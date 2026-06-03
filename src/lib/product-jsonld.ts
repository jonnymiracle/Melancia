/**
 * Product JSON-LD builder — pure function, no side effects.
 *
 * Usage:
 *   const schema = buildProductJsonLd(product)
 *   // Later, when a real reviews integration (Judge.me / Loox) is wired up:
 *   const schema = buildProductJsonLd(product, { rating: { ratingValue: 4.8, reviewCount: 42 } })
 *
 * aggregateRating is intentionally omitted unless a real rating with
 * reviewCount > 0 is supplied. Never pass fabricated or placeholder values.
 */

import type { ShopifyProductDetail } from '@/types/shopify'
import { SITE_NAME, SITE_URL, LOGO_IMAGE } from '@/lib/site-config'

export interface ProductRating {
  ratingValue: number
  reviewCount: number
}

export interface BuildProductJsonLdOpts {
  rating?: ProductRating
}

export function buildProductJsonLd(
  product: ShopifyProductDetail,
  opts?: BuildProductJsonLdOpts,
): Record<string, unknown> {
  // --- images -----------------------------------------------------------
  const imageUrls = product.images.edges.map((e) => e.node.url)
  // Fall back to the absolute logo URL when the product has no images.
  const images: string[] =
    imageUrls.length > 0
      ? imageUrls
      : [`${SITE_URL}${LOGO_IMAGE}`]

  // --- first variant (price / currency) ----------------------------------
  const firstVariant = product.variants.edges[0]?.node

  // Price: use a 2-decimal string that matches the Shopify amount format.
  // If somehow there are no variants, default to '0.00' so the schema
  // remains valid — real product pages always have at least one variant.
  const price = firstVariant
    ? parseFloat(firstVariant.price.amount).toFixed(2)
    : '0.00'
  const priceCurrency = firstVariant?.price.currencyCode ?? 'USD'

  // --- availability -------------------------------------------------------
  const anyInStock = product.variants.edges.some((e) => e.node.availableForSale)
  const availability = anyInStock
    ? 'https://schema.org/InStock'
    : 'https://schema.org/OutOfStock'

  // --- offers -------------------------------------------------------------
  const productUrl = `${SITE_URL}/shop/${product.handle}`

  const offers: Record<string, unknown> = {
    '@type': 'Offer',
    price,
    priceCurrency,
    availability,
    url: productUrl,
  }

  // --- schema object ------------------------------------------------------
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: images,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    offers,
  }

  // description: include only when non-empty
  if (product.description) {
    schema.description = product.description
  }

  // aggregateRating: include ONLY when a real rating with reviewCount > 0 is provided.
  // NEVER fabricate or infer ratings from unrelated data.
  if (opts?.rating && opts.rating.reviewCount > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: String(opts.rating.ratingValue),
      reviewCount: String(opts.rating.reviewCount),
    }
  }

  return schema
}
