import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const SITE = 'https://ansygroup.github.io/ebook-store';
const GMAIL_ACCOUNT = process.env.GMAIL_ACCOUNT || 'ca_BmQnzbsU5u3T';
const SELLER_EMAIL = process.env.SELLER_EMAIL || 'sales@ebook-store.dev';

// ── simple in-memory rate limit: 5 requests / 10 min per key (email OR ip) ──
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();
function rateLimited(key: string): boolean {
  const now = Date.now();
  const arr = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= MAX_PER_WINDOW) {
    hits.set(key, arr);
    return true;
  }
  arr.push(now);
  hits.set(key, arr);
  return false;
}

function clientIp(req: any): string {
  const xff = req.headers?.['x-forwarded-for'];
  if (typeof xff === 'string') return xff.split(',')[0].trim();
  if (Array.isArray(xff)) return String(xff[0]).trim();
  return req.headers?.['x-real-ip'] || 'unknown';
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const origin = (req.headers?.origin || req.headers?.referer || '') as string;
  const allowed =
    origin.startsWith(SITE) ||
    origin.startsWith(SITE + '/') ||
    origin.includes('localhost') ||
    /\.github\.io\//.test(origin);
  if (origin && !allowed) {
    res.status(403).json({ ok: false, error: 'Forbidden' });
    return;
  }

  const apiKey = process.env.COMPOSIO_API_KEY;
  if (!apiKey) {
    res.status(500).json({ ok: false, error: 'COMPOSIO_API_KEY not configured' });
    return;
  }

  const { email, honeypot } = req.body || {};
  if (honeypot) {
    res.status(200).json({ ok: true, messageId: 'blocked' });
    return;
  }
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    res.status(400).json({ ok: false, error: 'Valid email required' });
    return;
  }
  if (rateLimited(email) || rateLimited(clientIp(req))) {
    res.status(429).json({ ok: false, error: 'Too many requests, try later' });
    return;
  }

  const subject = '📚 Welcome to Dar Al-Maarifa';
  const body = [
    'Hello,',
    '',
    'Thank you for joining the Dar Al-Maarifa newsletter.',
    'We will send you our latest books and exclusive discount coupons.',
    '',
    `Browse the store: ${SITE}/shop`,
    '',
    '— The Dar Al-Maarifa Team',
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
      res.status(200).json({ ok: true, messageId: d.id });
      return;
    }
    res.status(502).json({ ok: false, error: 'Email send failed' });
  } catch (e) {
    res.status(500).json({ ok: false, error: (e as Error).message });
  }
}
