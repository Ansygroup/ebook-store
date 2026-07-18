# ebook-store Cloudflare Worker (API + Stripe webhook)

Replaces the dead Vercel API. Free tier: 100k req/day.

## Endpoints
- `POST /api/subscribe` — newsletter signup → welcome email (Composio Gmail)
- `POST /api/confirm-order` — manual order confirm → delivery email
- `POST /api/stripe-webhook` — **Stripe webhook**: on `checkout.session.completed`,
  reads `session.metadata.slug` + `customer_email`, sends instant download email.

## Deploy
```bash
npm i -g wrangler
wrangler login
echo "COMPOSIO_API_KEY=xxx" > .dev.vars
echo "GMAIL_ACCOUNT=ca_xxx" >> .dev.vars
echo "SELLER_EMAIL=sales@ebook-store.dev" >> .dev.vars
echo "STRIPE_WEBHOOK_SECRET=whsec_xxx" >> .dev.vars
wrangler deploy
```
Then set GitHub secret `VITE_API_BASE` = `https://ebook-store-api.<your>.workers.dev`
and redeploy Pages so the frontend calls the Worker instead of the mailto fallback.

## Stripe setup
1. Stripe Dashboard → **Payment Links** (or Checkout Sessions).
2. Add **metadata** `slug` = the book slug (e.g. `the-influential-leader`).
3. Dashboard → **Webhooks** → Add endpoint:
   `https://ebook-store-api.<your>.workers.dev/api/stripe-webhook`
   - Listen to: `checkout.session.completed`
4. Orders now auto-deliver via Gmail (no manual step).

> Note: signature verification is **enabled** when `STRIPE_WEBHOOK_SECRET` is set
> (HMAC-SHA256 over `t.payload` using Web Crypto). Without it, the endpoint runs
> unverified (dev only) and logs a warning. Always set the secret in production.
