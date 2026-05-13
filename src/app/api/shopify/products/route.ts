import { NextResponse } from 'next/server'
import { fetchStorefrontProducts } from '@/lib/shopify-products'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const products = await fetchStorefrontProducts(24)
    return NextResponse.json({ products })
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    console.error('[shopify/products]', message)
    return NextResponse.json(
      { error: message, products: [] },
      { status: 500 },
    )
  }
}
