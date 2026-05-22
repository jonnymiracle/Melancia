import fs from 'fs'
import path from 'path'
import ComingSoonClient from './ComingSoonClient'

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif'])

// Default vertical focus per filename — add entries here to fine-tune any image
const POSITION_MAP: Record<string, string> = {
  'image00006.jpg':  'center top',
  'image00006.jpeg': 'center top',
  'image00008.jpeg': 'center top',
  'IMG_3576.JPG':    'right center',
  'IMG_3579.JPG':    'center bottom',
  'IMG_3580.JPG':    'left center',
  'IMG_3582.JPG':    'left center',
  'IMG_3586.JPG':    'left center',
  'IMG_3589.JPG':    'center bottom',
  'IMG_3590.JPG':    'center bottom',
}

export default function ComingSoonPage() {
  const dir = path.join(process.cwd(), 'public', 'images', 'Fotos hero')

  let slides: { src: string; position: string }[] = []

  try {
    slides = fs
      .readdirSync(dir)
      .filter(f => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))
      .sort()
      .map(f => ({
        src: `/images/Fotos hero/${f}`,
        position: POSITION_MAP[f] ?? 'center center',
      }))
  } catch {
    // folder missing at build time — fall back to empty (won't crash)
  }

  return <ComingSoonClient slides={slides} />
}
