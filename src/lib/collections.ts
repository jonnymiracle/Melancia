/**
 * SEO collection config + pure classification predicate.
 *
 * Two keyword-targeted collections sit under /collections/[handle]:
 *   - brazilian-bikini-sets  → the $85 two-piece sets
 *   - brazilian-bikini-tops  → the $42.50 single tops
 *
 * Classification (pure, testable) PREFERS an explicit tag signal and FALLS
 * BACK to a price split so it works today (before products are tagged in the
 * separate content track) and improves automatically once tags exist:
 *
 *   1. Tag signal (case-insensitive, wins over price):
 *        - a tag containing "set" → set
 *        - a tag containing "top" → top
 *   2. Price fallback (representative price = first variant's price.amount):
 *        - price >= PRICE_THRESHOLD ($60) → set   (sets are ~$85)
 *        - price <  PRICE_THRESHOLD ($60) → top   (tops are ~$42.50)
 *
 * $60 sits halfway between the two real price points ($42.50 and $85), so it
 * tolerates modest future price drift without reclassifying products.
 *
 * NOTE: the shared GraphQL query is intentionally NOT modified to fetch
 * productType — collections reuse fetchAllStorefrontProducts() and filter in
 * code (locked architectural decision).
 */

import type { ShopifyProduct } from '@/types/shopify'
import { SITE_NAME } from '@/lib/site-config'

export const SETS_HANDLE = 'brazilian-bikini-sets' as const
export const TOPS_HANDLE = 'brazilian-bikini-tops' as const

/** Halfway between the $42.50 tops and the $85 sets. Documented in module header. */
export const PRICE_THRESHOLD = 60

type CollectionKind = 'set' | 'top'

export interface Collection {
  handle: string
  /** Which side of the catalog this collection lists. */
  kind: CollectionKind
  /** Human label for nav/breadcrumbs, e.g. "Brazilian Bikini Sets". */
  name: string
  /** Meta <title>: "{keyword} | Melancia Swim". */
  title: string
  metaDescription: string
  /** Visible page <h1>. */
  h1: string
  /** On-brand intro paragraph rendered above the grid. */
  intro: string
  /** Pure membership predicate. */
  match: (product: ShopifyProduct) => boolean
}

// --- representative price ----------------------------------------------------

/** First variant's price.amount parsed to a number; NaN when absent/unparseable. */
function representativePrice(product: ShopifyProduct): number {
  const amount = product.variants?.edges?.[0]?.node.price.amount
  return amount === undefined ? NaN : parseFloat(amount)
}

// --- tag signal --------------------------------------------------------------

// Match "set" / "top" as whole words so substrings like "sunset" or
// "laptop" don't accidentally classify a product.
const SET_TAG_RE = /\bset\b/i
const TOP_TAG_RE = /\btop\b/i

/**
 * Returns 'set' / 'top' from an explicit tag, or null when no tag signal.
 * "set" takes precedence: a product tagged as a set (even a "bikini top set")
 * is treated as a set.
 */
function tagKind(product: ShopifyProduct): CollectionKind | null {
  const tags = product.tags ?? []
  if (tags.some((tag) => SET_TAG_RE.test(tag))) return 'set'
  if (tags.some((tag) => TOP_TAG_RE.test(tag))) return 'top'
  return null
}

/**
 * Classify a product as a 'set' or 'top' (pure).
 * Tag signal wins; otherwise the price threshold decides. A product with no
 * tag signal and an unparseable price falls back to 'top' (the cheaper, more
 * conservative bucket) — it simply won't surface in the sets collection.
 */
export function classifyProduct(product: ShopifyProduct): CollectionKind {
  const fromTag = tagKind(product)
  if (fromTag) return fromTag
  const price = representativePrice(product)
  if (Number.isFinite(price) && price >= PRICE_THRESHOLD) return 'set'
  return 'top'
}

// --- intro placeholders ------------------------------------------------------
// PLACEHOLDER COPY — replaced by the separate long-form content track.
// Ad-safe (never the word "tiny"). Keyword-leading, cheeky, on-brand.

const SETS_INTRO =
  'PLACEHOLDER: Our Brazilian bikini sets pair a cheeky tanga bottom with a ' +
  'matching top for a coordinated, sun-ready look. Cut high on the leg with ' +
  'minimal-coverage shapes inspired by the beaches of Rio, each set is made ' +
  'in Brazil to move with you from sand to sea.'

const TOPS_INTRO =
  'PLACEHOLDER: Mix, match, and layer with our Brazilian bikini tops. From ' +
  'triangle to bandeau, every top brings that signature minimal-coverage, ' +
  'high-cut Brazilian silhouette — designed in Brazil and ready to pair with ' +
  'any bottom in your rotation.'

// --- collection list ---------------------------------------------------------

export const COLLECTIONS: readonly Collection[] = [
  {
    handle: SETS_HANDLE,
    kind: 'set',
    name: 'Brazilian Bikini Sets',
    title: `Brazilian Bikini Sets | ${SITE_NAME}`,
    metaDescription:
      'Shop Brazilian bikini sets from Melancia Swim — cheeky, high-cut, ' +
      'minimal-coverage two-pieces made in Brazil. Ships within the USA.',
    h1: 'Brazilian Bikini Sets',
    intro: SETS_INTRO,
    match: (product) => classifyProduct(product) === 'set',
  },
  {
    handle: TOPS_HANDLE,
    kind: 'top',
    name: 'Brazilian Bikini Tops',
    title: `Brazilian Bikini Tops | ${SITE_NAME}`,
    metaDescription:
      'Shop Brazilian bikini tops from Melancia Swim — triangle, bandeau, and ' +
      'high-cut minimal-coverage tops made in Brazil. Ships within the USA.',
    h1: 'Brazilian Bikini Tops',
    intro: TOPS_INTRO,
    match: (product) => classifyProduct(product) === 'top',
  },
] as const

/** Lookup a collection config by handle. Returns undefined for unknown handles. */
export function getCollection(handle: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.handle === handle)
}

/** Products matching the given collection handle. Empty for unknown handles. */
export function filterProductsForCollection(
  products: ShopifyProduct[],
  handle: string,
): ShopifyProduct[] {
  const collection = getCollection(handle)
  if (!collection) return []
  return products.filter((p) => collection.match(p))
}
