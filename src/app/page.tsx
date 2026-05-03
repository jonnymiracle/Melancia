import Link from 'next/link'
import Image from 'next/image'
import ProductCard3 from '@/components/ProductCard3'
import { NewsletterForm } from '@/components/NewsletterForm'
import { InstagramIcon } from '@/components/icons'
import { featuredProducts } from '@/data/products'
import { featuredCustomerReviews } from '@/data/reviews'

const INSTAGRAM = 'https://www.instagram.com/melanciaswim/'

export default function HomePage() {
  return (
    <>
      {/* ── Video Hero ── */}
      <section className="hero-video-section">
        <div className="hero-video-wrap">
          <video autoPlay muted loop playsInline>
            <source src="/videos/MELANCIA-REEL-01.MOV" type="video/mp4" />
          </video>

          <div className="hero-video-overlay">
            <div className="hero-video-text">
              <span className="hero-video-eyebrow">Summer Collection 2025</span>
              <h1 className="hero-video-title">
                Made for <em>tanning,</em> made for you.
              </h1>
              <div className="hero-video-cta">
                <Link href="/shop" className="btn-hero-pill">Shop New Arrivals</Link>
                <a href="#collections" className="btn-hero-pill outline">Explore Collections</a>
              </div>
            </div>
          </div>

          <div className="hero-video-scroll">
            <span>Scroll</span><span>↓</span>
          </div>
        </div>
      </section>

      {/* ── Category Strip ── */}
      <div className="category-strip">
        <Link href="/shop">Tops</Link>
        <Link href="/shop">Bottoms</Link>
        <Link href="/shop">One Pieces</Link>
      </div>

      {/* ── Featured Products ── */}
      <section className="section" id="featured">
        <div className="section-header">
          <span className="eyebrow">Just Dropped</span>
          <h2>New Arrivals</h2>
          <p>Our latest pieces — designed for sunshine, saltwater, and good vibes.</p>
        </div>
        <div className="product-grid">
          {featuredProducts.map(product => (
            <ProductCard3 key={product.id} product={product} />
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link href="/shop" className="btn btn-outline">View All Products</Link>
        </div>
      </section>

      {/* ── Collections ── */}
      <section className="section" id="collections" style={{ background: 'var(--cream)' }}>
        <div className="section-header">
          <span className="eyebrow">Shop By</span>
          <h2>Our Collections</h2>
        </div>
        <div className="collection-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="collection-banner">
              <div className="collection-banner-bg col-ph-1" style={{ height: '100%' }} />
              <div className="collection-banner-overlay">
                <h3>Summer Sets</h3>
                <Link href="/shop" className="collection-banner-link">Shop Now →</Link>
              </div>
            </div>
            <div className="collection-banner">
              <div className="collection-banner-bg col-ph-2" style={{ height: '100%' }} />
              <div className="collection-banner-overlay">
                <h3>Bottoms</h3>
                <Link href="/shop" className="collection-banner-link">Shop Now →</Link>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="collection-banner tall">
              <div className="collection-banner-bg col-ph-3" style={{ height: '100%' }} />
              <div className="collection-banner-overlay">
                <h3>One Pieces</h3>
                <Link href="/shop" className="collection-banner-link">Shop Now →</Link>
              </div>
            </div>
            <div className="collection-banner">
              <div className="collection-banner-bg col-ph-4" style={{ height: '100%' }} />
              <div className="collection-banner-overlay">
                <h3>Cover-Ups</h3>
                <Link href="/shop" className="collection-banner-link">Shop Now →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── About Strip ── */}
      <section className="about-strip">
        <div className="about-strip-image">
          <div className="about-strip-image-placeholder about-ph">
            <span className="placeholder-label">Add lifestyle photo here</span>
            <small style={{ opacity: 0.6, fontSize: '0.7rem' }}>public/images/about.jpg</small>
          </div>
        </div>
        <div className="about-strip-content">
          <span className="eyebrow">Our Story</span>
          <h2>Born from the ocean, <em>made for you.</em></h2>
          <p>
            Melancia (Portuguese for watermelon) was born out of a love for the sea,
            sun, and self-expression. We design swimwear that feels as free-spirited
            as a summer day — bold yet feminine, playful yet refined.
          </p>
          <p>
            Every piece is crafted with care: premium fabrics that hold their shape,
            vibrant colors that don&apos;t fade, and fits that make you feel confident
            from beach to brunch.
          </p>
          <div className="about-features">
            {[
              { label: 'Chlorine-Resistant', sub: 'Built to last through pool and ocean', icon: '~' },
              { label: 'UV Protection', sub: 'UPF 50+ on select styles', icon: '◎' },
              { label: 'Eco Fabric', sub: 'Made from recycled materials', icon: '↻' },
              { label: 'Inclusive Sizing', sub: 'Small – Large, all body types', icon: '⊟' },
            ].map(f => (
              <div key={f.label} className="about-feature">
                <span className="about-feature-icon" style={{ fontSize: '1.2rem', color: 'var(--coral)' }}>{f.icon}</span>
                <div>
                  <h4>{f.label}</h4>
                  <p>{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/contact" className="btn btn-primary">Learn More</Link>
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

      {/* ── Instagram Strip ── */}
      <section className="instagram-strip">
        <div className="section-header">
          <span className="eyebrow">@melanciaswim</span>
          <h2>Find us on Instagram</h2>
          <p>Tag us in your photos for a chance to be featured.</p>
        </div>
        <div className="instagram-grid">
          {['insta-1', 'insta-2', 'insta-3', 'insta-4', 'insta-5', 'insta-6'].map(cls => (
            <a key={cls} href={INSTAGRAM} target="_blank" rel="noopener" className="instagram-item">
              <div className={`instagram-item-placeholder ${cls}`} />
              <div className="instagram-overlay">
                <InstagramIcon size={22} />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="newsletter-section">
        <h2>Get Early Access</h2>
        <p>Be the first to know about new drops, exclusive deals, and summer inspo.</p>
        <NewsletterForm />
      </section>
    </>
  )
  
}
