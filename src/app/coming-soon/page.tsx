import fs from 'fs'
import path from 'path'
import ComingSoonClient from './ComingSoonClient'

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif'])

// Desktop focus per filename
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

// Mobile-specific overrides — only add entries that differ from desktop or are new
const MOBILE_POSITION_MAP: Record<string, string> = {
  'IMG_3576.JPG':    'calc(50% - 300px) center',
  'IMG_3580.JPG':    'left center',
  'IMG_3582.JPG':    'left center',
  'IMG_3586.JPG':    'left center',
  'IMG_3589.JPG':    'center bottom',
  'image00005.jpg':  'calc(50% - 200px) center',
  'image00005.jpeg': 'calc(50% - 200px) center',
  'image00002.jpg':  'calc(50% + 20px) center',
  'image00002.jpeg': 'calc(50% + 20px) center',
}

export default function ComingSoonPage() {
  const dir = path.join(process.cwd(), 'public', 'images', 'Fotos hero')

  let slides: { src: string; position: string; mobilePosition: string }[] = []

  try {
    slides = fs
      .readdirSync(dir)
      .filter(f => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))
      .sort()
      .map(f => ({
        src: `/images/Fotos hero/${f}`,
        position:       POSITION_MAP[f]        ?? 'center center',
        mobilePosition: MOBILE_POSITION_MAP[f] ?? POSITION_MAP[f] ?? 'center center',
      }))
  } catch {
    // folder missing at build time — fall back to empty (won't crash)
  }

  return <ComingSoonClient slides={slides} />
}
