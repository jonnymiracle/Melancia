/** Persists Shopify Storefront cart id in the browser (same pattern on production). */
export const SHOPIFY_CART_ID_KEY = 'melancia-shopify-cart-id'

export function getStoredCartId(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem(SHOPIFY_CART_ID_KEY)
  } catch {
    return null
  }
}

export function setStoredCartId(id: string): void {
  try {
    localStorage.setItem(SHOPIFY_CART_ID_KEY, id)
    window.dispatchEvent(
      new CustomEvent('melancia-cart-updated', { detail: { cartId: id } }),
    )
  } catch {
    /* quota / private mode */
  }
}

export function clearStoredCartId(): void {
  try {
    localStorage.removeItem(SHOPIFY_CART_ID_KEY)
    window.dispatchEvent(new CustomEvent('melancia-cart-updated', { detail: {} }))
  } catch {
    /* ignore */
  }
}
