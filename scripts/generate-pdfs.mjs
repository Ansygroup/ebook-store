#!/usr/bin/env node
/**
 * generate-pdfs.mjs — يولّد PDF بسيط (صالح) لكل كتاب في public/downloads/.
 * هذه ملفات تجريبية تستبدلها برفع ملفات الكتب الحقيقية.
 * النص ASCII فقط (العربية تحتاج خط مضمّن — يضاف عند رفع الملفات الحقيقية).
 */
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const books = JSON.parse(readFileSync(resolve(root, 'src/data/books.json'), 'utf8'));
mkdirSync(resolve(root, 'public/downloads'), { recursive: true });

function makePdf(meta) {
  const lines = [
    'BT /F1 26 Tf 72 720 Td (Dar Ma3rifa - E-Book Store) Tj ET',
    `BT /F1 14 Tf 72 690 Td (Sample: ${meta.slug}) Tj ET`,
    `BT /F1 12 Tf 72 668 Td (Book ID: ${meta.id}) Tj ET`,
    `BT /F1 12 Tf 72 646 Td (Price: $${meta.price} USD) Tj ET`,
    'BT /F1 11 Tf 72 618 Td (This is a placeholder PDF.) Tj ET',
    'BT /F1 11 Tf 72 600 Td (Replace with the real book file in public/downloads/) Tj ET',
  ];
  const content = lines.join('\n');
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${Buffer.byteLength(content, 'latin1')} >>\nstream\n${content}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = [];
  objects.forEach((obj, i) => {
    offsets.push(Buffer.byteLength(pdf, 'latin1'));
    pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });
  const xrefStart = Buffer.byteLength(pdf, 'latin1');
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((off) => { pdf += `${String(off).padStart(10, '0')} 00000 n \n`; });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return Buffer.from(pdf, 'latin1');
}

books.forEach((b) => {
  writeFileSync(resolve(root, `public/downloads/${b.id}.pdf`), makePdf(b));
});
console.log(`✅ ولّدت ${books.length} ملف PDF تجريبي في public/downloads/`);
