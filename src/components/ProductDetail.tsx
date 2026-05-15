'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { ShopifyProductDetail } from '@/types/shopify'
import { addToCart } from '@/lib/add-to-cart-client'

type Props = { product: ShopifyProductDetail }

function fmt(amount: string, currency: string) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(Number(amount))
}

export default function ProductDetail({ product }: Props) {
  const images = product.images.edges.map((e) => e.node)
  const variants = product.variants.edges.map((e) => e.node)

  const firstAvailable = variants.find((v) => v.availableForSale) ?? variants[0] ?? null
  const [activeImage, setActiveImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState(firstAvailable)
  const [pending, setPending] = useState(false)
  const [added, setAdded] = useState(false)

  const isSoldOut = !variants.some((v) => v.availableForSale)
  const showSizes =
    variants.length > 1 ||
    (variants.length === 1 && variants[0].title !== 'Default Title')

  const isOnSale =
    selectedVariant?.compareAtPrice &&
    Number(selectedVariant.compareAtPrice.amount) > Number(selectedVariant.price.amount)

  const handleAddToCart = async () => {
    if (!selectedVariant?.id || !selectedVariant.availableForSale) return
    setPending(true)
    const result = await addToCart(selectedVariant.id, 1)
    setPending(false)
    if (result.ok) {
      setAdded(true)
      window.dispatchEvent(new CustomEvent('melancia-cart-updated', { detail: {} }))
      setTimeout(() => setAdded(false), 2500)
    } else {
      alert(result.error)
    }
  }

  return (
    <>
      <p className="pdp-breadcrumb">
        <Link href="/shop">Shop</Link>
        {' / '}
        {product.title}
      </p>

      <div className="pdp-layout">
        {/* ── Gallery ── */}
        <div className="pdp-gallery">
          <div className="pdp-main-image">
            {images[activeImage] ? (
              <Image
                src={images[activeImage].url}
                alt={images[activeImage].altText ?? product.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                priority
              />
            ) : (
              <div className="product-image-placeholder prod-ph-1" style={{ height: '100%' }} />
            )}
          </div>

          {images.length > 1 && (
            <div className="pdp-thumbnails">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  className={`pdp-thumb${activeImage === i ? ' active' : ''}`}
                  onClick={() => setActiveImage(i)}
                  aria-label={`View photo ${i + 1}`}
                >
                  <Image
                    src={img.url}
                    alt={img.altText ?? product.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="72px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Info ── */}
        <div className="pdp-info">
          <Link href="/shop" className="pdp-back">← Back to shop</Link>

          <h1 className="pdp-title">{product.title}</h1>

          <div className="pdp-price">
            {isOnSale && selectedVariant?.compareAtPrice && (
              <span className="original">
                {fmt(selectedVariant.compareAtPrice.amount, selectedVariant.compareAtPrice.currencyCode)}
              </span>
            )}
            <span className={isOnSale ? 'sale' : ''}>
              {selectedVariant
                ? fmt(selectedVariant.price.amount, selectedVariant.price.currencyCode)
                : '—'}
            </span>
          </div>

          {/* Size pills */}
          {showSizes && (
            <div className="pdp-variants">
              <span className="pdp-variants-label">
                Size{selectedVariant && selectedVariant.title !== 'Default Title'
                  ? ` — ${selectedVariant.title}`
                  : ''}
              </span>
              <div className="pdp-size-pills">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    className={`pdp-size-pill${selectedVariant?.id === v.id ? ' selected' : ''}`}
                    onClick={() => { if (v.availableForSale) setSelectedVariant(v) }}
                    disabled={!v.availableForSale}
                    title={!v.availableForSale ? 'Sold out' : undefined}
                  >
                    {v.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          {isSoldOut ? (
            <button type="button" className="pdp-sold-out-btn" disabled>
              Sold Out — Notify Me
            </button>
          ) : !selectedVariant?.availableForSale ? (
            <button type="button" className="pdp-sold-out-btn" disabled>
              Sold Out — Notify Me
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary pdp-add-btn"
              onClick={handleAddToCart}
              disabled={pending}
            >
              {pending ? 'Adding…' : added ? '✓ Added to bag!' : 'Add to Bag'}
            </button>
          )}

          {/* Description */}
          {product.descriptionHtml ? (
            <div
              className="pdp-description"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          ) : product.description ? (
            <div className="pdp-description">
              <p>{product.description}</p>
            </div>
          ) : null}

          {/* Trust bar */}
          <div className="pdp-trust">
            <div className="pdp-trust-item">
              <span>🚚</span> Free US shipping on orders over $80
            </div>
            <div className="pdp-trust-item">
              <span>↩</span> Easy returns within 30 days
            </div>
            <div className="pdp-trust-item">
              <span>🔒</span> Secure checkout via Shopify
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
