#!/usr/bin/env bash
# نشر تلقائي على Netlify — يشتغل فور تملك NETLIFY_AUTH_TOKEN
# الاستخدام:
#   export NETLIFY_AUTH_TOKEN="ntn_xxxxxxxxxxxx"
#   ./deploy.sh
# أو اربط الريبو بـ GitHub واربطه بـ Netlify (يفضّل — نشر مستمر).
set -euo pipefail

cd "$(dirname "$0")"

if [ -z "${NETLIFY_AUTH_TOKEN:-}" ]; then
  echo "❌ غيّب NETLIFY_AUTH_TOKEN. احصل عليه من:"
  echo "   Netlify Dashboard → User settings → Applications → Personal access tokens"
  echo "ثم: export NETLIFY_AUTH_TOKEN=\"ntn_...\""
  exit 1
fi

echo "🔧 بناء الموقع..."
npm run build

if ! command -v netlify >/dev/null 2>&1; then
  echo "📦 تثبيت netlify-cli..."
  npm install -g netlify-cli
fi

echo "🚀 النشر على Netlify (production)..."
netlify deploy --prod --dir=dist --auth="$NETLIFY_AUTH_TOKEN" --message="deploy ebook-store"

echo "✅ تم النشر. افتح الرابط أعلاه."
