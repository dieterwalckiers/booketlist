/**
 * Re-encode opaque PNG image assets to JPEG, repoint all references, and delete
 * the original PNGs.
 *
 * WHY: a scraper swarm hammers old `cdn.sanity.io/.../<hash>.png?w=3840&...`
 * URLs. Because the sources are PNG, the `auto=format` fallback (bots send no
 * `Accept: image/webp`) serves a multi-megabyte PNG. Re-encoding the sources to
 * JPEG and DELETING the PNGs makes those exact bomb URLs 404 (the swarm gets
 * nothing) and bounds every future request to a fraction of the size.
 *
 * The JPEG is produced by Sanity's own CDN (`?fm=jpg`), so there is no local
 * image-processing dependency.
 *
 * SAFETY:
 *   - Dry-run by default. Pass --apply to write. Pass --delete to remove the
 *     original PNG after a successful repoint (implies the new asset is live).
 *   - Only converts OPAQUE assets (metadata.isOpaque == true) so transparent
 *     logos/illustrations are never flattened onto a black/white box.
 *   - Use --limit=N to trial on a handful first.
 *   - TAKE A DATASET EXPORT FIRST:  npx sanity dataset export production ./backup
 *
 * USAGE:
 *   SANITY_API_WRITE_TOKEN=sk... node scripts/reencode-png-assets.mjs            # dry run
 *   SANITY_API_WRITE_TOKEN=sk... node scripts/reencode-png-assets.mjs --apply --limit=3
 *   SANITY_API_WRITE_TOKEN=sk... node scripts/reencode-png-assets.mjs --apply --delete
 */
import { createClient } from '@sanity/client'

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '489ops8g'
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const TOKEN = process.env.SANITY_API_WRITE_TOKEN
const JPEG_QUALITY = 80

const APPLY = process.argv.includes('--apply')
const DELETE = process.argv.includes('--delete')
const LIMIT = Number(
  (process.argv.find((a) => a.startsWith('--limit=')) || '').split('=')[1] || 0
)

if (!TOKEN) {
  console.error('Missing SANITY_API_WRITE_TOKEN env var (needs Editor rights).')
  process.exit(1)
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2023-01-01',
  token: TOKEN,
  useCdn: false,
})

const MB = 1024 * 1024

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

async function run() {
  // Opaque PNG assets only (isOpaque == true means no real transparency).
  const assets = await client.fetch(
    `*[_type == "sanity.imageAsset" && extension == "png" && metadata.isOpaque == true]{
       _id, url, originalFilename, size, "alpha": metadata.isOpaque
     } | order(size desc)`
  )

  const work = LIMIT ? assets.slice(0, LIMIT) : assets
  console.log(
    `Found ${assets.length} opaque PNG assets. Processing ${work.length}.`
  )
  console.log(
    `Mode: ${APPLY ? 'APPLY' : 'DRY-RUN'}${
      DELETE ? ' +DELETE originals' : ''
    }\n`
  )

  let savedBytes = 0
  let done = 0
  for (const a of work) {
    const jpgUrl = `${a.url}?fm=jpg&q=${JPEG_QUALITY}&fit=max`
    const res = await fetch(jpgUrl)
    if (!res.ok) {
      console.warn(`  SKIP ${a._id} — fetch ${res.status}`)
      continue
    }
    const buf = Buffer.from(await res.arrayBuffer())
    const newSize = buf.length
    const label = `${a.originalFilename || a._id} (${(a.size / MB).toFixed(
      1
    )}MB png -> ${(newSize / MB).toFixed(1)}MB jpg)`

    const refDocs = await client.fetch(`*[references($id)]._id`, { id: a._id })

    if (!APPLY) {
      console.log(`  [dry] ${label}  | ${refDocs.length} docs reference it`)
      savedBytes += a.size - newSize
      continue
    }

    // Upload the JPEG as a new asset.
    const filename = (a.originalFilename || `${a._id}.png`).replace(
      /\.png$/i,
      '.jpg'
    )
    const newAsset = await client.assets.upload('image', buf, { filename })

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

    if (DELETE) {
      // Asset delete fails if any reference remains — a built-in safety net.
      await client.delete(a._id)
    }

    savedBytes += a.size - newSize
    done++
    console.log(
      `  ✓ ${label} | repointed ${patched} refs in ${refDocs.length} docs${
        DELETE ? ' | deleted original' : ''
      }`
    )
  }

  console.log(
    `\nDone. ${done} converted. Approx storage delta: ${(
      savedBytes / MB
    ).toFixed(1)} MB.`
  )
  if (!APPLY) console.log('Dry run only — re-run with --apply to write.')
  if (APPLY && !DELETE)
    console.log(
      'Originals KEPT. Re-run with --delete once you confirm the site looks right (a rebuild is needed to pick up new assets).'
    )
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
