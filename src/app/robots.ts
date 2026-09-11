import type { MetadataRoute } from 'next'
import { IS_PREVIEW } from '@/lib/site-env'

export default function robots(): MetadataRoute.Robots {
  // A preview deploy serves the same catalogue as the live store. If crawlers
  // reach it, Google sees the whole site duplicated on a second domain, so
  // previews are closed to everything.
  if (IS_PREVIEW) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    }
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/coming-soon'],
    },
    sitemap: 'https://www.melanciaswim.com/sitemap.xml',
  }
}
