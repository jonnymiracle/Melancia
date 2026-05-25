'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { NewsletterForm } from '@/components/NewsletterForm'
import { EnvelopeIcon, PhoneIcon, MapPinIcon, ClockIcon, InstagramIcon, GlobeIcon } from '@/components/icons'
import {
  SITE_EMAIL,
  SITE_EMAIL_MAILTO,
  SITE_WHATSAPP_DISPLAY,
  SITE_WHATSAPP_HREF,
  SITE_WHATSAPP2_DISPLAY,
  SITE_WHATSAPP2_HREF,
} from '@/lib/site-contact'

const INSTAGRAM = 'https://www.instagram.com/melanciaswim'

const retailers = [
  { icon: <GlobeIcon />, name: 'Our Online Store', detail: 'Browse and shop the full Melancia collection.', badge: 'Shop Now', online: true, href: '/shop' },
  { icon: <PhoneIcon />, name: 'WhatsApp (SV)', detail: 'Message us directly — we reply fast.', badge: 'Message Us', online: true, href: SITE_WHATSAPP_HREF },
  { icon: <PhoneIcon />, name: 'WhatsApp (US)', detail: 'Message us from the US.', badge: 'Message Us', online: true, href: SITE_WHATSAPP2_HREF },
  { icon: <InstagramIcon size={24} />, name: 'Instagram', detail: 'Slide into our DMs on @melanciaswim.', badge: 'Send a DM', online: true, href: 'https://ig.me/m/melanciaswim' },
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(false)
    const fd = new FormData(e.currentTarget)
    const body = {
      firstName: fd.get('firstName'),
      lastName: fd.get('lastName'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      subject: fd.get('subject'),
      message: fd.get('message'),
    }
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed')
      setSubmitted(true)
      formRef.current?.reset()
      setTimeout(() => setSubmitted(false), 6000)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Hero */}
      <div className="contact-hero">
        <Image
          src="/images/Brand Photo/book.JPG"
          alt="Melancia Swim"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
          sizes="100vw"
          priority
        />
        <div className="contact-hero-overlay" />
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
              { icon: <EnvelopeIcon />, title: 'Email Us', main: SITE_EMAIL, sub: 'We reply within 24 hours', href: SITE_EMAIL_MAILTO },
              { icon: <PhoneIcon />, title: 'WhatsApp (SV)', main: SITE_WHATSAPP_DISPLAY, sub: 'Message us anytime', href: SITE_WHATSAPP_HREF },
              { icon: <PhoneIcon />, title: 'WhatsApp (US)', main: SITE_WHATSAPP2_DISPLAY, sub: 'Message us anytime', href: SITE_WHATSAPP2_HREF },
              { icon: <MapPinIcon />, title: 'Based In', main: 'Puerto Rico & El Salvador', sub: 'Shipping within the USA' },
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
            </div>
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

          {error && (
            <div className="form-success show" style={{ background: '#fee2e2', color: '#b91c1c' }}>
              Something went wrong. Please try again or email us directly.
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input id="firstName" name="firstName" type="text" placeholder="Sofia" required />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input id="lastName" name="lastName" type="text" placeholder="Martinez" required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input id="email" name="email" type="email" placeholder="sofia@example.com" required />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone / WhatsApp (optional)</label>
              <input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <select id="subject" name="subject" required defaultValue="">
                <option value="" disabled>Select a topic…</option>
                {['Order Question', 'Sizing Help', 'Returns & Exchanges', 'Wholesale / Stockist Inquiry', 'Press & Collaboration', 'Other'].map(o => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea id="message" name="message" placeholder="Tell us how we can help…" required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>

      {/* ── Where We Sell ── */}
      <section className="where-we-sell">
        <div className="section-header" style={{ textAlign: 'left', marginBottom: 40 }}>
          <span className="eyebrow">Find Us</span>
          <h2>Ways to reach us</h2>
          <p style={{ textAlign: 'left', margin: 0 }}>Shop online or reach out directly — we&apos;re always happy to help.</p>
        </div>
        <div className="retailers-grid">
          {retailers.map(r => (
            <a key={r.name} className="retailer-card" href={r.href} target={r.href.startsWith('http') ? '_blank' : undefined} rel={r.href.startsWith('http') ? 'noopener' : undefined} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div className="retailer-icon" style={{ color: 'var(--coral)' }}>{r.icon}</div>
              <h4>{r.name}</h4>
              <p>{r.detail}</p>
              <span className="retailer-badge online">{r.badge}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section">
        <h2>Stay in the Loop</h2>
        <p>New drops, exclusive deals, and summer vibes — straight to your inbox.</p>
        <NewsletterForm source="contact-page" />
      </section>
    </>
  )
}
