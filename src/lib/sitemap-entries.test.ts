import { describe, it, expect } from 'vitest'
import { buildSitemapEntries } from './sitemap-entries'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const PRODUCTS = [
  { handle: 'copacabana-set' },
  { handle: 'ipanema-top' },
  { handle: null }, // no handle — must be excluded
]

const ARTICLES = [
  {
    blog: { handle: 'news' },
    handle: 'summer-lookbook-2025',
    publishedAt: '2025-05-01T00:00:00Z',
  },
  {
    blog: { handle: 'news' },
    handle: 'how-to-pick-a-bikini',
    publishedAt: '2025-04-01T00:00:00Z',
  },
]

const NOW = new Date('2024-01-15T00:00:00Z')

const BASE = 'https://www.melanciaswim.com'

// ---------------------------------------------------------------------------
// Helper: get all URLs from the sitemap
// ---------------------------------------------------------------------------

function urls(entries: ReturnType<typeof buildSitemapEntries>): string[] {
  return entries.map((e) => e.url)
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('buildSitemapEntries', () => {
  const entries = buildSitemapEntries({ products: PRODUCTS, articles: ARTICLES, now: NOW })
  const allUrls = urls(entries)

  // 1. Static pages
  // /size-guide is deliberately absent — there is no app/size-guide route, so
  // listing it would put a 404 in the sitemap.
  it('includes all 5 static page URLs (absolute)', () => {
    const staticPages = ['', '/shop', '/about', '/contact', '/shipping-policy']
    for (const path of staticPages) {
      expect(allUrls).toContain(`${BASE}${path}`)
    }
  })

  // 2. Collection pages
  it('includes both collection URLs', () => {
    expect(allUrls).toContain(`${BASE}/collections/brazilian-bikini-sets`)
    expect(allUrls).toContain(`${BASE}/collections/brazilian-bikini-tops`)
  })

  // 3. Blog index
  it('includes the /blog index URL', () => {
    expect(allUrls).toContain(`${BASE}/blog`)
  })

  // 4. Blog article URLs (double-dash format)
  it('includes blog article URLs in blogArticleHref format', () => {
    expect(allUrls).toContain(`${BASE}/blog/news--summer-lookbook-2025`)
    expect(allUrls).toContain(`${BASE}/blog/news--how-to-pick-a-bikini`)
  })

  // 5. Product pages
  it('includes a product URL for each product WITH a handle', () => {
    expect(allUrls).toContain(`${BASE}/shop/copacabana-set`)
    expect(allUrls).toContain(`${BASE}/shop/ipanema-top`)
  })

  // 6. Null-handle product excluded
  it('excludes products with no handle', () => {
    // The null-handle product must not result in a URL like /shop/null or /shop/undefined
    expect(allUrls).not.toContain(`${BASE}/shop/null`)
    expect(allUrls).not.toContain(`${BASE}/shop/undefined`)
    // Total product entries = 2 (only those with handles)
    const productUrls = allUrls.filter((u) => u.startsWith(`${BASE}/shop/`))
    expect(productUrls).toHaveLength(2)
  })

  // 7. Excluded paths
  it('excludes /cart', () => {
    expect(allUrls.some((u) => u.includes('/cart'))).toBe(false)
  })

  it('excludes /coming-soon', () => {
    expect(allUrls.some((u) => u.includes('/coming-soon'))).toBe(false)
  })

  it('excludes /api', () => {
    expect(allUrls.some((u) => u.includes('/api'))).toBe(false)
  })

  // 8. All URLs absolute on www.melanciaswim.com
  it('all URLs start with https://www.melanciaswim.com', () => {
    for (const url of allUrls) {
      expect(url.startsWith('https://www.melanciaswim.com')).toBe(true)
    }
  })

  // 9. No duplicate URLs
  it('has no duplicate URLs', () => {
    const uniqueUrls = new Set(allUrls)
    expect(uniqueUrls.size).toBe(allUrls.length)
  })

  // 10. `now` parameter propagates to lastModified on static entries
  it('uses the provided `now` date for static entry lastModified', () => {
    const home = entries.find((e) => e.url === BASE)
    expect(home?.lastModified).toEqual(NOW)
  })

  // 11. Empty inputs still produce static + collection entries
  it('works with empty products and articles', () => {
    const sparse = buildSitemapEntries({ products: [], articles: [], now: NOW })
    const sparseUrls = urls(sparse)
    expect(sparseUrls).toContain(`${BASE}`)
    expect(sparseUrls).toContain(`${BASE}/collections/brazilian-bikini-sets`)
    expect(sparseUrls).toContain(`${BASE}/blog`)
    // No product or article URLs
    expect(sparseUrls.filter((u) => u.startsWith(`${BASE}/shop/`))).toHaveLength(0)
  })
})
