import type { ShopifyProductDetail } from '@/types/shopify'

type Variant = ShopifyProductDetail['variants']['edges'][0]['node']

/** The two halves of a bikini, as stored in Shopify's `Piece` option. */
export type Piece = 'Top' | 'Bottom'
export const PIECES: readonly Piece[] = ['Top', 'Bottom']

/** Finds the first variant matching every given option name/value pair. */
export function findVariantByOptions(
  pool: Variant[],
  opts: Record<string, string>,
): Variant | undefined {
  return pool.find(v =>
    Object.entries(opts).every(([name, value]) =>
      v.selectedOptions.some(o => o.name === name && o.value === value)
    )
  )
}

/**
 * Resolves one piece of a paired set (a product whose variants carry a `Piece`
 * option of Top/Bottom) at a given size, within the selected colour.
 */
export function findPieceVariant(
  variants: Variant[],
  piece: Piece,
  size: string | null,
  color?: string | null,
): Variant | undefined {
  if (!size) return undefined
  const opts: Record<string, string> = { Size: size, Piece: piece }
  if (color) opts['Color'] = color
  return findVariantByOptions(variants, opts)
}

/** Sizes of `piece` that are in stock in the selected colour. */
export function availableSizesFor(
  variants: Variant[],
  sizes: string[],
  piece: Piece,
  color?: string | null,
): string[] {
  return sizes.filter(size => findPieceVariant(variants, piece, size, color)?.availableForSale)
}

/**
 * A set is unbuyable when either piece has no size left in the chosen colour —
 * a customer cannot complete a top-and-bottom pair. Callers use this to swap the
 * Add Set button for the back-in-stock notify form.
 */
export function isSetSoldOut(
  variants: Variant[],
  sizes: string[],
  color?: string | null,
): boolean {
  return PIECES.some(piece => availableSizesFor(variants, sizes, piece, color).length === 0)
}
