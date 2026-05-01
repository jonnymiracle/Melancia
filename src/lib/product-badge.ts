import type { Product } from '@/types'

export type CatalogProductBadge = NonNullable<Product['badge']>

type CatalogBadgeInput = Pick<Product, 'badge' | 'tags'>

/**
 * Badge shown on catalog product cards (`product-badge new` | `product-badge sale`).
 *
 * - If `product.badge` is set in data, that wins (manual override).
 * - Otherwise: same tag rules as Shopify (`badgeFromShopifyTags`) — add `sale` / `new` tags.
 */
export function resolveCatalogProductBadge(
  product: CatalogBadgeInput
): CatalogProductBadge | undefined {
  if (product.badge) return product.badge
  return badgeFromShopifyTags(product.tags)
}

function normalizeShopifyTag(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/_/g, '-')
    .replace(/\s+/g, ' ')
}

/** Tags that map to the Sale badge (normalized: lower, spaces collapsed, underscores → hyphens). */
const SHOPIFY_SALE_TAGS = new Set([
  'sale',
])

/** Tags that map to the New badge */
const SHOPIFY_NEW_TAGS = new Set([
  'new',
])

/**
 * Maps Shopify Admin product `tags` to a promo badge. Sale takes precedence over New
 * when both kinds of tags are present.
 */
export function badgeFromShopifyTags(
  tags: string[]
): CatalogProductBadge | undefined {
  if (!tags?.length) return undefined

  let sale = false
  let newest = false
  for (const raw of tags) {
    const t = normalizeShopifyTag(raw)
    if (!t) continue
    if (SHOPIFY_SALE_TAGS.has(t)) sale = true
    if (SHOPIFY_NEW_TAGS.has(t)) newest = true
  }

  if (sale) return 'sale'
  if (newest) return 'new'
  return undefined
}

/** Shopify card badge from Admin product tags only (e.g. `sale`, `new`). */
export function resolveShopifyProductBadge(
  tags: string[]
): CatalogProductBadge | undefined {
  return badgeFromShopifyTags(tags)
}
