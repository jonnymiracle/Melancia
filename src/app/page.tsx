import Link from 'next/link'
import Image from 'next/image'
import ProductCard3 from '@/components/ProductCard3'
import { NewsletterForm } from '@/components/NewsletterForm'
import { InstagramIcon } from '@/components/icons'
import AnnouncementBar from '@/components/AnnouncementBar'
import HeroSlideshow from '@/components/HeroSlideshow'
import { SOL_DE_IPANEMA_SLUG } from '@/lib/shop-collections'
import { featuredProducts } from '@/data/products'
import { fetchStorefrontProducts } from '@/lib/shopify-products'
import type { ProductCard3Product } from '@/types/shopify'

const INSTAGRAM = 'https://www.instagram.com/melanciaswim/'

/** Always fetch fresh Shopify data; avoid static page cache with stale products/images. */
export const dynamic = 'force-dynamic'

/** Matches the number of cards in `featuredProducts` (local fallback). */
const FEATURED_ON_HOME = featuredProducts.length

export default async function HomePage() {
  let homeFeatured: ProductCard3Product[] = featuredProducts

  try {
    const fromShopify = await fetchStorefrontProducts(FEATURED_ON_HOME)
    if (fromShopify.length > 0) {
      homeFeatured = fromShopify.slice(0, FEATURED_ON_HOME)
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
      <section className="section" id="featured" style={{ paddingTop: 40, paddingBottom: 40 }}>
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
          <img src="/images/photos bottom hero/wheelbarrow.jpeg" alt="Melancia swimwear lifestyle" style={{ width: '100%', height: 'calc(100% + 200px)', objectFit: 'cover', display: 'block', marginTop: '-200px' }} />
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
          rel="noopener"
          className="btn btn-primary instagram-cta-btn"
        >
          <InstagramIcon size={18} />
          @melanciaswim
        </a>
      </section>

      {/* ── Newsletter ── */}
      <section className="newsletter-section">
        <h2>Get Early Access</h2>
        <p>Be the first to know about new drops, exclusive deals, and summer inspo.</p>
        <NewsletterForm source="home-footer" />
      </section>
    </>
  )
  
}
