/**
 * ebook-store-api worker — Cloudflare Worker replacing the dead Vercel API.
 * Handles /api/subscribe and /api/confirm-order via Composio Gmail proxy.
 *
 * Deploy (after adding CF_API_TOKEN to ~/.hermes/):
 *   npm i -g wrangler
 *   wrangler login
 *   echo "COMPOSIO_API_KEY=xxx" > .dev.vars
 *   echo "GMAIL_ACCOUNT=ca_xxx" >> .dev.vars
 *   echo "SELLER_EMAIL=sales@ebook-store.dev" >> .dev.vars
 *   wrangler deploy
 * Then set VITE_API_BASE (GitHub secret) to https://ebook-store-api.<your>.workers.dev
 *
 * Free tier: 100k requests/day — plenty for a store.
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const SITE = 'https://ansygroup.github.io/ebook-store';

    // CORS for the Pages origin
    const origin = request.headers.get('origin') || '';
    const cors = {
      'Access-Control-Allow-Origin': origin.includes('github.io') || origin.includes('localhost') ? origin : SITE,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    if (url.pathname === '/api/subscribe' && request.method === 'POST') {
      const { email, honeypot } = await request.json();
      if (honeypot) return json({ ok: true, messageId: 'blocked' }, cors);
      if (!email || !/^[^@\s]+@[^@\s]+$/.test(email)) return json({ ok: false, error: 'Valid email required' }, 422, cors);

      const body = [
        'Hello,', '',
        'Thank you for joining the Dar Al-Maarifa newsletter.',
        'We will send you our latest books and exclusive discount coupons.',
        '', `Browse the store: ${SITE}/shop`, '', '— The Dar Al-Maarifa Team',
      ].join('\n');
      const raw = Buffer.from(`From: ${env.SELLER_EMAIL}\nTo: ${email}\nSubject: 📚 Welcome to Dar Al-Maarifa\n\n${body}`).toString('base64url');

      const r = await fetch('https://backend.composio.dev/api/v3.1/tools/execute/proxy?toolkit_versions=latest', {
        method: 'POST',
        headers: { 'X-API-KEY': env.COMPOSIO_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          connected_account_id: env.GMAIL_ACCOUNT,
          endpoint: 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: { raw },
        }),
      });
      const j = await r.json();
      const d = j.data || j;
      if (d.id && (d.labelIds || []).includes('SENT')) return json({ ok: true, messageId: d.id }, cors);
      return json({ ok: false, error: 'Email send failed' }, 502, cors);
    }

    if (url.pathname === '/api/confirm-order' && request.method === 'POST') {
      const { email, slug } = await request.json();
      if (!email || !slug) return json({ ok: false, error: 'email + slug required' }, 422, cors);
      const book = await fetch(`${SITE}/book/${slug}`).then((r) => r.text()).catch(() => '');
      const subject = `✅ Your order: ${slug}`;
      const body = `Hello,\n\nThank you for your order (${slug}).\nYour download link: ${SITE}/downloads/${slug}.pdf\n\n— Dar Al-Maarifa`;
      const raw = Buffer.from(`From: ${env.SELLER_EMAIL}\nTo: ${email}\nSubject: ${subject}\n\n${body}`).toString('base64url');
      const r = await fetch('https://backend.composio.dev/api/v3.1/tools/execute/proxy?toolkit_versions=latest', {
        method: 'POST',
        headers: { 'X-API-KEY': env.COMPOSIO_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          connected_account_id: env.GMAIL_ACCOUNT,
          endpoint: 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: { raw },
        }),
      });
      const j = await r.json();
      const d = j.data || j;
      if (d.id) return json({ ok: true, messageId: d.id }, cors);
      return json({ ok: false, error: 'confirm failed' }, 502, cors);
    }

    // Stripe webhook: on checkout.session.completed, email the download link.
    // Configure in Stripe Dashboard → Webhooks → point to /api/stripe-webhook
    // Set signing secret as env STRIPE_WEBHOOK_SECRET. Falls back to unverified
    // only if the secret is absent (dev). Production MUST set the secret.
    if (url.pathname === '/api/stripe-webhook' && request.method === 'POST') {
      const sig = request.headers.get('stripe-signature') || '';
      const payload = await request.text();
      let event;
      const secret = env.STRIPE_WEBHOOK_SECRET;
      if (secret) {
        // Verify HMAC-SHA256 signature (Stripe format: t=...,v1=...)
        const parts = sig.split(',').reduce((a, p) => {
          const [k, v] = p.split('=');
          a[k] = v;
          return a;
        }, {});
        const signedContent = `${parts.t}.${payload}`;
        const key = await crypto.subtle.importKey(
          'raw',
          new TextEncoder().encode(secret),
          { name: 'HMAC', hash: 'SHA-256' },
          false,
          ['sign'],
        );
        const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signedContent));
        const hex = [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, '0')).join('');
        if (hex !== parts.v1) {
          console.error('[stripe-webhook] signature mismatch');
          return json({ ok: false, error: 'Invalid signature' }, 400, cors);
        }
        try {
          event = JSON.parse(payload);
        } catch {
          return json({ ok: false, error: 'Invalid JSON' }, 400, cors);
        }
      } else {
        console.warn('[stripe-webhook] STRIPE_WEBHOOK_SECRET not set — skipping verification (dev)');
        try {
          event = JSON.parse(payload);
        } catch {
          return json({ ok: false, error: 'Invalid JSON' }, 400, cors);
        }
      }

      if (event.type !== 'checkout.session.completed') {
        return json({ ok: true, received: event.type }, cors); // ack others
      }
      const session = event.data?.object || {};
      const email = session.customer_email || session.customer_details?.email;
      const slug = session.metadata?.slug; // set on the Stripe Payment Link / Checkout Session
      if (!email || !slug) {
        console.error('[stripe-webhook] missing email/slug', { email, slug });
        return json({ ok: false, error: 'email + slug required' }, 422, cors);
      }
      console.log('[stripe-webhook] order completed', { slug, email });

      const subject = `✅ Your ebook: ${slug}`;
      const body = [
        'Hello,',
        '',
        `Thank you for purchasing "${slug}".`,
        `Your instant download: ${SITE}/downloads/${slug}.pdf`,
        'Formats: PDF + EPUB (works on every device).',
        '',
        '— Dar Al-Maarifa Team',
      ].join('\n');
      const raw = Buffer.from(`From: ${env.SELLER_EMAIL}\nTo: ${email}\nSubject: ${subject}\n\n${body}`).toString('base64url');
      const r = await fetch('https://backend.composio.dev/api/v3.1/tools/execute/proxy?toolkit_versions=latest', {
        method: 'POST',
        headers: { 'X-API-KEY': env.COMPOSIO_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          connected_account_id: env.GMAIL_ACCOUNT,
          endpoint: 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: { raw },
        }),
      });
      const j = await r.json();
      const d = j.data || j;
      if (d.id) {
        console.log('[stripe-webhook] delivery email sent', { slug, messageId: d.id });
        return json({ ok: true, messageId: d.id }, cors);
      }
      console.error('[stripe-webhook] delivery email failed', { slug });
      return json({ ok: false, error: 'delivery email failed' }, 502, cors);
    }

    return json({ ok: false, error: 'Not found' }, 404, cors);
  },
};

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', ...headers } });
}
