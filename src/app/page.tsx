import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import VariantCard from '@/components/VariantCard'
import type { VariantCardData } from '@/components/VariantCard'
import { NewsletterForm } from '@/components/NewsletterForm'
import { InstagramIcon } from '@/components/icons'
import AnnouncementBar from '@/components/AnnouncementBar'
import HeroSlideshow from '@/components/HeroSlideshow'
import { fetchAllStorefrontProducts } from '@/lib/shopify-products'
import type { ShopifyProduct } from '@/types/shopify'

export const metadata: Metadata = {
  title: 'Brazilian Bikinis & Swimwear Designed for Tanning',
  description: 'Melancia Swim — Brazilian-style bikinis and swimwear made for tanning. Shop small bikinis, bold colors, and minimal silhouettes. Based in Puerto Rico, shipping within the USA.',
  alternates: {
    canonical: 'https://www.melanciaswim.com',
  },
  openGraph: {
    title: 'Melancia Swim | Brazilian Bikinis & Swimwear Designed for Tanning',
    description: 'Shop Brazilian-style bikinis and swimwear. Minimal silhouettes, bold colors — designed for tanning. Based in Puerto Rico, ships within the USA.',
    url: 'https://www.melanciaswim.com',
  },
}

const INSTAGRAM = 'https://www.instagram.com/melanciaswim/'

export const dynamic = 'force-dynamic'

function expandToVariantCards(products: ShopifyProduct[]): VariantCardData[] {
  const cards: VariantCardData[] = []

  for (const product of products) {
    if (!product.handle) continue
    const variants = product.variants?.edges.map(e => e.node) ?? []
    const seen = new Set<string>()

    for (const v of variants) {
      const colorOpt = v.selectedOptions?.find(o => o.name === 'Color')
      const colorKey = colorOpt?.value ?? '__default__'
      if (seen.has(colorKey)) continue
      seen.add(colorKey)

      const imgUrl = v.image?.url ?? product.featuredImage?.url
      if (!imgUrl) continue

      cards.push({
        id: `${product.id}--${colorKey}`,
        handle: product.handle,
        title: product.title,
        colorName: colorOpt?.value ?? null,
        imageUrl: imgUrl,
        imageAlt: v.image?.altText ?? product.featuredImage?.altText ?? product.title ?? '',
        priceAmount: v.price.amount,
        priceCurrency: v.price.currencyCode,
      })
    }

    // Fallback: product has no variants with images
    if (seen.size === 0 && product.featuredImage?.url) {
      const v = variants[0]
      cards.push({
        id: product.id,
        handle: product.handle,
        title: product.title,
        colorName: null,
        imageUrl: product.featuredImage.url,
        imageAlt: product.featuredImage.altText ?? product.title ?? '',
        priceAmount: v?.price.amount ?? '0',
        priceCurrency: v?.price.currencyCode ?? 'USD',
      })
    }
  }

  return cards
}

export default async function HomePage() {
  let variantCards: VariantCardData[] = []

  try {
    const products = await fetchAllStorefrontProducts()
    variantCards = expandToVariantCards(products)
  } catch {
    /* Shopify unavailable — empty grid */
  }

  return (
    <>
      {/* ── Hero Slideshow ── */}
      <HeroSlideshow />

      {/* ── Announcement Bar (below hero) ── */}
      <div className="announcement-bar-below-hero">
        <AnnouncementBar />
      </div>

      {/* ── Products — all color variants ── */}
      <section className="section section-featured" id="featured">
        <div className="product-grid">
          {variantCards.map(card => (
            <VariantCard key={card.id} {...card} />
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link href="/shop" className="btn btn-outline">View All Products</Link>
        </div>
      </section>

      {/* ── About Strip ── */}
      <section className="about-strip">
        <div className="about-strip-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/photos bottom hero/wheelbarrow.jpeg" alt="Brazilian bikini swimwear lifestyle — Melancia Swim" loading="lazy" decoding="async" style={{ width: '100%', height: 'calc(100% + 200px)', objectFit: 'cover', display: 'block', marginTop: '-200px' }} />
        </div>
        <div className="about-strip-content">
          <h2>Made for the sun.<br /><em>Made for you.</em></h2>
          <p>
            Melancia was born for the moments you never forget: beach days, boat rides,
            pool parties and everything in between. Designed to make you feel as good as you look.
          </p>
          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center' }}>
            <Link href="/about" className="btn btn-primary btn-sm">Our Story</Link>
          </div>
        </div>
      </section>

      {/* ── Instagram CTA ── */}
      <section className="instagram-cta-section">
        <h2>Find us on Instagram</h2>
        <p>Follow our journey and tag us in your photos.</p>
        <a
          href={INSTAGRAM}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow Melancia Swim on Instagram (opens in a new tab)"
          className="btn btn-primary instagram-cta-btn"
        >
          <InstagramIcon size={18} />
          @melanciaswim
        </a>
      </section>

      {/* ── Newsletter ── */}
      <section className="newsletter-section">
        <Image
          src="/images/Get Early Access/Water.JPG"
          alt="Melancia Swim"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          sizes="100vw"
        />
        <div className="newsletter-overlay" />
        <div className="newsletter-content">
          <h2>Get Early Access</h2>
          <p>Be the first to know about new drops, exclusive deals, and summer inspo.</p>
          <NewsletterForm source="home-footer" />
        </div>
      </section>
    </>
  )
}
