#!/usr/bin/env node
/**
 * generate-seo.mjs — يولّد sitemap.xml (مع hreflang) + robots.txt + llms.txt.
 * يُستدعى أثناء build عبر npm run build.
 * يستخدم Pages URL (النشر الفعلي الحي) بدل Vercel المحطوم.
 */
import { writeFileSync, readFileSync } from 'node:fs';

const SITE = 'https://ansygroup.github.io/ebook-store';
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

// robots.txt يشير لـ sitemap المطلق
const robots = `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`;
writeFileSync('public/robots.txt', robots);
console.log('✅ robots.txt');

// llms.txt — فهرس قابل للقراءة الآلية (absolute URLs)
const llms = `# Dar Al-Maarifa E-Book Store

> Arabic RTL e-book store with 10 expertly crafted titles in leadership, business, productivity, and self-development. Bilingual (AR/EN).

## Books
${books.map((b) => `- [${b.titleEn || b.title}](${SITE}/book/${b.slug}) — ${b.descriptionEn || b.description} ($${b.price})`).join('\n')}

## Pages
- [Home](${SITE}/)
- [Shop](${SITE}/shop)

## Assets
- Covers: ${SITE}/covers/<slug>.png
- Promo images: ${SITE}/promo/<slug>.png
- Sample PDFs: ${SITE}/downloads/<slug>.pdf
`;
writeFileSync('public/llms.txt', llms);
console.log('✅ llms.txt');
