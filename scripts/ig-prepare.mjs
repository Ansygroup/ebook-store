#!/usr/bin/env node
/**
 * ig-prepare.mjs — stages a daily IG post for the ebook store.
 * Picks the next book (cycles), downloads its promo image from Pages,
 * writes an English-first caption (with Arabic alt), and saves it to
 * ig-queue/ ready to post (manually or via Composio once IG is linked).
 * Runs daily via cron f3d80ba9beeb.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const books = JSON.parse(readFileSync(resolve(root, 'src/data/books.json'), 'utf8'));
const queueDir = resolve(root, 'ig-queue');
const stateFile = resolve(root, 'ig-queue/.state.json');
mkdirSync(queueDir, { recursive: true });

const PAGES = 'https://ansygroup.github.io/ebook-store';
const today = new Date().toISOString().slice(0, 10);

// which book today?
let idx = 0;
if (existsSync(stateFile)) {
  try { idx = JSON.parse(readFileSync(stateFile, 'utf8')).idx || 0; } catch {}
}
const book = books[idx % books.length];
const nextIdx = (idx + 1) % books.length;
writeFileSync(stateFile, JSON.stringify({ idx: nextIdx, updated: today }));

const slug = book.slug;
const imgUrl = `${PAGES}/promo/${slug}.png`;
const imgPath = resolve(queueDir, `${today}-${slug}.png`);

// download image
try {
  execSync(`curl -fsSL "${imgUrl}" -o "${imgPath}"`, { stdio: 'pipe' });
  console.log(`✅ image: ${imgPath}`);
} catch (e) {
  console.error(`❌ failed to download image from ${imgUrl}`);
}

// caption — English-first (global), with Arabic alt block
const caption = `📚 Today's book from Dar Al-Maarifa: ${book.titleEn || book.title}

${book.descriptionEn || 'A practical, concise guide that changes how you think.'}

✅ PDF + EPUB  •  💰 $${book.price}
🚀 Get it from the link in bio: ${PAGES}

#ebooks #selfdevelopment #reading #${book.categoryEn || book.categoryAr} #dar_almaarifa

---

📚 كتاب اليوم من دار المعرفة: ${book.title}

${book.description || 'دليل عملي ومختصر يغيّر طريقة تفكيرك.'}

✅ PDF + EPUB  •  💰 $${book.price}
🚀 حمّله من الرابط في البايو: ${PAGES}

#كتب_إلكترونية #تطوير_الذات #القراءة #${book.categoryAr.replace(/\s/g, '_')} #دار_المعرفة
`;

const captionPath = resolve(queueDir, `${today}-${slug}.md`);
writeFileSync(captionPath, `# IG post — ${book.titleEn || book.title}\n\nbook: ${slug}\nimage: ${imgPath}\ndate: ${today}\n\n---\n\n${caption}`);
console.log(`✅ caption: ${captionPath}`);
console.log(`\n📅 book #${idx + 1}/${books.length}: ${book.titleEn || book.title}`);
console.log(`📌 next: ${books[nextIdx].titleEn || books[nextIdx].title}`);
console.log(`\n⚠️ If IG is not linked on Composio: post manually from ig-queue/ or link the account.`);
