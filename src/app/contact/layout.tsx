import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: "Get in touch with Melancia Swimwear — questions, collaborations, or just to say hi. We'd love to hear from you.",
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
