#!/usr/bin/env node
/**
 * gumroad_sync.mjs — يولّد تقرير بالكتب وجاهزية روابط Gumroad.
 *
 * ⚠️ ملاحظة قيد Composio: الـ proxy execute لـ Gumroad لا يمرر حقل
 * `price` بشكل صحيح (يُرجع "New products should be created with a price").
 * الحل العملي: أنشئ المنتجات يدويًا على gumroad.com (ٌ دقايق)،
 * ثم الصق رابط الشراء في src/data/books.json تحت `gumroadUrl`.
 *
 * هذا السكربت يتحقق من اكتمال الروابط ويطبع قائمة جاهزة للصق.
 *
 * الاستخدام:
 *   node scripts/gumroad_sync.mjs          # تقرير الجاهزية
 *   node scripts/gumroad_sync.mjs --links   # يطبع slug | الرابط لكل كتاب
 */
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const books = JSON.parse(readFileSync(resolve(root, 'src/data/books.json'), 'utf8'));
const LINKS = process.argv.includes('--links');

if (LINKS) {
  console.log('slug | gumroadUrl');
  books.forEach((b) => console.log(`${b.slug} | ${b.gumroadUrl || '(غير محدد)'}`));
  process.exit(0);
}

const ready = books.filter((b) => b.gumroadUrl && !b.gumroadUrl.includes('REPLACE_WITH_YOUR_LINK'));
console.log(`📦 الكتب: ${books.length}`);
console.log(`✅ جاهزة (لها رابط Gumroad): ${ready.length}`);
console.log(`⏳ تنتظر رابط: ${books.length - ready.length}`);
console.log('\nلإكمال: أنشئ المنتجات على https://gumroad.com/products ثم الصق الروابط في src/data/books.json');
if (books.length - ready.length > 0) {
  console.log('\nالكتب بدون رابط:');
  books.filter((b) => !b.gumroadUrl || b.gumroadUrl.includes('REPLACE_WITH_YOUR_LINK'))
    .forEach((b) => console.log(`  - ${b.slug}  (${b.title})`));
}
