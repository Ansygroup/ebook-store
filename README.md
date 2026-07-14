# Dar Al-Maarifa — Global E-Book Store

A production-ready, **English-first (LTR)** e-book store with full Arabic i18n support, built with:
**React + TypeScript + Vite + Framer Motion + Gumroad (payments) + serverless API (Vercel functions)**
with **automated tests** (Vitest unit + Playwright e2e).

## Features
- Professional **English-first LTR** design (dark theme, gradients, shadows) + Arabic via i18n toggle (`?lang=ar`).
- Live motion animation via Framer Motion (hero, cards, FAQ).
- Full store: home page + shop with category filter / sort + detail page per book.
- **Gumroad buy button** (overlay) — or fallback to the book page when the link is a placeholder.
- **10 books** with 1200×1800 PNG covers + 1080×1080 promo + sample PDFs.
- **Serverless API**: Gmail order confirmation + newsletter, protected by (IP+email rate-limit + honeypot + referer guard).
- **SEO/AEO**: sitemap + robots + llms.txt + JSON-LD (WebSite + Book + FAQPage + OfferCatalog).
- Tests: `vitest` (30 unit) + `playwright` (10 e2e).

## Run locally
```bash
npm install
npm run dev          # http://localhost:5173
```

## Connect real payments (Gumroad)
1. Create products at https://gumroad.com/products and grab the buy links.
2. Copy `gumroad-links.example.json` → `gumroad-links.json` and fill in the links.
3. Run: `node scripts/fill-gumroad.mjs` (updates `src/data/books.json`).
4. `git add -A && git commit && git push`.

> Even without real links, the buy button opens the book page (it has an email-order form + PDF download).

## Tests
```bash
npm test               # unit (Vitest)
npm run test:e2e       # e2e (Playwright — real browser)
npm run check-env      # checks setup readiness
```

## Deploy (GitHub Pages = live channel)
```bash
git push origin master   # Pages deploys dist/ automatically via pages.yml
```
- **Vercel** (optional): deploys the API functions — `vercel deploy --prod` (requires `VERCEL_TOKEN`).
- The API (`/api/confirm-order`, `/api/subscribe`) points to Vercel via `VITE_API_BASE`.

## Build for production
```bash
npm run build          # generates all assets (covers/promo/pdfs/seo) → dist/
npm run preview        # preview
```

## Manual rotation (keys / accounts)
See `DO-ROTATE.md` — ready steps to rotate: Vercel token, GitHub OAuth, Composio (Gmail/IG), Gumroad links.

## Marketing (Instagram)
- `scripts/ig-prepare.mjs` stages a daily post (promo image + caption) into `ig-queue/` (cron 09:00).
- `IG_GUIDE.md` explains manual posting from `ig-queue/`.
- `marketing/` holds ready English content: 30 IG captions, 5-email sequence, Pinterest pins, Meta Ads funnel.

## Structure
```
src/                  source (React + API client)
api/                  Vercel functions (confirm-order, subscribe)
scripts/              asset generation (covers/promo/pdfs/seo) + ig-prepare + fill-gumroad
public/               static assets (covers/promo/downloads + llms.txt/sitemap/robots)
e2e/ tests/           Playwright + Vitest specs
```
