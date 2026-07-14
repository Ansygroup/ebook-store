#!/usr/bin/env node
/**
 * copy-404.mjs — يجعل GitHub Pages يعمل كـ SPA.
 * ينسخ dist/index.html → dist/404.html ويضيف سكربت يحوّل مسار 404 إلى
 * مسار SPA حقيقي عبر History API (بدون إعادة تحميل).
 * يشغّل بعد vite build.
 */
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const dist = resolve(root, 'dist');

const index = readFileSync(resolve(dist, 'index.html'), 'utf8');

// أدخل سكربت SPA fallback قبل </body> (يحوّل /404.html?/<path> → /<path>)
const spaScript = `
  <script>
    // GitHub Pages SPA fallback: rewrite /404.html?/path → /path (history API)
    (function () {
      var seg = window.location.pathname.match(/\\/404\\.html$/);
      if (seg) {
        var real = window.location.pathname.replace(/\\/404\\.html$/, '') + window.location.search;
        window.history.replaceState(null, null, real || '/');
      }
    })();
  </script>
`;
const html = index.replace('</body>', spaScript + '\n  </body>');

writeFileSync(resolve(dist, '404.html'), html);
console.log('✅ dist/404.html (SPA fallback) generated from dist/index.html');
