# أسرار GitHub المطلوبة للنشر المستمر (Settings → Secrets → Actions):
#
#   NETLIFY_AUTH_TOKEN      من Netlify → User settings → Applications → Personal access tokens
#   NETLIFY_SITE_ID         من Site settings → Site information → API ID
#   VITE_SNIPCART_API_KEY   مفتاح Snipcart العام (من snipcart.com → Account → API Keys)
#
# بعد إضافتها وربط الريبو بـ GitHub، كل `git push` على main/master
# يبني + يشغّل الفحوصات + ينشر على Netlify تلقائياً.
#
# للنشر اليدوي المحلي بدون GitHub:
#   export NETLIFY_AUTH_TOKEN="ntn_..." VITE_SNIPCART_API_KEY="pk_..."
#   npm run deploy
