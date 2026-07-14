import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { getBookBySlug, formatPrice, books, pick, gumroadHref } from '../data/books';
import { useLang } from '../i18n/LanguageContext';
import BookCard from '../components/BookCard';

export default function BookDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang } = useLang();
  const book = slug ? getBookBySlug(slug) : undefined;
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function orderByEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!book || !email) return;
    setBusy(true);
    setStatus(null);
    try {
      const r = await fetch(`${import.meta.env.VITE_API_BASE || ''}/api/confirm-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, slug: book.slug, honeypot: '' }),
      });
      const j = await r.json();
      setStatus(
        j.ok
          ? { ok: true, msg: t('book.orderSent') }
          : { ok: false, msg: '❌ ' + (j.error || (lang === 'ar' ? 'تعذر الطلب' : 'Order failed')) },
      );
    } catch {
      setStatus({ ok: false, msg: '⚠️ ' + (lang === 'ar' ? 'خدمة الطلب غير متاحة حالياً — حاول لاحقاً' : 'Order service temporarily unavailable — try again later') });
    } finally {
      setBusy(false);
    }
  }

  if (!book) {
    return (
      <section className="section container">
        <h1 className="section__title">{t('book.notFound')}</h1>
        <Link to="/shop" className="btn btn--primary">
          {lang === 'ar' ? 'العودة للمتجر' : 'Back to shop'}
        </Link>
      </section>
    );
  }

  const related = books
    .filter((b) => b.id !== book.id)
    .sort((a, b) => {
      if (a.categoryEn === book.categoryEn && b.categoryEn !== book.categoryEn) return -1;
      if (a.categoryEn !== book.categoryEn && b.categoryEn === book.categoryEn) return 1;
      return b.rating - a.rating;
    })
    .slice(0, 3);

  const buyHref = gumroadHref(book);

  const title = pick<string>(book, 'title', lang);
  const author = pick<string>(book, 'author', lang);
  const category = pick<string>(book, 'category', lang);
  const longDesc = pick<string>(book, 'longDescription', lang);
  const tags = pick<string[]>(book, 'tags', lang);

  return (
    <section className="section book-detail">
      <div className="container">
        <Link to="/shop" className="book-detail__back">
          {lang === 'ar' ? '→ العودة للمتجر' : '← Back to shop'}
        </Link>

        <div className="book-detail__grid">
          <motion.div
            className="book-detail__cover"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img src={`/covers/${book.cover}`} alt={title} />
          </motion.div>

          <motion.div
            className="book-detail__info"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="book-card__cat">{category}</span>
            <h1 className="book-detail__title">{title}</h1>
            <p className="book-detail__author">{author}</p>

            <div className="book-card__rating">
              {'★'.repeat(Math.round(book.rating))}
              <span className="book-card__rating-value">
                {book.rating.toFixed(1)} ({book.reviews} {lang === 'ar' ? 'تقييم' : 'reviews'})
              </span>
            </div>

            <div className="book-detail__meta">
              <span>📄 {book.pages} {t('book.pages')}</span>
              <span>🌐 {book.language}</span>
              <span>📦 {book.formats.join(' · ')}</span>
            </div>

            <p className="book-detail__desc">{longDesc}</p>

            <div className="book-detail__tags">
              {tags.map((tg) => (
                <span key={tg} className="chip">
                  #{tg}
                </span>
              ))}
            </div>

            <div className="book-detail__buy">
              <div className="book-detail__price">
                <span>{t('book.price')}</span>
                <strong>{formatPrice(book.price)}</strong>
              </div>
              <a
                className="btn btn--primary btn--lg"
                href={buyHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('book.buyGumroad')}
              </a>

              {book.downloadUrl && (
                <a className="btn btn--ghost btn--lg" href={book.downloadUrl} download>
                  {t('book.download')}
                </a>
              )}

              <form className="book-detail__email" onSubmit={orderByEmail}>
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
                  placeholder={t('book.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="book-detail__email-input"
                />
                <button type="submit" className="btn btn--ghost btn--sm" disabled={busy || !email}>
                  {busy ? '...' : t('book.orderEmail')}
                </button>
              </form>
              {status && (
                <p className={status.ok ? 'book-detail__status--ok' : 'book-detail__status--err'}>
                  {status.msg}
                </p>
              )}
            </div>
            <p className="book-detail__note">
              {lang === 'ar'
                ? '✔ تسليم فوري · ✔ روابط تحميل دائمة · ✔ ضمان استرداد 7 أيام'
                : '✔ Instant delivery · ✔ Permanent download links · ✔ 7-day refund guarantee'}
            </p>
          </motion.div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="container">
          <div className="section__head section__head--left">
            <h2 className="section__title">{t('book.related')}</h2>
          </div>
          <div className="book-grid">
            {related.map((b, i) => (
              <BookCard key={b.id} book={b} index={i} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
