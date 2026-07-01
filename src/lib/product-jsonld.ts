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

  // --- offers (per-variant) ----------------------------------------------
  // AI agents need one Offer per variant so they can tell whether a specific
  // size is in stock — a single aggregate Offer hides that. Each variant
  // reuses the same 2-decimal price logic and the same product URL (we do
  // not append variant query params).
  const productUrl = `${SITE_URL}/shop/${product.handle}`

  const offers: Record<string, unknown>[] = product.variants.edges.map((e) => {
    const variant = e.node
    // Guard against a non-numeric amount so the schema never emits "NaN"
    // (an invalid schema.org price).
    const parsedPrice = parseFloat(variant.price.amount)
    const price = Number.isFinite(parsedPrice) ? parsedPrice.toFixed(2) : '0.00'

    return {
      '@type': 'Offer',
      name: variant.title,
      sku: variant.id,
      price,
      priceCurrency: variant.price.currencyCode,
      availability: variant.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: productUrl,
      itemCondition: 'https://schema.org/NewCondition',
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'USD',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'US',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 2,
            maxValue: 4,
            unitCode: 'DAY',
          },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'US',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 30,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/ReturnShippingFees',
      },
    }
  })

  // Defensive fallback: real product pages always have at least one variant,
  // but if none exist we still emit a single safe Offer (price '0.00',
  // OutOfStock, no name/sku) so the schema stays valid.
  if (offers.length === 0) {
    offers.push({
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
      availability: 'https://schema.org/OutOfStock',
      url: productUrl,
      itemCondition: 'https://schema.org/NewCondition',
    })
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
