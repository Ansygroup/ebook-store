# Required GitHub Secrets (Settings → Secrets → Actions):
#
#   VERCEL_TOKEN          from vercel.com/account/tokens
#   VERCEL_ORG_ID         from .vercel/project.json  (orgId)
#   VERCEL_PROJECT_ID     from .vercel/project.json  (projectId)
#   COMPOSIO_API_KEY      from app.composio.dev (API key) — powers order confirmation via Gmail
#   GMAIL_ACCOUNT         connected Gmail account on Composio (default: ca_BmQnzbsU5u3T)
#   SELLER_EMAIL          your confirmation email (default: sales@ebook-store.dev)
#
# After adding them and linking the repo to GitHub, every `git push` to main/master
# builds + runs tests + deploys to Vercel automatically.
# (VERCEL_PROTECTION_DISABLED=1 in CI disables preview protection automatically)
#
# For local manual deploy without GitHub:
#   export VERCEL_TOKEN="vcp_..."
#   npm run deploy
#
# ============ Composio (order confirmation + IG marketing) ============
# Order confirmation: /api/confirm-order calls Gmail via Composio proxy (proven working).
# IG marketing: npm run ig:promote (needs a linked IG account — current ca_d461BvmxN65- is expired)
# ⚠️ Composio limits: no delete / no schedule → periodic posting via external cron.
#
# To disable Vercel Auth Protection manually (if CI didn't remove it):
#   Vercel Dashboard → Project → Settings → Deployment Protection → turn off Vercel Authentication
