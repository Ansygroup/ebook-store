#!/usr/bin/env node
/**
 * fill-gumroad.mjs — fills real Gumroad links into src/data/books.json (and syncs public/books.json)
 * from gumroad-links.json (slug -> url).
 *
 * Usage:
 *   1) cp gumroad-links.example.json gumroad-links.json
 *   2) paste your real links from gumroad.com
 *   3) node scripts/fill-gumroad.mjs
 *   4) npm run build && git push
 */
import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const booksPath = resolve(root, 'src/data/books.json');
const publicPath = resolve(root, 'public/books.json');
const linksPath = resolve(root, 'gumroad-links.json');

if (!existsSync(linksPath)) {
  console.error('❌ gumroad-links.json not found. Copy gumroad-links.example.json to it and paste your links.');
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

// sync public/books.json (what the app actually fetches)
copyFileSync(booksPath, publicPath);

console.log(`✅ Updated ${filled}/${books.length} Gumroad links in src/data/books.json`);
console.log('✅ Synced public/books.json');
if (filled < books.length) {
  console.log(`⚠️  ${books.length - filled} still placeholder — add them to gumroad-links.json`);
}
console.log('   Next: npm run build && git push');
