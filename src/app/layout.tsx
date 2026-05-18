import type { Metadata } from 'next'
import { Lora, Playfair_Display, Poppins } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import PageLoader from '@/components/PageLoader'
import EngagementPopover from '@/components/EngagementPopover'
import BackgroundDecor from '@/components/BackgroundDecor'
import { brandTabIconHref } from '@/components/icons'

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-lora',
  display: 'swap',
})
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://melanciaswim.com'),
  title: {
    default: 'Melancia Swim | Brazilian Bikinis & Swimwear',
    template: '%s | Melancia Swim',
  },
  description: 'Shop Brazilian-style bikinis and swimwear designed for tanning. Melancia Swim offers small bikinis, bold colors, and minimal silhouettes — shipped within the USA. Based in Puerto Rico & El Salvador.',
  keywords: [
    'bikini',
    'Brazilian style bikini',
    'swimwear',
    'small bikini',
    'tanning',
    'melancia',
    'bikini puerto rico',
    'Brazilian bikini',
    'women swimwear',
    'beachwear',
    'swimsuit',
    'Sol de Ipanema',
    'Melancia Swim',
    'minimal bikini',
    'cheeky bikini',
    'summer swimwear',
  ],
  openGraph: {
    type: 'website',
    siteName: 'Melancia Swim',
    url: 'https://melanciaswim.com',
    title: 'Melancia Swim | Brazilian Bikinis & Swimwear',
    description: 'Shop Brazilian-style bikinis and swimwear designed for tanning. Bold colors, minimal silhouettes — shipped within the USA.',
    images: [{ url: '/images/Logo original colors.png', width: 1200, height: 630, alt: 'Melancia Swim — Brazilian Bikinis & Swimwear' }],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Melancia Swim | Brazilian Bikinis & Swimwear',
    description: 'Shop Brazilian-style bikinis and swimwear designed for tanning. Bold colors, minimal silhouettes — shipped within the USA.',
    images: ['/images/Logo original colors.png'],
  },
  alternates: {
    canonical: 'https://melanciaswim.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  icons: {
    icon: [{ url: brandTabIconHref, type: 'image/png' }],
    apple: brandTabIconHref,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable} ${lora.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                '@id': 'https://melanciaswim.com/#organization',
                name: 'Melancia Swim',
                alternateName: 'Melancia Swimwear',
                url: 'https://melanciaswim.com',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://melanciaswim.com/images/Logo original colors.png',
                  width: 400,
                  height: 400,
                },
                description: 'Brazilian-inspired bikinis and swimwear designed for tanning. Bold colors, minimal silhouettes — based in Puerto Rico & El Salvador, shipping within the USA.',
                areaServed: 'US',
                foundingLocation: {
                  '@type': 'Place',
                  name: 'Puerto Rico',
                },
                sameAs: [
                  'https://www.instagram.com/melanciaswim/',
                ],
              },
              {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                '@id': 'https://melanciaswim.com/#website',
                url: 'https://melanciaswim.com',
                name: 'Melancia Swim',
                publisher: {
                  '@id': 'https://melanciaswim.com/#organization',
                },
                potentialAction: {
                  '@type': 'SearchAction',
                  target: {
                    '@type': 'EntryPoint',
                    urlTemplate: 'https://melanciaswim.com/shop?q={search_term_string}',
                  },
                  'query-input': 'required name=search_term_string',
                },
              },
              {
                '@context': 'https://schema.org',
                '@type': 'ClothingStore',
                '@id': 'https://melanciaswim.com/#store',
                name: 'Melancia Swim',
                url: 'https://melanciaswim.com',
                logo: 'https://melanciaswim.com/images/Logo original colors.png',
                description: 'Brazilian-style bikinis and swimwear designed for tanning. Minimal silhouettes, bold colors, shipped within the USA.',
                areaServed: 'US',
                currenciesAccepted: 'USD',
                paymentAccepted: 'Credit Card',
                sameAs: ['https://www.instagram.com/melanciaswim/'],
              },
            ]),
          }}
        />
        <BackgroundDecor />
        <PageLoader />
        <Nav />
        <main className="page-content">
          {children}
        </main>
        <Footer />
        <EngagementPopover />
      </body>
    </html>
  )
}
