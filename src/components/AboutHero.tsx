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

      <div className="about-page-hero-overlay" style={{ textAlign: 'center', position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: 'none' }}>
        <h1 style={{ textTransform: 'uppercase', margin: 0 }}>Melancia Swim</h1>
      </div>
    </section>
  )
}
