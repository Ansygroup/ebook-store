import { useState } from 'react';
import { motion } from 'framer-motion';

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
      const r = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const j = await r.json();
      setStatus(
        j.ok
          ? { ok: true, msg: '✅ تم اشتراكك! تحقق من بريدك للترحيب.' }
          : { ok: false, msg: '❌ ' + (j.error || 'تعذر الاشتراك') },
      );
    } catch {
      setStatus({ ok: false, msg: '❌ خطأ في الاتصال' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="section newsletter">
      <div className="container">
        <motion.div
          className="newsletter__inner"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <div className="newsletter__text">
            <span className="section__eyebrow">النشرة الأسبوعية</span>
            <h2 className="section__title">كتاب جديد وكوبون خصم كل أسبوع</h2>
            <p className="section__sub">
              انضم لأكثر من 12,000 قارئ يتلقّون أفضل ملخّصات الكتب مباشرة على بريدهم.
            </p>
          </div>
          <form className="newsletter__form" onSubmit={subscribe}>
            <input
              type="email"
              required
              placeholder="بريدك الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="newsletter__input"
            />
            <button type="submit" className="btn btn--primary btn--lg" disabled={busy || !email}>
              {busy ? '...' : 'اشترك مجاناً'}
            </button>
          </form>
          {status && (
            <p className={status.ok ? 'newsletter__status--ok' : 'newsletter__status--err'}>
              {status.msg}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
