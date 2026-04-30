'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getStoredCartId, clearStoredCartId } from '@/lib/cart-storage'

type Money = { amount: string; currencyCode: string }

type CartLineNode = {
  id: string
  quantity: number
  merchandise?: {
    id: string
    title: string
    image?: { url: string; altText?: string | null } | null
    price: Money
    product: { title: string }
  } | null
}

type ShopifyCart = {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost?: {
    totalAmount?: Money
  }
  lines: {
    edges: { node: CartLineNode }[]
  }
}

export default function CartPage() {
  const [cart, setCart] = useState<ShopifyCart | null>(null)
  const [loading, setLoading] = useState(true)
  const [cartId, setCartIdState] = useState<string | null>(null)

  const loadCart = useCallback(async () => {
    const id = getStoredCartId()
    setCartIdState(id)
    if (!id) {
      setCart(null)
      setLoading(false)
      return
    }
    try {
      const res = await fetch(
        `/api/shopify/cart?cartId=${encodeURIComponent(id)}`,
      )
      const body = await res.json()
      const c = body.data?.cart as ShopifyCart | null | undefined
      if (!c) {
        clearStoredCartId()
        setCart(null)
      } else {
        setCart(c)
      }
    } catch {
      setCart(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCart()
  }, [loadCart])

  useEffect(() => {
    const onUpdate = () => {
      setLoading(true)
      loadCart()
    }
    window.addEventListener('melancia-cart-updated', onUpdate)
    return () => window.removeEventListener('melancia-cart-updated', onUpdate)
  }, [loadCart])

  const lines = useMemo(() => {
    if (!cart?.lines?.edges?.length) return []
    return cart.lines.edges
      .map((e) => e.node)
      .filter((n) => n.merchandise)
  }, [cart])

  const subtotal = useMemo(() => {
    const a = cart?.cost?.totalAmount
    if (a) return Number.parseFloat(a.amount)
    return lines.reduce((sum, line) => {
      const p = line.merchandise?.price
      if (!p) return sum
      return sum + Number.parseFloat(p.amount) * line.quantity
    }, 0)
  }, [cart, lines])

  const currency =
    cart?.cost?.totalAmount?.currencyCode ||
    lines[0]?.merchandise?.price.currencyCode ||
    'USD'

  const freeShippingThreshold = 80
  const amountToFreeShip = Math.max(0, freeShippingThreshold - subtotal)

  const changeQty = async (lineId: string, nextQty: number) => {
    if (!cartId) return
    const res = await fetch('/api/shopify/cart/lines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update',
        cartId,
        lineId,
        quantity: nextQty,
      }),
    })
    if (res.ok) await loadCart()
  }

  const removeLine = async (lineId: string) => {
    if (!cartId) return
    const res = await fetch('/api/shopify/cart/lines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'remove',
        cartId,
        lineIds: [lineId],
      }),
    })
    if (res.ok) {
      const body = await res.json().catch(() => ({}))
      if (body.totalQuantity === 0) clearStoredCartId()
      await loadCart()
    }
  }

  const checkout = () => {
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl
    }
  }

  if (loading) {
    return (
      <>
        <div className="cart-hero">
          <h1>Your Cart</h1>
          <p>Loading your bag…</p>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="cart-hero">
        <h1>Your Cart</h1>
        <p>Review your picks — free US shipping on orders over $80.</p>
      </div>

      <div className="cart-layout">
        {lines.length === 0 ? (
          <div className="cart-empty-panel">
            <div className="cart-empty">
              <span className="cart-empty-eyebrow">Your bag is waiting</span>
              <h2>Nothing here yet</h2>
              <p>
                Add items from the shop — your selections sync here when you use
                Add to bag on each product.
              </p>
              <Link href="/shop" className="btn btn-primary">
                Browse swimwear
              </Link>
            </div>
          </div>
        ) : (
          <>
            <section className="cart-lines-section" aria-labelledby="cart-heading">
              <h2 id="cart-heading" className="cart-section-title">
                Items ({cart?.totalQuantity ?? lines.reduce((n, l) => n + l.quantity, 0)})
              </h2>
              <div className="cart-lines">
                {lines.map((line) => {
                  const m = line.merchandise!
                  const title = m.product?.title || 'Product'
                  const variantLabel = m.title && m.title !== 'Default Title' ? m.title : ''
                  const unit = Number.parseFloat(m.price.amount)
                  const fmt = new Intl.NumberFormat(undefined, {
                    style: 'currency',
                    currency: m.price.currencyCode,
                  })

                  return (
                    <article key={line.id} className="cart-line">
                      <div className="cart-line-image">
                        {m.image?.url ? (
                          <Image
                            src={m.image.url}
                            alt={m.image.altText || title}
                            fill
                            sizes="100px"
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <div className="cart-line-placeholder prod-ph-1" aria-hidden />
                        )}
                      </div>
                      <div className="cart-line-body">
                        <h3 className="cart-line-title">{title}</h3>
                        {variantLabel ? (
                          <p className="cart-line-variant">{variantLabel}</p>
                        ) : null}
                        <div className="cart-line-actions">
                          <div className="cart-qty" role="group" aria-label="Quantity">
                            <button
                              type="button"
                              onClick={() => changeQty(line.id, line.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span>{line.quantity}</span>
                            <button
                              type="button"
                              onClick={() => changeQty(line.id, line.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            className="cart-remove"
                            onClick={() => removeLine(line.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="cart-line-price">
                        <span>{fmt.format(unit * line.quantity)}</span>
                        <span className="cart-line-unit">{fmt.format(unit)} each</span>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>

            <aside className="cart-summary" aria-labelledby="summary-heading">
              <div className="cart-summary-card">
                <h2 id="summary-heading">Order summary</h2>
                <div className="cart-summary-row">
                  <span>Subtotal</span>
                  <span>
                    {new Intl.NumberFormat(undefined, {
                      style: 'currency',
                      currency,
                    }).format(subtotal)}
                  </span>
                </div>
                <div className="cart-summary-row muted">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                {amountToFreeShip > 0 ? (
                  <p className="cart-summary-note">
                    Add{' '}
                    <strong>
                      {new Intl.NumberFormat(undefined, {
                        style: 'currency',
                        currency,
                      }).format(amountToFreeShip)}
                    </strong>{' '}
                    more for free US shipping.
                  </p>
                ) : (
                  <p className="cart-summary-note success">
                    You unlocked free US shipping on this order.
                  </p>
                )}
                <div className="cart-summary-row total">
                  <span>Estimated total</span>
                  <span>
                    {new Intl.NumberFormat(undefined, {
                      style: 'currency',
                      currency,
                    }).format(subtotal)}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-primary cart-checkout-btn"
                  onClick={checkout}
                >
                  Checkout
                </button>
                <p className="cart-summary-trust">
                  Secure checkout · Easy returns within 30 days
                </p>
                <Link href="/shop" className="cart-continue">
                  ← Continue shopping
                </Link>
              </div>
            </aside>
          </>
        )}
      </div>
    </>
  )
}
