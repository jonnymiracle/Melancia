import { shopifyFetch } from '@/lib/shopify'

export type BlogArticle = {
  id: string
  title: string
  handle: string
  excerpt: string
  contentHtml: string
  publishedAt: string
  tags: string[]
  image?: { url: string; altText?: string | null } | null
  author: { name: string }
  blog: { handle: string }
}

const ARTICLE_FIELDS = `
  id
  title
  handle
  excerpt
  contentHtml
  publishedAt
  tags
  image { url altText }
  author { name }
  blog { handle }
`

const ARTICLES_QUERY = `
  query Articles($first: Int!) {
    articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
      edges {
        node {
          ${ARTICLE_FIELDS}
        }
      }
    }
  }
`

const ARTICLE_BY_HANDLE_QUERY = `
  query ArticleByHandle($blogHandle: String!, $articleHandle: String!) {
    blogByHandle(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        ${ARTICLE_FIELDS}
      }
    }
  }
`

type ArticlesData = {
  data: {
    articles: {
      edges: { node: BlogArticle }[]
    }
  }
}

type ArticleByHandleData = {
  data: {
    blogByHandle: {
      articleByHandle: BlogArticle | null
    } | null
  }
}

export async function fetchBlogArticles(first = 20): Promise<BlogArticle[]> {
  try {
    const json = await shopifyFetch<ArticlesData>(ARTICLES_QUERY, { first })
    return (json.data?.articles?.edges ?? []).map(e => e.node)
  } catch {
    return []
  }
}

export async function fetchArticleByHandle(
  blogHandle: string,
  articleHandle: string
): Promise<BlogArticle | null> {
  try {
    const json = await shopifyFetch<ArticleByHandleData>(
      ARTICLE_BY_HANDLE_QUERY,
      { blogHandle, articleHandle }
    )
    return json.data?.blogByHandle?.articleByHandle ?? null
  } catch {
    return null
  }
}
