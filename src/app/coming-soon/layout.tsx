import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Coming Soon | Melancia Swim',
  description:
    'Something big is coming. Brazilian swimwear dropping soon — sign up to be first.',
}

export default function ComingSoonLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Non-root layouts must NOT render <html>/<body> — those belong to the
  // root app/layout.tsx only.  Font CSS variables and globals.css are already
  // applied by the root layout, so no imports are needed here.
  return <>{children}</>
}
