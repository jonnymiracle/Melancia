import Link from 'next/link'
import { InstagramIcon } from '@/components/icons'
import { SITE_WHATSAPP_HREF, SITE_EMAIL_MAILTO } from '@/lib/site-contact'
import AboutHero from '@/components/AboutHero'

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
      <AboutHero />

      {/* ── Story ── */}
      <section className="section about-page-story">
        <h2 className="about-melancia-title">About Melancia</h2>
        <div className="about-page-story-grid">
          <div className="about-page-story-image">
            <div className="about-strip-image-placeholder about-ph" style={{ height: 420, borderRadius: 20 }}>
              <span className="placeholder-label">Brand photo</span>
              <small style={{ opacity: 0.6, fontSize: '0.7rem' }}>public/images/about.jpg</small>
            </div>
          </div>
          <div className="about-page-story-text">
            <p>
              Designed especially for tanning, Melancia was created with the intention of bringing
              the heart and style of Brazil to the world. The brand was born from my own experience
              as a Salvadoran who fell in love with Brazil&apos;s effortless bikini culture — from
              the minimal silhouettes to the colors, the music, and the energy.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
              <Link href="/shop" className="btn btn-primary">Shop the Collection</Link>
              <Link href="/contact" className="btn btn-outline">Get in Touch</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Collab Quote ── */}
      <section className="about-collab-section">
        <div className="about-collab-overlay" />
        <p className="about-collab-text">
          Each bikini is made in collaboration with Brazilian women designers, creating unique
          pieces that carry the Carioca spirit. There&apos;s something special about wearing a
          Brazilian bikini paired with sun-kissed skin — it becomes more than a look, it&apos;s a feeling.
        </p>
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
