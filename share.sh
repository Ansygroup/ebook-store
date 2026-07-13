#!/usr/bin/env bash
# share.sh — يبني المتجر وينشره على رابط عام فوري عبر ngrok (بدون حماية)
# الاستخدام: bash share.sh   ثم افتح الرابط المطبوع
set -e
cd "$(dirname "$0")"

echo "📦 بناء المتجر..."
npm run build
cp dist/index.html dist/200.html  # SPA fallback

echo "🌐 تشغيل خادم محلي على :4321..."
npx --yes serve -s dist -l 4321 &
SERVE_PID=$!
sleep 4

echo "🚇 فتح نفق ngrok عام..."
ngrok http 4321 --log stdout &
NGROK_PID=$!
sleep 6

URL=$(curl -s http://localhost:4040/api/tunnels | python -c "import sys,json;print(json.load(sys.stdin)['tunnels'][0]['public_url'])")
echo ""
echo "✅ الموقع متاح للجميع على:"
echo "   $URL"
echo ""
echo "⚠️  الرابط مؤقت — يبقى شغّالاً طالما هذا الأمر يعمل. Ctrl+C للإيقاف."
echo "   للإنتاج الدائم: انشر على Vercel (بعد إيقاف Deployment Protection)."

trap "kill $SERVE_PID $NGROK_PID 2>/dev/null" EXIT
wait
