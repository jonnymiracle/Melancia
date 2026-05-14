import type { ProductCard3Product } from '@/types/shopify'
import type { Product } from '@/types'

export const SOL_DE_IPANEMA_SLUG = 'sol-de-ipanema' as const

export const SHOP_COLLECTION_OPTIONS = [
  { label: 'Sol de Ipanema', slug: SOL_DE_IPANEMA_SLUG },
] as const

function getProductTags(p: ProductCard3Product): string[] {
  if ('placeholderClass' in p) return (p as Product).tags ?? []
  return p.tags ?? []
}

/** True if the product belongs to the given collection slug (Shopify tags / local data). */
export function productMatchesCollectionSlug(
  product: ProductCard3Product,
  slug: string,
): boolean {
  if (slug !== SOL_DE_IPANEMA_SLUG) return false
  const tags = getProductTags(product)
  const blob = tags.join(' ').toLowerCase()
  return (
    blob.includes('sol de ipanema') ||
    blob.includes('sol-de-ipanema') ||
    blob.includes('soldeipanema') ||
    blob.includes('sol de ipanéma')
  )
}
