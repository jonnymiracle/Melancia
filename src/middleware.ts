import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Paths that should remain accessible
const ALLOWED = [
  '/coming-soon',
  '/_next',
  '/api',
  '/images',
  '/font',
  '/videos',
  '/svg',
  '/favicon',
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow the coming-soon page and all static/api assets
  if (ALLOWED.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Redirect everything else to /coming-soon
  return NextResponse.redirect(new URL('/coming-soon', req.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
