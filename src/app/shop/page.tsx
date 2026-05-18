import { fetchAllStorefrontProducts } from '@/lib/shopify-products'
import { allProducts } from '@/data/products'
import type { ProductCard3Product } from '@/types/shopify'
import ShopCatalog from './ShopCatalog'
import {
  SHOP_PRODUCTS_PER_PAGE,
  shopClampPage,
  shopTotalPages,
} from '@/lib/shop-pagination'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop Bikinis & Swimwear',
  description: 'Shop Melancia Swim — Brazilian-style bikinis, small bikinis, and swimwear designed for tanning. Bold colors, minimal silhouettes, ships within the USA. Browse the full collection.',
  alternates: {
    canonical: 'https://melanciaswim.com/shop',
  },
  openGraph: {
    title: 'Shop Bikinis & Swimwear | Melancia Swim',
    description: 'Brazilian-style bikinis and swimwear designed for tanning. Small bikinis, bold colors, minimal silhouettes — ships within the USA.',
    url: 'https://melanciaswim.com/shop',
  },
}

export const dynamic = 'force-dynamic'

type ShopPageProps = {
  searchParams: { page?: string }
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const requestedPage = Math.max(1, parseInt(searchParams.page ?? '1', 10) || 1)

  let fullList: ProductCard3Product[] = allProducts
  try {
    const shopifyProducts = await fetchAllStorefrontProducts({ maxProducts: 1000 })
    if (shopifyProducts.length > 0) {
      fullList = shopifyProducts
    }
  } catch {
    /* missing env or network — keep catalog */
  }

  const totalCount = fullList.length
  const totalPages = shopTotalPages(totalCount, SHOP_PRODUCTS_PER_PAGE)
  const currentPage = shopClampPage(requestedPage, totalPages)
  const start = (currentPage - 1) * SHOP_PRODUCTS_PER_PAGE
  const products = fullList.slice(start, start + SHOP_PRODUCTS_PER_PAGE)

  return (
    <ShopCatalog
      products={products}
      currentPage={currentPage}
      totalPages={totalPages}
      totalProducts={totalCount}
    />
  )
}
