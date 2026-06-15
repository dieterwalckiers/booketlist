import type { ImageValue, Rule, ValidationContext } from 'sanity'

// Keep delivered images small and prevent re-introducing the oversized PNG
// sources that drove the CDN bandwidth blow-up (see docs/cdn-bandwidth.md).
const MAX_WIDTH = 2500
const MAX_BYTES = 1.5 * 1024 * 1024

// Friendly field hint for editors. Auto-optimization (ResizingImageInput) means
// they normally never hit the validation limits below — this just reassures.
export const imageUploadHint =
  'Just upload your image — large photos are automatically optimized for the web.'

type AssetMeta = {
  w?: number
  size?: number
  extension?: string
  isOpaque?: boolean
} | null

async function fetchAssetMeta(
  ref: string,
  context: ValidationContext
): Promise<AssetMeta> {
  const client = context.getClient({ apiVersion: '2023-01-01' })
  return client.fetch(
    `*[_id == $id][0]{ "w": metadata.dimensions.width, size, extension, "isOpaque": metadata.isOpaque }`,
    { id: ref }
  )
}

/**
 * Validation for image fields. Use as `validation: imageSizeValidation`.
 *
 * Hard-blocks publishing images that are too large (by width or bytes) and
 * warns when a photo is uploaded as PNG. Note Sanity always stores the original
 * upload as-is — this runs after upload and refuses to publish until the editor
 * replaces an oversized image; it does not shrink the stored file.
 */
export const imageSizeValidation = (rule: Rule) => [
  rule.custom(async (value: ImageValue | undefined, context) => {
    const ref = value?.asset?._ref
    if (!ref) return true
    const meta = await fetchAssetMeta(ref, context)
    if (meta?.w && meta.w > MAX_WIDTH) {
      return `Image is ${meta.w}px wide — please upload one no wider than ${MAX_WIDTH}px.`
    }
    if (meta?.size && meta.size > MAX_BYTES) {
      return `Image is ${(meta.size / (1024 * 1024)).toFixed(
        1
      )}MB — please keep it under 1.5MB.`
    }
    return true
  }),
  rule
    .custom(async (value: ImageValue | undefined, context) => {
      const ref = value?.asset?._ref
      if (!ref) return true
      const meta = await fetchAssetMeta(ref, context)
      // Only warn for opaque PNGs (photos). Transparent PNGs (logos,
      // illustrations) legitimately need PNG and must not be nagged.
      if (meta?.extension === 'png' && meta.isOpaque) {
        return 'This is a PNG photo. JPEG is far smaller — consider re-exporting as JPEG before uploading.'
      }
      return true
    })
    .warning(),
]
