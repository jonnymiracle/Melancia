import { NextResponse } from 'next/server'
import { shopifyFetch } from '@/lib/shopify'

export async function POST(req: Request) {
  const { variantId, quantity } = await req.json()

  const query = `
    mutation CartCreate($variantId: ID!, $quantity: Int!) {
      cartCreate(
        input: {
          lines: [
            {
              merchandiseId: $variantId
              quantity: $quantity
            }
          ]
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

  const data = await shopifyFetch(query, {
    variantId,
    quantity,
  })

  return NextResponse.json(data)
}
