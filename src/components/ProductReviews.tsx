'use client'

/**
 * Klaviyo Reviews widgets for a product page.
 *
 * Klaviyo ships plain divs that its onsite script finds and fills in; there is
 * no documented API to mount or refresh one by hand. The `key` on each div ties
 * it to the product, so React tears the element down and builds a fresh one
 * when the shopper moves between products, rather than leaving a filled widget
 * showing the previous product's reviews.
 *
 * `data-id` wants the numeric Shopify product id. The Storefront API returns a
 * GID, so the caller passes the tail of it.
 *
 * Every review rendered here comes from Klaviyo, written by a real buyer. Do
 * not add a local list of reviews to this repo: a review we write ourselves is
 * a fabricated testimonial under the FTC rule in force since 21/10/2024.
 */

type Props = {
  /** Numeric Shopify product id, not the GID. */
  productId: string
  productTitle: string
  productType?: string
}

export default function ProductReviews({ productId, productTitle, productType }: Props) {
  return (
    <section className="pdp-reviews" aria-label="Customer reviews">
      <div
        key={`stars-${productId}`}
        className="klaviyo-star-rating-widget"
        data-id={productId}
        data-product-title={productTitle}
        data-product-type={productType ?? ''}
      />
      {/* Summary and list in one. Klaviyo's docs say not to add the separate
          summary and list widgets alongside this one. */}
      <div
        key={`reviews-${productId}`}
        id="klaviyo-reviews-all"
        data-id={productId}
      />
    </section>
  )
}
