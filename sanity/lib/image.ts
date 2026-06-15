import createImageUrlBuilder from '@sanity/image-url'
import type { UseNextSanityImageBuilder } from 'next-sanity-image'
import type { Image } from 'sanity'

import { dataset, projectId } from '../env'

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

export const urlForImage = (source: Image) => {
  // Ensure that source image contains a valid reference
  if (!source?.asset?._ref) {
    return undefined
  }

  return imageBuilder?.image(source).auto('format').fit('max')
}

// Default quality for delivered images. Lower than the library default (75)
// since WebP holds up well; trims bandwidth with no visible loss.
const DEFAULT_QUALITY = 65

/**
 * Shared `next-sanity-image` builder.
 *
 * Forces `fm=webp` so EVERY client gets WebP, not just those advertising it
 * via the `Accept` header. Without this, bots/crawlers/link-preview fetchers
 * (which send `Accept: *​/*`) fall back to the original format — and our source
 * assets are large PNGs, so a single hero image ships ~2MB instead of ~60KB.
 * That fallback cliff was the dominant driver of Sanity CDN bandwidth.
 *
 * Also uses `fit=max` instead of `fit=clip` so Sanity NEVER upscales: a request
 * for a width larger than the source returns the source size, not an upscaled
 * (and far heavier) image. Scrapers were requesting `w=3840` against ~350px
 * source covers, and `fit=clip` upscaled a 235KB PNG into a ~16MB response.
 *
 * @param maxWidth optional hard cap on the requested width (e.g. thumbnails).
 */
export const sanityImageBuilder =
  (maxWidth?: number): UseNextSanityImageBuilder =>
  (imageUrlBuilder, options) => {
    const requestedWidth =
      options.width ?? options.originalImageDimensions.width
    const width = maxWidth ? Math.min(requestedWidth, maxWidth) : requestedWidth

    return imageUrlBuilder
      .width(width)
      .format('webp')
      .quality(options.quality || DEFAULT_QUALITY)
      .fit('max')
  }
