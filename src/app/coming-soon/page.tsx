'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { NewsletterForm } from '@/components/NewsletterForm'

// ── Change this to your real launch date ──────────────────────────────────────
const LAUNCH_DATE = new Date('2026-07-01T00:00:00')

// ── Slideshow slides (same images as hero) ────────────────────────────────────
const SLIDES = [
  { src: '/images/Fotos hero/image00002.jpeg', position: 'center center' },
  { src: '/images/Fotos hero/image00005.jpeg', position: 'center center' },
  { src: '/images/Fotos hero/image00006.jpeg', position: 'center top' },
  { src: '/images/Fotos hero/image00008.jpeg', position: 'center top' },
]
const INTERVAL = 5000

function getTimeLeft() {
  const diff = LAUNCH_DATE.getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hrs:  Math.floor((diff / (1000 * 60 * 60)) % 24),
    min:  Math.floor((diff / (1000 * 60)) % 60),
    sec:  Math.floor((diff / 1000) % 60),
  }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export default function ComingSoonPage() {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(null)
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)

  // Countdown
  useEffect(() => {
    setTimeLeft(getTimeLeft())
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  // Slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setCurrent(c => (c + 1) % SLIDES.length)
        setFading(false)
      }, 600)
    }, INTERVAL)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="cs-page">
      {/* Slideshow background */}
      <div className="cs-bg">
        {SLIDES.map(({ src, position }, i) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            style={{
              objectFit: 'cover',
              objectPosition: position,
              transition: 'opacity 0.6s ease',
              opacity: i === current ? (fading ? 0 : 1) : 0,
            }}
          />
        ))}
        <div className="cs-overlay" />
      </div>

      {/* Centered content */}
      <div className="cs-center">
        {/* Logo */}
        <div className="cs-logo">
          <Image
            src="/images/Logo original colors.png"
            alt="Melancia Swim"
            width={160}
            height={0}
            style={{ height: 'auto' }}
            priority
          />
        </div>

        {/* Countdown */}
        {timeLeft !== null && (
          <div className="cs-countdown" aria-label="Countdown to launch">
            <div className="cs-unit">
              <span className="cs-number">{pad(timeLeft.days)}</span>
              <span className="cs-unit-label">days</span>
            </div>
            <span className="cs-sep" aria-hidden="true">:</span>
            <div className="cs-unit">
              <span className="cs-number">{pad(timeLeft.hrs)}</span>
              <span className="cs-unit-label">hrs</span>
            </div>
            <span className="cs-sep" aria-hidden="true">:</span>
            <div className="cs-unit">
              <span className="cs-number">{pad(timeLeft.min)}</span>
              <span className="cs-unit-label">min</span>
            </div>
            <span className="cs-sep" aria-hidden="true">:</span>
            <div className="cs-unit">
              <span className="cs-number">{pad(timeLeft.sec)}</span>
              <span className="cs-unit-label">sec</span>
            </div>
          </div>
        )}

        {/* Email capture */}
        <div className="cs-form-wrap">
          <NewsletterForm source="coming-soon" />
        </div>

        {/* Instagram */}
        <a
          className="cs-insta"
          href="https://www.instagram.com/melanciaswim/"
          target="_blank"
          rel="noopener noreferrer"
        >
          @melanciaswim
        </a>
      </div>
    </div>
  )
}
