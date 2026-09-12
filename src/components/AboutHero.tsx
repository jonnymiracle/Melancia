'use client'

import { useEffect, useRef, useState } from 'react'
import PageLoader from '@/components/PageLoader'

/** readyState the browser reports when `canplay` fires. */
const HAVE_FUTURE_DATA = 3

/**
 * The curtain stays up until the browser has buffered enough to paint a frame.
 * `canplay` fires on that, well before the whole file has arrived. A decode
 * failure lands on `error`, which lifts the curtain too: better a still hero
 * than a stuck logo.
 *
 * The reel is encoded for the web: no audio track, since the element is muted,
 * and the moov atom sits at the front so the browser can decode without first
 * reading to the end of the file. Re-encode with those two properties intact if
 * the footage is ever replaced.
 */
export default function AboutHero() {
  const [ready, setReady] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // On a hard load the browser starts fetching the video from the server-
  // rendered markup, so `canplay` can fire before React hydrates and there is
  // no handler yet to hear it. Ask the element what it already knows.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (video.readyState >= HAVE_FUTURE_DATA || video.error) setReady(true)
  }, [])

  return (
    <>
      <PageLoader ready={ready} maxMs={8000} />

      <section className="about-page-hero about-page-hero--video">
        {/* Video background */}
        <video
          ref={videoRef}
          className="about-hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setReady(true)}
          onError={() => setReady(true)}
        >
          <source src="/videos/MELANCIA-REEL-01.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay so text stays readable */}
        <div className="about-hero-video-overlay" />

        <div className="about-page-hero-overlay" style={{ textAlign: 'center', position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: 'none' }}>
          <h1 style={{ textTransform: 'uppercase', margin: 0, fontSize: 'clamp(0.975rem, 2.06vw, 1.875rem)' }}>Our Story</h1>
        </div>
      </section>
    </>
  )
}
