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

/** Star rating must be between 1 and 5 */
export interface CustomerReview {
  id: number
  name: string
  year: number
  rating: number
  text: string
}
