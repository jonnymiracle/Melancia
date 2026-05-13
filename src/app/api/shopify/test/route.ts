import { NextResponse } from 'next/server'
import { shopifyFetch } from '@/lib/shopify'

export const dynamic = 'force-dynamic'

const CONNECTION_QUERY = `
  query ShopifyTestConnection {
    shop {
      name
    }
    products(first: 5) {
      edges {
        node {
          title
          variants(first: 5) {
            edges {
              node {
                id
                availableForSale
              }
            }
          }
        }
      }
    }
  }
`

type ConnectionData = {
  data?: {
    shop?: { name: string } | null
    products?: {
      edges: {
        node: {
          title: string
          variants: {
            edges: { node: { id: string; availableForSale: boolean } }[]
          }
        }
      }[]
    }
  }
}

const CART_CREATE_TEST = `
  mutation ShopifyTestCartCreate($variantId: ID!, $quantity: Int!) {
    cartCreate(
      input: { lines: [{ merchandiseId: $variantId, quantity: $quantity }] }
    ) {
      cart {
        id
        checkoutUrl
        totalQuantity
      }
      userErrors {
        field
        message
      }
    }
  }
`

type CartCreateData = {
  data?: {
    cartCreate?: {
      cart?: { id: string; checkoutUrl: string; totalQuantity: number }
      userErrors?: { field: string[] | null; message: string }[]
    }
  }
}

function isProduction() {
  return process.env.NODE_ENV === 'production'
}

function pickSampleVariant(data: ConnectionData): {
  variantId: string | null
  productTitle: string | null
  note?: string
} {
  const edges = data.data?.products?.edges ?? []
  for (const { node } of edges) {
    const vEdges = node.variants?.edges ?? []
    const available = vEdges.find((e) => e.node.availableForSale)
    const pick = available ?? vEdges[0]
    if (pick?.node.id) {
      return {
        variantId: pick.node.id,
        productTitle: node.title,
        note: available
          ? undefined
          : 'First variant is not available for sale; cartCreate may return userErrors.',
      }
    }
  }
  return { variantId: null, productTitle: null, note: 'No variants found.' }
}

/**
 * Dev-only Storefront checks.
 *
 * GET: shop name + first usable variant id (for manual cart tests).
 * POST: `cartCreate` — body optional `{ "variantId": "gid://...", "quantity": 1 }`;
 * if `variantId` is omitted, uses the first variant from the same sample query.
 */
export async function GET() {
  if (isProduction()) {
    return NextResponse.json({ error: 'Disabled in production' }, { status: 404 })
  }

  try {
    const json = await shopifyFetch<ConnectionData>(CONNECTION_QUERY)
    const shopName = json.data?.shop?.name ?? null
    const sample = pickSampleVariant(json)

    return NextResponse.json({
      ok: true,
      shopName,
      sampleVariantId: sample.variantId,
      sampleProductTitle: sample.productTitle,
      note: sample.note,
      hint: sample.variantId
        ? 'POST /api/shopify/test with {} to run cartCreate using this variant, or pass { "variantId": "..." }.'
        : 'Add products with variants in Shopify and publish them to the storefront channel.',
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json(
      {
        ok: false,
        error: message,
        hint: 'Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local, then restart `next dev`.',
      },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  if (isProduction()) {
    return NextResponse.json({ error: 'Disabled in production' }, { status: 404 })
  }

  try {
    let variantId: string | undefined
    let quantity = 1

    try {
      const body = await req.json()
      if (body && typeof body.variantId === 'string') variantId = body.variantId
      if (body && typeof body.quantity === 'number' && body.quantity >= 1) {
        quantity = Math.floor(body.quantity)
      }
    } catch {
      // empty body is fine
    }

    if (!variantId) {
      const conn = await shopifyFetch<ConnectionData>(CONNECTION_QUERY)
      const sample = pickSampleVariant(conn)
      if (!sample.variantId) {
        return NextResponse.json(
          {
            ok: false,
            error: 'No variant to test. Pass variantId or add products in Shopify.',
          },
          { status: 400 },
        )
      }
      variantId = sample.variantId
    }

    const created = await shopifyFetch<CartCreateData>(CART_CREATE_TEST, {
      variantId,
      quantity,
    })

    const block = created.data?.cartCreate
    const errs = block?.userErrors ?? []
    const cart = block?.cart

    if (errs.length > 0 || !cart?.id) {
      return NextResponse.json(
        {
          ok: false,
          userErrors: errs,
          error: errs[0]?.message ?? 'cartCreate returned no cart',
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      ok: true,
      cartId: cart.id,
      totalQuantity: cart.totalQuantity,
      checkoutUrl: cart.checkoutUrl,
      variantUsed: variantId,
      hint: 'Store cart id in localStorage (melancia-shopify-cart-id) or open checkoutUrl in a browser tab.',
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
