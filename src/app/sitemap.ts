import type { MetadataRoute } from 'next'
import { fetchAllStorefrontProducts } from '@/lib/shopify-products'
import { fetchBlogArticles } from '@/lib/shopify-blog'
import { buildSitemapEntries } from '@/lib/sitemap-entries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, articles] = await Promise.all([
    fetchAllStorefrontProducts({ maxProducts: 1000 }).catch(() => []),
    fetchBlogArticles(250).catch(() => []),
  ])

  return buildSitemapEntries({ products, articles })
}
