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

// Exact Shopify color name (normalized: lowercase, letters only) → hex
const COLOR_MAP: Record<string, string> = {
  // ── Melancia brand colors ──────────────────────────────────────
  // moss, papaya, terracota, areia, coco, mar → now in PATTERN_MAP (image swatches)
  // riored, dragonfruit, amazonia → now in PATTERN_MAP (image swatches)
  lemoncream:     '#FCFAB1',  // "Lemon cream"
  cremedelimo:    '#FCFAB1',  // "Creme de limão" (Portuguese, current Shopify name)
  ceu:            '#AAF2FD',
  burgandy:       '#6B0F1A',  // Leblon Glow (typo of Burgundy kept to match Shopify)
  burgundy:       '#6B0F1A',
  // ── Patterns — placeholder until images are provided ──────────
  // tropicalia, junglemuse  →  will be added to PATTERN_MAP below
}

// Shopify color name (normalized: lowercase, letters only) → swatch image path
// Keys are computed via: name.toLowerCase().replace(/[^a-z]/g, '')
const PATTERN_MAP: Record<string, string> = {
  // Arpoador
  moss:            '/images/Color Swatch/moss.png',
  papaya:          '/images/Color Swatch/papaya.png',
  terracota:       '/images/Color Swatch/terracota.png',
  terracotta:      '/images/Color Swatch/terracota.png',
  // Solid-pattern swatches
  coco:            '/images/Color Swatch/Coco.png',
  coconut:         '/images/Color Swatch/Coco.png',  // legacy fallback
  mar:             '/images/Color Swatch/Mar.png',
  areia:           '/images/Color Swatch/Areia.png',
  riored:          '/images/Color Swatch/Rio Red.png',
  amazonia:        '/images/Color Swatch/Amazonia.png',
  dragonfruit:     '/images/Color Swatch/Dragon Fruit.png',
  // Pedra do Sal patterns
  zebravermelhia:  '/images/Color Swatch/Zebra Vermelha.png',
  zebrapastel:     '/images/Color Swatch/Zebra Pastel.png',
  zebraareia:      '/images/Color Swatch/Zebra Areia.png',
  carioca:         '/images/Color Swatch/Carioca.png',
  azulejosbainos:  '/images/Color Swatch/Azulejo Baiano.png',
  azulejosbaianos: '/images/Color Swatch/Azulejo Baiano.png',
  bahiatiles:      '/images/Color Swatch/Azulejo Baiano.png',
}

/** Returns a CSS `background` value — either a hex color or a url() for patterns. */
function getColorSwatch(name: string): string {
  const key = name.toLowerCase().replace(/[^a-z]/g, '')
  if (PATTERN_MAP[key]) return `url('${PATTERN_MAP[key]}') center/cover`
  return COLOR_MAP[key] ?? '#D0C8B8'
}

export default function ProductDetail({ product }: Props) {
  const images = product.images.edges.map((e) => e.node)
  const variants = product.variants.edges.map((e) => e.node)
  const options = product.options ?? []

  const firstAvailable = variants.find((v) => v.availableForSale) ?? variants[0] ?? null

  // Build initial selection from firstAvailable.selectedOptions
  const initSelection: Record<string, string> = {}
  if (firstAvailable?.selectedOptions) {
    for (const opt of firstAvailable.selectedOptions) {
      initSelection[opt.name] = opt.value
    }
  }

  const [selection, setSelection] = useState<Record<string, string>>(initSelection)
  const [activeImage, setActiveImage] = useState(0)
  const [pending, setPending] = useState(false)
  const [added, setAdded] = useState(false)
  const [notifyEmail, setNotifyEmail] = useState('')
  const [notifyPending, setNotifyPending] = useState(false)
  const [notifyDone, setNotifyDone] = useState(false)
  const [notifyError, setNotifyError] = useState('')

  // Derive the currently selected variant from the selection state
  const selectedVariant: Variant | null = variants.find(v =>
    (v.selectedOptions ?? []).every(opt => selection[opt.name] === opt.value)
  ) ?? null

  const isSoldOut = !variants.some((v) => v.availableForSale)

  const isOnSale =
    selectedVariant?.compareAtPrice &&
    Number(selectedVariant.compareAtPrice.amount) > Number(selectedVariant.price.amount)

  function handleOptionChange(optName: string, value: string) {
    setSelection(prev => ({ ...prev, [optName]: value }))
    // Reset gallery whenever a non-Size option changes (Color, Swimwear Feature, Piece, etc.)
    if (optName !== 'Size') setActiveImage(0)
  }

  // Gallery: show only images matching all selected options except Size
  // (Size never changes the photo; Color and Swimwear Feature / Piece do)
  const relevantSelection = Object.entries(selection).filter(([key]) => key !== 'Size')
  const variantImages = relevantSelection.length > 0
    ? variants
        .filter(v => {
          const opts = v.selectedOptions ?? []
          return relevantSelection.every(([name, value]) => {
            const opt = opts.find(o => o.name === name)
            return !opt || opt.value === value
          }) && Boolean(v.image?.url)
        })
        .map(v => ({ url: v.image!.url, altText: v.image?.altText ?? null }))
        .filter((img, i, arr) => arr.findIndex(x => x.url === img.url) === i)
    : []
  const displayImages = variantImages.length > 0 ? variantImages : images

  const handleNotifySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!notifyEmail) return
    setNotifyPending(true)
    setNotifyError('')
    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: notifyEmail,
          productId: product.id,
          productTitle: product.title,
          variantId: selectedVariant?.id ?? null,
          variantTitle: selectedVariant?.title ?? null,
          selection,
        }),
      })
      if (res.ok) {
        setNotifyDone(true)
        setNotifyEmail('')
      } else {
        setNotifyError('Something went wrong. Please try again.')
      }
    } catch {
      setNotifyError('Something went wrong. Please try again.')
    } finally {
      setNotifyPending(false)
    }
  }

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

  // Whether this product has meaningful variant options (not just "Default Title")
  const hasOptions = options.length > 0 && !(options.length === 1 && options[0].values.length === 1 && options[0].values[0] === 'Default Title')

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
            {displayImages.length > 0 ? (
              displayImages.map((img, i) => (
                <Image
                  key={img.url}
                  src={img.url}
                  alt={img.altText ?? product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                  style={{
                    objectFit: 'contain',
                    opacity: i === activeImage ? 1 : 0,
                    transition: 'opacity 0.2s ease',
                  }}
                />
              ))
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

          {/* ── Option selectors — dynamic, handles Size / Color / Piece / etc. ── */}
          {/* Render order: other options first, then Size, then Color */}
          {hasOptions && [...options].sort((a, b) => {
            const rank = (name: string) => name === 'Color' ? 2 : name === 'Size' ? 1 : 0
            return rank(a.name) - rank(b.name)
          }).map(opt => {
            // Skip "Default Title" single-value options
            if (opt.values.length === 1 && opt.values[0] === 'Default Title') return null

            if (opt.name === 'Color') {
              return (
                <div key={opt.name} className="pdp-variants">
                  <span className="pdp-variants-label">
                    COLOR{selection['Color'] ? ` — ${selection['Color'].toUpperCase()}` : ''}
                  </span>
                  <div className="pdp-color-circles">
                    {opt.values.map(color => (
                      <button
                        key={color}
                        type="button"
                        className={`pdp-color-circle${selection['Color'] === color ? ' selected' : ''}`}
                        style={{ background: getColorSwatch(color) }}
                        onClick={() => handleOptionChange('Color', color)}
                        title={color}
                        aria-label={color}
                      />
                    ))}
                  </div>
                </div>
              )
            }

            if (opt.name === 'Size') {
              const sortedValues = Array.from(opt.values).sort(
                (a, b) => (SIZE_ORDER[a] ?? 99) - (SIZE_ORDER[b] ?? 99)
              )
              return (
                <div key={opt.name} className="pdp-variants">
                  <span className="pdp-variants-label">SIZE</span>
                  <div className="pdp-size-pills">
                    {sortedValues.map(size => (
                      <button
                        key={size}
                        type="button"
                        className={`pdp-size-pill${selection['Size'] === size ? ' selected' : ''}`}
                        onClick={() => handleOptionChange('Size', size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )
            }

            // Generic pills for any other option (Piece: Top / Bottom, etc.)
            return (
              <div key={opt.name} className="pdp-variants">
                <span className="pdp-variants-label">{opt.name.toUpperCase()}</span>
                <div className="pdp-size-pills">
                  {opt.values.map(value => (
                    <button
                      key={value}
                      type="button"
                      className={`pdp-size-pill${selection[opt.name] === value ? ' selected' : ''}`}
                      onClick={() => handleOptionChange(opt.name, value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}

          {/* ── CTA ── */}
          {isSoldOut || !selectedVariant?.availableForSale ? (
            <div className="pdp-notify">
              <p className="pdp-notify-label">Sold out — get notified when it&apos;s back</p>
              {notifyDone ? (
                <p className="pdp-notify-success">✓ You&apos;re on the list! We&apos;ll email you when it&apos;s back.</p>
              ) : (
                <form className="pdp-notify-form" onSubmit={handleNotifySubmit}>
                  <input
                    type="email"
                    className="pdp-notify-input"
                    placeholder="your@email.com"
                    value={notifyEmail}
                    onChange={e => setNotifyEmail(e.target.value)}
                    required
                    disabled={notifyPending}
                  />
                  <button
                    type="submit"
                    className="pdp-notify-btn"
                    disabled={notifyPending}
                  >
                    {notifyPending ? '…' : 'Notify Me'}
                  </button>
                </form>
              )}
              {notifyError && <p className="pdp-notify-error">{notifyError}</p>}
            </div>
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

          {/* Composition & Care */}
          <div className="pdp-composition">
            <button
              type="button"
              className="pdp-composition-toggle"
              onClick={(e) => {
                const el = (e.currentTarget.nextElementSibling as HTMLElement)
                const isOpen = el.style.display !== 'none'
                el.style.display = isOpen ? 'none' : 'block'
                e.currentTarget.setAttribute('aria-expanded', String(!isOpen))
              }}
              aria-expanded="true"
            >
              <span>Composition &amp; Care</span>
              <span className="pdp-composition-icon">−</span>
            </button>
            <div className="pdp-composition-body">
              <p>
                Crafted in a soft, high-performance fabric (82% Polyamide, 18% Elastane)
                that feels like a second skin — quick-drying, chlorine-resistant, and built
                to keep its shape all season long.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
