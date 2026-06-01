/**
 * Per-product note describing the size the model is wearing in the photos.
 * Shown on the product page just under the title.
 *
 * Keyed by Shopify product handle (the slug in the URL, e.g. /shop/floresta-vermelha
 * → "floresta-vermelha"). Any product not listed here falls back to DEFAULT_MODEL_SIZE.
 *
 * 👉 When you swap in photos with a different model/size, add an entry below.
 *    Example:
 *      'floresta-vermelha': 'Small top and bottom',
 */
const MODEL_SIZE_BY_HANDLE: Record<string, string> = {
  // Add per-product overrides here as you update photography.
}

/** Used for every product without an explicit entry above. */
const DEFAULT_MODEL_SIZE = 'Medium top and bottom'

/** Full sentence shown on the product page, e.g. "The model is wearing size Medium top and bottom." */
export function getModelSizeNote(handle: string): string {
  const size = MODEL_SIZE_BY_HANDLE[handle] ?? DEFAULT_MODEL_SIZE
  return `The model is wearing size ${size}.`
}
