'use client'

import Image from 'next/image'
import type { Product } from '@/types'
import type {
  ProductCard3Product,
  ShopifyProduct,
  ShopifyProductVariant,
} from '@/types/shopify'
import Link from 'next/link'
import { resolveCatalogProductBadge, resolveShopifyProductBadge } from '@/lib/product-badge'
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

export default function ProductCard3({ product }: ProductCard3Props) {
  const isCatalog = isCatalogProduct(product)
  const allVariants = !isCatalog ? (product.variants?.edges ?? []).map(e => e.node) : []
  const variant = allVariants[0]
  const isCompletelyOutOfStock = allVariants.length > 0 && allVariants.every(v => !v.availableForSale)

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

          <div className="product-quick-add" role="presentation">
            <button type="button" className="btn btn-primary">Shop Now</button>
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

  const cardImage = shopifyCardImage(product)

  return (
    <div className="product-card">
      {handle && (
        <Link href={`/shop/${handle}`} className="product-card-link" aria-label={product.title} tabIndex={-1} />
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
          shopifyPromoBadge && (
            <span className={`product-badge ${shopifyPromoBadge}`}>
              {shopifyPromoBadge === 'new' ? 'New' : 'Sale'}
            </span>
          )
        )}

        <div className="product-quick-add" role="presentation">
          {handle ? (
            <Link href={`/shop/${handle}`} className="btn btn-primary">
              Shop Now
            </Link>
          ) : (
            <button type="button" className="btn btn-primary" disabled>
              Shop Now
            </button>
          )}
        </div>
      </div>

      <div className="product-info">
        {handle ? (
          <Link href={`/shop/${handle}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3 className="product-name">{product.title}</h3>
          </Link>
        ) : (
          <h3 className="product-name">{product.title}</h3>
        )}
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
