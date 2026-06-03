import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { ShopifyProductDetail } from '@/types/shopify'

// Mock the Shopify data layer so generateMetadata never hits the network.
vi.mock('@/lib/shopify-products', () => ({
  fetchProductByHandle: vi.fn(),
}))

import { generateMetadata } from './page'
import { fetchProductByHandle } from '@/lib/shopify-products'

const PRODUCT_IMAGE_URL =
  'https://cdn.shopify.com/s/files/1/0123/4567/products/leblon-glow.jpg'

const mockProduct: ShopifyProductDetail = {
  id: 'gid://shopify/Product/1',
  title: 'Leblon Glow',
  handle: 'leblon-glow',
  description: 'A sun-kissed Brazilian bikini.',
  descriptionHtml: '<p>A sun-kissed Brazilian bikini.</p>',
  tags: [],
  options: [],
  images: {
    edges: [
      {
        node: {
          url: PRODUCT_IMAGE_URL,
          altText: 'Leblon Glow bikini',
        },
      },
    ],
  },
  variants: { edges: [] },
}

const mockProductNoImages: ShopifyProductDetail = {
  ...mockProduct,
  handle: 'no-image-product',
  title: 'No Image Product',
  images: { edges: [] },
}

describe('product page generateMetadata canonical', () => {
  beforeEach(() => {
    vi.mocked(fetchProductByHandle).mockReset()
  })

  it('emits a self-referencing canonical equal to the product URL, not the homepage', async () => {
    vi.mocked(fetchProductByHandle).mockResolvedValue(mockProduct)

    const meta = await generateMetadata({
      params: Promise.resolve({ handle: 'leblon-glow' }),
    })

    const canonical = meta.alternates?.canonical
    expect(canonical).toBe('/shop/leblon-glow')
    // Guard against inheriting the homepage canonical.
    expect(canonical).not.toBe('https://www.melanciaswim.com')
  })
})

describe('product page generateMetadata openGraph + twitter (A2)', () => {
  beforeEach(() => {
    vi.mocked(fetchProductByHandle).mockReset()
  })

  it('openGraph.title contains the product name AND "Brazilian Bikini"', async () => {
    vi.mocked(fetchProductByHandle).mockResolvedValue(mockProduct)

    const meta = await generateMetadata({
      params: Promise.resolve({ handle: 'leblon-glow' }),
    })

    const ogTitle = meta.openGraph?.title as string | undefined
    expect(ogTitle).toBeDefined()
    expect(ogTitle).toContain('Leblon Glow')
    expect(ogTitle).toContain('Brazilian Bikini')
  })

  it('openGraph.url equals the product URL path', async () => {
    vi.mocked(fetchProductByHandle).mockResolvedValue(mockProduct)

    const meta = await generateMetadata({
      params: Promise.resolve({ handle: 'leblon-glow' }),
    })

    expect(meta.openGraph?.url).toBe('/shop/leblon-glow')
  })

  it('openGraph.images uses the first product image (not the logo)', async () => {
    vi.mocked(fetchProductByHandle).mockResolvedValue(mockProduct)

    const meta = await generateMetadata({
      params: Promise.resolve({ handle: 'leblon-glow' }),
    })

    const images = meta.openGraph?.images
    expect(images).toBeDefined()
    const firstImage = Array.isArray(images) ? images[0] : images
    const imageUrl =
      typeof firstImage === 'string' ? firstImage : (firstImage as { url: string }).url
    expect(imageUrl).toBe(PRODUCT_IMAGE_URL)
    expect(imageUrl).not.toContain('Logo')
  })

  it('twitter.images uses the first product image (not the logo)', async () => {
    vi.mocked(fetchProductByHandle).mockResolvedValue(mockProduct)

    const meta = await generateMetadata({
      params: Promise.resolve({ handle: 'leblon-glow' }),
    })

    const twitterImages = meta.twitter?.images
    expect(twitterImages).toBeDefined()
    const firstImage = Array.isArray(twitterImages) ? twitterImages[0] : twitterImages
    const imageUrl =
      typeof firstImage === 'string' ? firstImage : (firstImage as { url: string }).url
    expect(imageUrl).toBe(PRODUCT_IMAGE_URL)
    expect(imageUrl).not.toContain('Logo')
  })

  it('falls back to logo when product has no images', async () => {
    vi.mocked(fetchProductByHandle).mockResolvedValue(mockProductNoImages)

    const meta = await generateMetadata({
      params: Promise.resolve({ handle: 'no-image-product' }),
    })

    const images = meta.openGraph?.images
    const firstImage = Array.isArray(images) ? images[0] : images
    const imageUrl =
      typeof firstImage === 'string' ? firstImage : (firstImage as { url: string }).url
    expect(imageUrl).toContain('Logo')
  })

  it('openGraph has siteName, locale, and type fields', async () => {
    vi.mocked(fetchProductByHandle).mockResolvedValue(mockProduct)

    const meta = await generateMetadata({
      params: Promise.resolve({ handle: 'leblon-glow' }),
    })

    expect(meta.openGraph?.siteName).toBe('Melancia Swim')
    expect(meta.openGraph?.locale).toBe('en_US')
    // Next.js OpenGraph is a discriminated union; cast to access `type`.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((meta.openGraph as any)?.type).toBe('website')
  })

  it('returns minimal metadata when product is not found', async () => {
    vi.mocked(fetchProductByHandle).mockResolvedValue(null)

    const meta = await generateMetadata({
      params: Promise.resolve({ handle: 'nonexistent' }),
    })

    expect(meta.title).toBe('Product Not Found')
    expect(meta.openGraph).toBeUndefined()
  })
})
