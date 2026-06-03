import type { Metadata } from 'next'
import { fetchAllStorefrontProducts } from '@/lib/shopify-products'
import { allProducts } from '@/data/products'
import type { ProductCard3Product } from '@/types/shopify'
import ShopCatalog from './ShopCatalog'

export const metadata: Metadata = {
  title: 'Brazilian Bikinis',
  description: 'Shop Brazilian bikinis from Melancia Swim — cheeky, high-cut, minimal-coverage swimwear made in Brazil. Bold colors, sets and tops, ships within the USA. Browse the full collection.',
  alternates: {
    canonical: 'https://www.melanciaswim.com/shop',
  },
  openGraph: {
    title: 'Brazilian Bikinis | Melancia Swim',
    description: 'Brazilian bikinis made in Brazil — cheeky, high-cut, minimal-coverage swimwear. Bold colors, sets and tops, ships within the USA.',
    url: 'https://www.melanciaswim.com/shop',
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

  // PLACEHOLDER intro copy — replaced by the long-form content track.
  const intro = (
    <header className="collection-intro">
      <h1>Brazilian Bikinis</h1>
      <p>
        PLACEHOLDER: Discover Brazilian bikinis made in Brazil — cheeky,
        high-cut, minimal-coverage swimwear in bold colors. Shop coordinated
        sets and mix-and-match tops designed to move with you from sand to sea.
      </p>
    </header>
  )

  return <ShopCatalog products={products} intro={intro} />
}
