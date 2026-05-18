'use client'

import Link from 'next/link'
import ProductCard3 from '@/components/ProductCard3'
import type { ProductCard3Product } from '@/types/shopify'
import { shopPaginationItems } from '@/lib/shop-pagination'

type Props = {
  products: ProductCard3Product[]
  currentPage: number
  totalPages: number
  totalProducts: number
}

function productKey(p: ProductCard3Product) {
  return 'placeholderClass' in p ? `cat-${p.id}` : p.id
}

function makeShopHref(page: number): string {
  if (page <= 1) return '/shop'
  return `/shop?page=${page}`
}

export default function ShopCatalog({
  products,
  currentPage,
  totalPages,
  totalProducts,
}: Props) {
  return (
    <>
      <div className="shop-hero">
        <h1>Brazilian Bikinis & Swimwear</h1>
        <p>Shop Melancia Swim — small bikinis, bold colors, and minimal silhouettes designed for tanning.</p>
      </div>

      <div className="shop-layout">
        <div className="shop-main">
          <div className="shop-toolbar">
            <span className="shop-count">
              <strong>{totalProducts}</strong> products
              {totalPages > 1 && (
                <span style={{ marginLeft: 8, opacity: 0.75, fontWeight: 400 }}>
                  · Page {currentPage} of {totalPages}
                </span>
              )}
            </span>
          </div>

          <div className="product-grid">
            {products.map((product) => (
              <ProductCard3 key={productKey(product)} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              className="shop-pagination"
              aria-label="Product list pages"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 8,
                marginTop: 52,
                paddingTop: 32,
                borderTop: '1px solid var(--border)',
              }}
            >
              {currentPage > 1 ? (
                <Link href={makeShopHref(currentPage - 1)} className="size-btn prev-next" prefetch={false}>
                  ← Prev
                </Link>
              ) : (
                <span className="size-btn prev-next is-disabled" aria-disabled="true">← Prev</span>
              )}

              {shopPaginationItems(currentPage, totalPages).map((item, idx) =>
                item === 'ellipsis' ? (
                  <span key={`e-${idx}`} className="page-ellipsis" aria-hidden>…</span>
                ) : (
                  <Link
                    key={`p-${item}`}
                    href={makeShopHref(item)}
                    className={`size-btn${item === currentPage ? ' active' : ''}`}
                    prefetch={false}
                    aria-current={item === currentPage ? 'page' : undefined}
                  >
                    {item}
                  </Link>
                ),
              )}

              {currentPage < totalPages ? (
                <Link href={makeShopHref(currentPage + 1)} className="size-btn prev-next" prefetch={false}>
                  Next →
                </Link>
              ) : (
                <span className="size-btn prev-next is-disabled" aria-disabled="true">Next →</span>
              )}
            </nav>
          )}
        </div>
      </div>
    </>
  )
}
