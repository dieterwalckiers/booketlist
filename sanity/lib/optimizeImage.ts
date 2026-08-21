import { type SanityClient } from '@sanity/client'
import { useToast } from '@sanity/ui'

/**
 * Shared image auto-optimization used by the Studio image inputs.
 *
 * Sanity has no transform-on-ingest: it always stores the original upload and
 * only resizes on delivery. So oversized uploads must be fixed client-side. When
 * an editor adds an image that is too large, we fetch a width-capped/re-encoded
 * copy from Sanity's own image CDN and return its asset id so the caller can
 * point the field at it instead. See docs/cdn-bandwidth.md.
 */
export const MAX_WIDTH = 2000
export const MAX_BYTES = 1.5 * 1024 * 1024
const QUALITY = 82
const RASTER = new Set(['png', 'jpg', 'jpeg', 'webp', 'tiff', 'heic', 'heif'])

type Toast = ReturnType<typeof useToast>

type AssetMeta = {
  w?: number
  size?: number
  extension?: string
  isOpaque?: boolean
  originalFilename?: string
  url?: string
}

/**
 * If the asset `ref` is a raster image that exceeds our size limits, upload an
 * optimized copy and return its new `_id`. Returns null when nothing needs to
 * change (not a raster, or already small enough) or the optimization fails.
 * Shows in-progress / success / failure toasts so editors get feedback.
 */
export async function optimizeAsset(
  client: SanityClient,
  ref: string,
  toast: Toast
): Promise<string | null> {
  const meta: AssetMeta | null = await client.fetch(
    `*[_id == $id][0]{
      "w": metadata.dimensions.width, size, extension,
      "isOpaque": metadata.isOpaque, originalFilename, url
    }`,
    { id: ref }
  )
  if (!meta?.url || !meta.extension) return null

  const tooBig =
    (!!meta.w && meta.w > MAX_WIDTH) || (!!meta.size && meta.size > MAX_BYTES)
  if (!RASTER.has(meta.extension) || !tooBig) return null

  toast.push({
    id: 'img-opt',
    status: 'info',
    title: 'Optimizing image for the web…',
    duration: 60000,
  })
  try {
    // Transparent images go to WebP, not PNG: WebP carries an alpha channel and
    // is an order of magnitude smaller (12-29x on this dataset's covers with
    // drop shadows). Re-encoding a transparent PNG as PNG saves nothing.
    const fmt = meta.isOpaque ? 'jpg' : 'webp'
    const url = `${meta.url}?w=${MAX_WIDTH}&fit=max&fm=${fmt}&q=${QUALITY}`
    const blob = await fetch(url).then((r) => r.blob())
    const base = (meta.originalFilename || 'image').replace(/\.\w+$/, '')
    const asset = await client.assets.upload('image', blob, {
      filename: `${base}.${fmt}`,
    })
    toast.push({
      id: 'img-opt',
      status: 'success',
      title: 'Image optimized for the web',
      closable: true,
    })
    return asset._id
  } catch {
    toast.push({
      id: 'img-opt',
      status: 'warning',
      title: 'Could not auto-optimize this image',
      description: 'You can still publish, but a smaller image is recommended.',
      closable: true,
    })
    return null
  }
}
