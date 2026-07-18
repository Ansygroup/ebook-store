# Setup & Go-Live Guide — ebook-store

Everything is built and verified. The only missing pieces are **your live credentials**.
This guide tells you exactly what to paste where, and what each unlocks.

---

## 1. Stripe (enables real checkout + delivery)

### 1a. Create Payment Links (one-time)
You need a **full** Stripe secret key (starts `sk_live_`, ~110 chars — the one pasted earlier was truncated at 72).

```bash
STRIPE_SECRET_KEY=sk_live_xxx npm run stripe:links
```
This creates a Stripe Price + Payment Link per book (with `metadata.slug`),
then writes each `stripeUrl` back into `src/data/books.json`.
Commit + deploy after it finishes.

### 1b. Webhook (already coded — just point Stripe at it)
- Worker is live: `https://ebook-store-api.livepm8.workers.dev`
- Webhook endpoint: `https://ebook-store-api.livepm8.workers.dev/api/stripe-webhook`
- In Stripe Dashboard → Webhooks → add endpoint, sign with:
  `STRIPE_WEBHOOK_SECRET` (already in `worker/.dev.vars`, used for HMAC verify)
- Events to listen: `checkout.session.completed`

---

## 2. Order / Newsletter email (Composio + Gmail)

The Worker sends delivery emails via Composio Gmail. You need:
- A **valid** `COMPOSIO_API_KEY` (the one pasted returned 404 — regenerate in Composio).
- A Gmail **Connected Account ID** in the form `ca_xxx` (NOT a project name like `livepm8_workspace_first_project`).
  Find it: Composio Dashboard → Connected Accounts → Gmail → copy the `ca_...` id.

Put both in `worker/.dev.vars` and redeploy:
```bash
npx wrangler deploy
```

---

## 3. Meta Pixel (ad tracking)

Replace the placeholder in `scripts/generate-pixel.mjs` / build env:
```bash
VITE_META_PIXEL_ID=123456789012345 npm run build && npm run deploy
```
(Currently `your_pixel_id_here` → pixel.js is a safe no-op.)

---

## 4. What's already live (no action needed)

| Feature | Status |
|---|---|
| GitHub Pages site | ✅ https://ansygroup.github.io/ebook-store/ |
| Cloudflare Worker (API) | ✅ deployed, HMAC-verified webhook ready |
| SEO (sitemap, image-sitemap, hreflang, JSON-LD, PWA) | ✅ |
| Coupons (READ20 / LEAD10 / BUNDLE30 / LEAD10) | ✅ |
| Wishlist + Recently viewed + Bundle + Exit popup | ✅ |
| CSP (fixed — was blocking Pixel + SPA) | ✅ |
| 33 unit + 10 e2e tests green | ✅ |

---

## 5. Quick health check (run anytime)
```bash
npm run test        # 33 unit
CI=1 npx playwright test   # 10 e2e
npm run build       # 27 SPA routes prerendered
curl -s -o /dev/null -w "%{http_code}" https://ansygroup.github.io/ebook-store/wishlist/   # 200
```
