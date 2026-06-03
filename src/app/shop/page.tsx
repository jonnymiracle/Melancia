import type { Metadata } from 'next'
import Link from 'next/link'
import { fetchAllStorefrontProducts } from '@/lib/shopify-products'
import { SETS_HREF, TOPS_HREF } from '@/lib/collections'
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
      {/* Collection hub links — internal linking for SEO */}
      <nav className="collection-chips" aria-label="Shop by collection">
        <Link href={SETS_HREF} className="btn btn-outline btn-sm">
          Bikini Sets
        </Link>
        <Link href={TOPS_HREF} className="btn btn-outline btn-sm">
          Bikini Tops
        </Link>
      </nav>
    </header>
  )

  return <ShopCatalog products={products} intro={intro} />
}
