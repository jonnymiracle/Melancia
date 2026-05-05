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
  title: 'Melancia — Summer Swim',
  description: 'Swimwear designed for the free-spirited. Made with love, worn with confidence.',
  icons: {
    icon: [{ url: brandTabIconHref, type: 'image/png' }],
    apple: brandTabIconHref,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable} ${lora.variable}`}>
      <body>
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
