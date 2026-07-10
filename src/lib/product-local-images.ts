export type LocalImage = {
  src: string
  position: string
  altText: string | null
}

export type LocalImageSet = {
  images: LocalImage[]
}

const TC = '/images/title cards'

function tc(file: string): LocalImage {
  return { src: `${TC}/${file}`, position: 'center center', altText: null }
}

export const PRODUCT_LOCAL_IMAGES: Record<string, LocalImageSet> = {

  // ── Grumari Sol ──────────────────────────────────────────────────────────
  'grumari-sol-top:Areia': { images: [tc('Grumarie Areia.jpeg')] },
  'grumari-sol-top:Coco':  { images: [tc('Grumarie Coco 1.jpeg'), tc('Grumarie Coco 2.jpeg')] },
  'grumari-sol-top:Mar':   { images: [tc('Grumari mar.jpeg')] },

  // ── Ipanema Luz ──────────────────────────────────────────────────────────
  'ipanema-luz-top:Dragon Fruit': { images: [tc('ipanema luz dragon fruit.jpeg')] },

  // ── Pedra do Sal ─────────────────────────────────────────────────────────
  'pedra-do-sal-top:Ceu':             { images: [tc('pedra do sal ceu.jpeg')] },
  'pedra-do-sal-top:Carioca':         { images: [tc('Carioca.jpeg')] },
  'pedra-do-sal-top:Zebra pastel':    { images: [tc('zebra pastel.jpeg')] },
  'pedra-do-sal-top:Zebra Vermelhia': { images: [tc('Zebra Vermelha.jpeg')] },
  'pedra-do-sal-top:Azulejos Baianos':{ images: [tc('Azulejo Bahiano.jpeg')] },
  'pedra-do-sal-top:Zebra Areia':     { images: [tc('Zebra areia 1.jpeg'), tc('zebra areia 2.jpeg')] },
  'pedra-do-sal-top:Creme de limão':  { images: [tc('Pedra do Sal Amarelho.jpeg')] },

  // ── Onça ─────────────────────────────────────────────────────────────────
  'onca:__default__':   { images: [tc('onca.jpeg')] },

  // ── Tijuca ───────────────────────────────────────────────────────────────
  'tijuca:__default__': { images: [tc('Tijuca.jpeg')] },
}
