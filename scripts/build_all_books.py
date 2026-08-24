"""Integrate book_content manuscripts into generate-real-pdfs.py flow.
Run: python scripts/build_all_books.py
Generates: public/downloads/{slug}-sample.pdf and api/full-books/{slug}.pdf"""

import json, os, sys, importlib

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'scripts', 'book_content'))

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.enums import TA_CENTER

SAMPLE_DIR = os.path.join(ROOT, 'public', 'downloads')
FULL_DIR = os.path.join(ROOT, 'api', 'full-books')
os.makedirs(SAMPLE_DIR, exist_ok=True)
os.makedirs(FULL_DIR, exist_ok=True)

books = json.load(open(os.path.join(ROOT, 'src', 'data', 'books.json'), encoding='utf-8'))

def build_pdf(path, title, author, price, chapters, full, slug):
    doc = SimpleDocTemplate(path, pagesize=A4,
        leftMargin=2*cm, rightMargin=2*cm, topMargin=2*cm, bottomMargin=2*cm,
        title=title, author=author)
    ss = getSampleStyleSheet()
    h = ParagraphStyle('h', parent=ss['Title'], fontSize=22, spaceAfter=6, alignment=TA_CENTER)
    sub = ParagraphStyle('sub', parent=ss['Normal'], fontSize=12, textColor='#666666', spaceAfter=24, alignment=TA_CENTER)
    ch = ParagraphStyle('ch', parent=ss['Heading1'], fontSize=16, spaceBefore=18, spaceAfter=8, textColor='#111111')
    body = ParagraphStyle('body', parent=ss['Normal'], fontSize=11, leading=17, spaceAfter=10)
    prac = ParagraphStyle('prac', parent=body, textColor='#555555', leftIndent=14)

    story = [
        Paragraph(title, h),
        Paragraph(f"by {author} · ANSY · ebook-store-ten-flax.vercel.app", sub),
    ]
    if not full:
        story.append(Paragraph("FREE SAMPLE — first 3 chapters of the complete edition.", body))
        story.append(Spacer(1, 12))

    for i, (ch_title, paras) in enumerate(chapters, 1):
        story.append(Paragraph(f"Chapter {i} — {ch_title}", ch))
        for p in paras:
            story.append(Paragraph(p, body))
        if full:
            story.append(Paragraph(
                "Practice: choose one concrete situation this week where you apply this chapter. "
                "Write down what you did differently and what changed as a result.", prac))

    if not full:
        story.append(PageBreak())
        story.append(Paragraph("Get the complete edition", ch))
        story.append(Paragraph(
            f"The full edition of {title} includes all 10 chapters with end-of-chapter practice prompts. "
            f"Available at the ANSY store.", body))
        story.append(Paragraph("https://ebook-store-ten-flax.vercel.app/book/" + slug, body))
    doc.build(story)

_slug_cache = {}
def slug_for(book):
    return book['slug']

def main():
    total_s = total_f = 0
    for b in books:
        slug = b['slug']
        mod_name = slug.replace('-', '_')
        try:
            mod = importlib.import_module(mod_name)
            # force reimport safety in same-process reruns
            importlib.reload(mod)
        except ModuleNotFoundError:
            print(f"  ⚠ no manuscript module for {slug}, skipping")
            continue
        chapters = [(t, ps) for t, ps in mod.CHAPTERS]
        title = b.get('titleEn') or b.get('title') or slug.replace('-', ' ').title()
        author = b.get('authorEn') or b.get('author') or 'ANSY'

        sample_path = os.path.join(SAMPLE_DIR, f"{slug}-sample.pdf")
        full_path = os.path.join(FULL_DIR, f"{slug}.pdf")

        build_pdf(sample_path, title, author, b.get('price'), chapters[:3], full=False, slug=slug)
        build_pdf(full_path, title, author, b.get('price'), chapters, full=True, slug=slug)

        s_sz = os.path.getsize(sample_path)
        f_sz = os.path.getsize(full_path)
        total_s += s_sz; total_f += f_sz
        print(f"  ✅ {slug}: sample {s_sz//1024}KB + full {f_sz//1024}KB ({len(chapters)} chapters)")

    print(f"\nDone: {len(books)} books | samples {total_s//1024}KB total | full editions {total_f//1024}KB total")

if __name__ == '__main__':
    main()
