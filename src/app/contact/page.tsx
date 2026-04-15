'use client'

import { useState } from 'react'
import Link from 'next/link'
import { EnvelopeIcon, PhoneIcon, MapPinIcon, ClockIcon, InstagramIcon, TikTokIcon, PinterestIcon, GlobeIcon, MapPinIcon as StoreIcon, PlusIcon } from '@/components/icons'

const INSTAGRAM = 'https://www.instagram.com/YOUR_HANDLE'
const TIKTOK    = 'https://www.tiktok.com/@YOUR_HANDLE'
const PINTEREST = 'https://www.pinterest.com/YOUR_HANDLE'

const faqs = [
  { q: 'How do I know what size to order?', a: 'We recommend checking our Size Guide before ordering. Our swimwear generally runs true to size, but if you\'re between sizes we suggest sizing up for tops and down for bottoms.' },
  { q: 'Do you ship internationally?', a: 'Yes! We ship worldwide. Standard international shipping takes 7–14 business days. Free shipping applies to all orders over $80 within the US, and over $120 internationally.' },
  { q: 'What is your return policy?', a: 'We accept returns within 30 days of delivery, provided items are unworn, unwashed, and have all original tags attached. Swimwear must have the hygiene liner intact. Sale items are final sale.' },
  { q: 'How do I care for my swimwear?', a: 'Rinse in cold fresh water after each use. Hand wash with mild soap and lay flat to dry away from direct sunlight. Avoid wringing or machine washing to preserve shape and color.' },
  { q: 'Can I collaborate or become an affiliate?', a: 'Absolutely! We love working with content creators who align with our brand values. Send us a message via the contact form with your social handles and we\'ll be in touch.' },
]

const retailers = [
  { icon: <GlobeIcon />, name: 'Our Online Store', detail: 'Shop the full collection at melanciaswim.com — ships worldwide.', badge: 'Online', online: true },
  { icon: <GlobeIcon />, name: 'Amazon', detail: 'Selected styles available on Amazon with Prime shipping.', badge: 'Online', online: true },
  { icon: <StoreIcon />, name: 'Beach Boutique Miami', detail: '123 Ocean Drive, South Beach, Miami, FL 33139', badge: 'In-Store', online: false },
  { icon: <StoreIcon />, name: 'Sol & Mar Resort Wear', detail: '456 Collins Ave, Miami Beach, FL 33140', badge: 'In-Store', online: false },
  { icon: <StoreIcon />, name: 'Tropic Threads', detail: '789 Brickell Ave, Miami, FL 33131', badge: 'In-Store', online: false },
  { icon: <PlusIcon />, name: 'Become a Stockist', detail: 'Interested in carrying Melancia? We\'d love to work with you.', badge: 'Get in Touch', online: true },
]

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 6000)
  }

  return (
    <>
      {/* Hero */}
      <div className="contact-hero">
        <h1>Get in Touch</h1>
        <p>We&apos;d love to hear from you — questions, collaborations, or just to say hi!</p>
      </div>

      {/* Contact Layout */}
      <div className="contact-layout">
        {/* Left: Info */}
        <div className="contact-info">
          <h2>Let&apos;s connect</h2>
          <p>Whether you have questions about sizing, want to know where to find us, or are interested in stocking Melancia — we&apos;re here for it. We&apos;ll get back to you within 24 hours.</p>

          <div className="contact-cards">
            {[
              { icon: <EnvelopeIcon />, title: 'Email Us', main: 'hello@melanciaswim.com', sub: 'We reply within 24 hours', href: 'mailto:hello@melanciaswim.com' },
              { icon: <PhoneIcon />, title: 'WhatsApp / Phone', main: '+1 (234) 567-890', sub: 'Mon–Fri, 9am – 6pm', href: 'tel:+1234567890' },
              { icon: <MapPinIcon />, title: 'Based In', main: 'Miami, Florida — USA', sub: 'Shipping worldwide' },
              { icon: <ClockIcon />, title: 'Response Time', main: 'Within 24 business hours', sub: 'Faster via Instagram DM' },
            ].map(card => (
              <div key={card.title} className="contact-card">
                <div className="contact-card-icon">{card.icon}</div>
                <div>
                  <h4>{card.title}</h4>
                  {card.href ? <a href={card.href}>{card.main}</a> : <p>{card.main}</p>}
                  <p style={{ fontSize: '0.78rem', color: 'var(--mid)', marginTop: 2 }}>{card.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="contact-socials">
            <h3>Follow Us</h3>
            <div className="contact-social-links">
              <a href={INSTAGRAM} target="_blank" rel="noopener" className="contact-social-link">
                <InstagramIcon size={16} /> Instagram
              </a>
              <a href={TIKTOK} target="_blank" rel="noopener" className="contact-social-link">
                <TikTokIcon size={16} /> TikTok
              </a>
              <a href={PINTEREST} target="_blank" rel="noopener" className="contact-social-link">
                <PinterestIcon size={16} /> Pinterest
              </a>
            </div>
          </div>

          <div className="map-placeholder">
            <MapPinIcon size={36} />
            <h4>Miami, Florida</h4>
            <p>Replace this with a Google Maps iframe.</p>
          </div>
        </div>

        {/* Right: Form */}
        <div className="contact-form-wrapper" id="contactForm">
          <h3>Send us a message</h3>
          <p>Fill in the form below and we&apos;ll get back to you shortly.</p>

          {submitted && (
            <div className="form-success show">
              Message sent! We&apos;ll be in touch within 24 hours.
            </div>
          )}

          {/*
            FORMSPREE: Replace YOUR_FORMSPREE_ID with your code from formspree.io
            Change action to: https://formspree.io/f/YOUR_FORMSPREE_ID
          */}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input id="firstName" type="text" placeholder="Sofia" required />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input id="lastName" type="text" placeholder="Martinez" required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input id="email" type="email" placeholder="sofia@example.com" required />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone / WhatsApp (optional)</label>
              <input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <select id="subject" required defaultValue="">
                <option value="" disabled>Select a topic…</option>
                {['Order Question', 'Sizing Help', 'Returns & Exchanges', 'Wholesale / Stockist Inquiry', 'Press & Collaboration', 'Other'].map(o => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea id="message" placeholder="Tell us how we can help…" required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* ── Where We Sell ── */}
      <section className="where-we-sell">
        <div className="section-header" style={{ textAlign: 'left', marginBottom: 40 }}>
          <span className="eyebrow">Find Us</span>
          <h2>Where to Buy Melancia</h2>
          <p style={{ textAlign: 'left', margin: 0 }}>Shop online or visit one of our stockists near you.</p>
        </div>
        <div className="retailers-grid">
          {retailers.map(r => (
            <div key={r.name} className="retailer-card">
              <div className="retailer-icon" style={{ color: 'var(--coral)' }}>{r.icon}</div>
              <h4>{r.name}</h4>
              <p>{r.detail}</p>
              <span className={`retailer-badge${r.online ? ' online' : ''}`}>{r.badge}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '80px 48px' }}>
        <div className="section-header" style={{ textAlign: 'left', marginBottom: 32 }}>
          <span className="eyebrow">Quick Answers</span>
          <h2>Frequently Asked Questions</h2>
        </div>
        {faqs.map((faq, i) => (
          <div key={i} className={`faq-item${openFaq === i ? ' open' : ''}`}>
            <div className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <h4>{faq.q}</h4>
              <span className="faq-toggle">+</span>
            </div>
            <div className="faq-answer">
              <p>{faq.a}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Newsletter */}
      <section className="newsletter-section">
        <h2>Stay in the Loop</h2>
        <p>New drops, exclusive deals, and summer vibes — straight to your inbox.</p>
        <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
          <input type="email" placeholder="Your email address" aria-label="Email" />
          <button type="submit">Subscribe</button>
        </form>
      </section>
    </>
  )
}
