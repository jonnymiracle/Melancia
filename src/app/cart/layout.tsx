import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your Cart',
  description: 'Review your Melancia swimwear and head to checkout.',
  alternates: {
    canonical: 'https://www.melanciaswim.com/cart',
  },
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children
}
