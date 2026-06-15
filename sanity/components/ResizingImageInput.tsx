import { useToast } from '@sanity/ui'
import { useEffect, useRef } from 'react'
import { type ImageInputProps, set, setIfMissing, useClient } from 'sanity'

/**
 * Image input that auto-optimizes large uploads for the web, so non-technical
 * editors never have to think about image size.
 *
 * It lets Sanity's normal upload happen (keeping the full default UI: progress,
 * crop, hotspot, replace, asset browser), then — if the uploaded asset is too
 * large — fetches a resized/re-encoded copy from Sanity's own image CDN and
 * swaps the field's reference to it. Reacting to the final value (rather than
 * intercepting the upload) means every entry point is covered: drag-drop, file
 * dialog, paste and replace.
 *
 * Opaque images (photos) become JPEG; transparent ones (logos, illustrations)
 * stay PNG but are still width-capped. Small images are left untouched. The
 * original upload is left as an orphan asset (cleanable later); storage is cheap
 * and what matters — the document, and therefore the site — references only the
 * optimized copy. See docs/cdn-bandwidth.md.
 */
const MAX_WIDTH = 2000
const MAX_BYTES = 1.5 * 1024 * 1024
const QUALITY = 82
const RASTER = new Set(['png', 'jpg', 'jpeg', 'webp', 'tiff', 'heic', 'heif'])

type AssetMeta = {
  w?: number
  size?: number
  extension?: string
  isOpaque?: boolean
  originalFilename?: string
  url?: string
}

export function ResizingImageInput(props: ImageInputProps) {
  const client = useClient({ apiVersion: '2023-01-01' })
  const toast = useToast()

  const ref = props.value?.asset?._ref
  // Don't reprocess an image that was already on the document when it opened —
  // only act on uploads/replacements made in this editing session.
  const initialRef = useRef(ref)
  const handled = useRef<Set<string>>(new Set())
  // Keep the latest onChange without making it an effect dependency.
  const onChangeRef = useRef(props.onChange)
  onChangeRef.current = props.onChange

  useEffect(() => {
    if (!ref || ref === initialRef.current || handled.current.has(ref)) return
    handled.current.add(ref)

    let cancelled = false
    ;(async () => {
      const meta: AssetMeta | null = await client.fetch(
        `*[_id == $id][0]{
          "w": metadata.dimensions.width, size, extension,
          "isOpaque": metadata.isOpaque, originalFilename, url
        }`,
        { id: ref }
      )
      if (cancelled || !meta?.url || !meta.extension) return

      const tooBig =
        (!!meta.w && meta.w > MAX_WIDTH) ||
        (!!meta.size && meta.size > MAX_BYTES)
      if (!RASTER.has(meta.extension) || !tooBig) return

      toast.push({
        id: 'img-opt',
        status: 'info',
        title: 'Optimizing image for the web…',
        duration: 60000,
      })
      try {
        const fmt = meta.isOpaque ? 'jpg' : 'png'
        const url = `${meta.url}?w=${MAX_WIDTH}&fit=max&fm=${fmt}&q=${QUALITY}`
        const blob = await fetch(url).then((r) => r.blob())
        if (cancelled) return
        const base = (meta.originalFilename || 'image').replace(/\.\w+$/, '')
        const asset = await client.assets.upload('image', blob, {
          filename: `${base}.${fmt}`,
        })
        if (cancelled) return
        handled.current.add(asset._id)
        onChangeRef.current([
          setIfMissing({ _type: 'image' }),
          set({ _type: 'reference', _ref: asset._id }, ['asset']),
        ])
        toast.push({
          id: 'img-opt',
          status: 'success',
          title: 'Image optimized for the web',
          closable: true,
        })
      } catch {
        toast.push({
          id: 'img-opt',
          status: 'warning',
          title: 'Could not auto-optimize this image',
          description:
            'You can still publish, but a smaller image is recommended.',
          closable: true,
        })
      }
    })()

    return () => {
      cancelled = true
    }
  }, [ref, client, toast])

  return props.renderDefault(props)
}
