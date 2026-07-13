#!/usr/bin/env node
/**
 * make-bilingual.mjs — يضيف الحقول الثنائية (Ar/En) لكل كتاب في books.json
 * بناءً على ترجمة إنجليزية مدمجة. يُستدعى يدويًا عند تحديث الكتالوج.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const file = resolve(root, 'src/data/books.json');
const books = JSON.parse(readFileSync(file, 'utf8'));

// ترجمة إنجليزية مدمجة (title, author, category, description, longDescription, tags)
const EN = {
  'the-influential-leader': {
    title: 'The Influential Leader',
    author: 'Dr. Khalid Al-Mansour',
    category: 'Leadership',
    description: 'A practical guide to developing leadership that inspires your team and builds a high-performance culture.',
    longDescription: 'In this ebook, Dr. Khalid Al-Mansour presents a practical framework built on 15+ years of team-leadership experience. You will learn how to build real trust, delegate smartly, and transform from a manager who is followed by force into a leader who inspires through vision. Each chapter ends with hands-on exercises and ready-to-use templates for your team.',
    tags: ['Leadership', 'Management', 'Teams', 'Growth'],
  },
  'build-your-empire': {
    title: 'Build Your Empire',
    author: 'Sara Al-Ahmed',
    category: 'Business',
    description: 'A complete roadmap to launch your startup and grow it to profitability.',
    longDescription: 'From a napkin idea to a profitable company — "Build Your Empire" walks you step by step through every stage: validating the idea, building the first prototype, landing your first customer, then disciplined scaling. Sara Al-Ahmed shares her real mistakes and hard lessons so you avoid them, with simple financial tools to manage your cash flow.',
    tags: ['Entrepreneurship', 'Business', 'Growth', 'Investing'],
  },
  'deep-productivity': {
    title: 'Deep Productivity',
    author: 'Eng. Yousef Al-Otaibi',
    category: 'Productivity',
    description: 'A work style focused on depth over fake busyness that doubles your output.',
    longDescription: 'Busyness is not accomplishment. In "Deep Productivity" Eng. Yousef Al-Otaibi reveals a 30-day system to reclaim your focus: how to ditch notification noise, build deep-work rituals, and manage your energy not just your time. Packed with printable schedules and trackers to lock in the habit.',
    tags: ['Focus', 'Time', 'Habits', 'Work'],
  },
  'design-your-mindset': {
    title: 'Design Your Mindset',
    author: 'Noura Al-Qahtani',
    category: 'Self-Development',
    description: 'Reprogram your limiting beliefs and build a growth mindset that never stops learning.',
    longDescription: 'Every success is preceded by an inner shift. "Design Your Mindset" takes you on a journey to dismantle the beliefs that slow you down and build a new identity grounded in growth and responsibility. Noura Al-Qahtani blends applied psychology with real stories and guided meditation to deliver a method that changes how you think about failure and success.',
    tags: ['Mindset', 'Growth', 'Confidence', 'Learning'],
  },
  'tech-for-everyone': {
    title: 'Tech for Everyone',
    author: 'Eng. Abdullah Al-Shammari',
    category: 'Technology',
    description: 'Understand the basics of programming and AI without a technical background.',
    longDescription: 'You do not need an engineering degree to understand the digital world around you. "Tech for Everyone" explains in plain language how the internet works, what AI actually is, and how to benefit from modern tools in your work and daily life. Eng. Abdullah Al-Shammari turns complex concepts into stories and analogies that are easy to digest.',
    tags: ['Technology', 'Coding', 'AI', 'Learning'],
  },
  'health-without-limits': {
    title: 'Health Without Limits',
    author: 'Dr. Reem Al-Dosari',
    category: 'Health',
    description: 'An integrated lifestyle system for energy, focus, and sustainable wellbeing.',
    longDescription: 'Health is not a temporary diet but a way of life. "Health Without Limits" offers an evidence-based method to raise your daily energy, improve your sleep, and organize your nutrition without deprivation. Dr. Reem Al-Dosari simplifies the science and provides small, sustainable steps that fit your busy schedule.',
    tags: ['Health', 'Energy', 'Sleep', 'Nutrition'],
  },
  'art-of-negotiation': {
    title: 'The Art of Negotiation',
    author: 'Eng. Fahad Al-Qarni',
    category: 'Skills',
    description: 'Learn the art of persuasion and agreement with confidence at work and in daily life.',
    longDescription: 'Negotiation is not a battle but a dialogue that creates a win for both sides. In "The Art of Negotiation" Eng. Fahad Al-Qarni provides practical tools to read the other party, prepare your position, and handle rejection without stress. Built on real commercial and personal negotiation scenarios with non-verbal communication tips.',
    tags: ['Negotiation', 'Persuasion', 'Agreement', 'Skills'],
  },
  'smart-investing': {
    title: 'Smart Investing',
    author: 'Dr. Mansour Al-Harbi',
    category: 'Money',
    description: 'Fundamentals of building long-term wealth with disciplined, thoughtful steps.',
    longDescription: "You do not need to be a finance expert to build wealth. \"Smart Investing\" simplifies return, risk, and diversification, and guides you to build an investment plan starting today at any amount. Dr. Mansour Al-Harbi steps away from complexity and delivers clear rules that protect you from the common mistakes that eat beginners' savings.",
    tags: ['Investing', 'Money', 'Wealth', 'Planning'],
  },
  'content-writing': {
    title: 'Content Craft',
    author: 'Layla Al-Anazi',
    category: 'Marketing',
    description: 'Write content that sells and builds a loyal audience around your brand.',
    longDescription: 'Content is your currency in the digital age. "Content Craft" teaches you how to define your brand voice, write headlines that earn clicks, and tell stories that sell without pressure. Layla Al-Anazi shares her full framework for planning, editing, and publishing across platforms with the least effort and the highest impact.',
    tags: ['Marketing', 'Writing', 'Content', 'Audience'],
  },
  'learn-languages': {
    title: 'Learn Languages',
    author: 'Mr. Sultan Al-Mutairi',
    category: 'Education',
    description: 'A practical method to master any language in record time without a teacher.',
    longDescription: "Learning a new language is far more than memorizing words. \"Learn Languages\" presents a system built on daily exposure and early conversation, and explains how to use free apps and resources effectively. Mr. Sultan Al-Mutairi dismantles the myth of 'language difficulty' and puts you on a path to fluency in months, not years.",
    tags: ['Languages', 'Education', 'Skill', 'Speed'],
  },
};

const out = books.map((b) => {
  const en = EN[b.slug] || {};
  return {
    ...b,
    titleAr: b.title,
    titleEn: en.title || b.title,
    authorAr: b.author,
    authorEn: en.author || b.author,
    categoryAr: b.category,
    categoryEn: en.category || b.category,
    descriptionAr: b.description,
    descriptionEn: en.description || b.description,
    longDescriptionAr: b.longDescription,
    longDescriptionEn: en.longDescription || b.longDescription,
    tagsAr: b.tags,
    tagsEn: en.tags || b.tags,
  };
});

writeFileSync(file, JSON.stringify(out, null, 2));
console.log(`✅ added bilingual fields to ${out.length} books`);
