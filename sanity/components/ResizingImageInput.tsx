import { useToast } from '@sanity/ui'
import { useEffect, useRef } from 'react'
import { type ImageInputProps, set, setIfMissing, useClient } from 'sanity'

import { optimizeAsset } from '../lib/optimizeImage'

/**
 * Image input that auto-optimizes large uploads for the web, so non-technical
 * editors never have to think about image size.
 *
 * It lets Sanity's normal upload happen (keeping the full default UI: progress,
 * crop, hotspot, replace, asset browser), then — if the uploaded asset is too
 * large — swaps the field's reference to an optimized copy (see optimizeAsset).
 *
 * This works for single image fields, whose input is always mounted and starts
 * empty, so the upload is observed as a value change. Arrays of images use
 * ResizingImageArrayInput instead: an array item's own image input is not
 * reliably mounted when the item is added (drag-drop and the file picker create
 * a collapsed item), so a per-item input never sees the upload.
 * See docs/cdn-bandwidth.md.
 */
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
      const optimizedRef = await optimizeAsset(client, ref, toast)
      if (cancelled || !optimizedRef) return
      handled.current.add(optimizedRef)
      onChangeRef.current([
        setIfMissing({ _type: 'image' }),
        set({ _type: 'reference', _ref: optimizedRef }, ['asset']),
      ])
    })()

    return () => {
      cancelled = true
    }
  }, [ref, client, toast])

  return props.renderDefault(props)
}
