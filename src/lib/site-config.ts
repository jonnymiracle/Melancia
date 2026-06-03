/**
 * Single source of truth for brand-level constants used across metadata
 * (root layout, product pages, future collection/blog pages). Keep these
 * here so the brand name, base URL, and logo path can't drift between files.
 */
export const SITE_NAME = 'Melancia Swim'

/** Absolute production origin. Canonicals/OG use relative paths resolved against this via metadataBase. */
export const SITE_URL = 'https://www.melanciaswim.com'

/** Brand logo, used as the OpenGraph image fallback. Path under /public. */
export const LOGO_IMAGE = '/images/Logo original colors.png'
