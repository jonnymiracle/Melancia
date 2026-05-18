import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/cart'],
      },
    ],
    sitemap: 'https://melanciaswim.com/sitemap.xml',
    host: 'https://melanciaswim.com',
  }
}
