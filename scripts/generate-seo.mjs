#!/usr/bin/env node
/**
 * generate-seo.mjs — يولّد sitemap.xml و og-cover.png (placeholder) لكل الكتب.
 * يُستدعى أثناء build عبر npm run build.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const SITE = 'https://ebook-store-cxm4obhkq-ansygroups-projects.vercel.app';
const books = JSON.parse(
  (await import('node:fs')).readFileSync('src/data/books.json', 'utf8'),
);

// sitemap.xml
const urls = [
  '',
  '/shop',
  ...books.map((b) => `/book/${b.slug}`),
]
  .map(
    (p) =>
      `  <url><loc>${SITE}${p}</loc><changefreq>weekly</changefreq><priority>${
        p === '' ? '1.0' : p.startsWith('/book/') ? '0.8' : '0.9'
      }</priority></url>`,
  )
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
writeFileSync('public/sitemap.xml', sitemap);
console.log(`✅ sitemap.xml (${books.length + 2} URLs)`);

// og-cover.png placeholder (1x1 px transparent — استبدله بصورة 1200x630 حقيقية)
const png = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M8AAAMBAQDJ/pLvAAAAAElFTkSuQmCC',
  'base64',
);
mkdirSync('public', { recursive: true });
writeFileSync('public/og-cover.png', png);
console.log('✅ og-cover.png (placeholder — استبدله بصورة 1200x630)');
