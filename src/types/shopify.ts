import type { Product } from '@/types'

/** Single variant node from Storefront API `variants.edges[].node` */
export type ShopifyProductVariant = {
  id: string
  title: string
  availableForSale: boolean
  /** Present when the variant has its own image in Admin (often set without a product “featured” image). */
  image?: {
    url: string
    altText?: string | null
  } | null
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
  /** Admin product tags — use for card badges (e.g. `new`, `sale`) */
  tags: string[]
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

/** Paginated products query (cursor) — same `node` shape as `StorefrontProductsQueryData`. */
export type StorefrontProductsPaginatedQueryData = {
  data?: {
    products?: {
      pageInfo: {
        hasNextPage: boolean
        endCursor?: string | null
      }
      edges: {
        cursor: string
        node: ShopifyProduct
      }[]
    }
  }
}
