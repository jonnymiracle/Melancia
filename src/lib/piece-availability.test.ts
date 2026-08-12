import { describe, it, expect } from 'vitest'
import { findPieceVariant, availableSizesFor, isSetSoldOut } from './piece-availability'
import type { ShopifyProductDetail } from '@/types/shopify'

type Variant = ShopifyProductDetail['variants']['edges'][0]['node']

const SIZES = ['Small', 'Medium', 'Large']

/** Builds a variant the way Shopify returns them for pedra-do-sal-top. */
function variant(size: string, color: string, piece: string, available: boolean): Variant {
  return {
    id: `gid://shopify/ProductVariant/${size}-${color}-${piece}`,
    title: `${size} / ${color} / ${piece}`,
    availableForSale: available,
    selectedOptions: [
      { name: 'Size', value: size },
      { name: 'Color', value: color },
      { name: 'Piece', value: piece },
    ],
    price: { amount: '42.50', currencyCode: 'USD' },
  }
}

/** Every size/piece for one colour, with an availability lookup by `${size}/${piece}`. */
function colorway(color: string, stock: Record<string, boolean>): Variant[] {
  return SIZES.flatMap(size =>
    ['Top', 'Bottom'].map(piece => variant(size, color, piece, stock[`${size}/${piece}`] ?? false))
  )
}

describe('findPieceVariant', () => {
  const variants = colorway('Ceu', { 'Small/Top': true, 'Small/Bottom': true })

  it('matches on size, colour and piece together', () => {
    expect(findPieceVariant(variants, 'Top', 'Small', 'Ceu')?.title).toBe('Small / Ceu / Top')
    expect(findPieceVariant(variants, 'Bottom', 'Small', 'Ceu')?.title).toBe('Small / Ceu / Bottom')
  })

  it('returns undefined when no size is chosen yet', () => {
    expect(findPieceVariant(variants, 'Top', null, 'Ceu')).toBeUndefined()
  })

  it('does not cross colourways', () => {
    expect(findPieceVariant(variants, 'Top', 'Small', 'Carioca')).toBeUndefined()
  })
})

describe('availableSizesFor', () => {
  it('reports each piece independently', () => {
    // The case the split picker exists for: a top size with no matching bottom.
    const variants = colorway('Ceu', {
      'Small/Top': true, 'Small/Bottom': true,
      'Medium/Top': true, 'Medium/Bottom': false,
      'Large/Top': false, 'Large/Bottom': true,
    })

    expect(availableSizesFor(variants, SIZES, 'Top', 'Ceu')).toEqual(['Small', 'Medium'])
    expect(availableSizesFor(variants, SIZES, 'Bottom', 'Ceu')).toEqual(['Small', 'Large'])
  })

  it('returns nothing when the colourway is empty', () => {
    const variants = colorway('Carioca', {})
    expect(availableSizesFor(variants, SIZES, 'Top', 'Carioca')).toEqual([])
  })
})

describe('isSetSoldOut', () => {
  it('is false while both pieces still have a size', () => {
    const variants = colorway('Ceu', {
      'Small/Top': true, 'Large/Bottom': true,
    })
    expect(isSetSoldOut(variants, SIZES, 'Ceu')).toBe(false)
  })

  it('is true when every size of one piece is gone, even if the other has stock', () => {
    // Tops fully sold out; bottoms still available. No complete set is buyable,
    // so the page must fall through to the notify-me form.
    const variants = colorway('Ceu', {
      'Small/Bottom': true, 'Medium/Bottom': true, 'Large/Bottom': true,
    })
    expect(availableSizesFor(variants, SIZES, 'Bottom', 'Ceu')).toHaveLength(3)
    expect(isSetSoldOut(variants, SIZES, 'Ceu')).toBe(true)
  })

  it('is true when the whole colourway is sold out', () => {
    expect(isSetSoldOut(colorway('Carioca', {}), SIZES, 'Carioca')).toBe(true)
  })

  it('judges each colourway separately', () => {
    const catalog = [
      ...colorway('Ceu', { 'Small/Top': true, 'Small/Bottom': true }),
      ...colorway('Carioca', {}),
    ]
    expect(isSetSoldOut(catalog, SIZES, 'Ceu')).toBe(false)
    expect(isSetSoldOut(catalog, SIZES, 'Carioca')).toBe(true)
  })
})
