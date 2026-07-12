// Generates consistent, on-brand SVG book covers into public/covers/.
// Run with: node scripts/generate-covers.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '../public/covers');
mkdirSync(outDir, { recursive: true });

const themes = {
  leadership: { from: '#4f46e5', to: '#7c3aed', glyph: 'L', label: 'LEADERSHIP' },
  business: { from: '#059669', to: '#0d9488', glyph: 'B', label: 'BUSINESS' },
  productivity: { from: '#d97706', to: '#f59e0b', glyph: 'P', label: 'FOCUS' },
  selfdev: { from: '#db2777', to: '#e11d48', glyph: 'M', label: 'MINDSET' },
  tech: { from: '#0891b2', to: '#2563eb', glyph: 'T', label: 'TECH' },
  health: { from: '#16a34a', to: '#65a30d', glyph: 'H', label: 'HEALTH' },
  negotiation: { from: '#7c3aed', to: '#db2777', glyph: 'N', label: 'NEGOTIATE' },
  investing: { from: '#059669', to: '#10b981', glyph: 'I', label: 'INVEST' },
  content: { from: '#ea580c', to: '#f59e0b', glyph: 'W', label: 'CONTENT' },
  languages: { from: '#2563eb', to: '#06b6d4', glyph: 'A', label: 'LANGUAGES' },
};

function cover({ from, to, glyph, label }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="900" viewBox="0 0 600 900" role="img" aria-label="${label} book cover">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/>
      <stop offset="1" stop-color="${to}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.3" cy="0.2" r="0.9">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="600" height="900" fill="url(#g)"/>
  <rect width="600" height="900" fill="url(#glow)"/>
  <circle cx="470" cy="150" r="220" fill="#ffffff" opacity="0.08"/>
  <circle cx="120" cy="760" r="180" fill="#000000" opacity="0.08"/>
  <rect x="40" y="40" width="520" height="820" rx="18" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="2"/>
  <text x="300" y="360" font-family="Georgia, 'Times New Roman', serif" font-size="240" font-weight="700" fill="#ffffff" fill-opacity="0.92" text-anchor="middle">${glyph}</text>
  <text x="300" y="470" font-family="Helvetica, Arial, sans-serif" font-size="22" letter-spacing="8" fill="#ffffff" fill-opacity="0.85" text-anchor="middle">${label}</text>
  <line x1="210" y1="520" x2="390" y2="520" stroke="#ffffff" stroke-opacity="0.6" stroke-width="2"/>
  <text x="300" y="830" font-family="Helvetica, Arial, sans-serif" font-size="18" letter-spacing="4" fill="#ffffff" fill-opacity="0.7" text-anchor="middle">DAR AL-MAʿRIFA</text>
</svg>`;
}

for (const [name, theme] of Object.entries(themes)) {
  writeFileSync(resolve(outDir, `${name}.svg`), cover(theme), 'utf8');
  console.log('wrote', `${name}.svg`);
}
console.log('Done — covers generated in public/covers/');
