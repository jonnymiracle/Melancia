'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Product } from '@/types'
import type { ProductCard3Product, ShopifyProductVariant } from '@/types/shopify'
import { addToCart } from '@/lib/add-to-cart-client'
import { ShirtIcon } from '@/components/icons'

type ProductCard3Props = {
  product: ProductCard3Product
}

function isCatalogProduct(p: ProductCard3Product): p is Product {
  return 'placeholderClass' in p
}

function excerptFromDescription(html?: string, max = 120): string {
  if (!html?.trim()) return ''
  const plain = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  if (plain.length <= max) return plain
  return `${plain.slice(0, max).trimEnd()}…`
}

function formatVariantPrice(variant: ShopifyProductVariant) {
  const n = Number(variant.price.amount)
  if (Number.isNaN(n)) {
    return `${variant.price.amount} ${variant.price.currencyCode}`
  }
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: variant.price.currencyCode,
  }).format(n)
}

export default function ProductCard3({ product }: ProductCard3Props) {
  const [inBag, setInBag] = useState(false)
  const [pending, setPending] = useState(false)

  const goShop = () => {
    window.location.href = '/shop'
  }

  if (isCatalogProduct(product)) {
    return (
      <div className="product-card">
        <div className="product-image">
          {product.image ? (
            <Image src={product.image} alt={product.name} fill style={{ objectFit: 'cover' }} />
          ) : (
            <div className={`product-image-placeholder ${product.placeholderClass}`}>
              <ShirtIcon />
              <span className="placeholder-label">Product Photo</span>
            </div>
          )}

          {product.badge && (
            <span className={`product-badge ${product.badge}`}>
              {product.badge === 'new' ? 'New' : 'Sale'}
            </span>
          )}

          <button
            type="button"
            className={`product-wishlist${inBag ? ' active' : ''}`}
            aria-label="Add to bag"
            disabled={pending}
            onClick={() => {
              setPending(true)
              // goShop()

            }}
          >
            {inBag ? '♥' : '♡'}
          </button>

          <div
            className="product-quick-add"
            onClick={(e) => e.stopPropagation()}
            role="presentation"
          >
            <button
              type="button"
              className="btn btn-primary"
              disabled={pending}
              onClick={() => {
                setPending(true)
                // goShop()
              }}
            >
              + Add to cart
            </button>
          </div>
        </div>

        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-desc">{product.description}</p>
          <div className="product-footer">
            <span className="product-price">
              {product.originalPrice && (
                <span className="original">${product.originalPrice}.00</span>
              )}
              ${product.price}.00
            </span>
            <div className="product-colors">
              {product.colors.map((color, i) => (
                <span
                  key={i}
                  className="color-dot"
                  style={{
                    background: color,
                    border: color === '#ffffff' ? '1px solid #ddd' : undefined,
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const variant = product.variants?.edges?.[0]?.node
  const handle = product.handle ?? ''

  const subtitle =
    excerptFromDescription(product.description) ||
    (variant?.title && variant.title !== 'Default Title'
      ? variant.title
      : handle.replace(/-/g, ' '))

  const canAdd = Boolean(variant?.id && variant.availableForSale)

  const handleAddToCart = async () => {
    if (!variant?.id || !variant.availableForSale) return
    setPending(true)
    const result = await addToCart(variant.id, 1)
    setPending(false)
    if (result.ok) {
      setInBag(true)
    } else {
      alert(result.error)
    }
  }

  return (
    <div className="product-card">
      <div className="product-image">
        {product.featuredImage?.url ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            fill
            sizes="(max-width: 768px) 50vw, 280px"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className="product-image-placeholder prod-ph-1">
            <ShirtIcon />
            <span className="placeholder-label">Product Photo</span>
          </div>
        )}

        {variant && !variant.availableForSale && (
          <span className="product-badge sale">Sold out</span>
        )}

        <button
          type="button"
          className={`product-wishlist${inBag ? ' active' : ''}`}
          aria-label="Add to bag"
          disabled={!canAdd || pending}
          onClick={(e) => {
            e.stopPropagation()
            void handleAddToCart()
          }}
        >
          {inBag ? '♥' : '♡'}
        </button>

        <div
          className="product-quick-add"
          onClick={(e) => e.stopPropagation()}
          role="presentation"
        >
          {variant ? (
            <button
              type="button"
              className="btn btn-primary"
              disabled={!canAdd || pending}
              onClick={() => void handleAddToCart()}
            >
              {pending ? 'Adding…' : '+ Add to bag'}
            </button>
          ) : (
            <button type="button" className="btn btn-outline" disabled>
              Unavailable
            </button>
          )}
        </div>
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.title}</h3>
        <p className="product-desc">{subtitle}</p>
        <div className="product-footer">
          <span className="product-price">
            {variant ? formatVariantPrice(variant) : '—'}
          </span>
        </div>
      </div>
    </div>
  )
}
