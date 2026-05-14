import type { Metadata } from 'next'
import { Lora, Playfair_Display, Poppins } from 'next/font/google'
import './globals.css'
import AnnouncementBar from '@/components/AnnouncementBar'
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
  metadataBase: new URL('https://main.dvujasy3l4uac.amplifyapp.com'),
  title: {
    default: 'Melancia Swimwear | Sol de Ipanema Collection 2026',
    template: '%s | Melancia Swimwear',
  },
  description: 'Melancia swimwear — bold colors, flattering fits. Shop the Sol de Ipanema Collection 2026. Free-spirited swimwear made with love, worn with confidence.',
  keywords: ['swimwear', 'bikini', 'swimsuit', 'Sol de Ipanema', 'Melancia', 'summer', 'beachwear', 'women swimwear', 'Brazilian swimwear'],
  openGraph: {
    type: 'website',
    siteName: 'Melancia Swimwear',
    title: 'Melancia Swimwear | Sol de Ipanema Collection 2026',
    description: 'Bold colors, flattering fits. Shop the Sol de Ipanema Collection 2026.',
    images: [{ url: '/images/Logo original colors.png', width: 400, height: 400, alt: 'Melancia Swimwear Logo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Melancia Swimwear | Sol de Ipanema Collection 2026',
    description: 'Bold colors, flattering fits. Shop the Sol de Ipanema Collection 2026.',
    images: ['/images/Logo original colors.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
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
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ClothingStore',
              name: 'Melancia Swimwear',
              description: 'Bold, free-spirited swimwear made with love.',
              url: 'https://main.dvujasy3l4uac.amplifyapp.com',
              logo: 'https://main.dvujasy3l4uac.amplifyapp.com/images/Logo original colors.png',
              sameAs: ['https://www.instagram.com/melanciaswim/'],
              offers: {
                '@type': 'AggregateOffer',
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
              },
            }),
          }}
        />
        <BackgroundDecor />
        <PageLoader />
        <AnnouncementBar />
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
