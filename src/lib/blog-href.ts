/**
 * Returns the canonical href for a blog article page.
 * The route is /blog/[handle] where handle = "{blogHandle}--{articleHandle}".
 */
export function blogArticleHref(article: {
  blog: { handle: string }
  handle: string
}): string {
  return `/blog/${article.blog.handle}--${article.handle}`
}
