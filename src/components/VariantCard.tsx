'use client'

import { useState } from 'react'
import Image from 'next/image'

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
  const href = `/shop/${handle}${colorName ? `?color=${encodeURIComponent(colorName)}` : ''}`

  return (
    <div className="product-card">
      {/* Plain anchors, not next/link. Klaviyo's reviews script scans the DOM
          once when it loads and exposes no way to re-run, so a client-side
          navigation lands on a product page with empty review widgets. The
          product page is force-dynamic either way, so both routes hit the
          server; the extra cost is re-parsing cached JS. */}
      <a
        href={href}
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
          <a href={href} className="btn btn-primary">Shop Now</a>
        </div>
      </div>

      <div className="product-info">
        <a href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 className="product-name">{title}</h3>
          {colorName && <p className="variant-card-color">{colorName}</p>}
        </a>
        <div className="product-footer">
          <span className="product-price">{fmt(priceAmount, priceCurrency)}</span>
        </div>
        <a href={href} className="btn btn-primary product-mobile-cta">Shop Now</a>
      </div>
    </div>
  )
}
