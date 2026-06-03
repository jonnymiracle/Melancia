import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { fetchProductByHandle, fetchAllStorefrontProducts } from '@/lib/shopify-products'
import { SITE_NAME, SITE_URL, LOGO_IMAGE } from '@/lib/site-config'
import { buildProductJsonLd } from '@/lib/product-jsonld'
import { buildProductTitle } from '@/lib/product-title'
import { buildBreadcrumbJsonLd } from '@/lib/breadcrumb-jsonld'
import { classifyProduct, SETS_HREF, TOPS_HREF } from '@/lib/collections'
import { getRelatedProducts } from '@/lib/related-products'
import ProductDetail from '@/components/ProductDetail'
import ProductCard3 from '@/components/ProductCard3'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ handle: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const product = await fetchProductByHandle(handle)
  if (!product) return { title: 'Product Not Found' }

  const description = product.description?.slice(0, 160) || undefined
  const keywordTitle = buildProductTitle(product)
  const productUrl = `/shop/${handle}`

  const firstImageUrl = product.images.edges[0]?.node.url ?? null
  // Product images come from the Shopify CDN at varying (non-square)
  // dimensions, so we omit width/height hints and let crawlers read the
  // real image. The logo has known dimensions, so we keep them there.
  const ogImages = firstImageUrl
    ? [{ url: firstImageUrl, alt: product.title }]
    : [{ url: LOGO_IMAGE, width: 1200, height: 630, alt: `${SITE_NAME} logo` }]

  return {
    // Absolute title — already ends with "| Melancia Swim", so we use { absolute }
    // to prevent the root layout's "%s | Melancia Swim" template from doubling it.
    title: { absolute: keywordTitle },
    description,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      // Next.js 14's OpenGraph type union does not include 'product';
      // 'website' is the closest valid value and degrades gracefully.
      type: 'website',
      siteName: SITE_NAME,
      locale: 'en_US',
      url: productUrl,
      title: keywordTitle,
      description,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: keywordTitle,
      description,
      images: ogImages,
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params
  const product = await fetchProductByHandle(handle)
  if (!product) notFound()

  const jsonLd = buildProductJsonLd(product)

  // Keep this trail in sync with the visible breadcrumb rendered in
  // ProductDetail.tsx (.pdp-breadcrumb): Home / Shop / {product.title}.
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'Shop', url: `${SITE_URL}/shop` },
    { name: product.title, url: `${SITE_URL}/shop/${handle}` },
  ])

  // Fetch full catalog for related products; degrade gracefully on error.
  const catalog = await fetchAllStorefrontProducts({ maxProducts: 1000 }).catch(() => [])
  const relatedProducts = getRelatedProducts(product, catalog, 4)

  // Derive a human-readable heading — ad-safe, never "tiny".
  const kind = classifyProduct(product)
  const relatedHeading =
    kind === 'set' ? 'More Brazilian Bikini Sets' : 'More Brazilian Bikini Tops'

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductDetail product={product} />

      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <div className="related-products-header">
            <h2>{relatedHeading}</h2>
            <Link
              href={kind === 'set' ? SETS_HREF : TOPS_HREF}
              className="btn btn-outline btn-sm"
            >
              View All
            </Link>
          </div>
          <div className="product-grid">
            {relatedProducts.map((p) => (
              <ProductCard3 key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
