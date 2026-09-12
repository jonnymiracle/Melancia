export type ProductBadge = 'new' | 'sale'

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
): ProductBadge | undefined {
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
