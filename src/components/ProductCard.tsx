'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Product } from '@/types'
import { resolveCatalogProductBadge } from '@/lib/product-badge'
import { ShirtIcon } from './icons'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const [wishlisted, setWishlisted] = useState(false)
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

        <button
          className={`product-wishlist${wishlisted ? ' active' : ''}`}
          aria-label="Wishlist"
          onClick={() => setWishlisted(prev => !prev)}
        >
          {wishlisted ? '♥' : '♡'}
        </button>

        <div className="product-quick-add">+ Quick Add</div>
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
                style={{ background: color, border: color === '#ffffff' ? '1px solid #ddd' : undefined }}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
