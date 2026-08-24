"""Add new books to books.json — complete entries matching existing schema."""

import json

p = r'C:\Users\ansy0\repos\ebook-store\src\data\books.json'
books = json.load(open(p, encoding='utf-8'))
existing_slugs = {b['slug'] for b in books}
existing_ids = {b.get('id') for b in books}

NEW_BOOKS = [
    {
        "id": "freelance-freedom",
        "slug": "freelance-freedom",
        "title": "Freelance Freedom",
        "author": "ANSY",
        "category": "Business",
        "price": 16.99,
        "rating": 4.8,
        "reviews": 0,
        "pages": 145,
        "language": "English",
        "formats": ["PDF", "EPUB"],
        "featured": True,
        "cover": "freelance-freedom.png",
        "description": "Escape the 9-to-5 trap. Find your marketable skill, land clients on Upwork and Fiverr, price with confidence, and build a freelance income that replaces your salary.",
        "longDescription": "Your skills are worth more than one paycheck. This book walks you through the entire freelance journey: identifying the skill people will pay for, choosing the right platform, pricing without fear, landing your first five clients, writing contracts that protect you, and scaling from side hustle to full-time freedom. Every chapter ends with a concrete action step. No theory without practice.",
        "excerptEn": "Your skills are worth more than one paycheck.",
        "keywordsEn": ["freelancing for beginners", "side hustle ideas", "upwork tips", "how to freelance", "work from home income", "fiverr success"],
        "downloadUrl": "/downloads/freelance-freedom-sample.pdf",
        "stripeUrl": "",
        "tags": ["freelancing", "side hustle", "remote work", "income"],
    },
    {
        "id": "career-switch-kit",
        "slug": "career-switch-kit",
        "title": "Career Switch Kit",
        "author": "ANSY",
        "category": "Self-Development",
        "price": 14.99,
        "rating": 4.7,
        "reviews": 0,
        "pages": 138,
        "language": "English",
        "formats": ["PDF", "EPUB"],
        "featured": False,
        "cover": "career-switch.png",
        "description": "Change careers without losing everything you built. Audit transferable skills, learn fast, network into the new industry, and survive the salary dip with a clear plan.",
        "longDescription": "Changing careers feels like jumping off a cliff. It does not have to be. The Career Switch Kit gives you a systematic path: audit what you already know that transfers, close skill gaps efficiently, build proof-of-work in the new field before you quit, rewrite your resume and LinkedIn for the switch, network your way in through warm introductions, interview across fields with confidence, negotiate despite the experience gap, and excel in your first ninety days. Real strategies from real career changers.",
        "excerptEn": "Your next career is closer than you think.",
        "keywordsEn": ["career change", "how to change careers", "new career at 30", "transferable skills", "career transition"],
        "downloadUrl": "/downloads/career-switch-kit-sample.pdf",
        "stripeUrl": "",
        "tags": ["career", "job change", "skills"],
    },
    {
        "id": "speak-with-confidence",
        "slug": "speak-with-confidence",
        "title": "Speak With Confidence",
        "author": "ANSY",
        "category": "Skills",
        "price": 15.99,
        "rating": 4.8,
        "reviews": 0,
        "pages": 142,
        "language": "English",
        "formats": ["PDF", "EPUB"],
        "featured": False,
        "cover": "speak-confidence.png",
        "description": "From trembling to compelling. Master structure, body language, vocal variety, Q&A handling, and virtual presentations. The complete system for any room, any stage, any camera.",
        "longDescription": "Public speaking is the most commonly reported fear, and the most learnable skill. Speak With Confidence breaks it into trainable components: managing the physiology of fear, structuring talks that hold attention, opening with hooks that earn the room, using body language and vocal variety intentionally, surviving Q&A with grace, presenting to cameras as well as crowds, telling stories that stick, and building a practice system that compounds. Each chapter includes exercises you can do alone, today.",
        "excerptEn": "The room remembers the speaker who owns it.",
        "keywordsEn": ["public speaking tips", "presentation skills", "how to speak confidently", "overcome fear of speaking"],
        "downloadUrl": "/downloads/speak-with-confidence-sample.pdf",
        "stripeUrl": "",
        "tags": ["public speaking", "presentation", "communication"],
    },
    {
        "id": "sell-anything-online",
        "slug": "sell-anything-online",
        "title": "Sell Anything Online",
        "author": "ANSY",
        "category": "Marketing",
        "price": 18.99,
        "rating": 4.7,
        "reviews": 0,
        "pages": 155,
        "language": "English",
        "formats": ["PDF", "EPUB"],
        "featured": False,
        "cover": "sell-online.png",
        "description": "E-commerce without the overwhelm. Pick products, choose platforms, shoot photos that sell, write listings that convert, handle shipping, and grow with zero ad budget.",
        "longDescription": "Someone is buying what you could be selling. Sell Anything Online takes you from nothing to first thousand dollars: sourcing or making products people want, choosing between Etsy, eBay, Shopify, and social commerce based on what you sell, taking product photos with your phone that look professional, pricing for profit after fees, writing titles and descriptions that appear in searches, shipping without losing money, handling customer messages like a pro, marketing without an ad budget, doubling down on what works, and staying legal from day one.",
        "excerptEn": "Start this weekend. Sell by next week.",
        "keywordsEn": ["how to sell online", "start ecommerce", "etsy selling tips", "online store beginner", "make money selling"],
        "downloadUrl": "/downloads/sell-anything-online-sample.pdf",
        "stripeUrl": "",
        "tags": ["ecommerce", "online business", "selling"],
    },
    {
        "id": "focus-distracted-world",
        "slug": "focus-in-a-distracted-world",
        "title": "Focus In A Distracted World",
        "author": "ANSY",
        "category": "Productivity",
        "price": 12.99,
        "rating": 4.9,
        "reviews": 0,
        "pages": 125,
        "language": "English",
        "formats": ["PDF", "EPUB"],
        "featured": True,
        "cover": "focus-distracted.png",
        "description": "Your attention is being harvested for profit. Take it back. Understand the attention economy, detox from phone addiction, master single-tasking, and make focus your default.",
        "longDescription": "Every app on your phone was designed by teams of engineers to capture and hold your attention. You are not weak; you are outgunned. Focus In A Distracted World levels the playing field: understand exactly how the attention economy works, run a practical phone detox without going off-grid, retrain yourself to single-task in a multi-tasking world, apply digital minimalism without becoming a hermit, build deep work rituals that survive open offices and open phones, manage notifications so they serve you, rediscover boredom as the birthplace of thought, protect presence in relationships, curate an attention diet as carefully as your food, and design a life where focus is the default setting.",
        "excerptEn": "They designed your distraction. Design your focus.",
        "keywordsEn": ["digital detox", "phone addiction help", "how to focus better", "deep work", "stop scrolling"],
        "downloadUrl": "/downloads/focus-in-a-distracted-world-sample.pdf",
        "stripeUrl": "",
        "tags": ["focus", "attention", "digital detox", "productivity"],
    },
]

added = []
for nb in NEW_BOOKS:
    if nb['slug'] not in existing_slugs:
        books.append(nb)
        added.append(nb['slug'])
    if nb['id'] not in existing_ids:
        existing_ids.add(nb['id'])

json.dump(books, open(p, 'w', encoding='utf-8'), indent=2, ensure_ascii=False)
print(f"Added {len(added)} new books: {added}")
print(f"Total catalog: {len(books)}")
