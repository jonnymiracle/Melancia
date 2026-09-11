/**
 * Pulls the numeric id out of a Shopify global id.
 *
 *   gid://shopify/Product/9293134135529  ->  9293134135529
 *
 * The Storefront API speaks in GIDs, but several third-party widgets — Klaviyo
 * Reviews among them — want the bare number that Liquid's `product.id` emits.
 * Returns the input untouched if it is already numeric.
 */
export function legacyIdFromGid(gid: string): string {
  const tail = gid.split('/').pop() ?? ''
  // A GID can carry a query string, e.g. gid://shopify/Cart/abc?key=123
  return tail.split('?')[0]
}
