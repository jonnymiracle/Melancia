# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # install dependencies
npm run dev          # start dev server at http://localhost:3000
npm run build        # production build
npm run lint         # ESLint via next lint
```

No test suite is configured. There is no test runner command.

## Environment

Copy `.env.example` → `.env.local` and fill in:

```
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token
```

Optional (Instagram feed): `INSTAGRAM_USER_ID`, `INSTAGRAM_ACCESS_TOKEN`.

All four env vars are forwarded to the browser via `next.config.mjs`. The shop and cart routes fail gracefully without Shopify credentials — the shop falls back to the static `src/data/products.ts` catalog.

## Architecture

**Next.js 14 App Router** storefront for Melancia Swimwear, backed by the Shopify Storefront API (GraphQL). Deployed on AWS Amplify.

### Data flow

- `src/lib/shopify.ts` — single `shopifyFetch<T>()` wrapper for all Storefront API calls (POST to `/api/2026-01/graphql.json`, reads `SHOPIFY_STORE_DOMAIN` + `SHOPIFY_STOREFRONT_ACCESS_TOKEN`)
- `src/lib/shopify-products.ts` — product queries: `fetchStorefrontProducts` (limited), `fetchProductByHandle` (PDP), `fetchAllStorefrontProducts` (cursor-paginated, used by shop catalog)
- `src/app/api/shopify/` — thin Next.js route handlers that proxy Storefront mutations the browser cannot call directly (cart create, cart add lines, cart fetch)

### Cart

Cart state lives entirely in `localStorage` via `src/lib/cart-storage.ts`. The cart ID (`melancia-shopify-cart-id`) is stored there and passed to the `/api/shopify/cart/*` routes. Cart mutations dispatch a `melancia-cart-updated` CustomEvent that the Nav listens to for badge updates.

Client-side entry point: `src/lib/add-to-cart-client.ts` — call `addToCart(variantId, quantity)` from any client component.

### Shop catalog

`/shop` page (`src/app/shop/page.tsx`, `force-dynamic`) fetches all Shopify products at request time and handles:
- Collection filtering via `?collection=<slug>` (only `sol-de-ipanema` is active, defined in `src/lib/shop-collections.ts`)
- Client-side pagination (`src/lib/shop-pagination.ts`, `SHOP_PRODUCTS_PER_PAGE`)
- Fallback to static `src/data/products.ts` if Shopify is unreachable

`ShopCatalog` (`src/app/shop/ShopCatalog.tsx`) is the client component for the grid and pagination UI.

### Types

Two type systems coexist:
- `src/types/index.ts` — local static catalog types (`Product`, `CustomerReview`, etc.)
- `src/types/shopify.ts` — Storefront API shapes (`ShopifyProduct`, `ShopifyProductDetail`, etc.)

`ProductCard3Product = Product | ShopifyProduct` is the union used by the shop grid.

### Key shared constants

- `src/lib/site-contact.ts` — canonical email and WhatsApp number
- `src/lib/shop-collections.ts` — collection slugs and filter logic

### Layout

`src/app/layout.tsx` wraps every page with `Nav`, `Footer`, `PageLoader`, `EngagementPopover`, and `BackgroundDecor`. Fonts: Playfair Display, Poppins, Lora (all Google Fonts via `next/font`).

### Static files to ignore

`index.html` at the repo root is a legacy static mockup — it is not part of the Next.js app and should not be edited.
