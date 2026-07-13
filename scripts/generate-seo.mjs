#!/usr/bin/env node
/**
 * generate-seo.mjs — يولّد sitemap.xml (مع hreflang) + يبلّغ عن og-cover.
 * يُستدعى أثناء build عبر npm run build.
 */
import { writeFileSync, readFileSync } from 'node:fs';

const SITE = 'https://ebook-store-ansygroups-projects.vercel.app';
const books = JSON.parse(readFileSync('src/data/books.json', 'utf8'));

const pages = ['', '/shop', ...books.map((b) => `/book/${b.slug}`)];

const hreflang = (p) => {
  const base = `${SITE}${p}`;
  if (p === '') {
    // الصفحة الرئيسية: نسختان لغويتان
    return `
    <xhtml:link rel="alternate" hreflang="ar" href="${base}?lang=ar" />
    <xhtml:link rel="alternate" hreflang="en" href="${base}?lang=en" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${base}" />`;
  }
  // باقي الصفحات: لغة واحدة (محتوى ثنائي داخل الصفحة)
  return `
    <xhtml:link rel="alternate" hreflang="x-default" href="${base}" />`;
};

const urls = pages
  .map((p) => {
    const pri = p === '' ? '1.0' : p.startsWith('/book/') ? '0.8' : '0.9';
    return `  <url><loc>${SITE}${p}</loc>${hreflang(p)}
    <changefreq>weekly</changefreq><priority>${pri}</priority></url>`;
  })
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
writeFileSync('public/sitemap.xml', sitemap);
console.log(`✅ sitemap.xml (${pages.length} URLs with hreflang)`);
