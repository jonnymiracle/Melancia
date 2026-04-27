import { fetchStorefrontProducts } from '@/lib/shopify-products'
import { allProducts } from '@/data/products'
import type { ProductCard3Product } from '@/types/shopify'
import ShopCatalog from './ShopCatalog'

export default async function ShopPage() {
  let products: ProductCard3Product[] = allProducts

  try {
    const fromShopify = await fetchStorefrontProducts(24)
    if (fromShopify.length > 0) {
      products = fromShopify
    }
  } catch {
    /* missing env or network — keep catalog fallback */
  }

  return <ShopCatalog products={products} />
}
