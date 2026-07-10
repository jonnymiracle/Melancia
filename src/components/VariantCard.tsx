'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export type VariantCardData = {
  id: string
  handle: string
  title: string
  colorName: string | null
  imageUrl: string
  imageUrlFallback?: string
  imageAlt: string
  priceAmount: string
  priceCurrency: string
  objectPosition?: string
  imageScale?: number
  badge?: string
}

function fmt(amount: string, currency: string) {
  const n = Number(amount)
  if (Number.isNaN(n)) return `${amount} ${currency}`
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(n)
}

export default function VariantCard({
  handle,
  title,
  colorName,
  imageUrl,
  imageUrlFallback,
  imageAlt,
  priceAmount,
  priceCurrency,
  objectPosition,
  imageScale,
  badge,
}: VariantCardData) {
  const [src, setSrc] = useState(imageUrl)

  return (
    <div className="product-card">
      <Link
        href={`/shop/${handle}${colorName ? `?color=${encodeURIComponent(colorName)}` : ''}`}
        className="product-card-link"
        aria-label={colorName ? `${title} — ${colorName}` : title}
        tabIndex={-1}
      />

      <div className="product-image">
        <Image
          src={src}
          alt={imageAlt}
          fill
          quality={90}
          sizes="(max-width: 768px) 50vw, 400px"
          onError={() => { if (imageUrlFallback && src !== imageUrlFallback) setSrc(imageUrlFallback) }}
          style={{ objectFit: 'cover', objectPosition: objectPosition ?? 'center center', transform: imageScale ? `scale(${imageScale})` : undefined }}
        />
        {badge && <span className="product-card-badge">{badge}</span>}
        <div className="product-quick-add" role="presentation">
          <Link href={`/shop/${handle}${colorName ? `?color=${encodeURIComponent(colorName)}` : ''}`} className="btn btn-primary">
            Shop Now
          </Link>
        </div>
      </div>

      <div className="product-info">
        <Link href={`/shop/${handle}${colorName ? `?color=${encodeURIComponent(colorName)}` : ''}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 className="product-name">{title}</h3>
          {colorName && <p className="variant-card-color">{colorName}</p>}
        </Link>
        <div className="product-footer">
          <span className="product-price">{fmt(priceAmount, priceCurrency)}</span>
        </div>
        <Link
          href={`/shop/${handle}${colorName ? `?color=${encodeURIComponent(colorName)}` : ''}`}
          className="btn btn-primary product-mobile-cta"
        >
          Shop Now
        </Link>
      </div>
    </div>
  )
}
