'use client'

import { useState } from 'react'
import ProductCard from '@/components/ProductCard'
import { allProducts } from '@/data/products'
import { Product } from '@/types'

const SIZES   = ['XS', 'S', 'M', 'L']
const COLORS  = [
  { hex: '#F0856E', label: 'Coral' },
  { hex: '#C9A8E8', label: 'Lavender' },
  { hex: '#F9C4B8', label: 'Blush' },
  { hex: '#EAD9F8', label: 'Lilac' },
  { hex: '#2C2C2C', label: 'Black' },
  { hex: '#FFFFFF', label: 'White' },
  { hex: '#7EC8A4', label: 'Mint' },
  { hex: '#F5C843', label: 'Yellow' },
]

export default function ShopPage() {
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [maxPrice, setMaxPrice] = useState(200)
  const [sortBy, setSortBy] = useState('Featured')
  const [filterOpen, setFilterOpen] = useState(false)

  const toggleSize = (s: string) =>
    setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  const toggleColor = (c: string) =>
    setSelectedColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])

  const clearFilters = () => {
    setSelectedSizes([])
    setSelectedColors([])
    setMaxPrice(200)
  }

  const activeTags = [
    ...selectedSizes.map(s => ({ label: `Size: ${s}`, remove: () => toggleSize(s) })),
    ...selectedColors.map(c => ({ label: COLORS.find(x => x.hex === c)?.label ?? c, remove: () => toggleColor(c) })),
  ]

  return (
    <>
      {/* Hero */}
      <div className="shop-hero">
        <h1>All Swimwear</h1>
        <p>Dive into the new summer collection — bold colors, flattering fits.</p>
      </div>

      <div className="shop-layout">
        {/* ── Filters Sidebar ── */}
        <aside className={`filters-sidebar${filterOpen ? ' open' : ''}`}>
          <div className="filters-header">
            <h3>Filters</h3>
            <button className="filters-clear" onClick={clearFilters}>Clear all</button>
          </div>

          {/* Category */}
          <div className="filter-group">
            <div className="filter-group-title"><h4>Category</h4><span>▾</span></div>
            <div className="filter-options">
              {[['All', 24], ['Sets', 6], ['Tops', 7], ['Bottoms', 6], ['One Pieces', 3], ['Cover-Ups', 2]].map(([label, count]) => (
                <label key={label} className="filter-check">
                  <input type="checkbox" defaultChecked={label === 'All'} /> {label}
                  <span className="filter-count">{count}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="filter-group">
            <div className="filter-group-title"><h4>Size</h4><span>▾</span></div>
            <div className="size-options">
              {SIZES.map(s => (
                <button
                  key={s}
                  className={`size-btn${selectedSizes.includes(s) ? ' active' : ''}`}
                  onClick={() => toggleSize(s)}
                >{s}</button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="filter-group">
            <div className="filter-group-title"><h4>Color</h4><span>▾</span></div>
            <div className="color-options">
              {COLORS.map(c => (
                <span
                  key={c.hex}
                  className={`color-swatch${selectedColors.includes(c.hex) ? ' active' : ''}`}
                  style={{ background: c.hex, border: c.hex === '#FFFFFF' ? '1px solid #ddd' : undefined }}
                  title={c.label}
                  onClick={() => toggleColor(c.hex)}
                />
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="filter-group">
            <div className="filter-group-title"><h4>Price</h4><span>▾</span></div>
            <div className="price-range">
              <input
                type="range" min="0" max="200" value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
              />
              <div className="price-labels">
                <span>$0</span>
                <span>Up to ${maxPrice}</span>
              </div>
            </div>
          </div>

          {/* Style */}
          <div className="filter-group">
            <div className="filter-group-title"><h4>Style</h4><span>▾</span></div>
            <div className="filter-options">
              {[['Triangle', 8], ['Bandeau', 5], ['Halter', 4], ['Sports', 3], ['Brazilian Cut', 6], ['High Waist', 5]].map(([label, count]) => (
                <label key={label} className="filter-check">
                  <input type="checkbox" /> {label}
                  <span className="filter-count">{count}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Products ── */}
        <div className="shop-main">
          <div className="shop-toolbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <button className="mobile-filter-toggle" onClick={() => setFilterOpen(p => !p)}>
                Filters
              </button>
              <span className="shop-count"><strong>{allProducts.length}</strong> products</span>
            </div>
            <div className="shop-sort">
              <label>Sort by</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                {['Featured', 'Newest', 'Price: Low to High', 'Price: High to Low', 'Best Selling'].map(o => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active filter tags */}
          {activeTags.length > 0 && (
            <div className="active-filters">
              {activeTags.map(tag => (
                <div key={tag.label} className="filter-tag">
                  {tag.label}
                  <button onClick={tag.remove} aria-label="Remove">×</button>
                </div>
              ))}
            </div>
          )}

          <div className="product-grid">
            {allProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 52, paddingTop: 32, borderTop: '1px solid var(--border)' }}>
            {['← Prev', '1', '2', '3', 'Next →'].map((p, i) => (
              <button key={p} className={`page-btn${p === '1' ? ' active' : ''}${i === 0 || i === 4 ? ' prev-next' : ''}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
