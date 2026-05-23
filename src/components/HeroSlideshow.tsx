'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

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
  { src: '/images/Fotos hero/image00002.jpg', position: 'center center', alt: 'Melancia Swim — Brazilian-style bikini designed for tanning' },
  { src: '/images/Fotos hero/image00005.jpg', position: 'center center', alt: 'Small bikini swimwear by Melancia Swim — bold colors and minimal silhouettes' },
  { src: '/images/Fotos hero/image00006.jpg', position: 'center top', alt: 'Brazilian bikini swimwear collection by Melancia Swim' },
  { src: '/images/Fotos hero/image00008.jpeg', position: 'center top', alt: 'Melancia Swim swimwear — tanning bikini from Puerto Rico' },
]

const INTERVAL = 4500 // ms per slide

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length)
    }, INTERVAL)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="hero-video-section">
      <div className="hero-video-wrap">
        {SLIDES.map(({ src, position, alt }, i) => (
          <Image
            key={src}
            src={src}
            alt={alt}
            fill
            priority={i === 0}
            sizes="100vw"
            style={{
              objectFit: 'cover',
              objectPosition: position,
              transition: 'opacity 0.5s ease',
              opacity: i === current ? 1 : 0,
            }}
          />
        ))}

        <div className="hero-video-overlay">
          <div className="hero-video-text">
            <h1 className="hero-video-title">SOL de<br />IPANEMA</h1>
          </div>
          <div className="hero-video-cta">
            <Link href="/shop" className="btn-hero-pill">
              SHOP COLLECTION
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
