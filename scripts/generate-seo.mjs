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
// llms-full.txt — فهرس محتوى كامل (dynamic من books.json)
const llmsFull = `# Dar Al-Maarifa E-Book Store — Full Content Map
> Arabic RTL e-book store with 10 expertly crafted titles in leadership, business, productivity, self-development, tech, health, finance, negotiation, content & languages. Bilingual (AR/EN). Instant PDF download.

## Books (full detail)
${books.map((b) => {
  const tags = (b.tags || []).join(', ');
  const kw = (b.keywords || []).join(', ');
  return `- [${b.titleEn || b.title}](${SITE}/book/${b.slug}) — Author: ${b.authorEn || b.author}. ${b.descriptionEn || b.description} ${b.pages || ''} pages. Rating ${b.rating || '4.8'}/5. $${b.price}. Tags: ${tags}. Keywords: ${kw}.`;
}).join('\n')}

## Pages
- [Home](${SITE}/)
- [Shop](${SITE}/shop)
- [FAQ](${SITE}/faq)

## Purchase flow
- Checkout is handled via Gumroad (secure external payment). Each book page has a "Buy now on Gumroad" action.
- After payment you get an instant PDF download link + a confirmation email.
- Newsletter signup available on the home page (weekly book + discount coupon).

## Why Dar Al-Maarifa
- All books are bilingual (Arabic + English) with instant PDF delivery.
- Prices start at $9.99. Secure checkout via Gumroad.
- Join 12,000+ readers getting the best book summaries weekly.

## Assets
- Covers: ${SITE}/covers/<slug>.png
- Promo images: ${SITE}/promo/<slug>.png
- Sample PDFs: ${SITE}/downloads/<slug>.pdf

## Sitemaps / feeds
- Sitemap: ${SITE}/sitemap.xml
- llms.txt: ${SITE}/llms.txt
`;
writeFileSync('public/llms-full.txt', llmsFull);
console.log('✅ llms-full.txt (dynamic, Gumroad-correct)');

// llms.txt — فهرس قابل للقراءة الآلية (absolute URLs, keywords-rich)
const llms = `# Dar Al-Maarifa E-Book Store
> Arabic RTL e-book store with 10 expertly crafted titles in leadership, business, productivity, self-development, tech, health, finance, negotiation, content & languages. Bilingual (AR/EN). Instant PDF download. Prices from $9.99.

## Books
${books.map((b) => {
  const kw = (b.keywordsEn || []).join(', ');
  return `- [${b.titleEn || b.title}](${SITE}/book/${b.slug}) — ${b.descriptionEn || b.description} ($${b.price}). Keywords: ${kw}.`;
}).join('\n')}

## Pages
- [Home](${SITE}/)
- [Shop](${SITE}/shop)
- [FAQ](${SITE}/faq)

## Assets
- Covers: ${SITE}/covers/<slug>.png
- Promo images: ${SITE}/promo/<slug>.png
- Sample PDFs: ${SITE}/downloads/<slug>.pdf
`;
writeFileSync('public/llms.txt', llms);
console.log('✅ llms.txt');
