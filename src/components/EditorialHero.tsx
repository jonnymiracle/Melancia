import Image from 'next/image'
import Link from 'next/link'

// Editorial gallery — the hero photos presented as floating framed
// "windows" on a white canvas, varied proportions for an asymmetric,
// magazine-like rhythm. Tweak `ar` to change a frame's shape:
//   'portrait' 3/4 · 'tall' 2/3 · 'land' 4/3 · 'square' 1/1
const GALLERY: { src: string; caption: string; ar: 'portrait' | 'tall' | 'land' | 'square'; pos?: string }[] = [
  { src: '/images/Fotos hero/image00002.jpg', caption: 'Sol de Ipanema',        ar: 'tall',     pos: 'center center' },
  { src: '/images/Fotos hero/IMG_3575.JPG',   caption: 'Carioca',                ar: 'portrait', pos: 'center top' },
  { src: '/images/Fotos hero/image00005.jpg', caption: 'Bold & minimal',         ar: 'portrait', pos: 'center center' },
  { src: '/images/Fotos hero/IMG_3579.JPG',   caption: 'Designed for tanning',   ar: 'land',     pos: 'center center' },
  { src: '/images/Fotos hero/image00006.jpg', caption: 'Born in Brazil',         ar: 'portrait', pos: 'center top' },
  { src: '/images/Fotos hero/IMG_3582.JPG',   caption: 'Pedra do Sal',           ar: 'tall',     pos: 'center top' },
  { src: '/images/Fotos hero/image00008.jpeg',caption: 'Summer, always',         ar: 'portrait', pos: 'center top' },
  { src: '/images/Fotos hero/IMG_3586.JPG',   caption: 'Arpoador',               ar: 'square',   pos: 'center center' },
  { src: '/images/Fotos hero/IMG_3590.JPG',   caption: 'Melancia',               ar: 'portrait', pos: 'center center' },
]

export default function EditorialHero() {
  return (
    <section className="editorial-hero">
      {/* Giant serif display title — the artistic anchor */}
      <h1 className="editorial-hero-title">Melancia</h1>
      <p className="editorial-hero-subtitle">Brazilian Swimwear — Designed for Tanning</p>

      {/* Asymmetric gallery of framed windows */}
      <div className="editorial-gallery">
        {GALLERY.map(({ src, caption, ar, pos }, i) => (
          <figure key={src} className="editorial-figure">
            <div className={`editorial-frame ar-${ar}`}>
              <Image
                src={src}
                alt={caption}
                fill
                priority={i < 2}
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 320px"
                style={{ objectFit: 'cover', objectPosition: pos ?? 'center center' }}
              />
            </div>
            <figcaption className="editorial-figcaption">
              <span>{caption}</span>
              <span className="editorial-figindex">{String(i + 1).padStart(2, '0')}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <Link href="/shop" className="editorial-hero-link">
        Shop the Collection
      </Link>
    </section>
  )
}
