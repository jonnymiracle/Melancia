import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { fetchAllStorefrontProducts } from '@/lib/shopify-products'
import { SITE_NAME, SITE_URL, LOGO_IMAGE } from '@/lib/site-config'
import { buildBreadcrumbJsonLd } from '@/lib/breadcrumb-jsonld'
import { getCollection, filterProductsForCollection } from '@/lib/collections'
import ProductCard3 from '@/components/ProductCard3'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ handle: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const collection = getCollection(handle)
  if (!collection) return { title: 'Collection Not Found' }

  const url = `/collections/${handle}`
  return {
    title: collection.title,
    description: collection.metaDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: 'en_US',
      url,
      title: collection.title,
      description: collection.metaDescription,
      images: [{ url: LOGO_IMAGE, width: 1200, height: 630, alt: `${SITE_NAME} logo` }],
    },
  }
}

export default async function CollectionPage({ params }: Props) {
  const { handle } = await params
  const collection = getCollection(handle)
  if (!collection) notFound()

  let products = await fetchAllStorefrontProducts({ maxProducts: 1000 }).catch(() => [])
  products = filterProductsForCollection(products, handle)

  // Keep this trail in sync with the visible breadcrumb below: Home / Shop / {name}.
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'Shop', url: `${SITE_URL}/shop` },
    { name: collection.name, url: `${SITE_URL}/collections/${handle}` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <nav className="pdp-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / {collection.name}
      </nav>

      <div className="shop-layout">
        <div className="shop-main">
          <header className="collection-intro">
            <h1>{collection.h1}</h1>
            {/* PLACEHOLDER intro copy — replaced by the long-form content track. */}
            <p>{collection.intro}</p>
          </header>

          <div className="shop-toolbar">
            <span className="shop-count">
              <strong>{products.length}</strong> products
            </span>
          </div>

          <div className="product-grid">
            {products.map((product) => (
              <ProductCard3 key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
