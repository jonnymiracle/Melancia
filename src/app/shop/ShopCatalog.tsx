'use client'

import { useState } from 'react'
import ProductCard3 from '@/components/ProductCard3'
import type { ProductCard3Product } from '@/types/shopify'

const SIZES = ['Small', 'Medium', 'Large']

/** Display names for shop filters — extend when new collections ship */
const COLLECTION_SUN = '🌞'
const COLLECTION_OPTIONS: { label: string; slug: string }[] = [{ label: 'Sol de Ipanema', slug: 'sol-de-ipanema' }]
const COLORS = [
  { hex: '#F7A18F', label: 'Coral' },
  { hex: '#E3C3DD', label: 'Lavender' },
  { hex: '#FBD4CE', label: 'Blush' },
  { hex: '#F3EAF5', label: 'Lilac' },
  { hex: '#2C2C2C', label: 'Black' },
  { hex: '#FFFFFF', label: 'White' },
  { hex: '#7EC8A4', label: 'Mint' },
  { hex: '#F5C843', label: 'Yellow' },
]

type Props = {
  products: ProductCard3Product[]
}

function productKey(p: ProductCard3Product) {
  return 'placeholderClass' in p ? `cat-${p.id}` : p.id
}

export default function ShopCatalog({ products }: Props) {
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [maxPrice, setMaxPrice] = useState(200)
  const [sortBy, setSortBy] = useState('Featured')
  const [filterOpen, setFilterOpen] = useState(false)

  const toggleSize = (s: string) =>
    setSelectedSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))

  const toggleColor = (c: string) =>
    setSelectedColors((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))

  const toggleCollection = (slug: string) =>
    setSelectedCollections((prev) =>
      prev.includes(slug) ? prev.filter((x) => x !== slug) : [...prev, slug],
    )

  const clearFilters = () => {
    setSelectedSizes([])
    setSelectedCollections([])
    setSelectedColors([])
    setMaxPrice(200)
  }

  const activeTags = [
    ...selectedSizes.map((s) => ({ label: `Size: ${s}`, remove: () => toggleSize(s) })),
    ...selectedCollections.map((slug) => {
      const label = COLLECTION_OPTIONS.find((o) => o.slug === slug)?.label ?? slug
      return {
        label: `Collection: ${COLLECTION_SUN} ${label}`,
        remove: () => toggleCollection(slug),
      }
    }),
    ...selectedColors.map((c) => ({
      label: COLORS.find((x) => x.hex === c)?.label ?? c,
      remove: () => toggleColor(c),
    })),
  ]

  return (
    <>
      <div className="shop-hero">
        <h1>All Swimwear</h1>
        <p>Dive into the new summer collection — bold colors, flattering fits.</p>
      </div>

      <div className="shop-layout">
        <aside className={`filters-sidebar${filterOpen ? ' open' : ''}`}>
          <div className="filters-header">
            <h3>Filters</h3>
            <button type="button" className="filters-clear" onClick={clearFilters}>
              Clear all
            </button>
          </div>

          <div className="filter-group">
            <div className="filter-group-title">
              <h4>Category</h4>
              <span>▾</span>
            </div>
            <div className="filter-options">
              {[
                ['Tops', 7],
                ['Bottoms', 6],
                ['One Pieces', 3],
              ].map(([label, count]) => (
                <label key={label} className="filter-check">
                  <input type="checkbox" /> {label}
                  <span className="filter-count">{count}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-group-title">
              <h4>Size</h4>
              <span>▾</span>
            </div>
            <div className="size-options">
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`size-btn${selectedSizes.includes(s) ? ' active' : ''}`}
                  onClick={() => toggleSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-group-title">
              <h4>Collection</h4>
              <span>▾</span>
            </div>
            <div className="filter-options">
              {COLLECTION_OPTIONS.map(({ label, slug }) => (
                <label key={slug} className="filter-check">
                  <input
                    type="checkbox"
                    checked={selectedCollections.includes(slug)}
                    onChange={() => toggleCollection(slug)}
                  />{' '}
                  <span aria-hidden="true">{COLLECTION_SUN}</span>{' '}
                  {label}
                  <span className="filter-count">{products.length}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-group-title">
              <h4>Color</h4>
              <span>▾</span>
            </div>
            <div className="color-options">
              {COLORS.map((c) => (
                <span
                  key={c.hex}
                  role="button"
                  tabIndex={0}
                  className={`color-swatch${selectedColors.includes(c.hex) ? ' active' : ''}`}
                  style={{
                    background: c.hex,
                    border: c.hex === '#FFFFFF' ? '1px solid #ddd' : undefined,
                  }}
                  title={c.label}
                  onClick={() => toggleColor(c.hex)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      toggleColor(c.hex)
                    }
                  }}
                />
              ))}
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-group-title">
              <h4>Price</h4>
              <span>▾</span>
            </div>
            <div className="price-range">
              <input
                type="range"
                min={0}
                max={200}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
              <div className="price-labels">
                <span>$0</span>
                <span>Up to ${maxPrice}</span>
              </div>
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-group-title">
              <h4>Style</h4>
              <span>▾</span>
            </div>
            <div className="filter-options">
              {[
                ['Triangle', 8],
                ['Bandeau', 5],
                ['Halter', 4],
                ['Sports', 3],
                ['Brazilian Cut', 6],
                ['High Waist', 5],
              ].map(([label, count]) => (
                <label key={label} className="filter-check">
                  <input type="checkbox" /> {label}
                  <span className="filter-count">{count}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        <div className="shop-main">
          <div className="shop-toolbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <button
                type="button"
                className="mobile-filter-toggle"
                onClick={() => setFilterOpen((p) => !p)}
              >
                Filters
              </button>
              <span className="shop-count">
                <strong>{products.length}</strong> products
              </span>
            </div>
            <div className="shop-sort">
              <label htmlFor="shop-sort">Sort by</label>
              <select
                id="shop-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {['Featured', 'Newest', 'Price: Low to High', 'Price: High to Low', 'Best Selling'].map(
                  (o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>

          {activeTags.length > 0 && (
            <div className="active-filters">
              {activeTags.map((tag) => (
                <div key={tag.label} className="filter-tag">
                  {tag.label}
                  <button type="button" onClick={tag.remove} aria-label="Remove">
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="product-grid">
            {products.map((product) => (
              <ProductCard3 key={productKey(product)} product={product} />
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 8,
              marginTop: 52,
              paddingTop: 32,
              borderTop: '1px solid var(--border)',
            }}
          >
            {['← Prev', '1', '2', '3', 'Next →'].map((p, i) => (
              <button
                key={p}
                type="button"
                className={`page-btn${p === '1' ? ' active' : ''}${i === 0 || i === 4 ? ' prev-next' : ''}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
