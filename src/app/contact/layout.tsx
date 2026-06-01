import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: "Get in touch with Melancia Swim — questions about bikinis, swimwear sizing, shipping within the USA, or collaborations. Based in Puerto Rico & El Salvador. We'd love to hear from you.",
  alternates: {
    canonical: 'https://www.melanciaswim.com/contact',
  },
  openGraph: {
    title: 'Contact Us | Melancia Swim',
    description: "Questions about bikinis, swimwear, sizing, or shipping? Reach out to Melancia Swim — based in Puerto Rico & El Salvador, shipping within the USA.",
    url: 'https://www.melanciaswim.com/contact',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
