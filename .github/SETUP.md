# أسرار GitHub المطلوبة للنشر المستمر (Settings → Secrets → Actions):
#
#   VERCEL_TOKEN          من vercel.com/account/tokens
#   VERCEL_ORG_ID         من .vercel/project.json  (orgId)
#   VERCEL_PROJECT_ID     من .vercel/project.json  (projectId)
#   VITE_SNIPCART_API_KEY مفتاح Snipcart العام (snipcart.com → Account → API Keys)
#
# بعد إضافتها وربط الريبو بـ GitHub، كل `git push` على main/master
# يبني + يشغّل الفحوصات + ينشر على Vercel تلقائياً.
#
# للنشر اليدوي المحلي بدون GitHub:
#   export VERCEL_TOKEN="vcp_..." VITE_SNIPCART_API_KEY="pk_..."
#   npm run deploy
#
# ============ Composio (تسويق الكتب على Instagram) ============
# لربط بوت ينشر بطاقات الكتب على IG عبر Composio:
#   COMPOSIO_API_KEY      من app.composio.dev (مفتاح API)
#   Connected Account IG: ca_d461BvmxN65-  (IG 17841408299412233)
# ⚠️ قيود Composio عندك: لا delete / لا schedule → استخدم cron للنشر الدوري.
# تحتاج استدعاء toolkit: instagram (INSTAGRAM_CREATE_MEDIA_CONTAINER + INSTAGRAM_CREATE_POST)
