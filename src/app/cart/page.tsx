'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type CartLine = {
  id: string
  title: string
  variant: string
  price: number
  qty: number
  image?: string
  placeholderClass: string
}

const INITIAL_LINES: CartLine[] = [
  {
    id: '1',
    title: 'Watermelon Bliss Set',
    variant: 'M · Coral / Lavender',
    price: 89,
    qty: 1,
    placeholderClass: 'prod-ph-1',
  },
  {
    id: '2',
    title: 'Lavender Dream Top',
    variant: 'S · Lilac',
    price: 48,
    qty: 2,
    placeholderClass: 'prod-ph-2',
  },
]

export default function CartPage() {
  const [lines, setLines] = useState<CartLine[]>(INITIAL_LINES)

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.price * l.qty, 0),
    [lines],
  )

  const freeShippingThreshold = 80
  const amountToFreeShip = Math.max(0, freeShippingThreshold - subtotal)

  const updateQty = (id: string, delta: number) => {
    setLines((prev) =>
      prev.flatMap((l) => {
        if (l.id !== id) return [l]
        const next = l.qty + delta
        if (next < 1) return []
        return [{ ...l, qty: next }]
      }),
    )
  }

  const removeLine = (id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id))
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
                Add a few favorites from the shop — sunshine optional, good vibes
                included.
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
                Items ({lines.reduce((n, l) => n + l.qty, 0)})
              </h2>
              <div className="cart-lines">
                {lines.map((line) => (
                  <article key={line.id} className="cart-line">
                    <div className="cart-line-image">
                      {line.image ? (
                        <Image
                          src={line.image}
                          alt={line.title}
                          fill
                          sizes="100px"
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div
                          className={`cart-line-placeholder ${line.placeholderClass}`}
                          aria-hidden
                        />
                      )}
                    </div>
                    <div className="cart-line-body">
                      <h3 className="cart-line-title">{line.title}</h3>
                      <p className="cart-line-variant">{line.variant}</p>
                      <div className="cart-line-actions">
                        <div className="cart-qty" role="group" aria-label="Quantity">
                          <button
                            type="button"
                            onClick={() => updateQty(line.id, -1)}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span>{line.qty}</span>
                          <button
                            type="button"
                            onClick={() => updateQty(line.id, 1)}
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
                      <span>${(line.price * line.qty).toFixed(2)}</span>
                      <span className="cart-line-unit">
                        ${line.price.toFixed(2)} each
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <aside className="cart-summary" aria-labelledby="summary-heading">
              <div className="cart-summary-card">
                <h2 id="summary-heading">Order summary</h2>
                <div className="cart-summary-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="cart-summary-row muted">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                {amountToFreeShip > 0 ? (
                  <p className="cart-summary-note">
                    Add{' '}
                    <strong>${amountToFreeShip.toFixed(2)}</strong> more for free US
                    shipping.
                  </p>
                ) : (
                  <p className="cart-summary-note success">
                    You unlocked free US shipping on this order.
                  </p>
                )}
                <div className="cart-summary-row total">
                  <span>Estimated total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <button type="button" className="btn btn-primary cart-checkout-btn">
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
