import { useState } from 'react';
import { NEWSLETTER_URL, SELLER_EMAIL } from '../data/books';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setBusy(true);
    setStatus(null);
    try {
      const r = await fetch(`${import.meta.env.VITE_API_BASE || ''}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, honeypot: '', coupon: 'READ20' }),
      });
      const j = await r.json();
      if (j.ok) {
        // Meta Pixel: track lead (if Pixel loaded)
        try { (window as any).fbq?.('track', 'Lead'); } catch {}
        setStatus({ ok: true, msg: '✅ You are subscribed! Your READ20 discount code is on its way to your inbox 🎁' });
      } else {
        setStatus({ ok: false, msg: '❌ Subscription failed' });
      }
    } catch {
      if (NEWSLETTER_URL) {
        // graceful fallback: open external signup instead of dead API
        window.open(NEWSLETTER_URL, '_blank', 'noopener');
        setStatus({ ok: true, msg: '✅ Redirected to signup' });
      } else {
        // last-resort: open a pre-filled email (no backend needed)
        const subj = encodeURIComponent('Newsletter signup: ' + email);
        window.location.href = `mailto:${SELLER_EMAIL}?subject=${subj}`;
        setStatus({ ok: true, msg: '📧 Opened your mail app to send your signup' });
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="newsletter">
      <div className="container newsletter__inner">
        <div className="newsletter__copy">
          <h2>A new book &amp; discount coupon every week</h2>
          <p>Join 12,000+ readers getting the best book notes straight to their inbox.</p>
        </div>
        <form className="newsletter__form" onSubmit={subscribe}>
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="hp-field"
            style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
            onChange={() => {}}
          />
          <input
            type="email"
            required
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="newsletter__input"
          />
          <button type="submit" className="btn btn--primary" disabled={busy || !email}>
            {busy ? '...' : 'Subscribe free'}
          </button>
        </form>
        <p className="newsletter__privacy">We respect your privacy — your email is never shared.</p>
        <p className="newsletter__coupon-hint">
          🎁 Subscribe &amp; get 20% off (code READ20) your first order
        </p>
        {status && (
          <p className={status.ok ? 'newsletter__status--ok' : 'newsletter__status--err'}>
            {status.msg}
          </p>
        )}
      </div>
    </section>
  );
}
