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
