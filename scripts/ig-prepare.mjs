#!/usr/bin/env node
/**
 * ig-prepare.mjs — يحضّر منشور IG يومي من متجر الكتب.
 * يختار الكتاب التالي (دورة)، يحمّل صورته الترويجية من Pages، يكتب كابشن عربي+إنجليزي،
 * ويحفظه في ig-queue/ جاهزًا للنشر (يدويًا أو عبر Composio لما يُربط IG).
 * يُشغّل يوميًا عبر cron f3d80ba9beeb.
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

// أي كتاب اليوم؟
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

// حمّل الصورة
try {
  execSync(`curl -fsSL "${imgUrl}" -o "${imgPath}"`, { stdio: 'pipe' });
  console.log(`✅ صورة: ${imgPath}`);
} catch (e) {
  console.error(`❌ فشل تحميل الصورة من ${imgUrl}`);
}

// كابشن
const caption = `📚 كتاب اليوم من دار المعرفة: ${book.title}

${book.description || 'دليل عملي ومختصر يغيّر طريقة تفكيرك.'}

✅ PDF + EPUB  •  💰 $${book.price}
🚀 حمّله من الرابط في البايو: ${PAGES}

#كتب_إلكترونية #تطوير_الذات #القراءة #${book.categoryAr.replace(/\s/g, '_')} #دار_المعرفة

---

📚 Today's book from Dar Al-Maarifa: ${book.titleEn || book.title}

${book.descriptionEn || book.description || 'A practical, concise guide that changes how you think.'}

✅ PDF + EPUB  •  💰 $${book.price}
🚀 Get it from the link in bio: ${PAGES}

#ebooks #selfdevelopment #reading #${book.categoryEn || book.categoryAr} #dar_almaarifa
`;

const captionPath = resolve(queueDir, `${today}-${slug}.md`);
writeFileSync(captionPath, `# منشور IG — ${book.title}\n\nالكتاب: ${slug}\nالصورة: ${imgPath}\nالتاريخ: ${today}\n\n---\n\n${caption}`);
console.log(`✅ كابشن: ${captionPath}`);
console.log(`\n📅 الكتاب #${idx + 1}/${books.length}: ${book.title}`);
console.log(`📌 التالي: ${books[nextIdx].title}`);
console.log(`\n⚠️ إذا IG غير موصول على Composio: انشر يدويًا من ig-queue/ أو اربط الحساب.`);
