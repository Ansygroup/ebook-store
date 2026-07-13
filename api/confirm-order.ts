import { readFileSync } from 'node:fs';
import { join } from 'node:path';

interface Book {
  slug: string;
  title: string;
  price: number;
  gumroadUrl?: string;
  description: string;
}

const SITE = 'https://ebook-store-mg5ynw9qq-ansygroups-projects.vercel.app';
const GMAIL_ACCOUNT = process.env.GMAIL_ACCOUNT || 'ca_BmQnzbsU5u3T';
const SELLER_EMAIL = process.env.SELLER_EMAIL || 'sales@ebook-store.dev';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }
  const apiKey = process.env.COMPOSIO_API_KEY;
  if (!apiKey) {
    res.status(500).json({ ok: false, error: 'COMPOSIO_API_KEY not configured' });
    return;
  }
  const { email, slug } = req.body || {};
  if (!email || !slug || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    res.status(400).json({ ok: false, error: 'Valid email and slug required' });
    return;
  }

  let books: Book[] = [];
  try {
    books = JSON.parse(readFileSync(join(process.cwd(), 'src/data/books.json'), 'utf8'));
  } catch {
    res.status(500).json({ ok: false, error: 'Book data unavailable' });
    return;
  }
  const book = books.find((b) => b.slug === slug);
  if (!book) {
    res.status(404).json({ ok: false, error: 'Book not found' });
    return;
  }

  const orderId = `ORD-${Date.now()}`;
  const downloadUrl = book.gumroadUrl && !book.gumroadUrl.includes('REPLACE')
    ? book.gumroadUrl
    : `${SITE}/book/${book.slug}`;
  const subject = `✅ طلبك: ${book.title}`;
  const body = [
    'مرحبًا،',
    '',
    `شكرًا لطلبك "${book.title}" بـ ${book.price} USD.`,
    `رابط التحميل: ${downloadUrl}`,
    '',
    `رقم الطلب: ${orderId}`,
    `أي استفسار: ${SELLER_EMAIL}`,
    '— فريق متجر الكتب',
  ].join('\n');

  const raw = Buffer.from(
    `From: ${SELLER_EMAIL}\nTo: ${email}\nSubject: ${subject}\n\n${body}`,
  ).toString('base64url');

  try {
    const r = await fetch(
      `https://backend.composio.dev/api/v3.1/tools/execute/proxy?toolkit_versions=latest`,
      {
        method: 'POST',
        headers: { 'X-API-KEY': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          connected_account_id: GMAIL_ACCOUNT,
          endpoint: 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: { raw },
        }),
      },
    );
    const j = await r.json();
    const d = j.data || j;
    if (d.id && (d.labelIds || []).includes('SENT')) {
      res.status(200).json({ ok: true, orderId, messageId: d.id });
      return;
    }
    res.status(502).json({ ok: false, error: 'Email send failed', detail: JSON.stringify(d).slice(0, 200) });
  } catch (e) {
    res.status(500).json({ ok: false, error: (e as Error).message });
  }
}
