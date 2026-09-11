export interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number
  badge?: 'new' | 'sale'
  colors: string[]
  placeholderClass: string
  image?: string
  tags: string[]
}

export interface Retailer {
  id: number
  name: string
  address: string
  type: 'online' | 'in-store'
}

export interface Testimonial {
  id: number
  text: string
  author: string
  rating: number
}

// Las reseñas reales llegarán desde una app de reviews (Judge.me / Loox), que
// trae sus propios tipos. No definimos una forma local para evitar que alguien
// vuelva a poblarla a mano: una reseña escrita por nosotros es un testimonio
// fabricado bajo la regla de la FTC vigente desde el 21/10/2024.
