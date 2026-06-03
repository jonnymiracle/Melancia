import { describe, it, expect } from 'vitest'
import { buildBreadcrumbJsonLd } from './breadcrumb-jsonld'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const HOME_ITEM = { name: 'Home', url: 'https://www.melanciaswim.com/' }
const SHOP_ITEM = { name: 'Shop', url: 'https://www.melanciaswim.com/shop' }
const PRODUCT_ITEM = {
  name: 'Leblon Glow',
  url: 'https://www.melanciaswim.com/shop/leblon-glow',
}

const threeItems = [HOME_ITEM, SHOP_ITEM, PRODUCT_ITEM]

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('buildBreadcrumbJsonLd', () => {
  // 1. JSON roundtrip
  it('produces a value that round-trips through JSON.stringify / JSON.parse', () => {
    const schema = buildBreadcrumbJsonLd(threeItems)
    const roundTripped = JSON.parse(JSON.stringify(schema))
    expect(roundTripped).toEqual(schema)
  })

  // 1b. Empty input still produces a valid BreadcrumbList with an empty list
  it('returns a valid BreadcrumbList with an empty itemListElement for empty input', () => {
    const schema = buildBreadcrumbJsonLd([])
    expect(schema['@type']).toBe('BreadcrumbList')
    expect(schema.itemListElement).toEqual([])
  })

  // 2. Top-level type fields
  it('sets @context to https://schema.org', () => {
    const schema = buildBreadcrumbJsonLd(threeItems)
    expect(schema['@context']).toBe('https://schema.org')
  })

  it('sets @type to BreadcrumbList', () => {
    const schema = buildBreadcrumbJsonLd(threeItems)
    expect(schema['@type']).toBe('BreadcrumbList')
  })

  // 3. itemListElement length matches input
  it('itemListElement length matches the number of input items', () => {
    const schema = buildBreadcrumbJsonLd(threeItems)
    const list = schema.itemListElement as unknown[]
    expect(list).toHaveLength(3)
  })

  it('itemListElement length matches a single-item input', () => {
    const schema = buildBreadcrumbJsonLd([HOME_ITEM])
    const list = schema.itemListElement as unknown[]
    expect(list).toHaveLength(1)
  })

  it('itemListElement length matches a two-item input', () => {
    const schema = buildBreadcrumbJsonLd([HOME_ITEM, SHOP_ITEM])
    const list = schema.itemListElement as unknown[]
    expect(list).toHaveLength(2)
  })

  // 4. Each element is a ListItem
  it('every element has @type === ListItem', () => {
    const schema = buildBreadcrumbJsonLd(threeItems)
    const list = schema.itemListElement as Array<Record<string, unknown>>
    for (const item of list) {
      expect(item['@type']).toBe('ListItem')
    }
  })

  // 5. Positions are 1-based and in order
  it('positions are 1-based integers in order', () => {
    const schema = buildBreadcrumbJsonLd(threeItems)
    const list = schema.itemListElement as Array<Record<string, unknown>>
    list.forEach((item, i) => {
      expect(item.position).toBe(i + 1)
    })
  })

  it('a single-item list has position 1', () => {
    const schema = buildBreadcrumbJsonLd([HOME_ITEM])
    const list = schema.itemListElement as Array<Record<string, unknown>>
    expect(list[0].position).toBe(1)
  })

  // 6. Names and URLs match inputs in order
  it('names match input names in order', () => {
    const schema = buildBreadcrumbJsonLd(threeItems)
    const list = schema.itemListElement as Array<Record<string, unknown>>
    expect(list[0].name).toBe('Home')
    expect(list[1].name).toBe('Shop')
    expect(list[2].name).toBe('Leblon Glow')
  })

  it('item URLs match input URLs in order', () => {
    const schema = buildBreadcrumbJsonLd(threeItems)
    const list = schema.itemListElement as Array<Record<string, unknown>>
    expect(list[0].item).toBe('https://www.melanciaswim.com/')
    expect(list[1].item).toBe('https://www.melanciaswim.com/shop')
    expect(list[2].item).toBe('https://www.melanciaswim.com/shop/leblon-glow')
  })

  // 7. URLs are absolute (start with the site origin)
  it('all item URLs start with https://www.melanciaswim.com', () => {
    const schema = buildBreadcrumbJsonLd(threeItems)
    const list = schema.itemListElement as Array<Record<string, unknown>>
    for (const entry of list) {
      expect(String(entry.item)).toMatch(/^https:\/\/www\.melanciaswim\.com/)
    }
  })

  // 8. Representative Home / Shop / Product trail
  it('produces correct positions, names, and URLs for the full Home > Shop > Product trail', () => {
    const schema = buildBreadcrumbJsonLd(threeItems)
    const list = schema.itemListElement as Array<Record<string, unknown>>

    expect(list[0]).toMatchObject({
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://www.melanciaswim.com/',
    })
    expect(list[1]).toMatchObject({
      '@type': 'ListItem',
      position: 2,
      name: 'Shop',
      item: 'https://www.melanciaswim.com/shop',
    })
    expect(list[2]).toMatchObject({
      '@type': 'ListItem',
      position: 3,
      name: 'Leblon Glow',
      item: 'https://www.melanciaswim.com/shop/leblon-glow',
    })
  })

  // 9. Pure / deterministic — two calls with identical input produce equal output
  it('is deterministic — two calls with identical input produce equal output', () => {
    const a = buildBreadcrumbJsonLd(threeItems)
    const b = buildBreadcrumbJsonLd(threeItems)
    expect(a).toEqual(b)
  })

  // 10. Does not mutate the input array
  it('does not mutate the input array', () => {
    const items = [{ ...HOME_ITEM }, { ...SHOP_ITEM }, { ...PRODUCT_ITEM }]
    const copy = [...items]
    buildBreadcrumbJsonLd(items)
    expect(items).toEqual(copy)
  })
})
