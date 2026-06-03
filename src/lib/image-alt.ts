/**
 * Image alt text builder — pure function, no side effects.
 *
 * Generates descriptive, keyword-enriched alt text for product images on the
 * product detail page. When Shopify has a per-image altText set by an editor,
 * that text is returned verbatim (it is intentional and usually best). When
 * no per-image alt is available, a descriptive string is generated from the
 * product's attributes (title, color, Set/Top classification).
 *
 * Format (generated):
 *   index 0:  "{title} [{color}] Brazilian Bikini {Set|Top}"
 *   index N:  "{base} — view {N+1}"
 *
 * Color is included ONLY when the product has exactly one Color option value.
 * The brand suffix ("| Melancia Swim") is intentionally omitted — alt text is
 * descriptive prose for accessibility/SEO, not a page title.
 *
 * Ad policy: never contains the word "tiny".
 */

import type { ShopifyProductDetail } from '@/types/shopify'
import { classifyProduct } from '@/lib/collections'
import { singleColorValue } from '@/lib/product-title'

/**
 * Build descriptive alt text for a product image.
 *
 * @param product - The full product detail object.
 * @param image   - The image node; altText may be set by a Shopify editor.
 * @param index   - The 0-based position of this image in the displayed gallery.
 * @returns       A non-empty alt string — verbatim editor alt, or a generated one.
 */
export function buildImageAlt(
  product: ShopifyProductDetail,
  image: { altText?: string | null },
  index: number,
): string {
  // Respect editor-set alt when non-empty (trimmed)
  const existing = image.altText?.trim()
  if (existing) return existing

  // Classify Set / Top
  const kind = classifyProduct(product)
  const setOrTop = kind === 'set' ? 'Set' : 'Top'

  // Color only when exactly one value (never fabricate)
  const color = singleColorValue(product)

  // Build the base description
  const parts: string[] = [product.title]
  if (color) parts.push(color)
  parts.push(`Brazilian Bikini ${setOrTop}`)

  const base = parts.join(' ')

  // First image: use the base; subsequent: append view number for distinctness
  if (index === 0) return base
  return `${base} — view ${index + 1}`
}
