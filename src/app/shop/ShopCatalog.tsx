'use client'

import ProductCard3 from '@/components/ProductCard3'
import type { ProductCard3Product } from '@/types/shopify'

type Props = {
  products: ProductCard3Product[]
}

function productKey(p: ProductCard3Product) {
  return 'placeholderClass' in p ? `cat-${p.id}` : p.id
}

export default function ShopCatalog({ products }: Props) {
  return (
    <>
      <div className="shop-hero">
        <h1>Benvindo no Brasil</h1>
        <p>Dive into the new summer collection — bold colors, flattering fits.</p>
      </div>

      <div className="shop-layout">
        <div className="shop-main">
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
