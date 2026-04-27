import { shopifyFetch } from '@/lib/shopify'
import type { ShopifyProduct, StorefrontProductsQueryData } from '@/types/shopify'

const STOREFRONT_PRODUCTS_QUERY = `
  query Products($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          featuredImage {
            url
            altText
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`

/**
 * Calls Shopify and returns flat `ShopifyProduct[]` (unwraps `edges[].node`).
 * Same shape your UI / ProductCard3 expects.
 */
export async function fetchStorefrontProducts(first = 24): Promise<ShopifyProduct[]> {
  const json = await shopifyFetch<StorefrontProductsQueryData>(
    STOREFRONT_PRODUCTS_QUERY,
    { first },
  )

  const edges = json.data?.products?.edges ?? []
  return edges.map(({ node }) => node)
}
