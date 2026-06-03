import { describe, it, expect } from 'vitest'
import type { ShopifyProductDetail } from '@/types/shopify'
import { buildProductTitle } from './product-title'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeDetail(opts: {
  title: string
  tags?: string[]
  price?: string
  options?: { name: string; values: string[] }[]
}): ShopifyProductDetail {
  return {
    id: 'gid://shopify/Product/1',
    title: opts.title,
    handle: opts.title.toLowerCase().replace(/\s+/g, '-'),
    description: 'A Brazilian bikini.',
    descriptionHtml: '<p>A Brazilian bikini.</p>',
    tags: opts.tags ?? [],
    options: opts.options ?? [],
    images: { edges: [] },
    variants: {
      edges: [
        {
          node: {
            id: 'gid://shopify/ProductVariant/1',
            title: 'Default',
            availableForSale: true,
            selectedOptions: [],
            price: { amount: opts.price ?? '85.00', currencyCode: 'USD' },
            compareAtPrice: null,
          },
        },
      ],
    },
  }
}

const setProduct = makeDetail({ title: 'Leblon Glow', price: '85.00' })
const topProduct = makeDetail({ title: 'Carvão', price: '42.50' })
const setTagProduct = makeDetail({
  title: 'Mystery Bundle',
  tags: ['Brazilian Bikini Set'],
  price: '42.50', // price says top, tag says set → tag wins
})
const topTagProduct = makeDetail({
  title: 'Premium Single',
  tags: ['top'],
  price: '85.00', // price says set, tag says top → tag wins
})

const singleColorProduct = makeDetail({
  title: 'Carvão',
  price: '42.50',
  options: [
    { name: 'Color', values: ['Black'] },
    { name: 'Size', values: ['XS', 'S', 'M'] },
  ],
})

const multiColorProduct = makeDetail({
  title: 'Ipanema',
  price: '85.00',
  options: [
    { name: 'Color', values: ['Black', 'White', 'Neon Coral'] },
    { name: 'Size', values: ['XS', 'S', 'M'] },
  ],
})

const zeroColorProduct = makeDetail({
  title: 'Ipanema',
  price: '85.00',
  options: [
    { name: 'Size', values: ['XS', 'S', 'M'] },
  ],
})

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('buildProductTitle', () => {
  // 1. Core keyword invariants
  it('always contains "Brazilian Bikini"', () => {
    expect(buildProductTitle(setProduct)).toContain('Brazilian Bikini')
    expect(buildProductTitle(topProduct)).toContain('Brazilian Bikini')
  })

  it('always contains the product title', () => {
    expect(buildProductTitle(setProduct)).toContain('Leblon Glow')
    expect(buildProductTitle(topProduct)).toContain('Carvão')
  })

  it('always ends with "| Melancia Swim"', () => {
    expect(buildProductTitle(setProduct)).toMatch(/\| Melancia Swim$/)
    expect(buildProductTitle(topProduct)).toMatch(/\| Melancia Swim$/)
  })

  // 2. Set / Top classification
  it('set-priced product ($85) → title contains "Set"', () => {
    expect(buildProductTitle(setProduct)).toContain('Set')
    expect(buildProductTitle(setProduct)).not.toContain('Top')
  })

  it('top-priced product ($42.50) → title contains "Top"', () => {
    expect(buildProductTitle(topProduct)).toContain('Top')
    expect(buildProductTitle(topProduct)).not.toContain('Set')
  })

  it('set-tagged product (tag wins over cheap price) → title contains "Set"', () => {
    expect(buildProductTitle(setTagProduct)).toContain('Set')
  })

  it('top-tagged product (tag wins over high price) → title contains "Top"', () => {
    expect(buildProductTitle(topTagProduct)).toContain('Top')
  })

  // 3. Full title format check (no color)
  it('set product title matches full format without color', () => {
    const title = buildProductTitle(setProduct)
    // "Leblon Glow Brazilian Bikini Set | Melancia Swim"
    expect(title).toBe('Leblon Glow Brazilian Bikini Set | Melancia Swim')
  })

  it('top product title matches full format without color', () => {
    const title = buildProductTitle(topProduct)
    // "Carvão Brazilian Bikini Top | Melancia Swim"
    expect(title).toBe('Carvão Brazilian Bikini Top | Melancia Swim')
  })

  // 4. Single-color enrichment
  it('single Color option → color appears in title', () => {
    const title = buildProductTitle(singleColorProduct)
    expect(title).toContain('Black')
    // "Carvão Black Brazilian Bikini Top | Melancia Swim"
    expect(title).toBe('Carvão Black Brazilian Bikini Top | Melancia Swim')
  })

  it('multiple Color option values → color NOT injected', () => {
    const title = buildProductTitle(multiColorProduct)
    expect(title).not.toContain('Black')
    expect(title).not.toContain('White')
    expect(title).not.toContain('Neon Coral')
    expect(title).toBe('Ipanema Brazilian Bikini Set | Melancia Swim')
  })

  it('no Color option at all → color NOT injected', () => {
    const title = buildProductTitle(zeroColorProduct)
    expect(title).toBe('Ipanema Brazilian Bikini Set | Melancia Swim')
  })

  // 5. Ad policy: never "tiny"
  it('never contains the word "tiny"', () => {
    const products = [setProduct, topProduct, singleColorProduct, multiColorProduct, zeroColorProduct]
    for (const p of products) {
      expect(buildProductTitle(p).toLowerCase()).not.toContain('tiny')
    }
  })

  // 6. Never double-appends brand (since we return the absolute title)
  it('contains exactly one "Melancia Swim" occurrence', () => {
    const title = buildProductTitle(setProduct)
    const count = title.split('Melancia Swim').length - 1
    expect(count).toBe(1)
  })
})
