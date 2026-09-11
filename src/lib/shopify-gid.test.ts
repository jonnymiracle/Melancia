import { describe, it, expect } from 'vitest'
import { legacyIdFromGid } from './shopify-gid'

describe('legacyIdFromGid', () => {
  it('pulls the numeric id out of a product GID', () => {
    // The real shape returned by the Storefront API for pedra-do-sal-top.
    expect(legacyIdFromGid('gid://shopify/Product/9293134135529')).toBe('9293134135529')
  })

  it('works for other resource types', () => {
    expect(legacyIdFromGid('gid://shopify/ProductVariant/123')).toBe('123')
  })

  it('drops a trailing query string', () => {
    // Cart GIDs carry a key, and a widget given the whole tail would silently
    // match nothing.
    expect(legacyIdFromGid('gid://shopify/Cart/hWNGiz?key=205000a3')).toBe('hWNGiz')
  })

  it('leaves a bare id alone', () => {
    expect(legacyIdFromGid('9293134135529')).toBe('9293134135529')
  })

  it('returns an empty string rather than throwing on empty input', () => {
    expect(legacyIdFromGid('')).toBe('')
  })
})
