import type { ShopifyProduct } from '@/types/shopify'
import type { VariantCardData } from '@/components/VariantCard'

// Per-card image crop position overrides. Key format: `${handle}--${colorValue}`.
const CARD_IMAGE_POSITIONS: Record<string, string> = {
  'grumari-sol-top--Coco':         'left center',
  'ipanema-luz-top--Dragon Fruit': '-30px center',
}

// Per-card image URL overrides (local title card images). Key format: `${handle}--${colorValue}`.
const CARD_IMAGE_OVERRIDES: Record<string, string> = {
  // Grumari Sol
  'grumari-sol-top--Areia':            '/images/title cards/Grumarie Areia.jpeg',
  'grumari-sol-top--Coco':             '/images/title cards/Grumarie Coco 1.jpeg',
  'grumari-sol-top--Mar':              '/images/title cards/Grumari mar.jpeg',
  // Ipanema Luz
  'ipanema-luz-top--Dragon Fruit':     '/images/title cards/ipanema luz dragon fruit.jpeg',
  // Pedra do Sal
  'pedra-do-sal-top--Ceu':             '/images/title cards/pedra do sal ceu.jpeg',
  'pedra-do-sal-top--Carioca':         '/images/title cards/Carioca.jpeg',
  'pedra-do-sal-top--Zebra pastel':    '/images/title cards/zebra pastel.jpeg',
  'pedra-do-sal-top--Zebra Vermelhia': '/images/title cards/Zebra Vermelha.jpeg',
  'pedra-do-sal-top--Azulejos Baianos':'/images/title cards/Azulejo Bahiano.jpeg',
  'pedra-do-sal-top--Zebra Areia':     '/images/title cards/Zebra areia 1.jpeg',
  'pedra-do-sal-top--Creme de limão':  '/images/title cards/Pedra do Sal Amarelho.jpeg',
  // Onça & Tijuca (no Color option → key uses __default__)
  'onca--__default__':                 '/images/title cards/onca.jpeg',
  'tijuca--__default__':               '/images/title cards/Tijuca.jpeg',
}

// Per-card image scale (zoom). Key format: `${handle}--${colorValue}`.
const CARD_IMAGE_SCALES: Record<string, number> = {}

// Badge pills shown on product cards. Key is the product handle (applies to all colorways).
const CARD_BADGES: Record<string, string> = {
  'tijuca': 'New Release',
}

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
    if (product.tags?.includes('hidden-test')) continue
    const variants = product.variants?.edges.map(e => e.node) ?? []
    const seen = new Set<string>()

    for (const v of variants) {
      const colorOpt = v.selectedOptions?.find(o => o.name === 'Color')
      const colorKey = colorOpt?.value ?? '__default__'
      if (seen.has(colorKey)) continue
      seen.add(colorKey)

      const imgUrl = v.image?.url ?? product.featuredImage?.url
      if (!imgUrl) continue

      const positionKey = `${product.handle}--${colorKey}`
      const override = CARD_IMAGE_OVERRIDES[positionKey]
      cards.push({
        id: `${product.id}--${colorKey}`,
        handle: product.handle,
        title: product.title,
        colorName: colorOpt?.value ?? null,
        imageUrl: override ?? imgUrl,
        imageUrlFallback: override ? imgUrl : undefined,
        imageAlt: v.image?.altText ?? product.featuredImage?.altText ?? product.title ?? '',
        priceAmount: v.price.amount,
        priceCurrency: v.price.currencyCode,
        objectPosition: CARD_IMAGE_POSITIONS[positionKey],
        imageScale: CARD_IMAGE_SCALES[positionKey],
        badge: CARD_BADGES[product.handle],
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
        badge: CARD_BADGES[product.handle],
      })
    }
  }

  cards.sort((a, b) => sortRank(a) - sortRank(b))
  return cards
}

function sortRank(card: VariantCardData): number {
  if (card.handle === 'tijuca') return 0
  if (card.handle === 'pedra-do-sal-top') return 1
  const key = `${card.handle}--${card.colorName ?? '__default__'}`
  if (CARD_IMAGE_OVERRIDES[key]) return 2
  return 3
}
