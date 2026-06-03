import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { fetchBlogArticles } from '@/lib/shopify-blog'
import { blogArticleHref } from '@/lib/blog-href'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Blog — Swimwear Tips, Style Guides & Beach Life',
  description: 'Swimwear tips, tanning guides, Brazilian bikini style inspiration, and more — from Melancia Swim.',
  alternates: { canonical: 'https://www.melanciaswim.com/blog' },
  openGraph: {
    title: 'Blog | Melancia Swim',
    description: 'Swimwear tips, tanning guides, and Brazilian bikini style inspiration.',
    url: 'https://www.melanciaswim.com/blog',
  },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

export default async function BlogPage() {
  const articles = await fetchBlogArticles(24)

  return (
    <>
      {/* Hero */}
      <div className="blog-hero">
        <p className="blog-hero-eyebrow">From the beach</p>
        <h1>The Melancia Journal</h1>
        <p className="blog-hero-sub">Style guides, tanning tips, and everything swimwear.</p>
      </div>

      <div className="blog-layout">
        {articles.length === 0 ? (
          <div className="blog-empty">
            <p>No posts yet — check back soon.</p>
            <Link href="/shop" className="btn btn-primary">Shop the Collection</Link>
          </div>
        ) : (
          <div className="blog-grid">
            {articles.map((article, i) => (
              <Link
                key={article.id}
                href={blogArticleHref(article)}
                className="blog-card"
              >
                <div className="blog-card-image">
                  {article.image?.url ? (
                    <Image
                      src={article.image.url}
                      alt={article.image.altText ?? article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      style={{ objectFit: 'cover' }}
                      priority={i < 3}
                    />
                  ) : (
                    <div className="blog-card-placeholder" />
                  )}
                </div>
                <div className="blog-card-body">
                  {article.tags.length > 0 && (
                    <span className="blog-card-tag">{article.tags[0]}</span>
                  )}
                  <h2 className="blog-card-title">{article.title}</h2>
                  {article.excerpt && (
                    <p className="blog-card-excerpt">{article.excerpt}</p>
                  )}
                  <div className="blog-card-meta">
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
