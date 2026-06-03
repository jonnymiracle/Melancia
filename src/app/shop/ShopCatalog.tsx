'use client'

import type { ReactNode } from 'react'
import ProductCard3 from '@/components/ProductCard3'
import HeroSlideshow from '@/components/HeroSlideshow'
import type { ProductCard3Product } from '@/types/shopify'

type Props = {
  products: ProductCard3Product[]
  /** Optional intro region (H1 + copy) rendered above the grid (e.g. the SEO hub intro). */
  intro?: ReactNode
}

function productKey(p: ProductCard3Product) {
  return 'placeholderClass' in p ? `cat-${p.id}` : p.id
}

export default function ShopCatalog({ products, intro }: Props) {
  return (
    <>
      <HeroSlideshow />

      <div className="shop-layout">
        <div className="shop-main">
          {intro}

          <div className="shop-toolbar">
            <span className="shop-count">
              <strong>{products.length}</strong> products
            </span>
          </div>

          <div className="product-grid">
            {products.map((product) => (
              <ProductCard3 key={productKey(product)} product={product} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
