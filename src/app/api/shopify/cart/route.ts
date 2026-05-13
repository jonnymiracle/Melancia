import { NextResponse } from 'next/server'
import { shopifyFetch } from '@/lib/shopify'

const CART_QUERY = `
  query cartQuery($id: ID!) {
    cart(id: $id) {
      id
      checkoutUrl
      totalQuantity
      cost {
        totalAmount {
          amount
          currencyCode
        }
      }
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                image {
                  url
                  altText
                }
                price {
                  amount
                  currencyCode
                }
                product {
                  title
                }
              }
            }
          }
        }
      }
    }
  }
`

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const cartId = searchParams.get('cartId')
  if (!cartId) {
    return NextResponse.json({ data: { cart: null } })
  }
  try {
    const result = await shopifyFetch<{ data?: { cart?: unknown } }>(CART_QUERY, {
      id: cartId,
    })
    return NextResponse.json(result)
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { data: { cart: null }, error: 'Could not load cart' },
      { status: 500 },
    )
  }
}

type CartCreateData = {
  data?: {
    cartCreate?: {
      cart?: { id: string; checkoutUrl: string } | null
      userErrors?: { field: string[] | null; message: string }[]
    }
  }
}

export async function POST(req: Request) {
  try {
    const { variantId, quantity } = await req.json()

    const query = `
      mutation CartCreate($variantId: ID!, $quantity: Int!) {
        cartCreate(
          input: {
            lines: [{ merchandiseId: $variantId, quantity: $quantity }]
          }
        ) {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const data = await shopifyFetch<CartCreateData>(query, { variantId, quantity })
    const block = data.data?.cartCreate
    const errs = block?.userErrors ?? []

    if (errs.length > 0 || !block?.cart?.id) {
      return NextResponse.json(
        { error: errs[0]?.message ?? 'cartCreate returned no cart' },
        { status: 400 },
      )
    }

    return NextResponse.json(data)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
