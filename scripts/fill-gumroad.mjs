#!/usr/bin/env node
/**
 * fill-gumroad.mjs — يملأ روابط Gumroad الحقيقية في src/data/books.json
 * من ملف gumroad-links.json (slug -> url).
 *
 * الاستخدام:
 *   1) انسخ gumroad-links.example.json إلى gumroad-links.json
 *   2) الصق روابطك الحقيقية من gumroad.com
 *   3) node scripts/fill-gumroad.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const booksPath = resolve(root, 'src/data/books.json');
const linksPath = resolve(root, 'gumroad-links.json');

if (!existsSync(linksPath)) {
  console.error('❌ gumroad-links.json غير موجود. انسخ gumroad-links.example.json إليه.');
  process.exit(1);
}

const books = JSON.parse(readFileSync(booksPath, 'utf8'));
const links = JSON.parse(readFileSync(linksPath, 'utf8'));

let filled = 0;
for (const b of books) {
  const url = links[b.slug];
  if (url && url.startsWith('http') && !url.includes('REPLACE')) {
    b.gumroadUrl = url;
    filled++;
  }
}
writeFileSync(booksPath, JSON.stringify(books, null, 2) + '\n');
console.log(`✅ حدّثت ${filled}/${books.length} رابط Gumroad في src/data/books.json`);
console.log('   الآن: git add -A && git commit -m "feat: real Gumroad links" && git push');
