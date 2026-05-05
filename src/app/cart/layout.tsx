import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your Cart — Melancia',
  description: 'Review your Melancia swimwear and head to checkout.',
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children
}
