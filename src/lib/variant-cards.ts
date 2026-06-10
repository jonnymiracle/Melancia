import type { ShopifyProduct } from '@/types/shopify'
import type { VariantCardData } from '@/components/VariantCard'

/**
 * Expands a flat list of Shopify products into one card entry per unique color
 * variant. Each entry carries the variant's image and price so the grid shows
 * every colorway, not just one card per product. Clicking any card goes to the
 * same /shop/[handle] product page.
 */
export function expandToVariantCards(products: ShopifyProduct[]): VariantCardData[] {
  const cards: VariantCardData[] = []

  for (const product of products) {
    if (!product.handle) continue
    const variants = product.variants?.edges.map(e => e.node) ?? []
    const seen = new Set<string>()

    for (const v of variants) {
      const colorOpt = v.selectedOptions?.find(o => o.name === 'Color')
      const colorKey = colorOpt?.value ?? '__default__'
      if (seen.has(colorKey)) continue
      seen.add(colorKey)

      const imgUrl = v.image?.url ?? product.featuredImage?.url
      if (!imgUrl) continue

      cards.push({
        id: `${product.id}--${colorKey}`,
        handle: product.handle,
        title: product.title,
        colorName: colorOpt?.value ?? null,
        imageUrl: imgUrl,
        imageAlt: v.image?.altText ?? product.featuredImage?.altText ?? product.title ?? '',
        priceAmount: v.price.amount,
        priceCurrency: v.price.currencyCode,
      })
    }

    // Fallback: product has no variant images — use featuredImage
    if (seen.size === 0 && product.featuredImage?.url) {
      const v = variants[0]
      cards.push({
        id: product.id,
        handle: product.handle,
        title: product.title,
        colorName: null,
        imageUrl: product.featuredImage.url,
        imageAlt: product.featuredImage.altText ?? product.title ?? '',
        priceAmount: v?.price.amount ?? '0',
        priceCurrency: v?.price.currencyCode ?? 'USD',
      })
    }
  }

  return cards
}
