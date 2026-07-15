#!/usr/bin/env node
/**
 * generate-feed.mjs — builds RSS 2.0 feed for the blog (discovery + readers).
 * Called during build via npm run build.
 */
import { writeFileSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const posts = JSON.parse(readFileSync(resolve(root, 'src/data/posts.json'), 'utf8'));
const SITE = 'https://ansygroup.github.io/ebook-store';

const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));

const items = sorted
  .map((p) => {
    const url = `${SITE}/blog/${p.slug}`;
    const desc = (p.excerptEn || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const title = (p.titleEn || p.title).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${desc}</description>
      <category>${p.tags.join('</category>\n      <category>')}</category>
    </item>`;
  })
  .join('\n');

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Dar Al-Maarifa — Blog</title>
    <link>${SITE}/blog</link>
    <description>Leadership, business & self-development insights from Dar Al-Maarifa.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
writeFileSync(resolve(root, 'public/feed.xml'), rss);
console.log(`✅ feed.xml (${sorted.length} posts)`);
