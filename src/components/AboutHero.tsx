'use client'

export default function AboutHero() {
  return (
    <section className="about-page-hero about-page-hero--video">
      {/* Video background */}
      <video
        className="about-hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/videos/MELANCIA-REEL-01.MOV" type="video/mp4" />
      </video>

      {/* Dark overlay so text stays readable */}
      <div className="about-hero-video-overlay" />

      <div className="about-page-hero-overlay">
        <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.8)' }}>Our Story</span>
        <h1>Born from the ocean,<br /><em>made for you.</em></h1>
        <p>Born from a love for Brazil&apos;s effortless bikini culture — designed for the sun, the sea, and you.</p>
      </div>
    </section>
  )
}
