import { NextResponse } from 'next/server'
import { shopifyFetch } from '@/lib/shopify'

const LINES_UPDATE = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
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

const LINES_REMOVE = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
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

type Gql = {
  data?: {
    cartLinesUpdate?: {
      cart?: { id: string; totalQuantity: number }
      userErrors?: { message: string }[]
    }
    cartLinesRemove?: {
      cart?: { id: string; totalQuantity: number }
      userErrors?: { message: string }[]
    }
  }
}

/** POST `{ action: 'update'|'remove', cartId, lineId, quantity?, lineIds? }` */
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const cartId = body.cartId as string | undefined
    const action = body.action as string | undefined

    if (!cartId) {
      return NextResponse.json({ error: 'cartId required' }, { status: 400 })
    }

    if (action === 'update') {
      const lineId = body.lineId as string
      const quantity = Math.max(0, Number(body.quantity) || 0)
      if (!lineId) {
        return NextResponse.json({ error: 'lineId required' }, { status: 400 })
      }
      if (quantity < 1) {
        const removed = await shopifyFetch<Gql>(LINES_REMOVE, {
          cartId,
          lineIds: [lineId],
        })
        const r = removed.data?.cartLinesRemove
        if (r?.userErrors?.length) {
          return NextResponse.json(
            { error: r.userErrors[0].message },
            { status: 400 },
          )
        }
        return NextResponse.json({ ok: true, totalQuantity: r?.cart?.totalQuantity })
      }
      const updated = await shopifyFetch<Gql>(LINES_UPDATE, {
        cartId,
        lines: [{ id: lineId, quantity }],
      })
      const u = updated.data?.cartLinesUpdate
      if (u?.userErrors?.length) {
        return NextResponse.json({ error: u.userErrors[0].message }, { status: 400 })
      }
      return NextResponse.json({ ok: true, totalQuantity: u?.cart?.totalQuantity })
    }

    if (action === 'remove') {
      const lineIds = body.lineIds as string[] | undefined
      if (!lineIds?.length) {
        return NextResponse.json({ error: 'lineIds required' }, { status: 400 })
      }
      const removed = await shopifyFetch<Gql>(LINES_REMOVE, { cartId, lineIds })
      const r = removed.data?.cartLinesRemove
      if (r?.userErrors?.length) {
        return NextResponse.json(
          { error: r.userErrors[0].message },
          { status: 400 },
        )
      }
      return NextResponse.json({ ok: true, totalQuantity: r?.cart?.totalQuantity })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
