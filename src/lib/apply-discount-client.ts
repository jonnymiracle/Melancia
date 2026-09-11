import { getStoredCartId } from '@/lib/cart-storage'

const PENDING_KEY = 'melancia-pending-discount'

export type ApplyResult =
  | { state: 'applied'; code: string }
  | { state: 'queued'; code: string }
  | { state: 'rejected'; code: string }
  | { state: 'error' }

/**
 * Puts the welcome code on the shopper's cart.
 *
 * Most people meet the popup before they have added anything, so there is no
 * cart to discount yet. Rather than fail, the code is parked in localStorage
 * and `flushPendingDiscount` picks it up the moment a cart exists. That is why
 * this returns 'queued' as a success, not a failure.
 */
export async function applyDiscount(code: string): Promise<ApplyResult> {
  const cartId = getStoredCartId()

  if (!cartId) {
    try { localStorage.setItem(PENDING_KEY, code) } catch { /* private mode */ }
    return { state: 'queued', code }
  }

  try {
    const res = await fetch('/api/shopify/cart/discount', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartId, code }),
    })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) return park(code)
    if (!body.applicable) return { state: 'rejected', code }

    try { localStorage.removeItem(PENDING_KEY) } catch { /* ignore */ }
    return { state: 'applied', code }
  } catch {
    return park(code)
  }
}

/**
 * Keeps the code for another try instead of giving up on it.
 *
 * A failure here is almost always a bad second from Shopify, not a bad code.
 * Parking it means the next add to cart or cart visit applies it and the
 * shopper never finds out anything went wrong.
 */
function park(code: string): ApplyResult {
  try { localStorage.setItem(PENDING_KEY, code) } catch { /* private mode */ }
  return { state: 'error' }
}

/**
 * Applies a code that was parked before a cart existed. Safe to call on every
 * add to cart: it does nothing when nothing is pending.
 */
export async function flushPendingDiscount(): Promise<ApplyResult | null> {
  let pending: string | null = null
  try { pending = localStorage.getItem(PENDING_KEY) } catch { return null }
  if (!pending) return null
  if (!getStoredCartId()) return null

  const result = await applyDiscount(pending)
  // Clear on a definite answer. Leaving a rejected code parked would retry it
  // on every add for the rest of the session.
  if (result.state === 'applied' || result.state === 'rejected') {
    try { localStorage.removeItem(PENDING_KEY) } catch { /* ignore */ }
  }
  return result
}
