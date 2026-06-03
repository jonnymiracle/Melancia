import { describe, it, expect } from 'vitest'
import type { ShopifyProductDetail } from '@/types/shopify'
import { buildImageAlt } from './image-alt'

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

/** A $85 set product with a single color */
const setProduct = makeDetail({
  title: 'Leblon Glow',
  price: '85.00',
  options: [{ name: 'Color', values: ['Burgundy'] }],
})

/** A $42.50 top product with a single color */
const topProduct = makeDetail({
  title: 'Carvão',
  price: '42.50',
  options: [{ name: 'Color', values: ['Black'] }],
})

/** Product with multiple colors → color should be omitted */
const multiColorProduct = makeDetail({
  title: 'Ipanema',
  price: '85.00',
  options: [{ name: 'Color', values: ['Black', 'White', 'Neon Coral'] }],
})

/** Product with no Color option */
const noColorProduct = makeDetail({
  title: 'Arpoador',
  price: '42.50',
  options: [{ name: 'Size', values: ['XS', 'S', 'M'] }],
})

/** Product with whitespace-only color — treated as absent */
const whitespaceColorProduct = makeDetail({
  title: 'Test',
  price: '42.50',
  options: [{ name: 'Color', values: ['   '] }],
})

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('buildImageAlt', () => {
  // 1. Verbatim passthrough when altText is present and non-empty
  it('returns existing altText verbatim when non-empty', () => {
    const alt = buildImageAlt(setProduct, { altText: 'Model wearing Leblon Glow set on beach' }, 0)
    expect(alt).toBe('Model wearing Leblon Glow set on beach')
  })

  it('returns existing altText verbatim for subsequent images too', () => {
    const alt = buildImageAlt(setProduct, { altText: 'Side view of Leblon Glow' }, 2)
    expect(alt).toBe('Side view of Leblon Glow')
  })

  // 2. Null / undefined altText → generate
  it('generates alt when altText is null', () => {
    const alt = buildImageAlt(setProduct, { altText: null }, 0)
    expect(alt).toContain('Leblon Glow')
    expect(alt).toContain('Brazilian Bikini')
  })

  it('generates alt when altText is undefined', () => {
    const alt = buildImageAlt(setProduct, {}, 0)
    expect(alt).toContain('Leblon Glow')
    expect(alt).toContain('Brazilian Bikini')
  })

  // 3. Whitespace-only altText → treated as absent (generate)
  it('treats whitespace-only altText as absent and generates', () => {
    const alt = buildImageAlt(setProduct, { altText: '   ' }, 0)
    expect(alt).toContain('Brazilian Bikini')
  })

  // 4. Generated alt contains correct Set/Top
  it('set-priced product ($85) → generated alt contains "Set"', () => {
    const alt = buildImageAlt(setProduct, {}, 0)
    expect(alt).toContain('Set')
    expect(alt).not.toContain('Top')
  })

  it('top-priced product ($42.50) → generated alt contains "Top"', () => {
    const alt = buildImageAlt(topProduct, {}, 0)
    expect(alt).toContain('Top')
    expect(alt).not.toContain('Set')
  })

  it('tag signal wins over price for Set classification', () => {
    const tagSetProduct = makeDetail({
      title: 'Mystery',
      tags: ['set'],
      price: '42.50',
      options: [],
    })
    const alt = buildImageAlt(tagSetProduct, {}, 0)
    expect(alt).toContain('Set')
  })

  // 5. Generated alt contains the product title
  it('generated alt always contains the product title', () => {
    expect(buildImageAlt(setProduct, {}, 0)).toContain('Leblon Glow')
    expect(buildImageAlt(topProduct, {}, 0)).toContain('Carvão')
    expect(buildImageAlt(noColorProduct, {}, 0)).toContain('Arpoador')
  })

  // 6. Single-color enrichment
  it('single Color option → color appears in generated alt', () => {
    const alt = buildImageAlt(setProduct, {}, 0)
    expect(alt).toContain('Burgundy')
  })

  it('single color for top product → color appears in alt', () => {
    const alt = buildImageAlt(topProduct, {}, 0)
    expect(alt).toContain('Black')
  })

  // 7. Multi/zero color → color NOT in generated alt
  it('multiple Color option values → color NOT in generated alt', () => {
    const alt = buildImageAlt(multiColorProduct, {}, 0)
    expect(alt).not.toContain('Black')
    expect(alt).not.toContain('White')
    expect(alt).not.toContain('Neon Coral')
  })

  it('no Color option → color NOT in generated alt', () => {
    const alt = buildImageAlt(noColorProduct, {}, 0)
    // Should not contain stray color keywords
    expect(alt).toContain('Brazilian Bikini')
    expect(alt).toContain('Arpoador')
  })

  it('whitespace-only Color value → color NOT injected', () => {
    const alt = buildImageAlt(whitespaceColorProduct, {}, 0)
    expect(alt).not.toContain('   ')
    expect(alt).toContain('Brazilian Bikini')
  })

  // 8. Distinctness across indices
  it('index 0 and index 1 produce different alt text (distinct)', () => {
    const alt0 = buildImageAlt(setProduct, {}, 0)
    const alt1 = buildImageAlt(setProduct, {}, 1)
    expect(alt0).not.toBe(alt1)
  })

  it('index 0 and index 2 produce different alt text (distinct)', () => {
    const alt0 = buildImageAlt(setProduct, {}, 0)
    const alt2 = buildImageAlt(setProduct, {}, 2)
    expect(alt0).not.toBe(alt2)
  })

  it('subsequent images include the view number for distinction', () => {
    const alt1 = buildImageAlt(setProduct, {}, 1)
    expect(alt1).toContain('2')
  })

  it('subsequent images (index 3) include view 4', () => {
    const alt3 = buildImageAlt(setProduct, {}, 3)
    expect(alt3).toContain('4')
  })

  // 9. Alt does NOT include brand suffix (not a title — descriptive prose only)
  it('generated alt does NOT contain "Melancia Swim"', () => {
    const alt = buildImageAlt(setProduct, {}, 0)
    expect(alt).not.toContain('Melancia Swim')
    expect(alt).not.toContain('| Melancia')
  })

  // 10. Ad policy: never "tiny"
  it('never contains the word "tiny"', () => {
    const products = [setProduct, topProduct, multiColorProduct, noColorProduct]
    for (const p of products) {
      for (let i = 0; i < 3; i++) {
        expect(buildImageAlt(p, {}, i).toLowerCase()).not.toContain('tiny')
      }
    }
  })

  // 11. Exact format checks for index 0
  it('index 0 format: "{title} {color} Brazilian Bikini {Set|Top}"', () => {
    // setProduct has single color "Burgundy", price $85 → Set
    expect(buildImageAlt(setProduct, {}, 0)).toBe('Leblon Glow Burgundy Brazilian Bikini Set')
  })

  it('index 0 format without color: "{title} Brazilian Bikini {Set|Top}"', () => {
    // noColorProduct has no color, price $42.50 → Top
    expect(buildImageAlt(noColorProduct, {}, 0)).toBe('Arpoador Brazilian Bikini Top')
  })

  // 12. Exact format check for subsequent indices
  it('index 1 format: "{base} — view 2"', () => {
    expect(buildImageAlt(setProduct, {}, 1)).toBe('Leblon Glow Burgundy Brazilian Bikini Set — view 2')
  })

  it('index 2 format: "{base} — view 3"', () => {
    expect(buildImageAlt(noColorProduct, {}, 2)).toBe('Arpoador Brazilian Bikini Top — view 3')
  })
})
