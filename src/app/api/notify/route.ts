import { NextResponse } from 'next/server'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const rec = body as {
    email?: string
    productId?: string
    productTitle?: string
    variantId?: string | null
    variantTitle?: string | null
    selection?: Record<string, string>
  }

  const email = typeof rec.email === 'string' ? rec.email.trim() : ''
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const productTitle = rec.productTitle ?? 'Unknown product'
  const selection = rec.selection ?? {}

  // Build a human-readable variant description (e.g. "Size: M, Color: Moss, Piece: Top")
  const variantDesc = Object.entries(selection)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ')

  const apiKey = process.env.KLAVIYO_API_KEY
  const listId = process.env.KLAVIYO_BACK_IN_STOCK_LIST_ID ?? process.env.KLAVIYO_LIST_ID

  if (!apiKey || !listId) {
    console.info('[notify] No Klaviyo config — back-in-stock request logged:', email, productTitle, variantDesc)
    return NextResponse.json({ ok: true, debug: 'no_config' })
  }

  try {
    const res = await fetch('https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/', {
      method: 'POST',
      headers: {
        'Authorization': `Klaviyo-API-Key ${apiKey}`,
        'Content-Type': 'application/json',
        'revision': '2024-10-15',
      },
      body: JSON.stringify({
        data: {
          type: 'profile-subscription-bulk-create-job',
          attributes: {
            custom_source: `Back in Stock — ${productTitle}${variantDesc ? ` (${variantDesc})` : ''}`,
            profiles: {
              data: [
                {
                  type: 'profile',
                  attributes: {
                    email,
                    subscriptions: {
                      email: { marketing: { consent: 'SUBSCRIBED' } },
                    },
                    properties: {
                      back_in_stock_product: productTitle,
                      back_in_stock_variant: variantDesc || rec.variantTitle || '',
                      back_in_stock_product_id: rec.productId ?? '',
                      back_in_stock_variant_id: rec.variantId ?? '',
                    },
                  },
                },
              ],
            },
          },
          relationships: {
            list: { data: { type: 'list', id: listId } },
          },
        },
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[notify] Klaviyo error:', res.status, err)
      return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
    }
  } catch (e) {
    console.error('[notify] Klaviyo fetch failed:', e)
    return NextResponse.json({ error: 'Network error' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
