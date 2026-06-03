import { describe, it, expect } from 'vitest'
import { blogArticleHref } from './blog-href'

describe('blogArticleHref', () => {
  it('returns the correct href using double-dash separator', () => {
    const result = blogArticleHref({ blog: { handle: 'news' }, handle: 'my-post' })
    expect(result).toBe('/blog/news--my-post')
  })

  it('produces a single path segment (no extra slash between blog and article handles)', () => {
    const result = blogArticleHref({ blog: { handle: 'news' }, handle: 'my-post' })
    // Should have exactly two slashes: leading / and /blog/
    expect(result.split('/').length).toBe(3) // ['', 'blog', 'news--my-post']
  })

  it('always uses -- (double-dash) not a slash', () => {
    const result = blogArticleHref({ blog: { handle: 'journal' }, handle: 'summer-style' })
    expect(result).toBe('/blog/journal--summer-style')
    expect(result).not.toContain('/blog/journal/summer-style')
  })

  it('handles handles with existing hyphens correctly', () => {
    const result = blogArticleHref({
      blog: { handle: 'melancia-news' },
      handle: 'top-5-bikini-styles-2025',
    })
    expect(result).toBe('/blog/melancia-news--top-5-bikini-styles-2025')
  })
})
