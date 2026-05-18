import Link from 'next/link'
import { InstagramIcon } from '@/components/icons'
import { SITE_WHATSAPP_HREF, SITE_EMAIL_MAILTO } from '@/lib/site-contact'
import AboutHero from '@/components/AboutHero'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Story — Brazilian Swimwear Born for Tanning',
  description: 'Melancia Swim was born from a love of Brazilian bikini culture — minimal silhouettes, bold colors, designed for tanning. Discover the story behind our swimwear brand, based in Puerto Rico & El Salvador.',
  alternates: {
    canonical: 'https://melanciaswim.com/about',
  },
  openGraph: {
    title: 'Our Story | Melancia Swim — Brazilian Bikini Brand',
    description: 'Born from Brazilian bikini culture. Melancia Swim brings minimal silhouettes and bold colors designed for tanning, from Puerto Rico & El Salvador to the world.',
    url: 'https://melanciaswim.com/about',
  },
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
        <h2 className="about-melancia-title">
          About <span className="about-melancia-sub">Melancia Swim</span>
        </h2>
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
              <InstagramIcon size={18} /> Instagram
            </a>
            <a href={SITE_WHATSAPP_HREF} target="_blank" rel="noopener" className="btn btn-primary">
              WhatsApp
            </a>
            <a href={SITE_EMAIL_MAILTO} className="btn btn-primary">
              Email
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
