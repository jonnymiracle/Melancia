'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { ShopifyProductDetail } from '@/types/shopify'
import { addToCart } from '@/lib/add-to-cart-client'
import { getModelSizeNote } from '@/lib/model-size'
import { buildImageAlt } from '@/lib/image-alt'
import { classifyProduct } from '@/lib/collections'
import { PRODUCT_LOCAL_IMAGES } from '@/lib/product-local-images'
import { FREE_SHIPPING_ENABLED, FREE_SHIPPING_NOTE } from '@/lib/free-shipping'
import { findVariantByOptions, findPieceVariant, availableSizesFor, PIECES } from '@/lib/piece-availability'
import type { Piece } from '@/lib/piece-availability'
import PieceSizePicker from './PieceSizePicker'

type Props = { product: ShopifyProductDetail; initialColor?: string }
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

export default function ProductDetail({ product, initialColor }: Props) {
  const images = product.images.edges.map((e) => e.node)
  const variants = product.variants.edges.map((e) => e.node)
  const options = product.options ?? []

  // Pick the best available variant: prefer Medium, then Small, then Large, then any available, then first.
  const SIZE_PREFERENCE = ['Medium', 'M', 'Small', 'S', 'Large', 'L']
  function bestVariant(pool: Variant[]): Variant | null {
    const available = pool.filter(v => v.availableForSale)
    for (const size of SIZE_PREFERENCE) {
      const found = findVariantByOptions(available, { Size: size })
      if (found) return found
    }
    return available[0] ?? pool[0] ?? null
  }

  const colorPool = initialColor
    ? variants.filter(v => v.selectedOptions?.some(o => o.name === 'Color' && o.value === initialColor))
    : variants
  const seedVariant = (colorPool.length > 0 ? bestVariant(colorPool) : null) ?? bestVariant(variants)

  const initSelection: Record<string, string> = {}
  if (seedVariant?.selectedOptions) {
    for (const opt of seedVariant.selectedOptions) {
      initSelection[opt.name] = opt.value
    }
  }

  const [selection, setSelection] = useState<Record<string, string>>(initSelection)
  const [activeImage, setActiveImage] = useState(0)
  const [failedUrls, setFailedUrls] = useState<Set<string>>(new Set())
  const [pending, setPending] = useState(false)
  const [added, setAdded] = useState(false)
  const [compositionOpen, setCompositionOpen] = useState(true)
  const [notifyEmail, setNotifyEmail] = useState('')
  const [notifyPending, setNotifyPending] = useState(false)
  const [notifyDone, setNotifyDone] = useState(false)
  const [notifyError, setNotifyError] = useState('')

  // Paired top/bottom size selection. Triggered when the product stores both
  // pieces as variants of one Shopify product (a Piece option carrying Top and
  // Bottom), which lets the customer size each piece independently.
  const isPaired = options.some(
    o => o.name === 'Piece' && o.values.includes('Top') && o.values.includes('Bottom')
  )
  const [topSize, setTopSize] = useState<string | null>(null)
  const [bottomSize, setBottomSize] = useState<string | null>(null)

  const sizeValues = options.find(o => o.name === 'Size')?.values ?? []
  const sortedSizes = [...sizeValues].sort((a, b) => (SIZE_ORDER[a] ?? 99) - (SIZE_ORDER[b] ?? 99))
  const chosenSize: Record<Piece, string | null> = { Top: topSize, Bottom: bottomSize }

  const findPiece = (piece: Piece, size: string | null) =>
    findPieceVariant(variants, piece, size, selection['Color'])

  // In-stock sizes per piece for the chosen colour. Computed once here and read
  // by the pickers, the sold-out check and the pre-selection price fallback, so
  // "what is still available" has a single definition.
  const inStock = isPaired
    ? Object.fromEntries(
        PIECES.map(p => [p, availableSizesFor(variants, sizeValues, p, selection['Color'])]),
      ) as Record<Piece, string[]>
    : null

  // Derive the currently selected variant from the selection state
  const selectedVariant: Variant | null = variants.find(v =>
    (v.selectedOptions ?? []).every(opt => selection[opt.name] === opt.value)
  ) ?? null

  const isSoldOut = !variants.some((v) => v.availableForSale)

  // A set is unbuyable when either piece has no size left in the chosen colour,
  // so the notify-me form must take over from the Add Set button.
  const pairedSoldOut = inStock !== null && PIECES.some(p => inStock[p].length === 0)

  // What the customer is buying: one line per item headed for the bag. A paired
  // product contributes a top and a bottom, everything else a single variant.
  // Price, the CTA and add-to-cart all read from this, which is why none of them
  // needs its own paired branch.
  const cartLines = isPaired ? PIECES.map(p => findPiece(p, chosenSize[p])) : [selectedVariant]
  const readyToAdd = cartLines.every(v => v?.availableForSale)

  // Same lines, but falling back to any in-stock size so a paired product shows
  // a real total before the customer has picked anything.
  const pricedLines = isPaired
    ? PIECES.map(p => findPiece(p, chosenSize[p]) ?? findPiece(p, inStock![p][0] ?? null))
    : [selectedVariant]
  const priced = pricedLines.every(Boolean) ? (pricedLines as Variant[]) : null

  const total = priced?.reduce((sum, v) => sum + Number(v.price.amount), 0) ?? 0
  const wasTotal =
    priced?.reduce((sum, v) => sum + Number(v.compareAtPrice?.amount ?? v.price.amount), 0) ?? 0
  const onSale = priced !== null && wasTotal > total

  // Nothing buyable in this colourway, so the buy button gives way to the
  // back-in-stock form. Each side of the `||` is only reachable in its own mode.
  const showNotify =
    pairedSoldOut || (!isPaired && (isSoldOut || !selectedVariant?.availableForSale))

  function handleOptionChange(optName: string, value: string) {
    setSelection(prev => ({ ...prev, [optName]: value }))
    if (optName !== 'Size') setActiveImage(0)
    if (isPaired && optName === 'Color') { setTopSize(null); setBottomSize(null) }
  }

  // Gallery: show only images matching all selected options except Size
  // (Size never changes the photo; Color and Swimwear Feature / Piece do).
  // On a paired product the customer buys both pieces, so Piece is dropped too —
  // otherwise the gallery stays pinned to whichever piece happened to seed the
  // selection and the bottoms are never shown.
  const relevantSelection = Object.entries(selection)
    .filter(([key]) => key !== 'Size' && !(isPaired && key === 'Piece'))
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
  const colorKey = selection['Color'] ?? '__default__'
  const localImageSet = PRODUCT_LOCAL_IMAGES[`${product.handle}:${colorKey}`]
  const localImages = localImageSet?.images.map(img => ({ url: img.src, altText: img.altText })) ?? []
  const baseImages = variantImages.length > 0 ? variantImages : images
  const allImages = localImages.length > 0 ? [...localImages, ...baseImages] : baseImages
  const displayImages = allImages.filter(img => !failedUrls.has(img.url))

  // Clamp activeImage if switching to a variant group with fewer images
  useEffect(() => {
    if (activeImage >= displayImages.length && displayImages.length > 0) {
      setActiveImage(displayImages.length - 1)
    }
  }, [displayImages.length, activeImage])

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
    if (!readyToAdd) {
      if (isPaired) alert('That combination is no longer available. Please pick another size.')
      return
    }
    const items = cartLines as Variant[]

    setPending(true)
    // Sequential and fail-fast on purpose: the first call mints the Shopify cart
    // id the rest read, and stopping on the first error keeps half a set out of
    // the bag rather than reporting a success the customer does not have.
    let addedCount = 0
    let failure: string | null = null
    for (const variant of items) {
      const result = await addToCart(variant.id, 1)
      if (!result.ok) { failure = result.error; break }
      addedCount++
    }
    setPending(false)

    if (addedCount > 0) window.dispatchEvent(new CustomEvent('melancia-cart-updated', { detail: {} }))

    if (!failure) {
      setAdded(true)
      setTimeout(() => setAdded(false), 2500)
    } else if (addedCount > 0) {
      const missing = items.slice(addedCount).map(v => v.title).join(', ')
      alert(`We could only add part of your set — ${missing} could not be added. Please review your bag before checking out.`)
    } else {
      alert(failure)
    }
  }

  // Whether this product has meaningful variant options (not just "Default Title")
  const hasOptions = options.length > 0 && !(options.length === 1 && options[0].values.length === 1 && options[0].values[0] === 'Default Title')

  return (
    <>
      <p className="pdp-breadcrumb">
        <Link href="/">Home</Link>
        {' / '}
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
                  alt={buildImageAlt(product, img, i)}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                  onError={() => setFailedUrls(prev => { const s = new Set(prev); s.add(img.url); return s })}
                  style={{
                    objectFit: 'cover',
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
                  {/* Decorative: the button's aria-label already names the photo,
                      so an empty alt avoids screen-reader double-announcing. */}
                  <Image
                    src={img.url}
                    alt=""
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

          <p className="pdp-model-size">{getModelSizeNote(product.handle)}</p>

          {/* One price path: a set sums its two lines, everything else has one. */}
          <div className="pdp-price">
            {!priced ? <span>—</span> : (
              <>
                {onSale && (
                  <span className="original">{fmt(String(wasTotal), priced[0].price.currencyCode)}</span>
                )}
                <span className={onSale ? 'sale' : ''}>
                  {fmt(String(total), priced[0].price.currencyCode)}
                </span>
              </>
            )}
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
              // In paired mode, size is handled by the dedicated top/bottom pickers below
              if (isPaired) return null
              return (
                <div key={opt.name} className="pdp-variants">
                  <span className="pdp-variants-label">SIZE</span>
                  <div className="pdp-size-pills">
                    {sortedSizes.map(size => (
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

            // In paired mode, skip Piece — it's redundant (each product is already one piece)
            if (isPaired && opt.name === 'Piece') return null

            // Generic pills for any other option
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

          {/* ── Paired top/bottom size pickers ── */}
          {inStock && !pairedSoldOut && (
            <>
              <PieceSizePicker
                piece="Top"
                sizes={sortedSizes}
                inStock={inStock.Top}
                chosen={topSize}
                onChoose={setTopSize}
              />
              <PieceSizePicker
                piece="Bottom"
                sizes={sortedSizes}
                inStock={inStock.Bottom}
                chosen={bottomSize}
                onChoose={setBottomSize}
              />
            </>
          )}

          {/* ── CTA ── */}
          {showNotify ? (
            <div className="pdp-notify">
              <p className="pdp-notify-label">
                {pairedSoldOut
                  ? `Sold out in ${selection['Color'] ?? 'this colour'} — get notified when it's back`
                  : "Sold out — get notified when it's back"}
              </p>
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
              disabled={pending || !readyToAdd}
            >
              {pending ? 'Adding…'
                : added ? '✓ Added to bag!'
                : isPaired ? 'Add Set to Bag' : 'Add to Bag'}
            </button>
          )}

          <p className="pdp-shipping-note">
            <Link href="/shipping-policy">
              {FREE_SHIPPING_ENABLED && <><strong>{FREE_SHIPPING_NOTE}</strong>&nbsp;·&nbsp;</>}
              Ships in 2–4 business days&nbsp;·&nbsp;30-day returns
            </Link>
          </p>

          <div className="pdp-trust-strip">
            {FREE_SHIPPING_ENABLED && <span>🚚 {FREE_SHIPPING_NOTE}</span>}
            <span>🔒 Secure Checkout</span>
            <span>↩ Free Returns</span>
            <span>📦 Ships in 2–4 Days</span>
          </div>

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
              onClick={() => setCompositionOpen(o => !o)}
              aria-expanded={compositionOpen}
            >
              <span>Composition &amp; Care</span>
              <span className="pdp-composition-icon">{compositionOpen ? '−' : '+'}</span>
            </button>
            {compositionOpen && (
              <div className="pdp-composition-body">
                <p>
                  Crafted in a soft, high-performance fabric (82% Polyamide, 18% Elastane)
                  that feels like a second skin — quick-drying, chlorine-resistant, and built
                  to keep its shape all season long.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
