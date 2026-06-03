import { describe, it, expect } from 'vitest'
import type { ShopifyProductDetail } from '@/types/shopify'
import { buildProductJsonLd } from './product-jsonld'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const PRODUCT_IMAGE_URL =
  'https://cdn.shopify.com/s/files/1/0123/4567/products/leblon-glow.jpg'
const PRODUCT_IMAGE_URL_2 =
  'https://cdn.shopify.com/s/files/1/0123/4567/products/leblon-glow-2.jpg'

const baseProduct: ShopifyProductDetail = {
  id: 'gid://shopify/Product/1',
  title: 'Leblon Glow',
  handle: 'leblon-glow',
  description: 'A sun-kissed Brazilian bikini.',
  descriptionHtml: '<p>A sun-kissed Brazilian bikini.</p>',
  tags: [],
  options: [],
  images: {
    edges: [
      { node: { url: PRODUCT_IMAGE_URL, altText: 'Leblon Glow bikini' } },
      { node: { url: PRODUCT_IMAGE_URL_2, altText: 'Leblon Glow bikini back' } },
    ],
  },
  variants: {
    edges: [
      {
        node: {
          id: 'gid://shopify/ProductVariant/11',
          title: 'S / Neon Coral',
          availableForSale: true,
          selectedOptions: [
            { name: 'Size', value: 'S' },
            { name: 'Color', value: 'Neon Coral' },
          ],
          price: { amount: '68.00', currencyCode: 'USD' },
          compareAtPrice: null,
        },
      },
      {
        node: {
          id: 'gid://shopify/ProductVariant/12',
          title: 'M / Neon Coral',
          availableForSale: false,
          selectedOptions: [
            { name: 'Size', value: 'M' },
            { name: 'Color', value: 'Neon Coral' },
          ],
          price: { amount: '68.00', currencyCode: 'USD' },
          compareAtPrice: null,
        },
      },
    ],
  },
}

/** All variants unavailable */
const outOfStockProduct: ShopifyProductDetail = {
  ...baseProduct,
  handle: 'sold-out',
  variants: {
    edges: baseProduct.variants.edges.map((e) => ({
      node: { ...e.node, availableForSale: false },
    })),
  },
}

/** No images */
const noImageProduct: ShopifyProductDetail = {
  ...baseProduct,
  handle: 'no-image',
  images: { edges: [] },
}

/** Empty description */
const noDescriptionProduct: ShopifyProductDetail = {
  ...baseProduct,
  handle: 'no-desc',
  description: '',
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('buildProductJsonLd', () => {
  // 1. JSON roundtrip
  it('produces a value that round-trips through JSON.stringify / JSON.parse', () => {
    const schema = buildProductJsonLd(baseProduct)
    const roundTripped = JSON.parse(JSON.stringify(schema))
    expect(roundTripped).toEqual(schema)
  })

  // 2. Required fields
  it('sets @context to https://schema.org', () => {
    const schema = buildProductJsonLd(baseProduct)
    expect(schema['@context']).toBe('https://schema.org')
  })

  it('sets @type to Product', () => {
    const schema = buildProductJsonLd(baseProduct)
    expect(schema['@type']).toBe('Product')
  })

  it('includes name matching product.title', () => {
    const schema = buildProductJsonLd(baseProduct)
    expect(schema.name).toBe('Leblon Glow')
  })

  it('includes image as a non-empty array', () => {
    const schema = buildProductJsonLd(baseProduct)
    expect(Array.isArray(schema.image)).toBe(true)
    expect((schema.image as string[]).length).toBeGreaterThan(0)
  })

  it('includes all product image URLs in the image array', () => {
    const schema = buildProductJsonLd(baseProduct)
    const images = schema.image as string[]
    expect(images).toContain(PRODUCT_IMAGE_URL)
    expect(images).toContain(PRODUCT_IMAGE_URL_2)
  })

  it('includes brand.name === "Melancia Swim"', () => {
    const schema = buildProductJsonLd(baseProduct)
    const brand = schema.brand as { '@type': string; name: string }
    expect(brand.name).toBe('Melancia Swim')
  })

  it('includes brand @type === Brand', () => {
    const schema = buildProductJsonLd(baseProduct)
    const brand = schema.brand as { '@type': string; name: string }
    expect(brand['@type']).toBe('Brand')
  })

  // 3. Offers — price matches input
  it('offers.price equals the first variant price amount', () => {
    const schema = buildProductJsonLd(baseProduct)
    const offers = schema.offers as Record<string, unknown>
    expect(offers.price).toBe('68.00')
  })

  it('offers.priceCurrency equals the first variant currencyCode (USD)', () => {
    const schema = buildProductJsonLd(baseProduct)
    const offers = schema.offers as Record<string, unknown>
    expect(offers.priceCurrency).toBe('USD')
  })

  it('offers.url is the absolute product URL', () => {
    const schema = buildProductJsonLd(baseProduct)
    const offers = schema.offers as Record<string, unknown>
    expect(offers.url).toBe('https://www.melanciaswim.com/shop/leblon-glow')
  })

  it('offers has @type Offer', () => {
    const schema = buildProductJsonLd(baseProduct)
    const offers = schema.offers as Record<string, unknown>
    expect(offers['@type']).toBe('Offer')
  })

  // 4. Availability
  it('offers.availability is InStock when at least one variant is availableForSale', () => {
    const schema = buildProductJsonLd(baseProduct) // has one in-stock variant
    const offers = schema.offers as Record<string, unknown>
    expect(offers.availability).toBe('https://schema.org/InStock')
  })

  it('offers.availability is OutOfStock when no variant is availableForSale', () => {
    const schema = buildProductJsonLd(outOfStockProduct)
    const offers = schema.offers as Record<string, unknown>
    expect(offers.availability).toBe('https://schema.org/OutOfStock')
  })

  // 5. aggregateRating — absent without rating, present with rating
  it('does NOT include aggregateRating when no rating is provided', () => {
    const schema = buildProductJsonLd(baseProduct)
    expect(schema).not.toHaveProperty('aggregateRating')
  })

  it('does NOT include aggregateRating when opts is provided but rating is undefined', () => {
    const schema = buildProductJsonLd(baseProduct, {})
    expect(schema).not.toHaveProperty('aggregateRating')
  })

  it('does NOT include aggregateRating when reviewCount is 0', () => {
    const schema = buildProductJsonLd(baseProduct, {
      rating: { ratingValue: 4.8, reviewCount: 0 },
    })
    expect(schema).not.toHaveProperty('aggregateRating')
  })

  it('DOES include aggregateRating when rating with reviewCount > 0 is provided', () => {
    const schema = buildProductJsonLd(baseProduct, {
      rating: { ratingValue: 4.7, reviewCount: 23 },
    })
    expect(schema).toHaveProperty('aggregateRating')
  })

  it('aggregateRating has correct @type, ratingValue, and reviewCount', () => {
    const schema = buildProductJsonLd(baseProduct, {
      rating: { ratingValue: 4.7, reviewCount: 23 },
    })
    const ar = schema.aggregateRating as Record<string, unknown>
    expect(ar['@type']).toBe('AggregateRating')
    expect(ar.ratingValue).toBe('4.7')
    expect(ar.reviewCount).toBe('23')
  })

  // 6. description handling
  it('includes description when non-empty', () => {
    const schema = buildProductJsonLd(baseProduct)
    expect(schema.description).toBe('A sun-kissed Brazilian bikini.')
  })

  it('omits description when empty', () => {
    const schema = buildProductJsonLd(noDescriptionProduct)
    expect(schema).not.toHaveProperty('description')
  })

  // 7. No-image fallback
  it('includes a non-empty image array even when product has no images', () => {
    const schema = buildProductJsonLd(noImageProduct)
    expect(Array.isArray(schema.image)).toBe(true)
    expect((schema.image as string[]).length).toBeGreaterThan(0)
  })
})
