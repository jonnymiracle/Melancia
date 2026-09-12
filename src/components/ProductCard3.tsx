'use client'

import Image from 'next/image'
import type { ShopifyProduct, ShopifyProductVariant } from '@/types/shopify'
import { badgeFromShopifyTags } from '@/lib/product-badge'
import { ShirtIcon } from '@/components/icons'

type ProductCard3Props = {
  product: ShopifyProduct
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

/** Product card prefers the image on the first variant; falls back to featuredImage. */
function shopifyCardImage(product: ShopifyProduct): {
  url: string
  alt: string
} | null {
  const edges = product.variants?.edges ?? []
  for (const { node } of edges) {
    if (node.image?.url) {
      return {
        url: node.image.url,
        alt: node.image.altText || product.title,
      }
    }
  }
  if (product.featuredImage?.url) {
    return {
      url: product.featuredImage.url,
      alt: product.featuredImage.altText || product.title,
    }
  }
  return null
}

export default function ProductCard3({ product }: ProductCard3Props) {
  const allVariants = (product.variants?.edges ?? []).map(e => e.node)
  const variant = allVariants[0]
  const isCompletelyOutOfStock = allVariants.length > 0 && allVariants.every(v => !v.availableForSale)

  const handle = product.handle ?? ''
  const promoBadge = badgeFromShopifyTags(product.tags ?? [])
  const cardImage = shopifyCardImage(product)

  return (
    <div className="product-card">
      {handle && (
        <a href={`/shop/${handle}`} className="product-card-link" aria-label={product.title} tabIndex={-1} />
      )}

      <div className="product-image">
        {cardImage ? (
          <Image
            src={cardImage.url}
            alt={cardImage.alt}
            fill
            quality={90}
            sizes="(max-width: 768px) 50vw, 400px"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className="product-image-placeholder prod-ph-1">
            <ShirtIcon />
            <span className="placeholder-label">Product Photo</span>
          </div>
        )}

        {isCompletelyOutOfStock ? (
          <span className="product-badge sale">Sold Out</span>
        ) : (
          promoBadge && (
            <span className={`product-badge ${promoBadge}`}>
              {promoBadge === 'new' ? 'New' : 'Sale'}
            </span>
          )
        )}

        <div className="product-quick-add" role="presentation">
          {handle ? (
            <a href={`/shop/${handle}`} className="btn btn-primary">Shop Now</a>
          ) : (
            <button type="button" className="btn btn-primary" disabled>
              Shop Now
            </button>
          )}
        </div>
      </div>

      <div className="product-info">
        {handle ? (
          <a href={`/shop/${handle}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3 className="product-name">{product.title}</h3>
          </a>
        ) : (
          <h3 className="product-name">{product.title}</h3>
        )}
        <div className="product-footer">
          <span className="product-price">
            {variant ? formatVariantPrice(variant) : '—'}
          </span>
        </div>
      </div>
    </div>
  )
}
