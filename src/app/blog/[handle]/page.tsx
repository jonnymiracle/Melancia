import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { fetchArticleByHandle, fetchBlogArticles } from '@/lib/shopify-blog'
import { blogArticleHref } from '@/lib/blog-href'

type Props = { params: { handle: string } }

// handle = "news--my-post-slug" (blogHandle--articleHandle)
function splitHandle(combined: string): [string, string] {
  const idx = combined.indexOf('--')
  if (idx === -1) return ['news', combined]
  return [combined.slice(0, idx), combined.slice(idx + 2)]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [blogHandle, articleHandle] = splitHandle(params.handle)
  const article = await fetchArticleByHandle(blogHandle, articleHandle)
  if (!article) return {}

  return {
    title: article.title,
    description: article.excerpt || article.title,
    alternates: { canonical: `https://www.melanciaswim.com/blog/${params.handle}` },
    openGraph: {
      title: article.title,
      description: article.excerpt || article.title,
      url: `https://www.melanciaswim.com/blog/${params.handle}`,
      type: 'article',
      publishedTime: article.publishedAt,
      images: article.image?.url
        ? [{ url: article.image.url, alt: article.image.altText ?? article.title }]
        : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const [blogHandle, articleHandle] = splitHandle(params.handle)
  const [article, related] = await Promise.all([
    fetchArticleByHandle(blogHandle, articleHandle),
    fetchBlogArticles(4),
  ])

  if (!article) notFound()

  const relatedArticles = related
    .filter(a => a.handle !== articleHandle)
    .slice(0, 3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    datePublished: article.publishedAt,
    author: { '@type': 'Person', name: article.author.name },
    publisher: {
      '@type': 'Organization',
      name: 'Melancia Swim',
      logo: { '@type': 'ImageObject', url: 'https://www.melanciaswim.com/images/Logo original colors.png' },
    },
    ...(article.image?.url && { image: article.image.url }),
    description: article.excerpt,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="blog-post">
        {/* Header */}
        <div className="blog-post-header">
          <Link href="/blog" className="blog-back">← Back to Journal</Link>
          {article.tags.length > 0 && (
            <span className="blog-card-tag">{article.tags[0]}</span>
          )}
          <h1 className="blog-post-title">{article.title}</h1>
          <div className="blog-post-meta">
            <span>{article.author.name}</span>
            <span>·</span>
            <span>
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Hero image */}
        {article.image?.url && (
          <div className="blog-post-image">
            <Image
              src={article.image.url}
              alt={article.image.altText ?? article.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 860px"
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Content */}
        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />

        {/* CTA */}
        <div className="blog-post-cta">
          <p>Find your perfect swimwear</p>
          <Link href="/shop" className="btn btn-primary">Shop the Collection</Link>
        </div>
      </article>

      {/* Related posts */}
      {relatedArticles.length > 0 && (
        <section className="blog-related">
          <h2>More from the Journal</h2>
          <div className="blog-grid blog-grid--small">
            {relatedArticles.map(a => (
              <Link
                key={a.id}
                href={blogArticleHref(a)}
                className="blog-card"
              >
                <div className="blog-card-image">
                  {a.image?.url ? (
                    <Image
                      src={a.image.url}
                      alt={a.image.altText ?? a.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="blog-card-placeholder" />
                  )}
                </div>
                <div className="blog-card-body">
                  <h3 className="blog-card-title">{a.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
