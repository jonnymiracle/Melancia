/**
 * Pure helper for computing related products on a product detail page.
 *
 * Strategy: classify the current product with `classifyProduct`, then return
 * other products from the catalog that share the same kind (set/top), up to
 * `limit`. Self-exclusion is by handle when available, otherwise by id.
 * Result order matches the input catalog order (deterministic/stable).
 */

import type { ShopifyProduct } from '@/types/shopify'
import { classifyProduct, type ClassifiableProduct } from '@/lib/collections'

/**
 * Returns up to `limit` products from `all` that:
 *   1. Have the same collection kind (set/top) as `current`.
 *   2. Are not the current product itself (matched by handle when present, else id).
 *
 * Pure and deterministic — result order equals input catalog order.
 */
export function getRelatedProducts(
  current: ClassifiableProduct & { handle?: string; id?: string },
  all: ShopifyProduct[],
  limit = 4,
): ShopifyProduct[] {
  const currentKind = classifyProduct(current)

  // Prefer handle for self-exclusion; fall back to id.
  const currentHandle = current.handle
  const currentId = current.id

  return all
    .filter((p) => {
      // Exclude self
      if (currentHandle !== undefined && p.handle !== undefined) {
        if (p.handle === currentHandle) return false
      } else if (currentId !== undefined && p.id === currentId) {
        return false
      }
      // Include only same-kind products
      return classifyProduct(p) === currentKind
    })
    .slice(0, limit)
}
