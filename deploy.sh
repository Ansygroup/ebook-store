#!/usr/bin/env bash
# نشر على Vercel — يقرأ VERCEL_TOKEN من البيئة.
# الاستخدام:
#   export VERCEL_TOKEN="vcp_xxxxxxxxxxxx"
#   ./deploy.sh
# أو اربط الريبو بـ GitHub (يقرأ Vercel secrets تلقائياً).
set -euo pipefail

cd "$(dirname "$0")"

if [ -z "${VERCEL_TOKEN:-}" ]; then
  echo "❌ غيّب VERCEL_TOKEN. احصل عليه من vercel.com/account/tokens"
  echo "   ثم: export VERCEL_TOKEN=\"vcp_...\""
  exit 1
fi

echo "🔧 بناء الموقع..."
npm run build

echo "🚀 النشر على Vercel..."
vercel deploy --prod --yes

echo "✅ تم النشر."
