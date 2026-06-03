import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import ProductCard3 from '@/components/ProductCard3'
import { NewsletterForm } from '@/components/NewsletterForm'
import { InstagramIcon } from '@/components/icons'
import AnnouncementBar from '@/components/AnnouncementBar'
import HeroSlideshow from '@/components/HeroSlideshow'
import { featuredProducts } from '@/data/products'
import { fetchBestSellingProducts } from '@/lib/shopify-products'
import type { ProductCard3Product } from '@/types/shopify'

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

/** Always fetch fresh Shopify data; avoid static page cache with stale products/images. */
export const dynamic = 'force-dynamic'

const FEATURED_ON_HOME = 6

export default async function HomePage() {
  let homeFeatured: ProductCard3Product[] = featuredProducts.slice(0, FEATURED_ON_HOME)

  try {
    const fromShopify = await fetchBestSellingProducts(FEATURED_ON_HOME)
    if (fromShopify.length > 0) {
      homeFeatured = fromShopify
    }
  } catch {
    /* missing env or network — keep static featuredProducts */
  }

  return (
    <>
      {/* ── Hero Slideshow ── */}
      <HeroSlideshow />

      {/* ── Announcement Bar (below hero) ── */}
      <div className="announcement-bar-below-hero">
        <AnnouncementBar />
      </div>

      {/* ── Featured Products ── */}
      <section className="section section-featured" id="featured">
        <div className="product-grid">
          {homeFeatured.map(product => (
            <ProductCard3 key={product.id} product={product} />
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

      {/* ── Testimonials ── */}
      {/* <section className="testimonials-section">
        <div className="section-header">
          <span className="eyebrow">Reviews</span>
          <h2>What Our Girls Are Saying</h2>
        </div>
        <div className="testimonials-grid">
          {featuredCustomerReviews.map((review) => (
            <div key={review.id} className="testimonial-card">
              <div className="testimonial-stars" aria-hidden>
                {'★'.repeat(review.rating)}
              </div>
              <p className="testimonial-text">&ldquo;{review.text}&rdquo;</p>
              <span className="testimonial-author">
                — {review.name}
                <span style={{ opacity: 0.65, fontWeight: 400 }}> · {review.year}</span>
              </span>
            </div>
          ))}
        </div>
      </section> */}

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
