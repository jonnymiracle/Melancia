import { NextResponse } from 'next/server'
import { fetchStorefrontProducts } from '@/lib/shopify-products'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const products = await fetchStorefrontProducts(24)
    return NextResponse.json({ products })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: 'Failed to load products', products: [] },
      { status: 500 },
    )
  }
}
