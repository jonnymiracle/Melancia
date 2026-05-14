import { fetchAllStorefrontProducts } from '@/lib/shopify-products'
import { allProducts } from '@/data/products'
import type { ProductCard3Product } from '@/types/shopify'
import ShopCatalog from './ShopCatalog'
import {
  SHOP_PRODUCTS_PER_PAGE,
  shopClampPage,
  shopTotalPages,
} from '@/lib/shop-pagination'
import {
  productMatchesCollectionSlug,
  SOL_DE_IPANEMA_SLUG,
} from '@/lib/shop-collections'

export const dynamic = 'force-dynamic'

type ShopPageProps = {
  searchParams: { page?: string; collection?: string }
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const requestedPage = Math.max(1, parseInt(searchParams.page ?? '1', 10) || 1)
  const rawCollection = searchParams.collection
  const activeCollectionSlug =
    typeof rawCollection === 'string' && rawCollection === SOL_DE_IPANEMA_SLUG
      ? SOL_DE_IPANEMA_SLUG
      : null

  let fullList: ProductCard3Product[] = allProducts
  try {
    const shopifyProducts = await fetchAllStorefrontProducts({ maxProducts: 1000 })
    if (shopifyProducts.length > 0) {
      fullList = shopifyProducts
    }
  } catch {
    /* missing env or network — keep catalog */
  }

  if (activeCollectionSlug) {
    fullList = fullList.filter((p) => productMatchesCollectionSlug(p, activeCollectionSlug))
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
      activeCollectionSlug={activeCollectionSlug}
    />
  )
}
