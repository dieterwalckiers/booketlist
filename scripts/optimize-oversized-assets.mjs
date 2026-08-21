/**
 * One-off backfill: shrink oversized image assets that are already referenced
 * by documents, repoint the references, and (optionally) delete the originals.
 *
 * WHY: the Studio upload guardrails (see docs/cdn-bandwidth.md §5) only act on
 * *new* uploads — `ResizingImageInput` deliberately ignores images that were
 * already on a document when it opened. So every image uploaded before the
 * guardrails shipped keeps failing `imageSizeValidation` forever, and editors
 * see a wall of red "Image is 2918px wide" errors on legacy documents that they
 * cannot clear without manually re-uploading each image. This script clears
 * them in bulk.
 *
 * It is the dimension/bytes counterpart to `reencode-png-assets.mjs` (which
 * handled format only) and produces exactly what a fresh upload would: a copy
 * capped at 2000px, re-encoded via Sanity's own CDN — no local image library.
 *
 * SELECTION: assets that currently FAIL validation (wider than 2500px or over
 * 1.5MB) and are referenced by at least one document. Pass --all to instead
 * process everything the Studio's auto-optimizer would act on (wider than
 * 2000px or over 1.5MB).
 *
 * ORPHAN CLEANUP (--orphans): a separate mode that permanently DELETES
 * *unreferenced* assets over the same limits. Nothing renders them, but their
 * originals remain publicly fetchable at full size on cdn.sanity.io — the exact
 * shape of asset the scraper swarm targets. Assets newer than --min-age-days
 * (default 7) are skipped so an editor's in-progress upload is never caught,
 * and Sanity refuses to delete anything still referenced.
 *
 * FORMAT: transparent images become WebP, which supports an alpha channel and
 * is 12–29x smaller than the equivalent PNG (measured on this dataset). WebP
 * stays WebP; everything else becomes JPEG. Nothing is ever flattened onto a
 * black box — the alpha channel survives.
 *
 * SAFETY:
 *   - Dry-run by default. Pass --apply to write. Pass --delete to remove the
 *     original after a successful repoint. Pass BOTH in the same invocation:
 *     --delete only removes originals the same pass repointed, so an --apply
 *     run followed by a separate --delete run leaves the originals behind as
 *     orphans (use --orphans to sweep those up).
 *   - Skips any asset whose optimized copy is not actually smaller.
 *   - Use --limit=N to trial on a handful first.
 *   - TAKE A DATASET EXPORT FIRST:  npx sanity dataset export production ./backup
 *
 * USAGE:
 *   SANITY_API_WRITE_TOKEN=sk... node scripts/optimize-oversized-assets.mjs             # dry run
 *   SANITY_API_WRITE_TOKEN=sk... node scripts/optimize-oversized-assets.mjs --apply --limit=3
 *   SANITY_API_WRITE_TOKEN=sk... node scripts/optimize-oversized-assets.mjs --apply --delete
 *
 *   node scripts/optimize-oversized-assets.mjs --orphans                        # dry run
 *   SANITY_API_WRITE_TOKEN=sk... node scripts/optimize-oversized-assets.mjs --orphans --apply
 */
import { createClient } from '@sanity/client'

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '489ops8g'
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const TOKEN = process.env.SANITY_API_WRITE_TOKEN

// Output cap — matches sanity/lib/optimizeImage.ts so a backfilled image is
// identical to one an editor uploads today.
const TARGET_WIDTH = 2000
const QUALITY = 82

// Selection thresholds — match sanity/lib/imageValidation.ts (what editors see
// as an error). With --all, fall back to the auto-optimizer's own thresholds.
const MB = 1024 * 1024
const MAX_BYTES = 1.5 * MB
const FAIL_WIDTH = 2500

const APPLY = process.argv.includes('--apply')
const DELETE = process.argv.includes('--delete')
const ALL = process.argv.includes('--all')
const ORPHANS = process.argv.includes('--orphans')
const flag = (name, fallback) =>
  Number(
    (process.argv.find((a) => a.startsWith(`--${name}=`)) || '').split(
      '='
    )[1] || fallback
  )
const LIMIT = flag('limit', 0)
// Don't touch a freshly uploaded asset: an editor may have uploaded it seconds
// ago and not saved the document yet, which makes it look orphaned.
const MIN_AGE_DAYS = flag('min-age-days', 7)

// The dataset is public-read, so a dry run needs no credentials — only writing
// does. This keeps the preview runnable without handling a token.
if (!TOKEN && APPLY) {
  console.error('Missing SANITY_API_WRITE_TOKEN env var (needs Editor rights).')
  process.exit(1)
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2023-01-01',
  token: TOKEN,
  useCdn: false,
  // Explicit: reference checks MUST see drafts too, or we would treat an asset
  // used only by an unpublished draft as unreferenced.
  perspective: 'raw',
})

// Recursively replace every `{_ref: oldId}` with newId, in place.
function replaceRef(node, oldId, newId) {
  let count = 0
  if (Array.isArray(node)) {
    for (const item of node) count += replaceRef(item, oldId, newId)
  } else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (k === '_ref' && v === oldId) {
        node._ref = newId
        count++
      } else {
        count += replaceRef(v, oldId, newId)
      }
    }
  }
  return count
}

// Transparent -> WebP (alpha-capable and vastly smaller than PNG), WebP stays
// WebP, the rest becomes JPEG. Re-encoding a transparent PNG *as PNG* saves
// nothing — PNG is already near its floor — which is why the first backfill run
// left every transparent asset over the size limit. WebP is the actual fix.
function targetFormat(asset) {
  if (asset.isOpaque === false) return 'webp'
  if (asset.extension === 'webp') return 'webp'
  return 'jpg'
}

function fits(asset) {
  return asset.w <= FAIL_WIDTH && asset.size <= MAX_BYTES
}

/**
 * Delete an asset and CONFIRM it is gone, rather than trusting the promise.
 *
 * Note that --delete only ever removes an original this pass repointed. An
 * original orphaned by an EARLIER --apply pass is invisible to a later
 * --delete: the selection query only matches referenced assets, so once an
 * asset is orphaned it drops out of scope. Running --apply then --delete as two
 * separate invocations therefore leaves the originals behind — that is how 14
 * of them survived the Aug 2026 backfill. Use --orphans to sweep those up.
 *
 * Returns an { ok, error } result instead of throwing, so one stubborn asset
 * cannot abort the whole run.
 */
async function deleteAsset(id) {
  try {
    await client.delete(id)
  } catch (e) {
    return { ok: false, error: e.message }
  }
  const survived = await client.fetch(`defined(*[_id == $id][0]._id)`, { id })
  return survived
    ? { ok: false, error: 'delete reported success but the asset still exists' }
    : { ok: true }
}

/**
 * --orphans: permanently delete UNREFERENCED image assets that are over the
 * limits. Nothing on the site renders them, but their originals stay publicly
 * fetchable at full size on cdn.sanity.io — exactly what the scraper swarm
 * targets — and they occupy storage. Most are leftovers from the JPEG migration
 * (#4) and the backfill above, which replace an asset rather than edit it.
 *
 * Two independent safety nets:
 *   1. Assets younger than --min-age-days are skipped, so an image an editor
 *      just uploaded into an unsaved document is never caught.
 *   2. Sanity itself refuses to delete an asset that still has a reference, so
 *      a mistake here surfaces as an error, not as a broken document.
 */
async function runOrphans() {
  const cutoff = new Date(
    Date.now() - MIN_AGE_DAYS * 24 * 60 * 60 * 1000
  ).toISOString()

  const orphans = await client.fetch(
    `*[_type == "sanity.imageAsset"
       && (metadata.dimensions.width > $width || size > $bytes)
       && _createdAt < $cutoff
       && count(*[references(^._id)]) == 0
     ]{
       _id, originalFilename, size, extension, _createdAt,
       "w": metadata.dimensions.width
     } | order(size desc)`,
    { width: ALL ? TARGET_WIDTH : FAIL_WIDTH, bytes: MAX_BYTES, cutoff }
  )

  const work = LIMIT ? orphans.slice(0, LIMIT) : orphans
  const totalMB = work.reduce((sum, a) => sum + a.size, 0) / MB

  console.log(
    `Found ${orphans.length} unreferenced assets over the limits, older than ` +
      `${MIN_AGE_DAYS} day(s). Processing ${work.length} (${totalMB.toFixed(
        1
      )} MB).`
  )
  console.log(`Mode: ${APPLY ? 'APPLY — DELETES PERMANENTLY' : 'DRY-RUN'}\n`)

  let deleted = 0
  let failed = 0
  let reclaimed = 0
  for (const a of work) {
    const label =
      `${(a.originalFilename || a._id).slice(0, 48)} ` +
      `(${a.w}px ${(a.size / MB).toFixed(1)}MB ${a.extension}, ` +
      `added ${a._createdAt.slice(0, 10)})`

    if (!APPLY) {
      console.log(`  [dry] would delete ${label}`)
      continue
    }
    const res = await deleteAsset(a._id)
    if (res.ok) {
      deleted++
      reclaimed += a.size
      console.log(`  ✓ deleted ${label}`)
    } else {
      failed++
      console.warn(`  FAILED ${label} — ${res.error}`)
    }
  }

  console.log(
    `\nDone. ${deleted} deleted, ${failed} failed. ` +
      `Storage reclaimed: ${(reclaimed / MB).toFixed(1)} MB ` +
      `of ${totalMB.toFixed(1)} MB available.`
  )
  if (failed)
    console.log(
      `\n${failed} asset(s) could NOT be deleted — re-run to see whether they ` +
        'persist, and check the token has asset-delete rights.'
    )
  if (!APPLY)
    console.log(
      '\nDry run only — re-run with --apply to delete. THIS CANNOT BE UNDONE; ' +
        'take a dataset export first.'
    )
}

async function run() {
  const widthThreshold = ALL ? TARGET_WIDTH : FAIL_WIDTH
  const assets = await client.fetch(
    `*[_type == "sanity.imageAsset"
       && extension in ["png", "jpg", "jpeg", "webp", "tiff", "heic", "heif"]
       && (metadata.dimensions.width > $width || size > $bytes)
       && count(*[references(^._id)]) > 0
     ]{
       _id, url, originalFilename, size, extension,
       "w": metadata.dimensions.width,
       "h": metadata.dimensions.height,
       "isOpaque": metadata.isOpaque
     } | order(size desc)`,
    { width: widthThreshold, bytes: MAX_BYTES }
  )

  const work = LIMIT ? assets.slice(0, LIMIT) : assets
  console.log(
    `Found ${assets.length} referenced assets over the limits ` +
      `(>${widthThreshold}px or >${(MAX_BYTES / MB).toFixed(
        1
      )}MB). Processing ${work.length}.`
  )
  console.log(
    `Mode: ${APPLY ? 'APPLY' : 'DRY-RUN'}${
      DELETE ? ' +DELETE originals' : ''
    }\n`
  )

  let savedBytes = 0
  let done = 0
  let skipped = 0
  let undeleted = 0
  const stillOverLimit = []

  for (const a of work) {
    const fmt = targetFormat(a)
    // fit=max never upscales, so a narrow-but-heavy image is only re-encoded.
    const url = `${a.url}?w=${TARGET_WIDTH}&fit=max&fm=${fmt}&q=${QUALITY}`
    const res = await fetch(url)
    if (!res.ok) {
      console.warn(`  SKIP ${a._id} — fetch ${res.status}`)
      skipped++
      continue
    }
    const buf = Buffer.from(await res.arrayBuffer())
    const newSize = buf.length
    const newWidth = Math.min(a.w, TARGET_WIDTH)

    // No width reduction and no meaningful byte saving means a new asset would
    // buy nothing — don't churn the document for it. Typical of transparent
    // PNGs, which are already about as small as PNG gets.
    if (newWidth === a.w && newSize > a.size * 0.9) {
      console.log(
        `  SKIP ${a.originalFilename || a._id} — re-encode is not smaller ` +
          `(${(a.size / MB).toFixed(1)}MB -> ${(newSize / MB).toFixed(1)}MB)`
      )
      skipped++
      if (!fits(a))
        stillOverLimit.push({ ...a, newSize: a.size, newWidth: a.w })
      continue
    }

    if (!fits({ w: newWidth, size: newSize })) {
      stillOverLimit.push({ ...a, newSize, newWidth })
    }

    const label =
      `${a.originalFilename || a._id} ` +
      `(${a.w}px ${(a.size / MB).toFixed(1)}MB ${a.extension} -> ` +
      `${newWidth}px ${(newSize / MB).toFixed(1)}MB ${fmt})`

    const refDocs = await client.fetch(`*[references($id)]._id`, { id: a._id })

    if (!APPLY) {
      console.log(`  [dry] ${label}  | ${refDocs.length} docs reference it`)
      savedBytes += a.size - newSize
      continue
    }

    const base = (a.originalFilename || a._id).replace(/\.\w+$/, '')
    const newAsset = await client.assets.upload('image', buf, {
      filename: `${base}.${fmt}`,
    })

    // Repoint every referencing document (published + drafts).
    let patched = 0
    for (const docId of refDocs) {
      const doc = await client.getDocument(docId)
      if (!doc) continue
      const n = replaceRef(doc, a._id, newAsset._id)
      if (n > 0) {
        await client.createOrReplace(doc)
        patched += n
      }
    }

    let deleteNote = ''
    if (DELETE) {
      // Asset delete fails if any reference remains — a built-in safety net.
      const res = await deleteAsset(a._id)
      deleteNote = res.ok
        ? ' | deleted original'
        : ` | ORIGINAL NOT DELETED: ${res.error}`
      if (!res.ok) undeleted++
    }

    savedBytes += a.size - newSize
    done++
    console.log(
      `  ✓ ${label} | repointed ${patched} refs in ${refDocs.length} docs${deleteNote}`
    )
  }

  console.log(
    `\nDone. ${done} optimized, ${skipped} skipped. Approx storage delta: ` +
      `${(savedBytes / MB).toFixed(1)} MB.`
  )

  if (undeleted)
    console.log(
      `\nWARNING: ${undeleted} original(s) survived --delete and are now ` +
        'unreferenced. Clean them up with --orphans.'
    )

  if (stillOverLimit.length) {
    console.log(
      `\n${stillOverLimit.length} asset(s) STILL over the validation limits ` +
        `after optimizing — these need a manual re-export or a limit change:`
    )
    for (const a of stillOverLimit) {
      console.log(
        `  - ${a.originalFilename || a._id}: ${a.newWidth}px, ` +
          `${(a.newSize / MB).toFixed(1)}MB (${targetFormat(a)}${
            a.isOpaque === false ? ', transparent' : ''
          })`
      )
    }
  }

  if (!APPLY) console.log('\nDry run only — re-run with --apply to write.')
  if (APPLY && !DELETE)
    console.log(
      '\nOriginals KEPT. Re-run with --delete once you confirm the site looks right (a rebuild is needed to pick up new assets).'
    )
}

const main = ORPHANS ? runOrphans : run

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
