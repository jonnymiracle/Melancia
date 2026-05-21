'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { NewsletterForm } from '@/components/NewsletterForm'
import { InstagramIcon } from '@/components/icons'

type Slide = { src: string; position: string }

// ── Launch date: this Friday at 12:00 noon ────────────────────────────────────
const LAUNCH_DATE = new Date('2026-05-23T12:00:00')
const INTERVAL = 3500

function getTimeLeft() {
  const diff = LAUNCH_DATE.getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hrs:  Math.floor((diff / (1000 * 60 * 60)) % 24),
    min:  Math.floor((diff / (1000 * 60)) % 60),
  }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export default function ComingSoonClient({ slides }: { slides: Slide[] }) {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(null)
  const [current, setCurrent] = useState(0)
  const [imgReady, setImgReady] = useState(false)

  // Countdown
  useEffect(() => {
    setTimeLeft(getTimeLeft())
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  // Slideshow — true cross-fade, no blackout
  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % slides.length)
    }, INTERVAL)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <div className="cs-page">
      {/* Loading screen — hides once first image is ready */}
      <div className={`cs-loader${imgReady ? ' cs-loader--hide' : ''}`}>
        <Image
          src="/images/Logo original colors.png"
          alt="Melancia Swim"
          width={160}
          height={0}
          style={{ height: 'auto' }}
          priority
        />
      </div>

      {/* Slideshow background */}
      <div className="cs-bg">
        {slides.map(({ src, position }, i) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            onLoad={i === 0 ? () => setImgReady(true) : undefined}
            style={{
              objectFit: 'cover',
              objectPosition: position,
              transition: 'opacity 0.6s ease',
              opacity: i === current ? 1 : 0,
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
          </div>
        )}

        {/* Email capture */}
        <div className="cs-form-wrap">
          <NewsletterForm
            source="coming-soon"
            placeholder="First buyers get a gift. Drop your email."
            buttonLabel="Get ready for tanning"
          />
        </div>

        {/* Instagram */}
        <a
          className="cs-insta"
          href="https://www.instagram.com/melanciaswim/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <InstagramIcon size={13} /> @melanciaswim
        </a>
      </div>
    </div>
  )
}
