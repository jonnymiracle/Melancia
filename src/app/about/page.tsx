import Link from 'next/link'
import { InstagramIcon } from '@/components/icons'
import { SITE_WHATSAPP_HREF, SITE_EMAIL_MAILTO } from '@/lib/site-contact'

export const metadata = {
  title: 'Our Story',
  description: 'Melancia was born from a love for the sea, sun, and self-expression. Discover the story behind our free-spirited swimwear brand.',
}

const VALUES = [
  {
    icon: '~',
    label: 'Chlorine-Resistant',
    body: 'Built to last through pool and ocean — our fabrics hold their color and shape season after season.',
  },
  {
    icon: '◎',
    label: 'UV Protection',
    body: 'UPF 50+ on select styles. Sun-proof so you can stay out longer and worry less.',
  },
  {
    icon: '↻',
    label: 'Eco Fabric',
    body: 'We use materials made from recycled fibers — because the ocean deserves to be protected, not just worn.',
  },
  {
    icon: '⊟',
    label: 'Inclusive Sizing',
    body: 'Small through Large, designed to flatter every body. More sizes are on the way.',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="about-page-hero">
        <div className="about-page-hero-overlay">
          <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.8)' }}>Our Story</span>
          <h1>Born from the ocean,<br /><em>made for you.</em></h1>
          <p>Melancia is Portuguese for watermelon — and just like the fruit, we're bold, sweet, and made for summer.</p>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="section about-page-story">
        <div className="about-page-story-grid">
          <div className="about-page-story-image">
            <div className="about-strip-image-placeholder about-ph" style={{ height: 420, borderRadius: 20 }}>
              <span className="placeholder-label">Founder photo</span>
              <small style={{ opacity: 0.6, fontSize: '0.7rem' }}>public/images/founder.jpg</small>
            </div>
          </div>
          <div className="about-page-story-text">
            <span className="eyebrow">How it started</span>
            <h2>A love letter to the sea.</h2>
            <p>
              Melancia was born out of a deep love for the sea, the sun, and the feeling of being
              completely free. We wanted swimwear that matched that energy — bold colors, feminine
              shapes, and quality that actually lasts beyond one summer.
            </p>
            <p>
              Every piece is designed to move with you, not against you. From beach to brunch,
              from the pool to the party — Melancia is built for the girl who lives life in full color.
            </p>
            <p>
              We're a small, passionate team and we put everything into every stitch. When you wear
              Melancia, you're wearing something made with real care.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
              <Link href="/shop" className="btn btn-primary">Shop the Collection</Link>
              <Link href="/contact" className="btn btn-outline">Get in Touch</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="section" style={{ background: 'var(--cream)' }}>
        <div className="section-header">
          <span className="eyebrow">What we stand for</span>
          <h2>Our Values</h2>
        </div>
        <div className="about-values-grid">
          {VALUES.map(v => (
            <div key={v.label} className="about-values-card">
              <span className="about-values-icon">{v.icon}</span>
              <h3>{v.label}</h3>
              <p>{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="about-page-cta">
        <div className="section-header">
          <span className="eyebrow">@melanciaswim</span>
          <h2>Follow our journey</h2>
          <p>Behind-the-scenes, new drops, and summer vibes — all on Instagram.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
            <a
              href="https://www.instagram.com/melanciaswim/"
              target="_blank"
              rel="noopener"
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <InstagramIcon size={18} /> Follow on Instagram
            </a>
            <a href={SITE_WHATSAPP_HREF} target="_blank" rel="noopener" className="btn btn-outline">
              WhatsApp us
            </a>
            <a href={SITE_EMAIL_MAILTO} className="btn btn-outline">
              Send an email
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
