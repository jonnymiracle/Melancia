import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bikini & Swimwear Size Guide',
  description: 'Find your perfect fit with the Melancia Swim size guide. Sizing charts for Brazilian bikini tops, bottoms, and one-pieces — designed for tanning and flattering every body.',
  alternates: {
    canonical: 'https://melanciaswim.com/size-guide',
  },
  openGraph: {
    title: 'Bikini & Swimwear Size Guide | Melancia Swim',
    description: 'Find your perfect bikini and swimwear size with the Melancia Swim size guide — tops, bottoms, and one-pieces.',
    url: 'https://melanciaswim.com/size-guide',
  },
}

export default function SizeGuideLayout({ children }: { children: React.ReactNode }) {
  return children
}
