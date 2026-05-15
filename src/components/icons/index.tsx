// ── Melancia SVG Icon Library ──
// All icons are inline SVGs — no external dependency needed.

export const BikiniIcon = ({ size = 44 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size * (140/236)} viewBox="0 0 236 140" fill="currentColor">
    <g transform="translate(0,140) scale(0.1,-0.1)">
      <path d="M637 1143 c-4 -3 -7 -19 -7 -34 0 -21 -7 -31 -27 -41 -40 -19 -45 -77 -8 -106 14 -11 31 -22 37 -24 8 -3 4 -15 -9 -34 -28 -40 -49 -122 -35 -136 16 -16 29 -2 36 37 10 50 30 58 23 9 -16 -103 -19 -191 -7 -199 21 -13 34 13 36 77 8 176 15 228 32 227 22 -1 166 -162 228 -254 86 -128 194 -324 194 -353 0 -18 37 -41 75 -47 50 -8 93 7 104 37 42 108 110 227 195 340 28 36 60 78 70 93 11 14 60 63 108 107 61 56 92 78 99 71 6 -6 16 -75 22 -153 12 -139 21 -167 44 -138 10 12 7 58 -12 181 -5 32 -4 47 4 47 10 0 16 -17 23 -65 2 -11 12 -21 22 -23 17 -4 18 1 11 43 -7 47 -18 75 -43 106 -11 14 -7 20 23 44 31 23 36 32 33 63 -2 27 -9 40 -25 47 -13 5 -23 15 -23 22 0 31 -24 63 -47 63 -38 0 -54 -49 -38 -117 12 -53 12 -53 -39 -68 -28 -9 -107 -27 -176 -42 -110 -23 -147 -26 -315 -25 -198 0 -268 10 -467 63 -77 21 -77 21 -71 90 4 48 2 73 -7 84 -13 15 -51 20 -63 8z m43 -73 c0 -16 -4 -30 -10 -30 -5 0 -10 14 -10 30 0 17 5 30 10 30 6 0 10 -13 10 -30z m1145 2 c0 -31 -19 -28 -23 4 -3 18 0 25 10 22 7 -3 13 -14 13 -26z m41 -77 c-6 -16 -46 -21 -46 -6 0 5 10 15 23 24 23 15 33 7 23 -18z m-1218 -3 c3 -21 2 -22 -17 -10 -25 16 -28 41 -3 36 9 -2 18 -14 20 -26z m303 -119 c108 -22 430 -24 577 -4 56 8 104 12 107 9 3 -3 -26 -40 -65 -84 -118 -134 -251 -333 -275 -414 -10 -31 -50 -70 -74 -70 -26 0 -56 37 -90 112 -28 64 -171 299 -198 326 -7 7 -13 16 -13 20 0 4 -21 29 -45 55 -69 74 -63 78 76 50z"/>
    </g>
  </svg>
)

export const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)

export const AccountIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/>
  </svg>
)

export const CartIcon = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden>
    <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
  </svg>
)

/** Shopping bag (nav); cart icon above stays for “add to cart” actions */
export const BagIcon = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
)

export const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
)


export const EnvelopeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)

export const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
)

export const MapPinIcon = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)

export const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)

export const GlobeIcon = ({ size = 28 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
)

export const PlusIcon = ({ size = 28 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14"/>
  </svg>
)

export const ShirtIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"
    fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>
  </svg>
)

/** `public/images/Logo original colors.png` — URL-safe for `<link rel="icon">` (see `app/layout.tsx` metadata.icons) */
export const brandTabIconHref =
  '/images/' + encodeURIComponent('Logo original colors.png')
