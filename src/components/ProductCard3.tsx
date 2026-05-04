'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import type { Product } from '@/types'
import type {
  ProductCard3Product,
  ShopifyProduct,
  ShopifyProductVariant,
} from '@/types/shopify'
import { addToCart } from '@/lib/add-to-cart-client'
import { getStoredCartId } from '@/lib/cart-storage'
import { resolveCatalogProductBadge, resolveShopifyProductBadge } from '@/lib/product-badge'
import { CartIcon, ShirtIcon } from '@/components/icons'

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

/** Product card uses `featuredImage`; many stores only attach photos to variants. */
function shopifyCardImage(product: ShopifyProduct): {
  url: string
  alt: string
} | null {
  if (product.featuredImage?.url) {
    return {
      url: product.featuredImage.url,
      alt: product.featuredImage.altText || product.title,
    }
  }
  const edges = product.variants?.edges ?? []
  for (const { node } of edges) {
    if (node.image?.url) {
      return {
        url: node.image.url,
        alt: node.image.altText || product.title,
      }
    }
  }
  return null
}

/** Cart line id for this variant, if it’s already in the stored Shopify cart. */
async function fetchCartLineIdForVariant(variantId: string): Promise<string | null> {
  const cartId = getStoredCartId()
  if (!cartId) return null
  try {
    const res = await fetch(
      `/api/shopify/cart?cartId=${encodeURIComponent(cartId)}`,
    )
    const body = await res.json()
    const edges = body?.data?.cart?.lines?.edges ?? []
    for (const edge of edges) {
      const node = edge?.node
      const mid = node?.merchandise?.id
      if (mid === variantId && node?.id) return node.id as string
    }
  } catch {
    /* ignore */
  }
  return null
}

export default function ProductCard3({ product }: ProductCard3Props) {
  const [pending, setPending] = useState(false)
  const [cartLineId, setCartLineId] = useState<string | null>(null)

  const isCatalog = isCatalogProduct(product)
  const variant = !isCatalog ? product.variants?.edges?.[0]?.node : undefined

  useEffect(() => {
    if (isCatalog || !variant?.id) {
      setCartLineId(null)
      return
    }
    let cancelled = false
    const sync = async () => {
      const id = await fetchCartLineIdForVariant(variant.id)
      if (!cancelled) setCartLineId(id)
    }
    void sync()
    window.addEventListener('melancia-cart-updated', sync)
    return () => {
      cancelled = true
      window.removeEventListener('melancia-cart-updated', sync)
    }
  }, [isCatalog, variant?.id])

  if (isCatalog) {
    const catalogBadge = resolveCatalogProductBadge(product)

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

          {catalogBadge && (
            <span className={`product-badge ${catalogBadge}`}>
              {catalogBadge === 'new' ? 'New' : 'Sale'}
            </span>
          )}

          <div
            className="product-quick-add"
            onClick={(e) => e.stopPropagation()}
            role="presentation"
          >
            <button type="button" className="btn btn-primary">
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

  const handle = product.handle ?? ''

  const shopifyPromoBadge = resolveShopifyProductBadge(product.tags ?? [])

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
    if (!result.ok) {
      alert(result.error)
      return
    }
    const lineId = await fetchCartLineIdForVariant(variant.id)
    setCartLineId(lineId)
  }

  const handleRemoveFromCart = async () => {
    const cartId = getStoredCartId()
    if (!cartId || !cartLineId) return
    setPending(true)
    try {
      const res = await fetch('/api/shopify/cart/lines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'remove',
          cartId,
          lineIds: [cartLineId],
        }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        alert(body.error || 'Could not remove from bag')
        return
      }
      setCartLineId(null)
      window.dispatchEvent(new CustomEvent('melancia-cart-updated', { detail: {} }))
    } finally {
      setPending(false)
    }
  }

  const handleBagClick = () => {
    if (cartLineId) void handleRemoveFromCart()
    else void handleAddToCart()
  }

  const bagLabel = pending
    ? cartLineId
      ? 'Removing…'
      : 'Adding…'
    : cartLineId
      ? '- remove from cart'
      : '+ Add to cart'

  const cardImage = shopifyCardImage(product)

  return (
    <div className="product-card">
      <div className="product-image">
        {cardImage ? (
          <Image
            src={cardImage.url}
            alt={cardImage.alt}
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

        {variant && !variant.availableForSale ? (
          <span className="product-badge sale">Sold out</span>
        ) : (
          shopifyPromoBadge && (
            <span className={`product-badge ${shopifyPromoBadge}`}>
              {shopifyPromoBadge === 'new' ? 'New' : 'Sale'}
            </span>
          )
        )}

        {cartLineId && (
          <span
            className="product-wishlist active product-in-bag-icon"
            aria-label="In your bag"
            role="img"
          >
            <CartIcon size={16} />
          </span>
        )}

        <div
          className="product-quick-add"
          onClick={(e) => e.stopPropagation()}
          role="presentation"
        >
          {variant ? (
            <button
              type="button"
              className="btn btn-primary"
              disabled={pending || (!cartLineId && !canAdd)}
              onClick={() => void handleBagClick()}
            >
              {bagLabel}
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
