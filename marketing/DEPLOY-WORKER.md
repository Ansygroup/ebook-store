# 🔧 Deploy the Cloudflare Worker API (replaces dead Vercel)

The store's newsletter + order-confirm APIs need a backend. Vercel token is dead,
so we use a **free Cloudflare Worker** (`worker/index.js`). 100k requests/day — plenty.

## Steps (your CF account needed — I can't access it)
```bash
# 1. Install wrangler
npm i -g wrangler

# 2. Login (opens browser — your CF account)
wrangler login

# 3. Secrets (from Composio dashboard)
wrangler secret put COMPOSIO_API_KEY   # your Composio key
wrangler secret put GMAIL_ACCOUNT      # ca_xxx (the Gmail connected account)
wrangler secret put SELLER_EMAIL       # sales@ebook-store.dev

# 4. Deploy
wrangler deploy
# → prints https://ebook-store-api.<your-subdomain>.workers.dev

# 5. Wire frontend to the Worker
#    Set GitHub repo secret:  VITE_API_BASE = https://ebook-store-api.<your-subdomain>.workers.dev
#    Then: git commit --allow-empty -m "use worker api" && git push
#    (CI rebuilds with VITE_API_BASE → newsletter + order confirm go live)
```

## Verify
- Sign up on the live store → should receive welcome email (via Composio Gmail)
- Buy a book (after Gumroad links) → should receive download-link email

## Why this works
- `worker/index.js` handles `/api/subscribe` + `/api/confirm-order`
- Calls Composio Gmail proxy (same as the old Vercel function)
- No Vercel token needed — fully free, fully yours

## Fallback
If you fix the Vercel token instead, set `VITE_API_BASE=https://ebook-store-ansygroups-projects.vercel.app`
and the existing `api/*.ts` functions work. Worker is the recommended path (no token expiry risk).
