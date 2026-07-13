#!/usr/bin/env node
/**
 * ig_promote.mjs — ينشر بطاقة كتاب على Instagram عبر Composio.
 *
 * القيود عند المستخدم (من AGENTS.md):
 *   - Composio IG toolkit (slug=instagram) ليس له أداة delete ولا schedule.
 *   - النشر الدوري يتم عبر cron خارجي (هذا السكربت = خطوة واحدة لكل استدعاء).
 *
 * الاستخدام:
 *   export COMPOSIO_API_KEY="your_key"
 *   node scripts/ig_promote.mjs --slug the-influential-leader
 *   node scripts/ig_promote.mjs --all            # ينشر كتاب واحد عشوائي/مميّز كل استدعاء
 *
 * ملاحظة: يستخدم INSTAGRAM_CREATE_MEDIA_CONTAINER + INSTAGRAM_CREATE_POST
 * (متحقق منه مع version 20260708_00). الصورة = غلاف الكتاب من public/covers.
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// بيانات الكتب (JSON مفصول — آمن للقراءة من node)
const books = JSON.parse(
  readFileSync(resolve(root, 'src/data/books.json'), 'utf8'),
);

const flags = process.argv.slice(2);
const getFlag = (n) => {
  const i = flags.indexOf(n);
  return i >= 0 ? flags[i + 1] : null;
};

const slug = getFlag('--slug');
const all = flags.includes('--all');

if (!process.env.COMPOSIO_API_KEY) {
  console.error('❌ COMPOSIO_API_KEY غير معيّن. صدّره أولاً.');
  process.exit(1);
}

const target =
  slug ? books.find((b) => b.slug === slug)
        : all ? books.find((b) => b.featured) || books[0]
        : null;

if (!target) {
  console.error('❌ ما لقيت كتاب. تأكد --slug أو استخدم --all.');
  process.exit(1);
}

const coverPath = `public/covers/${target.cover}`;
if (!existsSync(resolve(root, coverPath))) {
  console.error(`❌ غلاف الكتاب مفقود: ${coverPath}`);
  process.exit(1);
}

const caption =
  `📚 ${target.title} — ${target.author}\n` +
  `${target.description}\n\n` +
  `💰 $${target.price}\n` +
  `🛒 اطلبه الآن: https://ansygroup.github.io/ebook-store/book/${target.slug}\n\n` +
  `#كتب_إلكترونية #قراءة #تطوير_الذات #leadership`;

console.log('📤 سيُنشر على IG عبر Composio:');
console.log('   الكتاب :', target.title);
console.log('   الغلاف :', coverPath);
console.log('   الـ caption:\n' + caption.split('\n').map((l) => '     ' + l).join('\n'));

// الاستدعاء الفعلي عبر Composio v3.1 proxy execute (مصادقة الحساب سيرفر-سايد).
// IG ليس له delete/schedule → النشر يدوي أو عبر cron خارجي.
const API_KEY = process.env.COMPOSIO_API_KEY;
const IG_ACCOUNT = process.env.IG_ACCOUNT; // معرّف حساب IG على Composio (يربطه المستخدم)

if (!API_KEY) {
  console.log('\n⚠️  COMPOSIO_API_KEY غير معيّن — الاستدعاء معطّل.');
  console.log('    صدّره ثم شغّل: export COMPOSIO_API_KEY="ak_..."');
  process.exit(0);
}

const base = 'https://backend.composio.dev/api/v3.1/tools/execute/proxy?toolkit_versions=latest';
const auth = { 'X-API-KEY': API_KEY, 'Content-Type': 'application/json' };

async function igProxy(method, endpoint, bodyObj) {
  const res = await fetch(base, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({
      connected_account_id: IG_ACCOUNT,
      endpoint: `https://graph.facebook.com/v21.0${endpoint}`,
      method,
      headers: { 'Content-Type': 'application/json' },
      body: bodyObj,
    }),
  });
  return res.json();
}

// 1) Create media container
const absCover = `https://ansygroup.github.io/ebook-store/covers/${target.cover}`;
const container = await igProxy('POST', '/me/media', {
  image_url: absCover,
  caption,
  access_token: 'COMPOSIO_INJECTED',
});
if (!container.id) {
  console.error('\n❌ فشل إنشاء media container:', JSON.stringify(container).slice(0, 200));
  process.exit(1);
}
// 2) Publish
const published = await igProxy('POST', '/me/media_publish', {
  creation_id: container.id,
  access_token: 'COMPOSIO_INJECTED',
});
console.log('\n✅ نُشر على Instagram:', published.id || JSON.stringify(published).slice(0, 120));
process.exit(0);
