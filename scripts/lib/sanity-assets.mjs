/**
 * Shared helpers for the asset-maintenance scripts
 * (`reencode-png-assets.mjs`, `optimize-oversized-assets.mjs`).
 *
 * Both scripts do the same three delicate things — talk to the dataset, repoint
 * references away from an asset, and delete the leftover — so they live here
 * rather than being copy-pasted and drifting apart. See docs/cdn-bandwidth.md.
 */
import { createClient } from '@sanity/client'

export const MB = 1024 * 1024

/**
 * Client for asset maintenance. `perspective: 'raw'` is not optional: every
 * reference check in these scripts MUST see draft documents too, or an asset
 * used only by an unpublished draft looks unreferenced and gets deleted out
 * from under the editor working on it.
 */
export function createAssetClient(token) {
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '489ops8g',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2023-01-01',
    token,
    useCdn: false,
    perspective: 'raw',
  })
}

/** Recursively replace every `{_ref: oldId}` with newId, in place. */
export function replaceRef(node, oldId, newId) {
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

/**
 * Delete an asset and CONFIRM it is gone, rather than trusting the promise.
 *
 * Returns { ok, error } instead of throwing, so one stubborn asset cannot abort
 * a long migration part-way through and leave the dataset half-converted.
 *
 * Caveat that applies to both callers: a `--delete` pass only removes originals
 * that the SAME pass repointed. Once an asset is orphaned it no longer matches
 * a selection query that requires a reference, so running `--apply` and then
 * `--delete` as two separate invocations leaves every original behind. Use
 * `optimize-oversized-assets.mjs --orphans` to sweep those up.
 */
export async function deleteAsset(client, id) {
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
