import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Temporary diagnostic endpoint — delete after Shopify connection is fixed
export async function GET() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

  const envCheck = {
    hasDomain: Boolean(domain),
    hasToken: Boolean(token),
    domainValue: domain ?? '(not set)',
    tokenPreview: token ? `${token.slice(0, 6)}…${token.slice(-4)}` : '(not set)',
  }

  if (!domain || !token) {
    return NextResponse.json({ ok: false, stage: 'env', envCheck }, { status: 200 })
  }

  const query = `{ shop { name } products(first: 1) { edges { node { title } } } }`

  try {
    const res = await fetch(`https://${domain}/api/2026-01/graphql.json`, {
      method: 'POST',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query }),
    })

    const text = await res.text()
    let json: unknown
    try { json = JSON.parse(text) } catch { json = text }

    return NextResponse.json({
      ok: res.ok,
      stage: 'shopify',
      httpStatus: res.status,
      envCheck,
      shopifyResponse: json,
    }, { status: 200 })
  } catch (e) {
    return NextResponse.json({
      ok: false,
      stage: 'fetch',
      envCheck,
      error: e instanceof Error ? e.message : String(e),
    }, { status: 200 })
  }
}
