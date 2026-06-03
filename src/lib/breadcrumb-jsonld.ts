/**
 * BreadcrumbList JSON-LD builder — pure function, no side effects.
 *
 * Usage:
 *   const schema = buildBreadcrumbJsonLd([
 *     { name: 'Home', url: 'https://www.melanciaswim.com/' },
 *     { name: 'Shop', url: 'https://www.melanciaswim.com/shop' },
 *     { name: 'Leblon Glow', url: 'https://www.melanciaswim.com/shop/leblon-glow' },
 *   ])
 *
 * Positions are 1-based in array order. The builder is deterministic and
 * does not mutate the input array.
 */

export interface BreadcrumbItem {
  name: string
  url: string
}

export function buildBreadcrumbJsonLd(
  items: BreadcrumbItem[],
): Record<string, unknown> {
  const itemListElement = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  }))

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  }
}
