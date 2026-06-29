import type { Metadata } from 'next'
import { Lora, Playfair_Display, Poppins } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import PageLoader from '@/components/PageLoader'
import EngagementPopover from '@/components/EngagementPopover'
import BackgroundDecor from '@/components/BackgroundDecor'
import { brandTabIconHref } from '@/components/icons'
import { SITE_NAME, LOGO_IMAGE } from '@/lib/site-config'

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
  metadataBase: new URL('https://www.melanciaswim.com'),
  title: {
    default: 'Melancia Swim | Brazilian Bikinis & Swimwear',
    template: '%s | Melancia Swim',
  },
  description: 'Shop Brazilian-style bikinis and swimwear designed for tanning. Melancia Swim offers small bikinis, bold colors, and minimal silhouettes — shipped within the USA. Based in Puerto Rico & El Salvador.',
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    url: 'https://www.melanciaswim.com',
    title: 'Melancia Swim | Brazilian Bikinis & Swimwear',
    description: 'Shop Brazilian-style bikinis and swimwear designed for tanning. Bold colors, minimal silhouettes — shipped within the USA.',
    images: [{ url: LOGO_IMAGE, width: 1200, height: 630, alt: 'Melancia Swim — Brazilian Bikinis & Swimwear' }],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Melancia Swim | Brazilian Bikinis & Swimwear',
    description: 'Shop Brazilian-style bikinis and swimwear designed for tanning. Bold colors, minimal silhouettes — shipped within the USA.',
    images: [LOGO_IMAGE],
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
                '@id': 'https://www.melanciaswim.com/#organization',
                name: 'Melancia Swim',
                alternateName: 'Melancia Swimwear',
                url: 'https://www.melanciaswim.com',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://www.melanciaswim.com/images/Logo original colors.png',
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
                '@id': 'https://www.melanciaswim.com/#website',
                url: 'https://www.melanciaswim.com',
                name: 'Melancia Swim',
                publisher: {
                  '@id': 'https://www.melanciaswim.com/#organization',
                },
                potentialAction: {
                  '@type': 'SearchAction',
                  target: {
                    '@type': 'EntryPoint',
                    urlTemplate: 'https://www.melanciaswim.com/shop?q={search_term_string}',
                  },
                  'query-input': 'required name=search_term_string',
                },
              },
              {
                '@context': 'https://schema.org',
                '@type': 'ClothingStore',
                '@id': 'https://www.melanciaswim.com/#store',
                name: 'Melancia Swim',
                url: 'https://www.melanciaswim.com',
                logo: 'https://www.melanciaswim.com/images/Logo original colors.png',
                description: 'Brazilian-style bikinis and swimwear designed for tanning. Minimal silhouettes, bold colors, shipped within the USA.',
                areaServed: 'US',
                currenciesAccepted: 'USD',
                paymentAccepted: 'Credit Card',
                sameAs: ['https://www.instagram.com/melanciaswim/'],
              },
            ]),
          }}
        />
        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1045697827880455');
          fbq('track', 'PageView');
        `}</Script>
        <noscript>
          <img height="1" width="1" style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1045697827880455&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
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
