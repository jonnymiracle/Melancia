import { shopifyFetch } from '@/lib/shopify'
import type {
  ShopifyProduct,
  ShopifyProductDetail,
  StorefrontProductsPaginatedQueryData,
  StorefrontProductsQueryData,
} from '@/types/shopify'

/** Storefront allows up to 250 products per request. */
const STOREFRONT_PRODUCTS_PAGE_SIZE = 250

const PRODUCT_NODE_FIELDS = `
  id
  title
  handle
  description
  tags
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
        image {
          url
          altText
        }
        price {
          amount
          currencyCode
        }
      }
    }
  }
`

const STOREFRONT_PRODUCTS_QUERY = `
  query Products($first: Int!) {
    products(first: $first) {
      edges {
        node {
          ${PRODUCT_NODE_FIELDS}
        }
      }
    }
  }
`

const STOREFRONT_BEST_SELLING_QUERY = `
  query BestSellingProducts($first: Int!) {
    products(first: $first, sortKey: BEST_SELLING) {
      edges {
        node {
          ${PRODUCT_NODE_FIELDS}
        }
      }
    }
  }
`

const STOREFRONT_PRODUCTS_PAGINATED_QUERY = `
  query ProductsPaginated($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        cursor
        node {
          ${PRODUCT_NODE_FIELDS}
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

/**
 * Fetches top N products sorted by best selling (Shopify's sales velocity).
 */
export async function fetchBestSellingProducts(first = 6): Promise<ShopifyProduct[]> {
  const json = await shopifyFetch<StorefrontProductsQueryData>(
    STOREFRONT_BEST_SELLING_QUERY,
    { first },
  )
  const edges = json.data?.products?.edges ?? []
  return edges.map(({ node }) => node)
}

const PRODUCT_BY_HANDLE_QUERY = `
  query ProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      tags
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            availableForSale
            image {
              url
              altText
            }
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`

export async function fetchProductByHandle(handle: string): Promise<ShopifyProductDetail | null> {
  try {
    const json = await shopifyFetch<{ data: { productByHandle: ShopifyProductDetail | null } }>(
      PRODUCT_BY_HANDLE_QUERY,
      { handle },
    )
    return json.data?.productByHandle ?? null
  } catch {
    return null
  }
}

type PaginatedVars = { first: number; after?: string | null }

/**
 * Fetches **all** products from Shopify (cursor pagination), up to `maxProducts`.
 * Use for shop catalog counts / client-side paging when the catalog fits this cap.
 */
export async function fetchAllStorefrontProducts(
  options: { maxProducts?: number } = {},
): Promise<ShopifyProduct[]> {
  const maxProducts = options.maxProducts ?? 1000
  const all: ShopifyProduct[] = []
  let after: string | null = null

  while (all.length < maxProducts) {
    const first = Math.min(STOREFRONT_PRODUCTS_PAGE_SIZE, maxProducts - all.length)
    const variables: PaginatedVars = { first }
    if (after) variables.after = after

    const json = await shopifyFetch<StorefrontProductsPaginatedQueryData>(
      STOREFRONT_PRODUCTS_PAGINATED_QUERY,
      variables as Record<string, unknown>,
    )

    const products = json.data?.products
    const edges = products?.edges ?? []
    for (const edge of edges) {
      all.push(edge.node)
    }

    const pageInfo = products?.pageInfo
    if (!pageInfo?.hasNextPage || edges.length === 0) break
    after = pageInfo.endCursor ?? null
    if (!after) break
  }

  return all
}
