/**
 * Pure sitemap builder for melanciaswim.com.
 *
 * Accepts products + articles as plain data (no I/O), returns a
 * MetadataRoute.Sitemap array that covers:
 *   - Static indexable pages (home, /shop, /about, /contact, /size-guide, /shipping-policy)
 *   - The two keyword-targeted collection pages (SETS_HREF / TOPS_HREF)
 *   - /blog index + every article in blogArticleHref format
 *   - Every product page that has a handle (null/undefined handles are skipped)
 *
 * Intentionally excludes /cart, /coming-soon, /api (none are indexable).
 */
import type { MetadataRoute } from 'next'
import { SETS_HREF, TOPS_HREF } from '@/lib/collections'
import { blogArticleHref } from '@/lib/blog-href'
import { SITE_URL as BASE_URL } from '@/lib/site-config'

// Minimal shapes that the builder requires — keeps the function fully testable
// without importing the full Shopify types.
type ProductInput = { handle?: string | null }
type ArticleInput = {
  blog: { handle: string }
  handle: string
  publishedAt?: string
}

export interface SitemapInput {
  products: ProductInput[]
  articles: ArticleInput[]
  /** Override "now" for deterministic tests. Defaults to `new Date()`. */
  now?: Date
}

// ---------------------------------------------------------------------------
// Static pages (indexable, self-canonicalled)
// ---------------------------------------------------------------------------

interface StaticEntry {
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  priority: number
}

const STATIC_PAGES: StaticEntry[] = [
  { path: '',                 changeFrequency: 'weekly',  priority: 1.0 },
  { path: '/shop',            changeFrequency: 'daily',   priority: 0.9 },
  { path: '/about',           changeFrequency: 'monthly', priority: 0.7 },
  { path: '/contact',         changeFrequency: 'monthly', priority: 0.6 },
  { path: '/size-guide',      changeFrequency: 'monthly', priority: 0.6 },
  { path: '/shipping-policy', changeFrequency: 'monthly', priority: 0.5 },
]

// ---------------------------------------------------------------------------
// Builder
// ---------------------------------------------------------------------------

export function buildSitemapEntries({
  products,
  articles,
  now = new Date(),
}: SitemapInput): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  // 1. Static pages
  for (const page of STATIC_PAGES) {
    entries.push({
      url: `${BASE_URL}${page.path}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })
  }

  // 2. Collection pages
  entries.push({
    url: `${BASE_URL}${SETS_HREF}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  })
  entries.push({
    url: `${BASE_URL}${TOPS_HREF}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  })

  // 3. Blog index
  entries.push({
    url: `${BASE_URL}/blog`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  })

  // 4. Blog articles
  for (const article of articles) {
    entries.push({
      url: `${BASE_URL}${blogArticleHref(article)}`,
      lastModified: article.publishedAt ? new Date(article.publishedAt) : now,
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  }

  // 5. Product pages (skip any without a handle)
  for (const product of products) {
    if (!product.handle) continue
    entries.push({
      url: `${BASE_URL}/shop/${product.handle}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  }

  return entries
}
