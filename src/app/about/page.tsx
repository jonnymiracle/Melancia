import Link from 'next/link'
import Image from 'next/image'
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


export default function AboutPage() {
  return (
    <>
      {/* ── Hero ── */}
      <AboutHero />

      {/* ── Story ── */}
      <section className="section about-page-story">
        <div className="about-page-story-grid">
          <div className="about-page-story-image">
            <div style={{ position: 'relative', height: 420, borderRadius: 20, overflow: 'hidden' }}>
              <Image
                src="/images/Brand Photo/IMG_7518.JPG"
                alt="Melancia Swim — brand photo"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
          <div className="about-page-story-text">
            <h2 className="about-melancia-title">About</h2>
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
        <Image
          src="/images/Get Early Access/Water.JPG"
          alt="Melancia Swim"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          sizes="100vw"
        />
        <div className="about-page-cta-overlay" />
        <div className="section-header" style={{ position: 'relative', zIndex: 2 }}>
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
