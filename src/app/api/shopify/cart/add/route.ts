import { NextResponse } from 'next/server'
import { shopifyFetch } from '@/lib/shopify'

const CART_LINES_ADD = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        totalQuantity
      }
      userErrors {
        field
        message
      }
    }
  }
`

const CART_CREATE = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        totalQuantity
      }
      userErrors {
        field
        message
      }
    }
  }
`

/** Shopify GraphQL HTTP body: `{ data: { cartLinesAdd | cartCreate } }` */
type ShopifyGqlBody = {
  data?: {
    cartLinesAdd?: {
      cart?: { id: string; totalQuantity: number }
      userErrors?: { message: string }[]
    }
    cartCreate?: {
      cart?: { id: string; totalQuantity: number }
      userErrors?: { message: string }[]
    }
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const variantId = body.variantId as string | undefined
    const quantity = Math.max(1, Number(body.quantity) || 1)
    const existingCartId = body.cartId as string | undefined

    if (!variantId) {
      return NextResponse.json({ error: 'variantId is required' }, { status: 400 })
    }

    if (existingCartId) {
      const merged = await shopifyFetch<ShopifyGqlBody>(CART_LINES_ADD, {
        cartId: existingCartId,
        lines: [{ merchandiseId: variantId, quantity }],
      })

      const add = merged.data?.cartLinesAdd
      const errs = add?.userErrors
      if (add?.cart?.id && (!errs || errs.length === 0)) {
        return NextResponse.json({
          cartId: add.cart.id,
          totalQuantity: add.cart.totalQuantity,
        })
      }
    }

    const created = await shopifyFetch<ShopifyGqlBody>(CART_CREATE, {
      input: {
        lines: [{ merchandiseId: variantId, quantity }],
      },
    })

    const create = created.data?.cartCreate
    const cErrs = create?.userErrors
    if (create?.cart?.id && (!cErrs || cErrs.length === 0)) {
      return NextResponse.json({
        cartId: create.cart.id,
        totalQuantity: create.cart.totalQuantity,
      })
    }

    const msg =
      create?.userErrors?.[0]?.message ||
      created.data?.cartLinesAdd?.userErrors?.[0]?.message ||
      'Could not update cart'
    return NextResponse.json({ error: msg }, { status: 400 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
