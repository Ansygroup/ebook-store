#!/usr/bin/env node
/**
 * auto-blog.mjs — publishes a new blog post every 2 weeks from a rotating topic pool.
 * Runs on a GitHub Actions cron (see .github/workflows/marketing.yml).
 * No secrets needed — content is templated, bilingual, SEO-friendly.
 * Commits the new post to src/data/posts.json and pushes.
 *
 * Dedup: slug = `${topicBase}-${YYYY-MM-DD}` so each run is unique and never duplicates.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const POSTS = 'src/data/posts.json';

// Topic pool — rotates forever. Each topic maps to a book for internal linking.
const TOPICS = [
  { base: 'daily-habits-of-top-performers', titleEn: 'The Daily Habits of Top Performers', titleAr: 'عادات النخبة اليومية',
    excerptEn: 'Small repeated actions beat big occasional efforts. Here are the habits that compound.',
    excerptAr: 'الأفعال الصغيرة المتكررة تتفوق على الجهود الكبيرة النادرة. عادات تتراكم.',
    tags: ['Productivity', 'Habits', 'Leadership'], relatedBook: 'deep-productivity',
    bodyEn: '## Why habits win\n\nDiscipline is overrated; systems are not. Top performers automate the basics so willpower is spent on the hard parts.\n\n### The 3 non-negotiables\n\n1. **Plan the night before** — decide tomorrow\'s one key task today.\n2. **Deep work block** — 90 minutes, phone away, one problem.\n3. **Review weekly** — what moved, what didn\'t, adjust.\n\n> You do not rise to your goals. You fall to your systems.',
    bodyAr: '## لماذا تنتصر العادات\n\nالانضباط مبالغ فيه؛ الأنظمة لا. النخبة تؤتمت الأساسيات ليُصرف الإرادة على الصعب.\n\n### الثلاثة غير القابلة للتفاوض\n\n1. **خطّط من الليلة** — قرّر مهمة الغد الواحدة اليوم.\n2. **كتلة تركيز عميق** — 90 دقيقة، الهاتف بعيد، مشكلة واحدة.\n3. **راجع أسبوعيًا** — ما تقدّم وما تعثّر وعدّل.\n\n> لا ترتقي لأهدافك. تسقط عند أنظمتك.' },
  { base: 'negotiation-mistakes-that-cost-you', titleEn: 'Negotiation Mistakes That Quietly Cost You', titleAr: 'أخطاء التفاوض التي تكلّفك بصمت',
    excerptEn: 'Most deals are lost before they start. Avoid these five silent killers.',
    excerptAr: 'معظم الصفقات تُخسر قبل أن تبدأ. تجنّب هذه القتلة الصامتة الخمسة.',
    tags: ['Negotiation', 'Business', 'Communication'], relatedBook: 'art-of-negotiation',
    bodyEn: '## The silent killers\n\nNegotiation is not about talking — it is about not flinching.\n\n### 1. Anchoring too low\n\nWhoever anchors first frames the range. Anchor with confidence.\n\n### 2. Filling silence\n\nSilence is leverage. Let the other side blink.\n\n### 3. Negotiating price alone\n\nTrade scope, timeline, extras. Price is one variable.\n\n### 4. Showing urgency\n\nNeed reads as weakness. Calm reads as choice.\n\n### 5. Skipping the walk-away\n\nA real BATNA makes every ask cheaper.\n\n> The best negotiators are willing to leave.',
    bodyAr: '## القتلة الصامتة\n\nالتفاوض ليس كلامًا — هو ألّا ترمش.\n\n### 1. ربط منخفض\n\nمن يربط أولًا يحدّد النطاق. اربط بثقة.\n\n### 2. ملء الصمت\n\nالصمت رافعة. دع الطرف الآخر يومض.\n\n### 3. التفاوض على السعر وحده\n\nتداول النطاق والوقت والمزايا. السعر متغيّر واحد.\n\n### 4. إظهار الاستعجال\n\nالحاجة ضعف. الهدوء خيار.\n\n### 5. تخطّي خطة البديل\n\nبديل حقيقي يرخّص كل طلب.\n\n> أفضل المفاوضين مستعدّون للمغادرة.' },
  { base: 'learn-anything-faster', titleEn: 'How to Learn Anything Faster', titleAr: 'كيف تتعلّم أي شيء أسرع',
    excerptEn: 'Learning is a skill. Use these evidence-backed methods to cut your curve in half.',
    excerptAr: 'التعلّم مهارة. استخدم هذه الطرق المثبتة لتقليص منحنى التعلّم إلى النصف.',
    tags: ['Learning', 'Productivity', 'Self-development'], relatedBook: 'learn-languages',
    bodyEn: '## Learn like a pro\n\nTalent is a story we tell slow learners.\n\n### Spaced repetition\n\nReview at growing intervals. Forgetting is the teacher.\n\n### Active recall\n\nClose the book. Retrieve. Struggle is the signal.\n\n### Teach it\n\nIf you cannot explain it simply, you do not own it.\n\n### Constrain time\n\nA 25-minute block beats a lazy afternoon.\n\n> You remember what you reconstruct, not what you reread.',
    bodyAr: '## تعلّم كمحترف\n\nالموهبة قصة نرويها للمتعلمين البطيئين.\n\n### التكرار المتباعد\n\nراجع بفواصل متزايدة. النسيان هو المعلّم.\n\n### الاسترجاع النشط\n\nأغلق الكتاب. استرجع. الصراع هو الإشارة.\n\n### علّمه\n\nإن لم تشرحه ببساطة فلا تملكه.\n\n### قيّد الوقت\n\nكتلة 25 دقيقة تغلب بعد ظهيرة كسولة.\n\n> تتذكر ما تعيد بناءه لا ما تعيد قراءته.' },
];

function main() {
  const posts = JSON.parse(readFileSync(POSTS, 'utf8'));
  const today = new Date().toISOString().slice(0, 10);
  // rotate by week number so the topic cycles but each publish is unique via date
  const week = Math.floor(Date.now() / (7 * 24 * 3600 * 1000));
  const topic = TOPICS[week % TOPICS.length];
  const slug = `${topic.base}-${today}`;
  if (posts.some((p) => p.slug === slug)) {
    console.log('✅ post for ' + today + ' already exists — nothing to do');
    return;
  }
  const post = { slug, ...topic, date: today, cover: `blog/${slug}.svg` };
  delete post.base;
  posts.push(post);
  writeFileSync(POSTS, JSON.stringify(posts, null, 2) + '\n');
  console.log(`✅ new blog post: ${slug} (${posts.length} total)`);

  const [g1, g2] = [['#6d5efc', '#22d3ee'], ['#f59e0b', '#ef4444'], ['#10b981', '#3b82f6']][posts.length % 3];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${g1}"/><stop offset="1" stop-color="${g2}"/></linearGradient></defs><rect width="800" height="400" fill="#0e0f1a"/><rect x="40" y="40" width="720" height="320" rx="18" fill="url(#g)" opacity="0.18"/><text x="400" y="200" fill="#e7e8ff" font-family="sans-serif" font-size="34" font-weight="800" text-anchor="middle">${topic.titleEn}</text></svg>\n`;
  writeFileSync(`public/${post.cover}`, svg);
  console.log(`✅ cover: public/${post.cover}`);
}

main();
