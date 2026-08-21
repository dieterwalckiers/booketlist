# Sanity CDN bandwidth — cause & resolution

## Summary

In June 2026 the project blew past its **20 GB/month** Sanity bandwidth quota
(27.5 GB by mid-month, days hitting 3+ GB). The cause was **not** normal traffic:
a **distributed scraper swarm** was downloading book-cover images directly from
`cdn.sanity.io`, and because the covers are **PNG** and Sanity **upscales on
request**, a single `?w=3840` request turned a 235 KB image into a **~16 MB**
response — a 67× amplification, paid thousands of times a day.

Resolution is layered: stop the active bleed (re-encode covers to JPEG + delete
the PNGs so the bomb URLs 404), prevent recurrence (never let the app or editors
emit/upload oversized images), and keep a cache layer (Cloudflare) in reserve as
the durable defence if the swarm adapts.

> **Status (2026-06-15):** delivery/format fixes deployed; **asset migration
> completed with `--delete` (the active bleed-stop is in place)**; upload
> guardrails implemented; Cloudflare deferred pending a few days of observation.
> See [Status of resolutions](#status-of-resolutions).

---

## How it was diagnosed (and two wrong turns)

The bandwidth graph alone was misleading; the breakthrough was the **request-log
export** (`manage.sanity.io → Usage → Request logs → Generate`, last 7 days),
which records every request with path, byte size, origin IP and user-agent.

The investigation went through two **incorrect** hypotheses first — worth
recording so we don't repeat them:

1. **"It's the WebP fallback to bots."** Real, but minor: served only 0.13 GB of
   15.6 GB. Fixed anyway (good hygiene), but not the cause.
2. **"It's build-time API fetching."** Plausible (the site refetches nav data on
   all 336 pages, ~85 MB/build) but ruled out: no deploys for days while
   bandwidth stayed high, and the logs showed the `query` endpoint was only
   0.68 GB vs **14.9 GB on `images`**.

**Lesson: measure traffic with the request logs before theorising.** The logs
ended the guessing immediately.

---

## Root cause

Images are served straight from the public `cdn.sanity.io` to the client
(`next-sanity-image` + `loader: 'custom'` in `next.config.js`, so Next does not
re-optimise or cache them — every byte counts against the Sanity quota). The
`production` dataset is public-read, and the asset CDN serves **any transform
anyone requests**. Two properties combine into a bandwidth bomb:

1. **Sources are PNG.** Every book cover was uploaded as PNG. With Sanity's
   `auto=format`, clients that don't advertise WebP (`Accept: */*` — i.e. every
   bot) get the original **PNG** back, which is far heavier than WebP.
2. **Sanity upscales with `fit=clip`.** Requesting a width larger than the source
   scales the image **up**. A scraper requesting `?w=3840` against a ~350 px
   cover gets a multi-megabyte upscaled image.

Measured against the live CDN, a 342×458 PNG cover:

| Request                                                                | Delivered       |
| ---------------------------------------------------------------------- | --------------- |
| `w=3840 fit=clip auto=format`, `Accept: */*` (**what the swarm gets**) | **15.9 MB** PNG |
| `w=3840` **`fit=max`** (no upscale), `Accept: */*`                     | 235 KB          |
| `w=3840` forced `fm=jpg`, `Accept: */*`                                | 747 KB          |
| `w=1920` `auto=format`, `Accept: image/webp` (real browser)            | ~65 KB          |

### What the request logs showed (7 days, 15.6 GB)

- **96% of bandwidth = the `images` endpoint** (14.9 GB); `query` only 0.68 GB.
- **`w=3840` variants alone = 10.9 GB (73%)** from ~2,000 requests (~5.6 MB ea).
- **89% of image requests had no `Referer`**, from **hundreds of IPs** (AWS/GCP
  ranges) with **fake user-agents** — a distributed swarm hitting the CDN
  directly, not people browsing the site. Some URLs were HTML-entity-encoded
  (`&amp;`), proving a scraper had read `srcset` straight out of the HTML.
- Damage spread **evenly across ~500 covers** (top asset only 1.8%) — the swarm
  crawls the whole catalogue, so deleting individual assets won't help.

The app's own fixes (below) only change URLs in **our** HTML; the swarm hammers
old cached / fabricated `auto=format` URLs we don't control. That's why the
delivery fixes alone didn't move the graph — the asset migration does.

---

## Status of resolutions

| #   | Fix                                                  | What it solves                                     | Status                                                              |
| --- | ---------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------- |
| 1   | Force `fm=webp` + `q=65`                             | Bots get WebP, not the PNG fallback                | ✅ Deployed (Jun 10, `6849070`)                                     |
| 2   | Trim `deviceSizes`/`imageSizes` + `robots.txt`       | Fewer/smaller variant URLs; slow legit crawlers    | ✅ Deployed (Jun 10)                                                |
| 3   | `fit=max` (no upscaling)                             | App never emits an upscale URL                     | 🟡 Implemented — deploy pending                                     |
| 4   | Re-encode PNG covers → JPEG + delete originals       | **Stops the active bleed** (bomb URLs 404)         | ✅ Completed (run with `--delete`)                                  |
| 5   | Auto-optimize on upload + validation backstop        | Editors can't re-introduce oversized images        | 🟡 Implemented — deploy pending                                     |
| 6   | Cloudflare cache + bot mitigation in front of images | Durable defence if the swarm adapts                | ⏸ Deferred (see [Monitoring](#monitoring--the-cloudflare-decision)) |
| 7   | Backfill script for pre-guardrail images             | Clears validation errors on legacy documents       | ✅ Completed (Aug 21, `--apply --delete`)                           |
| 8   | Orphan cleanup (`--orphans`)                         | Unreferenced originals stay fetchable at full size | 🟡 Implemented — 30 assets / 51.9 MB pending                        |

### 1–3 · Delivery fixes — [`sanity/lib/image.ts`](../sanity/lib/image.ts), [`next.config.js`](../next.config.js), [`public/robots.txt`](../public/robots.txt)

A shared `sanityImageBuilder()` is wired into every `useNextSanityImage` call
site and:

- forces `.format('webp')` (`fm=webp`) so format no longer depends on the
  `Accept` header — bots get ~58 KB instead of ~2 MB;
- uses `.fit('max')` so Sanity **never upscales** — a request wider than the
  source returns the source size (defuses the 67× bomb for any URL the app
  emits);
- sets quality 65.

`next.config.js` caps `deviceSizes` at `[640, 750, 828, 1080, 1920]` and
`imageSizes` at `[160, 256, 384]`. `robots.txt` adds `Crawl-delay` and disallows
aggressive AI/scraper bots — note it lives on the **site** domain, so it cannot
restrict `cdn.sanity.io` directly; it only slows crawling of the HTML that
surfaces image URLs.

### 4 · Asset migration — [`scripts/reencode-png-assets.mjs`](../scripts/reencode-png-assets.mjs)

The decisive bleed-stop. Re-encodes opaque PNG covers to JPEG (using Sanity's own
CDN, `?fm=jpg`, so no local image library), repoints every reference, and
deletes the originals. Deleting the old PNGs makes the swarm's exact bomb URLs
return **404** (a few bytes), and new JPEG sources bound the worst case to
~750 KB (~21×). Converts only `metadata.isOpaque == true` assets (174 of 266
PNGs) so transparent logos/illustrations are untouched.

> ✅ Completed on 2026-06-15 with `--delete` — the old PNG bomb URLs now 404.
> (Only `--delete` stops the bleed; `--apply` alone would keep the PNGs serving.)
> The script is dry-run by default, needs a write token, and a
> `sanity dataset export` backup was taken first. Re-runnable for future PNG
> uploads, though the auto-optimize input (#5) should prevent new ones.

### 5 · Upload guardrails (Sanity has no transform-on-ingest)

Sanity always stores the original upload as-is; resizing only happens on
delivery. So oversized uploads can only be stopped client-side, in the Studio.
Wired into every image field (`book.cover`, `book.additionalImages`,
`blogPost.coverImage`, blog body images, `settings.logo`, `imageElement`,
`galleryImage`):

- **Auto-optimize on upload** —
  [`sanity/components/ResizingImageInput.tsx`](../sanity/components/ResizingImageInput.tsx).
  After the normal upload, fetches a width-capped/re-encoded copy from Sanity's
  CDN (`?w=2000&fit=max&fm=jpg|webp`) and swaps the field's asset reference to it
  (opaque → JPEG, transparent → WebP, small images untouched). It reacts to the
  final value rather than intercepting the upload, so **every entry point is
  covered** (drag-drop, file dialog, paste, replace) and the default UI
  (progress, crop, hotspot, asset browser) is preserved. Editors just upload and
  see an "Image optimized for the web" toast. The oversized original is left as
  an orphan asset (storage is cheap; cleanable later) — the document only ever
  references the optimized copy.
- **Validation backstop** —
  [`sanity/lib/imageValidation.ts`](../sanity/lib/imageValidation.ts).
  Hard-blocks publishing images wider than 2500 px (**error**); warns — but does
  not block — on files over 1.5 MB and on opaque PNG photos (transparent PNGs
  exempt from the format warning). Rarely triggers now that auto-optimize
  targets 2000 px — it's a safety net. Each field also shows a plain-language
  `description` (`imageUploadHint`).

  > **Why size is only a warning.** It was originally an error too, which left
  > editors permanently blocked on legacy documents: transparent PNGs (logos,
  > catalogue covers, covers with drop shadows) ran 1.5–4 MB and could not be
  > re-encoded smaller _as PNG_. The WebP conversion in #7 has since fixed those
  > assets, so the warning now fires rarely — but it stays a warning, because a
  > genuinely irreducible image must never leave an editor stuck on a document
  > they cannot publish. Width is what makes the upscale bomb explosive, so
  > width stays the hard block.

### 6 · Cloudflare (deferred)

The durable defence against a distributed swarm hitting **arbitrary** URLs: serve
images via a Cloudflare-fronted hostname so repeat hits are served from CF cache
(origin hit ~once per URL) plus Bot Fight Mode. Requires DNS + a small loader
change to emit the custom hostname. Held back deliberately — see below.

### 7 · Backfill of pre-guardrail images — [`scripts/optimize-oversized-assets.mjs`](../scripts/optimize-oversized-assets.mjs)

The guardrails in #5 only act on **new** uploads: `ResizingImageInput`
deliberately ignores images that were already on a document when it opened. So
everything uploaded before they shipped kept failing validation forever, and
editors saw a wall of red errors on legacy documents (reported by the client on
the _Stien Van Kerckhoven_ author page, Aug 2026) that they could only clear by
manually re-uploading every image.

This script is the dimension/bytes counterpart to `reencode-png-assets.mjs`
(which handled format only). It selects **referenced** assets that fail
validation, fetches a 2000 px-capped re-encode from Sanity's CDN, repoints every
reference, and optionally deletes the original. Transparent → WebP, WebP stays
WebP, the rest becomes JPEG; assets that gain nothing are skipped. Dry-run by
default — same safety posture as the PNG migration.

**Run 1 (Aug 2026, `--apply --delete`):** 25 referenced assets over the limits →
14 optimized, ~15 MB reclaimed, **zero referenced assets left over 2500 px**.
The remaining 11 were all transparent PNGs, which the script then mapped to PNG
and therefore could not shrink at all.

**Run 2 — transparent → WebP.** Mapping transparent images to PNG was a mistake
inherited from the JPEG migration (#4), where the constraint was real: JPEG has
no alpha channel. **WebP does.** Measured against the live CDN on those exact 11
assets:

|                               | PNG re-encode       | WebP        |
| ----------------------------- | ------------------- | ----------- |
| Total (11 transparent assets) | 29.5 MB (unchanged) | **1.4 MB**  |
| Per-asset reduction           | ~0%                 | **12–29×**  |
| Largest (`228a0624….png`)     | 4.23 MB             | **0.15 MB** |

Alpha is preserved — every output is a `VP8X` container with the alpha flag set
and an `ALPH` chunk. Storing WebP sources is safe here because delivery already
forces `fm=webp` for every client (#1), and nothing in the app links to an
original asset file. `optimizeImage.ts` was changed to match, so new uploads
follow the same rule.

> ✅ Completed 2026-08-21. **Zero referenced assets now exceed either limit** —
> the editors' validation errors _and_ warnings are both cleared.

**`--delete` only removes originals the same pass repointed.** Once an asset is
orphaned it no longer matches the selection query (which requires at least one
reference), so it drops out of scope permanently. Running `--apply` and then
`--delete` as two separate invocations therefore leaves every original behind —
that is how the 14 originals from run 1 survived. Pass both flags together, or
sweep up afterwards with `--orphans`.

### 8 · Orphan cleanup — `--orphans`

Replacing an asset never edits it, so both migrations and every Studio
auto-optimize leave the oversized original behind, unreferenced. Nothing on the
site renders them, but **the originals stay publicly fetchable at full size on
`cdn.sanity.io`** — precisely the shape of asset the swarm targets — and they
occupy storage. As of 2026-08-21: **30 unreferenced assets over the limits,
51.9 MB**, the largest a 7.2 MB / 5304 px stock photo.

```bash
node scripts/optimize-oversized-assets.mjs --orphans              # dry run
SANITY_API_WRITE_TOKEN=sk... node scripts/optimize-oversized-assets.mjs --orphans --apply
```

Deletion is irreversible, so the mode carries three guards: it is dry-run by
default like every other mode; assets newer than `--min-age-days` (default 7)
are skipped, so an image an editor uploaded into a still-unsaved document is
never caught; and Sanity itself refuses to delete an asset that still has a
reference, which turns a mistake into an error rather than a broken document.
Deletes are verified by reading the document back — a resolved promise alone is
not treated as proof.

---

## Monitoring & the Cloudflare decision

The plan is to ship fixes 3–5, then **observe for ~3–5 days** before deciding on
Cloudflare. Watch in the Sanity Usage dashboard:

- **Daily bandwidth trend** — should fall sharply once the old PNGs are deleted
  (projected ~0.7 GB/week vs. ~15 GB/week).
- **Success signal:** the swarm keeps hitting the dead URLs but now gets **404s**
  (near-zero bytes) — confirmable in a fresh request-log export.

**Add Cloudflare if** bandwidth stays high after a few days, which would mean the
swarm has adapted (fabricating `fit=clip` widths against the new JPEGs, or
finding bare originals) — the one scenario only an edge cache + bot mitigation
fully solves.

---

## Related (not Sanity bandwidth)

The `/books` page ships **~3.9 MB of JSON props** (and `/cat/fiction` ~1 MB).
Because the site is statically generated this is served from the **host**
(Vercel), not Sanity — it doesn't touch the Sanity quota, but it hurts page-load
performance. The heavy `fetchAllBooks` query embeds each book's publisher's
entire element/gallery tree (with `palette` metadata); `fetchMenuProps` also
refetches full author/publisher docs on every page at build. A separate cleanup:
slim those GROQ queries to only the fields each page needs.

## Ongoing hygiene

**Don't upload photographic content as PNG.** PNG is what makes the upscale bomb
explosive and bloats storage; the largest originals were 12 MB and 8 MB PNGs at
6912×3456. The auto-optimize input now handles this automatically, and the
re-encode script cleared the existing backlog — but uploading JPEGs in the first
place keeps everything lean.
