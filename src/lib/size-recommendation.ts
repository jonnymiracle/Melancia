/**
 * Maps the sizes a shopper already knows (her bra, her jeans) onto a Melancia
 * size range.
 *
 * Ranges rather than single sizes because the pieces are adjustable: telling
 * someone "Small to Medium" keeps the sale alive where an exact answer she
 * disagrees with would lose it.
 *
 * The two tables below are plain data on purpose. Correcting them is editing a
 * value, never touching logic, which is what makes it safe for someone who
 * knows the garments to fix them without knowing TypeScript.
 *
 * KNOWN GAP: no combination currently returns plain "Medium". These values were
 * derived from the bust and jean ranges in PdpSizeChart.tsx, where Medium spans
 * only two values, so everyone lands on one edge or the other. Worth fixing when
 * the real garment measurements land.
 */

export type SizeRange =
  | 'Small'
  | 'Small – Medium'
  | 'Medium'
  | 'Medium – Large'
  | 'Large'

export const BANDS = [30, 32, 34, 36, 38] as const
export const CUPS = ['A', 'B', 'C', 'D', 'DD', 'DDD'] as const
export const JEANS = [0, 2, 4, 6, 8, 10, 12, 14, 16] as const

export type Band = (typeof BANDS)[number]
export type Cup = (typeof CUPS)[number]

/** Bra size to top range. Rows are bands, keys inside are cups. */
export const BRA_TO_TOP: Record<string, SizeRange> = {
  '30A': 'Small',          '30B': 'Small',          '30C': 'Small',
  '30D': 'Small',          '30DD': 'Small – Medium', '30DDD': 'Small – Medium',

  '32A': 'Small',          '32B': 'Small',          '32C': 'Small – Medium',
  '32D': 'Small – Medium', '32DD': 'Medium – Large', '32DDD': 'Medium – Large',

  '34A': 'Small – Medium', '34B': 'Small – Medium', '34C': 'Medium – Large',
  '34D': 'Medium – Large', '34DD': 'Large',         '34DDD': 'Large',

  '36A': 'Medium – Large', '36B': 'Medium – Large', '36C': 'Large',
  '36D': 'Large',          '36DD': 'Large',         '36DDD': 'Large',

  '38A': 'Large',          '38B': 'Large',          '38C': 'Large',
  '38D': 'Large',          '38DD': 'Large',         '38DDD': 'Large',
}

/** Jean size to bottom range. */
export const JEAN_TO_BOTTOM: Record<number, SizeRange> = {
  0: 'Small',
  2: 'Small',
  4: 'Small',
  6: 'Small – Medium',
  8: 'Small – Medium',
  10: 'Medium – Large',
  12: 'Medium – Large',
  14: 'Large',
  16: 'Large',
}

/**
 * The size actually put in the bag when the answer is a range.
 *
 * Always the larger of the two: an adjustable bikini can be tightened but not
 * let out, so the bigger size is the recoverable mistake.
 */
const RANGE_TO_CART: Record<SizeRange, 'Small' | 'Medium' | 'Large'> = {
  'Small': 'Small',
  'Small – Medium': 'Medium',
  'Medium': 'Medium',
  'Medium – Large': 'Large',
  'Large': 'Large',
}

export function topRangeFor(band: Band | number, cup: Cup | string): SizeRange {
  return BRA_TO_TOP[`${band}${cup}`] ?? 'Medium'
}

export function bottomRangeFor(jean: number): SizeRange {
  return JEAN_TO_BOTTOM[jean] ?? 'Medium'
}

export function cartSizeFor(range: SizeRange): 'Small' | 'Medium' | 'Large' {
  return RANGE_TO_CART[range]
}
