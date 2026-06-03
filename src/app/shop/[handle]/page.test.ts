import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { ShopifyProductDetail } from '@/types/shopify'

// Mock the Shopify data layer so generateMetadata never hits the network.
vi.mock('@/lib/shopify-products', () => ({
  fetchProductByHandle: vi.fn(),
}))

import { generateMetadata } from './page'
import { fetchProductByHandle } from '@/lib/shopify-products'

const mockProduct: ShopifyProductDetail = {
  id: 'gid://shopify/Product/1',
  title: 'Leblon Glow',
  handle: 'leblon-glow',
  description: 'A sun-kissed Brazilian bikini.',
  descriptionHtml: '<p>A sun-kissed Brazilian bikini.</p>',
  tags: [],
  options: [],
  images: { edges: [] },
  variants: { edges: [] },
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
