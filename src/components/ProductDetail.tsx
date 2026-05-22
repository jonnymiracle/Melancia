'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { ShopifyProductDetail } from '@/types/shopify'
import { addToCart } from '@/lib/add-to-cart-client'

type Props = { product: ShopifyProductDetail }
type Variant = ShopifyProductDetail['variants']['edges'][0]['node']

function fmt(amount: string, currency: string) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(Number(amount))
}

// Preferred display order for sizes
const SIZE_ORDER: Record<string, number> = {
  XXS: 0, XS: 1, S: 2, Small: 3, M: 4, Medium: 5,
  L: 6, Large: 7, XL: 8, XXL: 9, '2XL': 10, '3XL': 11,
}

// Color name → CSS hex swatch
const COLOR_MAP: Record<string, string> = {
  moss:       '#6B7F5A',
  papaya:     '#E8834A',
  terracota:  '#C85A35',
  terracotta: '#C85A35',
  black:      '#1A1A1A',
  white:      '#F5F5F0',
  nude:       '#E8C4A0',
  coral:      '#F5A28F',
  turquoise:  '#40C4B0',
  navy:       '#1B2A4A',
  red:        '#D94040',
  blue:       '#4A7FC1',
  green:      '#4A8C5A',
  pink:       '#F5A0C0',
  yellow:     '#F5D040',
  orange:     '#F08030',
  purple:     '#8050C0',
  brown:      '#8C5A35',
  gray:       '#8C8C8C',
  grey:       '#8C8C8C',
  sand:       '#D4BC8A',
  olive:      '#6B7F5A',
}

function getColorSwatch(name: string): string {
  const key = name.toLowerCase().replace(/[^a-z]/g, '')
  return COLOR_MAP[key] ?? '#D0C8B8'
}

/** Parse "Size / Color" title. Returns null if not that format. */
function parseTitle(title: string): { size: string; color: string } | null {
  const idx = title.indexOf(' / ')
  if (idx === -1) return null
  return { size: title.slice(0, idx).trim(), color: title.slice(idx + 3).trim() }
}

export default function ProductDetail({ product }: Props) {
  const images = product.images.edges.map((e) => e.node)
  const variants = product.variants.edges.map((e) => e.node)

  const firstAvailable = variants.find((v) => v.availableForSale) ?? variants[0] ?? null

  // Detect "Size / Color" variant format (e.g. "Medium / Moss")
  const isColorSizeFormat = variants.length > 0 && variants.every(v => parseTitle(v.title) !== null)

  // Unique sizes sorted by SIZE_ORDER
  const uniqueSizes = isColorSizeFormat
    ? [...new Set(variants.map(v => parseTitle(v.title)!.size))].sort(
        (a, b) => (SIZE_ORDER[a] ?? 99) - (SIZE_ORDER[b] ?? 99)
      )
    : []

  // Unique colors (in order they first appear)
  const uniqueColors = isColorSizeFormat
    ? [...new Set(variants.map(v => parseTitle(v.title)!.color))]
    : []

  // Initial size + color from first available variant
  const initParsed = firstAvailable ? parseTitle(firstAvailable.title) : null

  const [selectedSize, setSelectedSize] = useState(initParsed?.size ?? uniqueSizes[0] ?? '')
  const [selectedColor, setSelectedColor] = useState(initParsed?.color ?? uniqueColors[0] ?? '')
  const [activeImage, setActiveImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(firstAvailable)
  const [pending, setPending] = useState(false)
  const [added, setAdded] = useState(false)

  const isSoldOut = !variants.some((v) => v.availableForSale)

  // Fallback pill mode (no "Size / Color" format)
  const showSizes = !isColorSizeFormat && (
    variants.length > 1 ||
    (variants.length === 1 && variants[0].title !== 'Default Title')
  )

  const isOnSale =
    selectedVariant?.compareAtPrice &&
    Number(selectedVariant.compareAtPrice.amount) > Number(selectedVariant.price.amount)

  // Size change — keep same color if possible, else fall back to first available
  function handleSizeChange(size: string) {
    setSelectedSize(size)
    const sameColor = variants.find(v => {
      const p = parseTitle(v.title)
      return p?.size === size && p?.color === selectedColor
    })
    const fallback = variants.find(v => {
      const p = parseTitle(v.title)
      return p?.size === size && v.availableForSale
    })
    const target = sameColor ?? fallback ?? null
    if (target) {
      const p = parseTitle(target.title)!
      // If color had to change, reset gallery
      if (p.color !== selectedColor) setActiveImage(0)
      setSelectedColor(p.color)
      setSelectedVariant(target)
    }
  }

  // Color change — find the matching variant for selected size, reset gallery to first image
  function handleColorChange(color: string) {
    setSelectedColor(color)
    setActiveImage(0)
    const target = variants.find(v => {
      const p = parseTitle(v.title)
      return p?.size === selectedSize && p?.color === color
    })
    if (target) setSelectedVariant(target)
  }

  // Images for the selected color: collect one image per variant that matches the color.
  // Deduped by URL. Falls back to all product images if no variant images are set.
  const colorImages = isColorSizeFormat
    ? variants
        .filter(v => {
          const p = parseTitle(v.title)
          return p?.color === selectedColor && Boolean(v.image?.url)
        })
        .map(v => ({ url: v.image!.url, altText: v.image?.altText ?? null }))
        .filter((img, i, arr) => arr.findIndex(x => x.url === img.url) === i)
    : []
  const displayImages = colorImages.length > 0 ? colorImages : images

  // Colors available for the currently selected size
  const colorsForSelectedSize = isColorSizeFormat
    ? uniqueColors.map(color => ({
        color,
        available: variants.some(v => {
          const p = parseTitle(v.title)
          return p?.size === selectedSize && p?.color === color && v.availableForSale
        }),
      }))
    : []

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
            {displayImages[activeImage] ? (
              <Image
                src={displayImages[activeImage].url}
                alt={displayImages[activeImage].altText ?? product.title}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                style={{ objectFit: 'cover' }}
                priority
              />
            ) : (
              <div className="product-image-placeholder prod-ph-1" style={{ height: '100%' }} />
            )}
          </div>

          {displayImages.length > 1 && (
            <div className="pdp-thumbnails">
              {displayImages.map((img, i) => (
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

          {/* ── Size pills (Color+Size format) ── */}
          {isColorSizeFormat && uniqueSizes.length > 0 && (
            <div className="pdp-variants">
              <span className="pdp-variants-label">SIZE</span>
              <div className="pdp-size-pills">
                {uniqueSizes.map(size => (
                  <button
                    key={size}
                    type="button"
                    className={`pdp-size-pill${selectedSize === size ? ' selected' : ''}`}
                    onClick={() => handleSizeChange(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Color circles (Color+Size format) ── */}
          {isColorSizeFormat && colorsForSelectedSize.length > 0 && (
            <div className="pdp-variants">
              <span className="pdp-variants-label">COLOR — {selectedColor.toUpperCase()}</span>
              <div className="pdp-color-circles">
                {colorsForSelectedSize.map(({ color, available }) => (
                  <button
                    key={color}
                    type="button"
                    className={`pdp-color-circle${selectedColor === color ? ' selected' : ''}${!available ? ' unavailable' : ''}`}
                    style={{ '--swatch': getColorSwatch(color) } as React.CSSProperties}
                    onClick={() => { if (available) handleColorChange(color) }}
                    disabled={!available}
                    title={color}
                    aria-label={`${color}${!available ? ' (sold out)' : ''}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Fallback: plain pills if not Color+Size format ── */}
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

          {/* ── CTA ── */}
          {isSoldOut || !selectedVariant?.availableForSale ? (
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
