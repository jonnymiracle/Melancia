/**
 * Pure helpers for shop product pagination (used with Shopify total count + per-page slice).
 */

/** Products per page on `/shop` (server slice + pagination UI). */
export const SHOP_PRODUCTS_PER_PAGE = 5

/** Total pages for `itemCount` items and `perPage` per page (always at least 1). */
export function shopTotalPages(itemCount: number, perPage: number): number {
  if (perPage < 1) return 1
  return Math.max(1, Math.ceil(itemCount / perPage))
}

/** 1-based page numbers with `'ellipsis'` where there is a gap (for large page counts). */
export function shopPaginationItems(
  currentPage: number,
  totalPages: number,
): (number | 'ellipsis')[] {
  if (totalPages <= 1) return []
  if (totalPages <= 9) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages = new Set<number>()
  pages.add(1)
  pages.add(totalPages)
  for (let p = currentPage - 2; p <= currentPage + 2; p++) {
    if (p >= 1 && p <= totalPages) pages.add(p)
  }

  const sorted = Array.from(pages).sort((a, b) => a - b)
  const out: (number | 'ellipsis')[] = []
  let prev = 0
  for (const p of sorted) {
    if (prev > 0 && p - prev > 1) out.push('ellipsis')
    out.push(p)
    prev = p
  }
  return out
}

/** Clamp page to `[1, totalPages]`. */
export function shopClampPage(page: number, totalPages: number): number {
  if (!Number.isFinite(page) || page < 1) return 1
  return Math.min(page, totalPages)
}
