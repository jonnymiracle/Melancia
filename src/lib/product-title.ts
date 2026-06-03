/**
 * Product page title builder — pure function, no side effects.
 *
 * Returns a keyword-optimised, ad-safe title string for use as the HTML
 * <title> (absolute — do NOT let the root layout append the brand again)
 * and as the og:title.
 *
 * Format:
 *   {Product Title} [Color] Brazilian Bikini {Set|Top} | Melancia Swim
 *
 * Color is included ONLY when the product exposes exactly one Color option
 * value (single-color products). Zero or many values → omit (never fabricate).
 *
 * Set/Top is derived via classifyProduct, which prefers an explicit tag signal
 * and falls back to the representative price threshold.
 *
 * Ad policy: never contains the word "tiny".
 */

import type { ShopifyProductDetail } from '@/types/shopify'
import { classifyProduct } from '@/lib/collections'
import { SITE_NAME } from '@/lib/site-config'

/**
 * Derive a single Color value to inject into the title, or null when the
 * product has zero or multiple colors (ambiguous → omit for safety).
 */
function singleColorValue(product: ShopifyProductDetail): string | null {
  const colorOption = product.options.find(
    (opt) => opt.name.toLowerCase() === 'color',
  )
  if (!colorOption || colorOption.values.length !== 1) return null
  return colorOption.values[0]
}

/**
 * Build the full, absolute product <title>.
 *
 * Because this title already ends with "| Melancia Swim", callers MUST use
 * `title: { absolute: buildProductTitle(product) }` in Next.js metadata so
 * the root layout template does not double-append the brand.
 */
export function buildProductTitle(product: ShopifyProductDetail): string {
  const kind = classifyProduct(product)
  const setOrTop = kind === 'set' ? 'Set' : 'Top'

  const color = singleColorValue(product)

  const parts: string[] = [product.title]
  if (color) parts.push(color)
  parts.push(`Brazilian Bikini ${setOrTop}`)

  return `${parts.join(' ')} | ${SITE_NAME}`
}
