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
import { expandToVariantCards } from '@/lib/variant-cards'

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
        <h2 className="section-featured-heading">Shop the Collection</h2>
        <div className="product-grid">
          {variantCards.map(card => (
            <VariantCard key={card.id} {...card} />
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link href="/shop" className="btn btn-outline">Shop All Bikinis</Link>
        </div>
      </section>

      {/* ── About Strip ── */}
      <section className="about-strip">
        <div className="about-strip-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/photos bottom hero/wheelbarrow.jpeg" alt="Brazilian bikini swimwear lifestyle — Melancia Swim" loading="lazy" decoding="async" style={{ width: '100%', height: 'calc(100% + 200px)', objectFit: 'cover', display: 'block', marginTop: '-200px' }} />
        </div>
        <div className="about-strip-content">
          <h2>Born in Brazil.<br /><em>Made for everywhere.</em></h2>
          <p>
            Melancia started when a Salvadoran fell in love with the way Brazilian women wear a bikini —
            minimal, confident, built to tan in. We brought that cut, that attitude, and those fabrics
            back with us. Everything we make is designed to disappear on your body and show up in every photo.
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
          <h2>Get 15% Off Your First Order</h2>
          <p>Join the list for new drops, exclusive deals, and summer inspo.</p>
          <NewsletterForm source="home-footer" />
        </div>
      </section>
    </>
  )
}
