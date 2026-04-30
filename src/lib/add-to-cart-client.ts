import { getStoredCartId, setStoredCartId } from '@/lib/cart-storage'

export type AddToCartResult =
  | { ok: true; cartId: string; totalQuantity?: number }
  | { ok: false; error: string }

/** Adds a variant to the shared Shopify cart (creates cart on first add). */
export async function addToCart(
  variantId: string,
  quantity = 1,
): Promise<AddToCartResult> {
  const cartId = getStoredCartId()
  const res = await fetch('/api/shopify/cart/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      variantId,
      quantity,
      cartId: cartId ?? undefined,
    }),
  })

  const body = await res.json().catch(() => ({}))

  if (!res.ok) {
    return { ok: false, error: body.error || 'Could not add to bag' }
  }

  if (body.cartId) {
    setStoredCartId(body.cartId)
    return {
      ok: true,
      cartId: body.cartId,
      totalQuantity: body.totalQuantity,
    }
  }

  return { ok: false, error: body.error || 'Invalid response from cart' }
}
