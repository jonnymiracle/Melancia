import { describe, it, expect } from 'vitest'
import type { ShopifyProduct } from '@/types/shopify'
import {
  COLLECTIONS,
  getCollection,
  filterProductsForCollection,
  SETS_HANDLE,
  TOPS_HANDLE,
} from './collections'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeProduct(opts: {
  id: string
  title: string
  tags?: string[]
  price?: string
}): ShopifyProduct {
  return {
    id: opts.id,
    title: opts.title,
    handle: opts.id,
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

// Price-only fallback products (no set/top tag).
const setByPrice = makeProduct({ id: 'set-price', title: 'Ipanema Set', price: '85.00' })
const topByPrice = makeProduct({ id: 'top-price', title: 'Ipanema Top', price: '42.50' })

// Tag-driven products (price contradicts the tag → tag must win).
const setByTagCheapPrice = makeProduct({
  id: 'set-tag',
  title: 'Mystery Bundle',
  tags: ['Brazilian Bikini Set'],
  price: '42.50', // price would say "top", tag says "set"
})
const topByTagExpensivePrice = makeProduct({
  id: 'top-tag',
  title: 'Premium Single',
  tags: ['top'],
  price: '85.00', // price would say "set", tag says "top"
})

// Threshold edge cases.
const setAtThreshold = makeProduct({ id: 'at-60', title: 'At Threshold', price: '60.00' })
const topJustUnder = makeProduct({ id: 'under-60', title: 'Just Under', price: '59.99' })

const allProducts: ShopifyProduct[] = [
  setByPrice,
  topByPrice,
  setByTagCheapPrice,
  topByTagExpensivePrice,
  setAtThreshold,
  topJustUnder,
]

// ---------------------------------------------------------------------------
// filterProductsForCollection
// ---------------------------------------------------------------------------

describe('filterProductsForCollection', () => {
  it('sets collection returns ONLY set products', () => {
    const sets = filterProductsForCollection(allProducts, SETS_HANDLE)
    const ids = sets.map((p) => p.id).sort()
    expect(ids).toEqual(['at-60', 'set-price', 'set-tag'].sort())
  })

  it('tops collection returns ONLY top products', () => {
    const tops = filterProductsForCollection(allProducts, TOPS_HANDLE)
    const ids = tops.map((p) => p.id).sort()
    expect(ids).toEqual(['top-price', 'top-tag', 'under-60'].sort())
  })

  it('sets and tops do not overlap and partition the catalog', () => {
    const sets = filterProductsForCollection(allProducts, SETS_HANDLE)
    const tops = filterProductsForCollection(allProducts, TOPS_HANDLE)
    const setIds = sets.map((p) => p.id)
    const topIds = new Set(tops.map((p) => p.id))
    for (const id of setIds) expect(topIds.has(id)).toBe(false)
    expect(sets.length + tops.length).toBe(allProducts.length)
  })

  it('counts are correct (3 sets, 3 tops)', () => {
    expect(filterProductsForCollection(allProducts, SETS_HANDLE)).toHaveLength(3)
    expect(filterProductsForCollection(allProducts, TOPS_HANDLE)).toHaveLength(3)
  })

  it('an explicit "set" tag wins even when price says "top"', () => {
    const sets = filterProductsForCollection([setByTagCheapPrice], SETS_HANDLE)
    const tops = filterProductsForCollection([setByTagCheapPrice], TOPS_HANDLE)
    expect(sets.map((p) => p.id)).toEqual(['set-tag'])
    expect(tops).toHaveLength(0)
  })

  it('an explicit "top" tag wins even when price says "set"', () => {
    const tops = filterProductsForCollection([topByTagExpensivePrice], TOPS_HANDLE)
    const sets = filterProductsForCollection([topByTagExpensivePrice], SETS_HANDLE)
    expect(tops.map((p) => p.id)).toEqual(['top-tag'])
    expect(sets).toHaveLength(0)
  })

  it('price fallback classifies $85 as a set and $42.50 as a top when no tag is present', () => {
    expect(filterProductsForCollection([setByPrice], SETS_HANDLE)).toHaveLength(1)
    expect(filterProductsForCollection([setByPrice], TOPS_HANDLE)).toHaveLength(0)
    expect(filterProductsForCollection([topByPrice], TOPS_HANDLE)).toHaveLength(1)
    expect(filterProductsForCollection([topByPrice], SETS_HANDLE)).toHaveLength(0)
  })

  it('price threshold is inclusive at 60 for sets, exclusive below for tops', () => {
    expect(filterProductsForCollection([setAtThreshold], SETS_HANDLE)).toHaveLength(1)
    expect(filterProductsForCollection([topJustUnder], TOPS_HANDLE)).toHaveLength(1)
  })

  it('returns an empty array for an unknown handle', () => {
    expect(filterProductsForCollection(allProducts, 'tanning-bikinis')).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// getCollection
// ---------------------------------------------------------------------------

describe('getCollection', () => {
  it('returns config for valid handles', () => {
    expect(getCollection(SETS_HANDLE)?.handle).toBe(SETS_HANDLE)
    expect(getCollection(TOPS_HANDLE)?.handle).toBe(TOPS_HANDLE)
  })

  it('returns undefined for an unknown handle', () => {
    expect(getCollection('tanning-bikinis')).toBeUndefined()
    expect(getCollection('')).toBeUndefined()
  })
})

// ---------------------------------------------------------------------------
// Collection config integrity
// ---------------------------------------------------------------------------

describe('collection config', () => {
  it('defines exactly two collections', () => {
    expect(COLLECTIONS).toHaveLength(2)
  })

  for (const c of COLLECTIONS) {
    it(`"${c.handle}" has non-empty title/metaDescription/h1/intro`, () => {
      expect(c.title.trim().length).toBeGreaterThan(0)
      expect(c.metaDescription.trim().length).toBeGreaterThan(0)
      expect(c.h1.trim().length).toBeGreaterThan(0)
      expect(c.intro.trim().length).toBeGreaterThan(0)
    })

    it(`"${c.handle}" never uses the banned ad word "tiny"`, () => {
      const blob = `${c.title} ${c.metaDescription} ${c.h1} ${c.intro}`.toLowerCase()
      expect(blob).not.toContain('tiny')
    })
  }

  it('sets title contains the primary keyword "brazilian bikini set"', () => {
    expect(getCollection(SETS_HANDLE)!.title.toLowerCase()).toContain('brazilian bikini set')
  })

  it('tops title contains the primary keyword "brazilian bikini top"', () => {
    expect(getCollection(TOPS_HANDLE)!.title.toLowerCase()).toContain('brazilian bikini top')
  })
})
