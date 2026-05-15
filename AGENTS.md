# Melancia — agent / dev guide

## Source of truth (local)

**Edit the Next.js app under `src/` and assets under `public/`.**  
That is what `npm run dev`, `npm run build`, and AWS Amplify (`amplify.yml`) use.

| Path | Role |
|------|------|
| `src/app/` | Pages (home, shop, contact, cart, about, …) |
| `src/components/` | UI (Nav, Footer, HeroSlideshow, …) |
| `src/lib/` | Shopify, contact info, collections, newsletter API helpers |
| `public/` | Images, fonts, videos (served at `/images/…`, `/font/…`) |
| `src/app/globals.css` | Global styles |

## Do not use for production changes

- **`index.html` (repo root)** — old static mockup. It references `css/style.css` and `shop.html`, which are not part of this project. Opening it in a browser is not the live site.

## Run locally

```bash
npm install
npm run dev
```

Open **http://localhost:3000**

Copy `.env.example` → `.env.local` and set Shopify + optional `NEWSLETTER_WEBHOOK_URL`.

## Shared constants

- Contact email / WhatsApp: `src/lib/site-contact.ts`
- Shop collection filter slug: `src/lib/shop-collections.ts` (`sol-de-ipanema` → `/shop?collection=sol-de-ipanema`)

## Hero

Home hero is **`src/components/HeroSlideshow.tsx`** (image slideshow from `public/images/Fotos hero/`), not the video block in `index.html`.

## Deploy

Amplify runs `npm run build` and publishes `.next` output.
