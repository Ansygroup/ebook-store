#!/usr/bin/env node
/**
 * order_confirm.mjs — يرسل تأكيد طلب للعميل + إشعار للبايع عبر Gmail (Composio).
 *
 * يستخدم Composio v3.1 proxy execute (مصادقة Gmail تحصل سيرفر-سايد).
 * البيانات من src/data/books.json.
 *
 * الاستخدام:
 *   export COMPOSIO_API_KEY="ak_..."          # من ~/.hermes/composio_key
 *   export GMAIL_ACCOUNT="ca_XXX"            # connected Gmail account (من Composio)
 *   export SELLER_EMAIL="you@example.com"
 *   node scripts/order_confirm.mjs --to buyer@x.com --book the-influential-leader --order ORD-123
 */
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const API_KEY = process.env.COMPOSIO_API_KEY;
const ACCOUNT = process.env.GMAIL_ACCOUNT || 'ca_BmQnzbsU5u3T';
const SELLER = process.env.SELLER_EMAIL || 'sales@ebook-store.dev';

const args = process.argv.slice(2);
const get = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const to = get('--to');
const slug = get('--book');
const order = get('--order') || `ORD-${Date.now()}`;
const dry = args.includes('--dry');

if (!API_KEY) { console.error('❌ COMPOSIO_API_KEY غير معيّن.'); process.exit(1); }
if (!to || !slug) { console.error('الاستخدام: --to <email> --book <slug> [--order ID] [--dry]'); process.exit(1); }

const books = JSON.parse(readFileSync(resolve(root, 'src/data/books.json'), 'utf8'));
const book = books.find((b) => b.slug === slug);
if (!book) { console.error('❌ الكتاب غير موجود:', slug); process.exit(1); }

const SITE = 'https://ansygroup.github.io/ebook-store';
const subject = `✅ طلبك: ${book.title}`;
const body = [
  `مرحبًا،`,
  ``,
  `شكرًا لشرائك "${book.title}" بـ ${book.price} USD.`,
  `رابط التحميل: ${book.gumroadUrl && !book.gumroadUrl.includes('REPLACE') ? book.gumroadUrl : SITE + '/book/' + book.slug}`,
  ``,
  `رقم الطلب: ${order}`,
  `أي استفسار: ${SELLER}`,
  `— فريق متجر الكتب`,
].join('\n');

// Gmail API يتطلب raw RFC2822 بـ base64url
const raw = Buffer.from(
  `From: ${SELLER}\nTo: ${to}\nSubject: ${subject}\n\n${body}`,
).toString('base64url');

console.log(`📧 تأكيد طلب ${order} → ${to} (${book.title})`);
if (dry) { console.log('  [dry]', subject, '\n', body); process.exit(0); }

const res = await fetch(
  `https://backend.composio.dev/api/v3.1/tools/execute/proxy?toolkit_versions=latest`,
  {
    method: 'POST',
    headers: { 'X-API-KEY': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      connected_account_id: ACCOUNT,
      endpoint: 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { raw },
    }),
  },
);
const j = await res.json();
const d = j.data || j;
if (d.id && (d.labelIds || []).includes('SENT')) {
  console.log('  ✅ تم الإرسال (message id:', d.id + ')');
  process.exit(0);
} else {
  console.error('  ❌ فشل الإرسال:', JSON.stringify(d).slice(0, 200));
  process.exit(1);
}
