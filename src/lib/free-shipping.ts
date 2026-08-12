/**
 * Site-wide free shipping messaging.
 *
 * Shopify's General delivery profile currently rates the Domestic (US) and
 * El Salvador zones at $0.00 with no order minimum, so these claims are
 * unconditional.
 *
 * If a paid rate is ever added in Shopify, flipping `FREE_SHIPPING_ENABLED` to
 * false removes the announcement bar, the product-card badges, the product-page
 * note and trust chip, the footer strip, and the cart summary line.
 *
 * It does NOT touch copy that lives outside these components — those need a
 * manual edit:
 *   - page titles/descriptions in app/page.tsx, app/shop/page.tsx, app/layout.tsx
 *   - lib/faq-jsonld.ts (the shipping FAQ answer, which Google reads)
 *   - app/shipping-policy/page.tsx
 */
export const FREE_SHIPPING_ENABLED = true

/** Grid card pill and other tight spaces. */
export const FREE_SHIPPING_SHORT = 'Free Shipping'

/** Announcement bar segment. */
export const FREE_SHIPPING_BAR = 'Free shipping on all U.S. orders'

/** Product page note, footer strip. */
export const FREE_SHIPPING_NOTE = 'Free U.S. shipping'
