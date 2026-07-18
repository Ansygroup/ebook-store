#!/usr/bin/env node
/**
 * copy-404.mjs — makes GitHub Pages serve SPA routes with HTTP 200 (not 404).
 *
 * GitHub Pages serves /folder/index.html at /folder/ with status 200. We generate
 * a real directory + index.html for every client route so crawlers see 200 (SEO-safe),
 * and ALSO keep dist/404.html as the ultimate fallback for unknown paths.
 * Runs after `vite build`.
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const dist = resolve(root, 'dist');

const index = readFileSync(resolve(dist, 'index.html'), 'utf8');

// SPA fallback script for the 404.html catch-all (client-side rewrite)
const spaScript = `
  <script>
    (function () {
      var seg = window.location.pathname.match(/\\/404\\.html$/);
      if (seg) {
        var real = window.location.pathname.replace(/\\/404\\.html$/, '') + window.location.search;
        window.history.replaceState(null, null, real || '/');
      }
    })();
  </script>
`;
const fallbackHtml = index.replace('</body>', spaScript + '\n  </body>');
writeFileSync(resolve(dist, '404.html'), fallbackHtml);

// Pre-render every client route as a real directory so Pages returns 200 (SEO-safe).
// Routes mirror src/App.tsx. Books/posts are read from source so the build stays in sync.
const books = JSON.parse(readFileSync(resolve(root, 'src/data/books.json'), 'utf8'));
const posts = JSON.parse(readFileSync(resolve(root, 'src/data/posts.json'), 'utf8'));

const routes = [
  '',
  'shop',
  'blog',
  'pricing',
  'faq',
  'privacy',
  'terms',
  'verify',
  'wishlist',
  ...books.map((b) => `book/${b.slug}`),
  ...posts.map((p) => `blog/${p.slug}`),
];

for (const r of routes) {
  const dir = resolve(dist, r);
  mkdirSync(dir, { recursive: true });
  // strip the leading "/" only for non-root; root already handled by dist/index.html
  const target = r === '' ? resolve(dist, 'index.html') : resolve(dir, 'index.html');
  if (r === '') {
    // dist/index.html already exists from vite — leave it
    continue;
  }
  writeFileSync(target, index);
}

// copy assets referenced relatively — vite uses absolute /assets/* so they resolve fine.
console.log(`✅ SPA routes pre-rendered (${routes.length} dirs, HTTP 200 on GitHub Pages) + dist/404.html fallback`);
