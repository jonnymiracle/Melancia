import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { fetchProductByHandle } from '@/lib/shopify-products'
import ProductDetail from '@/components/ProductDetail'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ handle: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const product = await fetchProductByHandle(handle)
  if (!product) return { title: 'Product Not Found' }
  return {
    title: product.title,
    description: product.description?.slice(0, 160) || undefined,
  }
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params
  const product = await fetchProductByHandle(handle)
  if (!product) notFound()
  return <ProductDetail product={product} />
}
