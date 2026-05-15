'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SOL_DE_IPANEMA_SLUG } from '@/lib/shop-collections'

// ─────────────────────────────────────────────
// Adjust `position` per slide to control which
// part of the photo shows inside the hero frame.
//
// Common values:
//   'center top'    → show faces / upper body
//   'center center' → show middle of photo
//   'center bottom' → show lower body / legs
//   '30% center'    → shift left/right + center
// ─────────────────────────────────────────────
const SLIDES = [
  { src: '/images/Fotos hero/image00002.jpeg', position: 'center center' },
  { src: '/images/Fotos hero/image00005.jpeg', position: 'center center' },
  { src: '/images/Fotos hero/image00006.jpeg', position: 'center top' },
  { src: '/images/Fotos hero/image00008.jpeg', position: 'center top' },
]

const INTERVAL = 4500 // ms per slide

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % SLIDES.length)
        setFading(false)
      }, 500)
    }, INTERVAL)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="hero-video-section">
      <div className="hero-video-wrap">
        {SLIDES.map(({ src, position }, i) => (
          <Image
            key={src}
            src={src}
            alt={`Melancia swimwear ${i + 1}`}
            fill
            priority={i === 0}
            sizes="100vw"
            style={{
              objectFit: 'cover',
              objectPosition: position,
              transition: 'opacity 0.5s ease',
              opacity: i === current ? (fading ? 0 : 1) : 0,
            }}
          />
        ))}

        <div className="hero-video-overlay">
          <div className="hero-video-text">
            <h1 className="hero-video-title">SOL de<br />IPANEMA</h1>
          </div>
          <div className="hero-video-cta">
            <Link href={`/shop?collection=${SOL_DE_IPANEMA_SLUG}`} className="btn-hero-pill">
              SHOP COLLECTION
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
