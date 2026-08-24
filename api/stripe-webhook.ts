import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * stripe-webhook.ts — receives checkout.session.completed from Stripe Payment Links
 * and emails the full-book PDF to the buyer automatically.
 *
 * SETUP (one-time, in Stripe Dashboard):
 *   1. Developers → Webhooks → Add endpoint
 *      URL: https://ebook-store-ten-flax.vercel.app/api/stripe-webhook
 *      Event: checkout.session.completed
 *   2. Copy the signing secret (whsec_...) into Vercel env: STRIPE_WEBHOOK_SECRET
 *   3. Payment Link settings → After payment → redirect to /verify?paid=1
 *
 * Env vars:
 *   STRIPE_WEBHOOK_SECRET  — whsec_... from Stripe dashboard
 *   GMAIL_ACCOUNT          — Composio connected account id
 *   COMPOSIO_API_KEY       — for sending email
 */

interface Book {
  slug: string;
  titleEn?: string;
  title: string;
  price: number;
}

function loadBooks(): Book[] {
  // books.json lives at project root after build (sync-books copies src->public)
  for (const p of [
    join(__dirname, '..', '..', 'src', 'data', 'books.json'),
    join(process.cwd(), 'src', 'data', 'books.json'),
    join(process.cwd(), 'public', 'books.json'),
  ]) {
    try { return JSON.parse(readFileSync(p, 'utf8')); } catch { /* next */ }
  }
  return [];
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET not configured');
    res.status(500).json({ ok: false, error: 'Webhook not configured' });
    return;
  }

  // ── Signature verification (Stripe spec: HMAC-SHA256 of timestamp.payload) ──
  const sigHeader = (req.headers['stripe-signature'] || '') as string;
  const parts = Object.fromEntries(
    sigHeader.split(',').map((kv) => kv.split('=') as [string, string]),
  );
  const timestamp = parts['t'];
  const theirSig = parts['v1'];

  if (!timestamp || !theirSig) {
    res.status(400).json({ ok: false, error: 'Missing signature' });
    return;
  }

  // Reject events older than 5 minutes (replay protection)
  const age = Math.abs(Date.now() / 1000 - parseInt(timestamp, 10));
  if (age > 300) {
    res.status(400).json({ ok: false, error: 'Timestamp too old' });
    return;
  }

  const payload =
    typeof req.body === 'string'
      ? req.body
      : JSON.stringify(req.body);

  const crypto = await import('node:crypto');
  const expected = crypto
    .createHmac('sha256', secret)
    .update(timestamp + '.' + payload)
    .digest('hex');

  const a = Buffer.from(expected);
  const b = Buffer.from(theirSig);
  const valid = a.length === b.length && crypto.timingSafeEqual(a, b);

  if (!valid) {
    res.status(400).json({ ok: false, error: 'Invalid signature' });
    return;
  }

  // ── Parse event ──
  let event: any;
  try { event = JSON.parse(payload); } catch {
    res.status(400).json({ ok: false, error: 'Invalid JSON' });
    return;
  }

  if (event.type !== 'checkout.session.completed') {
    res.status(200).json({ ok: true, ignored: event.type });
    return;
  }

  const session = event.data?.object || {};
  const customerEmail =
    session.customer_details?.email ||
    session.customer_email ||
    '';

  // Payment Links carry the book slug via client_reference_id or metadata
  const slug =
    session.client_reference_id ||
    session.metadata?.slug ||
    '';

  if (!customerEmail || !slug) {
    console.error('[stripe-webhook] missing email or slug', {
      email: !!customerEmail, slug: !!slug,
    });
    res.status(200).json({ ok: true, warning: 'missing fields — skipped' });
    return;
  }

  // ── Find the book + load full PDF ──
  const books = loadBooks();
  const book = books.find((b) => b.slug === slug);
  if (!book) {
    res.status(200).json({ ok: true, warning: `unknown slug: ${slug}` });
    return;
  }

  let attachmentB64 = '';
  const pdfCandidates = [
    join(__dirname, 'full-books', `${slug}.pdf`),
    join(process.cwd(), 'api', 'full-books', `${slug}.pdf`),
    join(process.cwd(), 'private-books', `${slug}.pdf`),
  ];
  for (const p of pdfCandidates) {
    try {
      attachmentB64 = readFileSync(p).toString('base64');
      break;
    } catch { /* try next path */ }
  }

  // ── Send delivery email via Composio Gmail ──
  const apiKey = process.env.COMPOSIO_API_KEY;
  const gmailAccount = process.env.GMAIL_ACCOUNT || 'ca_BmQnzbsU5u3T';
  const sellerEmail = process.env.SELLER_EMAIL || 'sales@ebook-store.dev';

  if (!apiKey) {
    console.error('[stripe-webhook] COMPOSIO_API_KEY missing');
    res.status(500).json({ ok: false, error: 'Email service not configured' });
    return;
  }

  const orderId = `ORD-${Date.now()}`;
  const title = book.titleEn || book.title;
  const boundary = 'ansy-' + orderId;

  const textPart = [
    'Hello,',
    '',
    `Thank you for purchasing "${title}"!`,
    '',
    attachmentB64
      ? 'Your complete book is attached to this email as a PDF.'
      : 'Your download will arrive in a follow-up email within minutes.',
    '',
    `Order ID: ${orderId}`,
    `Questions? Reply to this email or contact ${sellerEmail}`,
    '',
    '— The ANSY Team',
    'https://ebook-store-ten-flax.vercel.app',
  ].join('\r\n');

  let rawBody: string;
  if (attachmentB64) {
    rawBody = [
      `From: ${sellerEmail}`,
      `To: ${customerEmail}`,
      `Subject: ✅ Your book: ${title} (Order ${orderId})`,
      'MIME-Version: 1.0',
      `Content-Type: multipart/mixed; boundary="${boundary}"`,
      '',
      `--${boundary}`,
      'Content-Type: text/plain; charset="UTF-8"',
      '',
      textPart,
      '',
      `--${boundary}`,
      `Content-Type: application/pdf; name="${slug}.pdf"`,
      `Content-Disposition: attachment; filename="${slug}.pdf"`,
      'Content-Transfer-Encoding: base64',
      '',
      attachmentB64,
      `--${boundary}--`,
    ].join('\r\n');
  } else {
    rawBody = [
      `From: ${sellerEmail}`,
      `To: ${customerEmail}`,
      `Subject: ✅ Your order: ${title} (Order ${orderId})`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset="UTF-8"',
      '',
      textPart,
    ].join('\r\n');
  }

  const raw = Buffer.from(rawBody).toString('base64url');

  try {
    const r = await fetch(
      'https://backend.composio.dev/api/v3.1/tools/execute/proxy?toolkit_versions=latest',
      {
        method: 'POST',
        headers: { 'X-API-KEY': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          connected_account_id: gmailAccount,
          endpoint: 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: { raw },
        }),
      },
    );
    const j = await r.json();
    const d = j.data || j;
    if (d.id) {
      console.log(`[stripe-webhook] delivered ${slug} to ${customerEmail} (${orderId})`);
      res.status(200).json({ ok: true, orderId, messageId: d.id });
      return;
    }
    console.error('[stripe-webhook] send failed:', JSON.stringify(d).slice(0, 300));
    res.status(502).json({ ok: false, error: 'Email failed' });
  } catch (e: any) {
    console.error('[stripe-webhook] error:', e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
}
