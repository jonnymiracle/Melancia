import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { fetchProductByHandle } from '@/lib/shopify-products'
import ProductDetail from '@/components/ProductDetail'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ handle: string }> }

const LOGO_IMAGE = '/images/Logo original colors.png'
const SITE_NAME = 'Melancia Swim'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const product = await fetchProductByHandle(handle)
  if (!product) return { title: 'Product Not Found' }

  const description = product.description?.slice(0, 160) || undefined
  const ogTitle = `${product.title} Brazilian Bikini | ${SITE_NAME}`
  const productUrl = `/shop/${handle}`

  const firstImageUrl = product.images.edges[0]?.node.url ?? null
  const ogImages = firstImageUrl
    ? [{ url: firstImageUrl, width: 1200, height: 1200, alt: product.title }]
    : [{ url: LOGO_IMAGE, width: 1200, height: 630, alt: `${SITE_NAME} logo` }]

  return {
    title: product.title,
    description,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: 'en_US',
      url: productUrl,
      title: ogTitle,
      description,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      images: ogImages,
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params
  const product = await fetchProductByHandle(handle)
  if (!product) notFound()
  return <ProductDetail product={product} />
}
