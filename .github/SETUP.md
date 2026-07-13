# أسرار GitHub المطلوبة للنشر المستمر (Settings → Secrets → Actions):
#
#   VERCEL_TOKEN          من vercel.com/account/tokens
#   VERCEL_ORG_ID         من .vercel/project.json  (orgId)
#   VERCEL_PROJECT_ID     من .vercel/project.json  (projectId)
#   VITE_SNIPCART_API_KEY مفتاح Snipcart العام (snipcart.com → Account → API Keys)
#   COMPOSIO_API_KEY      من app.composio.dev (مفتاح API) — يشغّل تأكيد الطلبات عبر Gmail
#   GMAIL_ACCOUNT         connected account لـ Gmail على Composio (افتراضي: ca_BmQnzbsU5u3T)
#   SELLER_EMAIL          بريدك للتأكيدات (افتراضي: sales@ebook-store.dev)
#
# بعد إضافتها وربط الريبو بـ GitHub، كل `git push` على main/master
# يبني + يشغّل الفحوصات + ينشر على Vercel تلقائياً.
# (VERCEL_PROTECTION_DISABLED=1 في CI يوقف حماية preview تلقائياً)
#
# للنشر اليدوي المحلي بدون GitHub:
#   export VERCEL_TOKEN="vcp_..." VITE_SNIPCART_API_KEY="pk_..."
#   npm run deploy
#
# ============ Composio (تأكيد الطلبات + تسويق IG) ============
# تأكيد الطلبات: /api/confirm-order يستدعي Gmail عبر Composio proxy (يثبت شغّال).
# تسويق IG: npm run ig:promote (يحتاج حساب IG مربوط — الحالي ca_d461BvmxN65- منتهٍ)
# ⚠️ قيود Composio: لا delete / لا schedule → النشر الدوري عبر cron خارجي.
#
# لإيقاف Vercel Auth Protection يدويًا (لو CI ما شاله):
#   Vercel Dashboard → Project → Settings → Deployment Protection → أوقف Vercel Authentication
