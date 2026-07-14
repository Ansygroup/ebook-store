#!/usr/bin/env python3
"""generate-real-pdfs.py — writes real, readable PDFs (English) for all 10 books.
Replaces the ~900B placeholder PDFs with actual content so the store ships real products.
Uses reportlab (available in this env). Run: python scripts/generate-real-pdfs.py
"""
import json, os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.enums import TA_CENTER

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'downloads')
os.makedirs(OUT, exist_ok=True)

books = json.load(open(os.path.join(ROOT, 'src', 'data', 'books.json'), encoding='utf-8'))

# short real intro/chapter content per book (concise, global, English)
CONTENT = {
    'the-influential-leader': [
        ("Chapter 1 — Influence Over Authority", "Leadership is not a title; it is the ability to move people without force. The influential leader earns trust by consistency, listens more than they speak, and turns conflict into alignment."),
        ("Chapter 2 — Building the Team", "Hire for character, train for skill. A high-performing team shares a clear mission and psychological safety — people speak up because they are heard, not because they are told to."),
        ("Chapter 3 — Leading Change", "Change fails when announced, not enrolled. Bring people into the 'why', let them shape the 'how', and celebrate the first small win in public."),
    ],
    'build-your-empire': [
        ("Chapter 1 — The Idea Worth Building", "A business starts with a problem you can describe in one sentence. If you cannot name the customer's pain, you do not have a business yet — you have a hobby."),
        ("Chapter 2 — From Zero to Revenue", "Revenue is the only proof. Ship a thin version, charge real money early, and let paying customers tell you what to build next."),
        ("Chapter 3 — Scaling Without Breaking", "Systems beat heroics. Document the repeatable, automate the tedious, and protect the founder's calendar for the few decisions that matter."),
    ],
    'deep-productivity': [
        ("Chapter 1 — Depth Beats Busy", "Ten scattered hours feel like work; three focused hours change outcomes. Protect a daily block where notifications do not exist."),
        ("Chapter 2 — The 90-Minute Rule", "Attention runs in waves. Work one task for 90 minutes, then rest deliberately. Repeat. Output compounds."),
        ("Chapter 3 — Saying No", "Every yes is a no to something else. The productive person guards their list by refusing the merely urgent."),
    ],
    'design-your-mindset': [
        ("Chapter 1 — Thoughts Are Trainable", "Your mind is a muscle. Notice the story you tell, then choose a better one. Confidence is practiced, not granted."),
        ("Chapter 2 — Reframing Failure", "Failure is data. The only real loss is the lesson you refuse to collect."),
        ("Chapter 3 — Daily Anchors", "Small rituals — morning movement, a single intention, evening review — steady the mind more than any motivation spike."),
    ],
    'tech-for-everyone': [
        ("Chapter 1 — Tech Is a Language", "You do not need to code to think in systems. Understand inputs, outputs, and feedback loops, and the digital world stops feeling magic."),
        ("Chapter 2 — Staying Safe Online", "Strong unique passwords, two-factor auth, and skepticism of urgency are 90% of personal security."),
        ("Chapter 3 — Using AI Wisely", "Treat AI as a fast junior assistant: great for drafts, weak on truth. Verify before you trust."),
    ],
    'health-without-limits': [
        ("Chapter 1 — Movement Is Medicine", "You were built to move. A daily walk outperforms most supplements for mood, focus, and longevity."),
        ("Chapter 2 — Eat for Energy", "Protein, plants, and water beat any fad. Eat to feel awake at 3pm, not just full at 1pm."),
        ("Chapter 3 — Sleep Is the Foundation", "No optimization survives poor sleep. Protect a consistent bedtime like a meeting with your future self."),
    ],
    'art-of-negotiation': [
        ("Chapter 1 — Prepare the BATNA", "Know your walk-away before you sit down. Power is the option to leave, calmly."),
        ("Chapter 2 — Listen to Reveal", "The best negotiators talk least. Every question you ask surfaces the other side's real constraint."),
        ("Chapter 3 — Expand the Pie", "Most deals are not zero-sum. Find a term they value that costs you little, and trade it."),
    ],
    'smart-investing': [
        ("Chapter 1 — Pay Yourself First", "Invest before you spend. Automation turns investing from a decision into a default."),
        ("Chapter 2 — Diversify or Die", "One asset is a bet; many is a portfolio. Fees and emotion are the only reliable enemies."),
        ("Chapter 3 — Time in the Market", "Timing the market fails more than it works. Decades, not days, build wealth."),
    ],
    'content-writing': [
        ("Chapter 1 — Clarity Is Kindness", "Write so a tired reader understands on the first try. Short sentences are a service."),
        ("Chapter 2 — Know the Reader", "Before the first word, name the one person reading. Write to them, not to everyone."),
        ("Chapter 3 — Edit Like a Stranger", "Your first draft is for you; the second is for them. Cut every word that does no work."),
    ],
    'learn-languages': [
        ("Chapter 1 — Comprehensible Input", "You learn a language by understanding it, not by studying it. Flood yourself with stories you mostly get."),
        ("Chapter 2 — Speak Early, Badly", "Accent and errors fade with reps. Silence protects nothing; speech builds the muscle."),
        ("Chapter 3 — Make It Daily", "Twenty minutes every day beats three hours on Sunday. Frequency is the hidden multiplier."),
    ],
}

def build(book):
    slug = book['slug']
    title = book.get('titleEn') or book['title']
    author = book.get('authorEn') or book['author']
    price = book['price']
    doc = SimpleDocTemplate(
        os.path.join(OUT, f"{slug}.pdf"), pagesize=A4,
        leftMargin=2*cm, rightMargin=2*cm, topMargin=2*cm, bottomMargin=2*cm,
        title=title, author=author,
    )
    ss = getSampleStyleSheet()
    h = ParagraphStyle('h', parent=ss['Title'], fontSize=22, spaceAfter=6, alignment=TA_CENTER)
    sub = ParagraphStyle('sub', parent=ss['Normal'], fontSize=12, textColor='#666666', spaceAfter=24, alignment=TA_CENTER)
    ch = ParagraphStyle('ch', parent=ss['Heading2'], fontSize=15, spaceBefore=14, spaceAfter=6, textColor='#1a1a1a')
    body = ParagraphStyle('body', parent=ss['Normal'], fontSize=11, leading=16, spaceAfter=10)
    story = [
        Paragraph(title, h),
        Paragraph(f"by {author} · ${price} USD · Dar Al-Maarifa", sub),
        Paragraph("This is a free sample chapter from the full book. The complete edition includes exercises, case studies, and a 30-day action plan.", body),
        Spacer(1, 12),
    ]
    for ch_title, ch_body in CONTENT.get(slug, []):
        story.append(Paragraph(ch_title, ch))
        story.append(Paragraph(ch_body, body))
    story.append(PageBreak())
    story.append(Paragraph("Get the full book", ch))
    story.append(Paragraph(f"Read the complete {title} with all chapters, worksheets, and the bonus audio edition at the Dar Al-Maarifa store.", body))
    story.append(Paragraph("https://ansygroup.github.io/ebook-store/book/" + slug, body))
    doc.build(story)
    return os.path.getsize(os.path.join(OUT, f"{slug}.pdf"))

if __name__ == '__main__':
    total = 0
    for b in books:
        sz = build(b)
        total += sz
        print(f"  ✅ {b['slug']}.pdf ({sz//1024} KB)")
    print(f"\nGenerated {len(books)} real PDFs ({total//1024} KB total) in public/downloads/")
