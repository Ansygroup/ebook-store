#!/usr/bin/env node
/**
 * fill-gumroad.mjs — يملأ روابط Gumroad الحقيقية في src/data/books.json.
 *
 * الطريقة:
 *   1) أنشئ منتجاتك على https://gumroad.com/products (ٌ دقائق لكل كتاب)
 *   2) انسخ رابط الشراء (يبدأ بـ https://gumroad.com/l/...)
 *   3) الصقها في ملف gumroad-links.json بهذا الشكل:
 *      {
 *        "the-influential-leader": "https://gumroad.com/l/abcd1234",
 *        "build-your-empire": "https://gumroad.com/l/efgh5678"
 *      }
 *   4) شغّل: node scripts/fill-gumroad.mjs
 *
 * السكربت يستبدل الـ placeholders ويثبت الروابط الحقيقية.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const booksPath = resolve(root, 'src/data/books.json');
const linksPath = resolve(root, 'gumroad-links.json');

if (!existsSync(linksPath)) {
  console.log('❌ ملف gumroad-links.json غير موجود.');
  console.log('   أنشئه بهذا الشكل:');
  console.log('   { "the-influential-leader": "https://gumroad.com/l/XXXX", ... }');
  console.log('   ثم شغّل: node scripts/fill-gumroad.mjs');
  process.exit(1);
}

const links = JSON.parse(readFileSync(linksPath, 'utf8'));
const books = JSON.parse(readFileSync(booksPath, 'utf8'));

let filled = 0;
for (const b of books) {
  const link = links[b.slug];
  if (link && link.startsWith('http') && !link.includes('REPLACE_WITH_YOUR_LINK')) {
    b.gumroadUrl = link;
    filled++;
  }
}

writeFileSync(booksPath, JSON.stringify(books, null, 2) + '\n');
console.log(`✅ ملئت ${filled} رابط Gumroad من ${books.length} كتاب.`);
console.log('   شغّل: npm run build && git add -A && git commit -m "feat: real Gumroad links"');
