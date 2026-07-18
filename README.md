# Dar Al-Maarifa — Global E-Book Store

A production-ready, **English-first (LTR)** e-book store with full Arabic i18n support, built with:
**React + TypeScript + Vite + Framer Motion + Stripe (payments) + Cloudflare Worker (serverless API)**
with **automated tests** (Vitest unit + Playwright e2e).

> Live site: https://ansygroup.github.io/ebook-store/
> API (Worker): https://ebook-store-api.livepm8.workers.dev

## Features
- Professional **English-first LTR** design (light/editorial theme + mint accent) + Arabic via i18n toggle (`?lang=ar`).
- Live motion animation via Framer Motion (hero, cards, FAQ, modal).
- Full store: home + shop (search / category filter / sort) + detail page per book.
- **Stripe Payment Links** checkout (with `?paid=1&coupon=` redirect → `/verify`) — or fallback to book page when link is a placeholder.
- **10 books** with 1200×1800 PNG covers + 1080×1080 promo + sample PDFs.
- **Serverless API** (Cloudflare Worker): Gmail order confirmation + newsletter, HMAC-verified Stripe webhook, protected by (rate-limit + honeypot + referer guard).
- **SEO/AEO**: sitemap + image-sitemap + robots + hreflang + llms.txt + JSON-LD (WebSite + Book + Offer + FAQPage + BreadcrumbList).
- **Conversion stack**: auto-coupons (READ20 newsletter / LEAD10 exit-popup), bundle discount (BUNDLE30), wishlist + recently-viewed (localStorage), A/B coupon tracking.
- Tests: `vitest` (33 unit) + `playwright` (10 e2e).

## Run locally
```bash
npm install
npm run dev          # http://localhost:5173
```

## Connect real payments + email (Stripe / Composio / Meta)
See **[SETUP.md](./SETUP.md)** — step-by-step with the exact credentials needed and what each unlocks.
(Short version: paste full `STRIPE_SECRET_KEY` → `npm run stripe:links`; valid `COMPOSIO_API_KEY` + Gmail `ca_xxx` → `wrangler deploy`; real `VITE_META_PIXEL_ID` → `npm run build`.)

## Tests
```bash
npm test               # unit (Vitest, 33)
CI=1 npx playwright test   # e2e (Playwright, 10)
```

## Deploy (GitHub Pages = live channel)
```bash
git push origin master   # Pages deploys dist/ automatically via pages.yml
```
- **Cloudflare Worker** (API): `npx wrangler deploy` (reads `worker/.dev.vars`).
- Frontend reads `VITE_API_BASE` for the Worker URL.

## Build for production
```bash
npm run build          # generates all assets (covers/promo/pdfs/seo) → dist/
npm run preview        # preview
```

## Marketing (Instagram)
- `scripts/gen-ig.mjs` stages posts (promo image + caption) into `ig-queue/` (cron 09:00 via `marketing.yml`).
- `marketing/` holds ready English content: 30 IG captions, 5-email sequence, Pinterest pins, Meta Ads funnel.

## Structure
```
src/                  source (React + API client + i18n + data)
worker/               Cloudflare Worker (confirm-order, subscribe, stripe-webhook) + wrangler.toml
scripts/              asset generation (covers/promo/pdfs/seo) + gen-stripe-links + gen-ig
public/               static assets (covers/promo/downloads + sitemap/robots/llms.txt/pixel.js)
e2e/                  Playwright specs
```
