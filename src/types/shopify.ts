import type { Product } from '@/types'

/** Single variant node from Storefront API `variants.edges[].node` */
export type ShopifyProductVariant = {
  id: string
  title: string
  availableForSale: boolean
  price: {
    amount: string
    currencyCode: string
  }
}

/** Product node from Storefront API `products.edges[].node` — matches your query shape */
export type ShopifyProduct = {
  id: string
  title: string
  handle?: string
  /** Plain or HTML from Storefront; strip before showing in cards if needed */
  description?: string
  featuredImage?: {
    url: string
    altText?: string | null
  } | null
  variants?: {
    edges: {
      node: ShopifyProductVariant
    }[]
  }
}

export type ProductCard3Product = Product | ShopifyProduct

/** Raw GraphQL envelope for a products list query */
export type StorefrontProductsQueryData = {
  data: {
    products: {
      edges: {
        node: ShopifyProduct
      }[]
    }
  }
}
