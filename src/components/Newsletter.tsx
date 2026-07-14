import { useState } from 'react';
import { useLang } from '../i18n/LanguageContext';
import { NEWSLETTER_URL } from '../data/books';

export default function Newsletter() {
  const { t, lang } = useLang();
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
        body: JSON.stringify({ email, honeypot: '' }),
      });
      const j = await r.json();
      if (j.ok) {
        // Meta Pixel: track lead (if Pixel loaded)
        try { (window as any).fbq?.('track', 'Lead'); } catch {}
        setStatus({ ok: true, msg: t('newsletter.ok') });
      } else {
        setStatus({ ok: false, msg: '❌ ' + (lang === 'ar' ? 'تعذر الاشتراك' : 'Subscription failed') });
      }
    } catch {
      if (NEWSLETTER_URL) {
        // graceful fallback: open external signup instead of dead API
        window.open(NEWSLETTER_URL, '_blank', 'noopener');
        setStatus({ ok: true, msg: '✅ ' + (lang === 'ar' ? 'تم توجيهك للاشتراك' : 'Redirected to signup') });
      } else {
        setStatus({ ok: false, msg: '⚠️ ' + (lang === 'ar' ? 'خدمة النشرة غير متاحة حالياً — حاول لاحقاً' : 'Newsletter service temporarily unavailable — try again later') });
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="newsletter">
      <div className="container newsletter__inner">
        <div className="newsletter__copy">
          <h2>{t('newsletter.title')}</h2>
          <p>{t('newsletter.sub')}</p>
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
            placeholder={t('newsletter.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="newsletter__input"
          />
          <button type="submit" className="btn btn--primary" disabled={busy || !email}>
            {busy ? '...' : t('newsletter.cta')}
          </button>
        </form>
        <p className="newsletter__privacy">{t('newsletter.privacy')}</p>
        {status && (
          <p className={status.ok ? 'newsletter__status--ok' : 'newsletter__status--err'}>
            {status.msg}
          </p>
        )}
      </div>
    </section>
  );
}
