import type { Metadata } from 'next'
import { fetchAllStorefrontProducts } from '@/lib/shopify-products'
import { expandToVariantCards } from '@/lib/variant-cards'
import type { VariantCardData } from '@/components/VariantCard'
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
  let variantCards: VariantCardData[] = []

  try {
    const products = await fetchAllStorefrontProducts({ maxProducts: 1000 })
    variantCards = expandToVariantCards(products)
  } catch {
    /* Shopify unavailable — empty grid */
  }

  return <ShopCatalog variantCards={variantCards} />
}
