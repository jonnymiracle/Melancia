import { NextResponse } from 'next/server'
import { shopifyFetch } from '@/lib/shopify'

/**
 * Puts a discount code on an existing cart.
 *
 * Shopify reports back whether the code is `applicable`, which is not the same
 * as the mutation succeeding: a wrong or expired code returns no userErrors and
 * simply comes back inapplicable. Both are passed through so the caller can
 * tell the shopper the truth.
 */
const MUTATION = `
  mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]!) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
      cart {
        id
        discountCodes { code applicable }
        cost {
          subtotalAmount { amount currencyCode }
          totalAmount { amount currencyCode }
        }
      }
      userErrors { field message }
    }
  }
`

type MutationData = {
  data?: {
    cartDiscountCodesUpdate?: {
      cart?: {
        id: string
        discountCodes: { code: string; applicable: boolean }[]
        cost?: {
          subtotalAmount?: { amount: string; currencyCode: string }
          totalAmount?: { amount: string; currencyCode: string }
        }
      } | null
      userErrors?: { field?: string[]; message: string }[]
    }
  }
}

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { cartId, code } = body as { cartId?: string; code?: string }
  if (!cartId || !code) {
    return NextResponse.json({ error: 'cartId and code are required' }, { status: 400 })
  }

  try {
    const json = await shopifyFetch<MutationData>(MUTATION, {
      cartId,
      discountCodes: [code],
    })

    const result = json.data?.cartDiscountCodesUpdate
    const userErrors = result?.userErrors ?? []
    if (userErrors.length > 0) {
      return NextResponse.json({ error: userErrors[0].message }, { status: 400 })
    }

    const codes = result?.cart?.discountCodes ?? []
    const applied = codes.find(c => c.code.toUpperCase() === code.toUpperCase())

    return NextResponse.json({
      applicable: applied?.applicable ?? false,
      code: applied?.code ?? code,
      cost: result?.cart?.cost ?? null,
    })
  } catch (err) {
    const detail = err instanceof Error ? err.message : 'Unknown error'
    console.error('[cart/discount] failed:', detail)
    return NextResponse.json({ error: 'Could not apply the code' }, { status: 502 })
  }
}
