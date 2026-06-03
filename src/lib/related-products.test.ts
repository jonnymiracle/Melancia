import { describe, it, expect } from 'vitest'
import type { ShopifyProduct } from '@/types/shopify'
import { getRelatedProducts } from './related-products'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeProduct(opts: {
  id: string
  title: string
  handle?: string
  tags?: string[]
  price?: string
}): ShopifyProduct {
  return {
    id: opts.id,
    title: opts.title,
    handle: opts.handle ?? opts.id,
    tags: opts.tags ?? [],
    variants: {
      edges: [
        {
          node: {
            id: `${opts.id}-v1`,
            title: 'Default',
            availableForSale: true,
            price: { amount: opts.price ?? '85.00', currencyCode: 'USD' },
          },
        },
      ],
    },
  }
}

// Sets (~$85)
const set1 = makeProduct({ id: 's1', title: 'Rio Set', handle: 'rio-set', price: '85.00' })
const set2 = makeProduct({ id: 's2', title: 'Copacabana Set', handle: 'copacabana-set', price: '85.00' })
const set3 = makeProduct({ id: 's3', title: 'Ipanema Set', handle: 'ipanema-set', price: '85.00' })
const set4 = makeProduct({ id: 's4', title: 'Leblon Set', handle: 'leblon-set', price: '85.00' })
const set5 = makeProduct({ id: 's5', title: 'Leme Set', handle: 'leme-set', price: '85.00' })

// Tops (~$42.50)
const top1 = makeProduct({ id: 't1', title: 'Sunrise Top', handle: 'sunrise-top', price: '42.50' })
const top2 = makeProduct({ id: 't2', title: 'Marina Top', handle: 'marina-top', price: '42.50' })
const top3 = makeProduct({ id: 't3', title: 'Praia Top', handle: 'praia-top', price: '42.50' })

// Tag-driven set (price would say "top", tag wins)
const setByTag = makeProduct({
  id: 's-tag',
  title: 'Bundle Set',
  handle: 'bundle-set',
  tags: ['Brazilian Bikini Set'],
  price: '42.50',
})

const allProducts: ShopifyProduct[] = [set1, set2, set3, set4, set5, top1, top2, top3, setByTag]

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('getRelatedProducts', () => {
  it('related to a SET excludes the current product and returns ONLY other sets (up to limit)', () => {
    const related = getRelatedProducts(set1, allProducts, 4)
    // Should not include set1 itself
    expect(related.map((p) => p.id)).not.toContain('s1')
    // All returned products must be sets (price >= $60 or set tag)
    for (const p of related) {
      const price = parseFloat(p.variants?.edges[0]?.node.price.amount ?? '0')
      const hasSetTag = (p.tags ?? []).some((t) => /\bset\b/i.test(t))
      expect(price >= 60 || hasSetTag).toBe(true)
    }
    // Must not include tops
    const topIds = [top1.id, top2.id, top3.id]
    for (const p of related) {
      expect(topIds).not.toContain(p.id)
    }
  })

  it('related to a TOP returns ONLY other tops', () => {
    const related = getRelatedProducts(top1, allProducts, 4)
    expect(related.map((p) => p.id)).not.toContain('t1')
    // All returned products must be tops (price < $60 and no set tag)
    for (const p of related) {
      const price = parseFloat(p.variants?.edges[0]?.node.price.amount ?? '0')
      const hasSetTag = (p.tags ?? []).some((t) => /\bset\b/i.test(t))
      expect(price < 60 && !hasSetTag).toBe(true)
    }
    // Must not include sets
    const setIds = [set1.id, set2.id, set3.id, set4.id, set5.id, setByTag.id]
    for (const p of related) {
      expect(setIds).not.toContain(p.id)
    }
  })

  it('excludes self by handle', () => {
    const related = getRelatedProducts(set1, allProducts)
    expect(related.map((p) => p.handle)).not.toContain('rio-set')
  })

  it('excludes self by id when handle is absent', () => {
    // Make a current product with no handle
    const current: ShopifyProduct = { ...set1, handle: undefined }
    const catalog: ShopifyProduct[] = [
      { ...set1, handle: undefined }, // same id, no handle
      set2,
      set3,
    ]
    const related = getRelatedProducts(current, catalog)
    expect(related.map((p) => p.id)).not.toContain('s1')
  })

  it('respects the limit — returns at most limit results', () => {
    // 5 sets total, current is set1 → 4 others + setByTag = 5 candidates; limit 2
    const related = getRelatedProducts(set1, allProducts, 2)
    expect(related).toHaveLength(2)
  })

  it('returns fewer than limit when not enough same-kind products exist', () => {
    // Only top1, top2, top3 are tops. Current is top1 → 2 candidates; limit 4
    const related = getRelatedProducts(top1, allProducts, 4)
    expect(related).toHaveLength(2)
    expect(related.map((p) => p.id).sort()).toEqual(['t2', 't3'].sort())
  })

  it('returns empty when no other same-kind products exist', () => {
    // Catalog has only tops, current is a set
    const topsOnly = [top1, top2, top3]
    const related = getRelatedProducts(set1, topsOnly)
    expect(related).toHaveLength(0)
  })

  it('returns empty for an empty catalog', () => {
    const related = getRelatedProducts(set1, [])
    expect(related).toHaveLength(0)
  })

  it('preserves deterministic input order (stable order)', () => {
    // Set catalog in specific order; result should follow that order
    const catalog: ShopifyProduct[] = [set5, set4, set3, set2, set1]
    const related = getRelatedProducts(set1, catalog, 4)
    // set1 excluded; remaining in input order: set5, set4, set3, set2
    expect(related.map((p) => p.id)).toEqual(['s5', 's4', 's3', 's2'])
  })

  it('tag-driven set is treated as a set (not a top)', () => {
    // setByTag has price $42.50 but tag "Brazilian Bikini Set"
    const related = getRelatedProducts(set1, [set2, setByTag, top1], 4)
    const ids = related.map((p) => p.id)
    expect(ids).toContain('s-tag') // set by tag — must be included
    expect(ids).not.toContain('t1') // top — must not be included
  })

  it('uses default limit of 4', () => {
    // 5 sets, current is set1 → 4 others (set2..set5) + setByTag = 5 candidates; limit default 4
    const related = getRelatedProducts(set1, allProducts)
    expect(related).toHaveLength(4)
  })
})
