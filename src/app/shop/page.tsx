import type { Metadata } from 'next'
import { fetchAllStorefrontProducts } from '@/lib/shopify-products'
import { allProducts } from '@/data/products'
import type { ProductCard3Product } from '@/types/shopify'
import ShopCatalog from './ShopCatalog'

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

export default async function ShopPage() {
  let products: ProductCard3Product[] = allProducts

  try {
    const fromShopify = await fetchAllStorefrontProducts({ maxProducts: 1000 })
    if (fromShopify.length > 0) {
      products = fromShopify
    }
  } catch {
    /* missing env or network — keep catalog */
  }

  return <ShopCatalog products={products} />
}
