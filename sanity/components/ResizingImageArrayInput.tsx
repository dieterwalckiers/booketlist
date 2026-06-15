import { useToast } from '@sanity/ui'
import { useEffect, useRef } from 'react'
import { type ArrayOfObjectsInputProps, set, useClient } from 'sanity'

import { optimizeAsset } from '../lib/optimizeImage'

type ImageItem = { _key?: string; asset?: { _ref?: string } }

/**
 * Array input that auto-optimizes large image uploads for the web.
 *
 * Used for arrays whose members are images (e.g. a book's additional media).
 * Unlike a single image field, an array item's own image input is not reliably
 * mounted when the item is added — drag-drop and the file picker create a
 * collapsed item, so a per-item input never observes the upload. This wrapper
 * sits on the always-mounted array field instead, watches its items, and
 * optimizes any newly-added oversized image, swapping that item's asset
 * reference to the optimized copy. See docs/cdn-bandwidth.md.
 */
export function ResizingImageArrayInput(props: ArrayOfObjectsInputProps) {
  const client = useClient({ apiVersion: '2023-01-01' })
  const toast = useToast()

  // Read the latest value/onChange without making them effect dependencies.
  const valueRef = useRef(props.value)
  valueRef.current = props.value
  const onChangeRef = useRef(props.onChange)
  onChangeRef.current = props.onChange

  const items = (Array.isArray(props.value) ? props.value : []) as ImageItem[]
  // Don't reprocess images already present when the field mounted — only act on
  // items added during this editing session.
  const initialRefs = useRef<Set<string>>(
    new Set(items.map((it) => it?.asset?._ref).filter(Boolean) as string[])
  )
  const handled = useRef<Set<string>>(new Set())
  // Re-run only when the set of (key → asset) pairs actually changes.
  const refsKey = items
    .map((it) => `${it?._key || ''}:${it?.asset?._ref || ''}`)
    .join('|')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const list = (
        Array.isArray(valueRef.current) ? valueRef.current : []
      ) as ImageItem[]
      for (const item of list) {
        const itemRef = item?.asset?._ref
        const key = item?._key
        if (!itemRef || !key) continue
        if (initialRefs.current.has(itemRef) || handled.current.has(itemRef))
          continue
        handled.current.add(itemRef)
        const optimizedRef = await optimizeAsset(client, itemRef, toast)
        if (cancelled || !optimizedRef) continue
        handled.current.add(optimizedRef)
        onChangeRef.current(
          set({ _type: 'reference', _ref: optimizedRef }, [
            { _key: key },
            'asset',
          ])
        )
      }
    })()
    return () => {
      cancelled = true
    }
  }, [refsKey, client, toast])

  return props.renderDefault(props)
}
