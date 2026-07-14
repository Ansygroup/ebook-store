#!/usr/bin/env bash
# setup-api.sh — deploys the Cloudflare Worker API (replaces dead Vercel).
# Requires: CF_API_TOKEN in env (your Cloudflare API token with Worker edit rights)
#
# Usage:
#   export CF_API_TOKEN=xxxx
#   ./scripts/setup-api.sh
#
# After deploy, set GitHub secret VITE_API_BASE = https://ebook-store-api.<sub>.workers.dev
# then: git commit --allow-empty -m "use worker api" && git push
set -e

if [ -z "$CF_API_TOKEN" ]; then
  echo "❌ Set CF_API_TOKEN first: export CF_API_TOKEN=xxxx"
  exit 1
fi

echo "📦 Installing wrangler..."
npm i -g wrangler

echo "🔐 Logging in via token..."
echo "$CF_API_TOKEN" | wrangler login --token 2>/dev/null || echo "(token login skipped — use 'wrangler login' in browser if needed)"

echo "🔑 Setting secrets..."
wrangler secret put COMPOSIO_API_KEY < ~/.hermes/composio_key
wrangler secret put GMAIL_ACCOUNT <<'EOF'
${GMAIL_ACCOUNT:-ca_BmQnzbsU5u3T}
EOF
wrangler secret put SELLER_EMAIL <<'EOF'
sales@ebook-store.dev
EOF

echo "🚀 Deploying worker..."
wrangler deploy

echo "✅ Done. Copy the workers.dev URL above and set it as GitHub secret VITE_API_BASE."
