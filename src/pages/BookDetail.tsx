import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { getBookBySlug, formatPrice, books } from '../data/books';
import BookCard from '../components/BookCard';

export default function BookDetail() {
  const { slug } = useParams<{ slug: string }>();
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
      const r = await fetch('/api/confirm-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, slug: book.slug, honeypot: '' }),
      });
      const j = await r.json();
      setStatus(j.ok ? { ok: true, msg: '✅ تم إرسال رابط التحميل إلى بريدك' } : { ok: false, msg: '❌ ' + (j.error || 'تعذر الطلب') });
    } catch {
      setStatus({ ok: false, msg: '❌ خطأ في الاتصال' });
    } finally {
      setBusy(false);
    }
  }

  if (!book) {
    return (
      <section className="section container">
        <h1 className="section__title">الكتاب غير موجود</h1>
        <Link to="/shop" className="btn btn--primary">
          العودة للمتجر
        </Link>
      </section>
    );
  }

  const related = books
    .filter((b) => b.id !== book.id)
    .sort((a, b) => {
      // نفس التصنيف أولاً
      if (a.category === book.category && b.category !== book.category) return -1;
      if (a.category !== book.category && b.category === book.category) return 1;
      return b.rating - a.rating;
    })
    .slice(0, 3);

  const buyHref = book.gumroadUrl && !book.gumroadUrl.includes('REPLACE_WITH_YOUR_LINK')
    ? book.gumroadUrl
    : undefined;

  return (
    <section className="section book-detail">
      <div className="container">
        <Link to="/shop" className="book-detail__back">
          → العودة للمتجر
        </Link>

        <div className="book-detail__grid">
          <motion.div
            className="book-detail__cover"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img src={`/covers/${book.cover}`} alt={book.title} />
          </motion.div>

          <motion.div
            className="book-detail__info"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="book-card__cat">{book.category}</span>
            <h1 className="book-detail__title">{book.title}</h1>
            <p className="book-detail__author">{book.author}</p>

            <div className="book-card__rating">
              {'★'.repeat(Math.round(book.rating))}
              <span className="book-card__rating-value">
                {book.rating.toFixed(1)} ({book.reviews} تقييم)
              </span>
            </div>

            <div className="book-detail__meta">
              <span>📄 {book.pages} صفحة</span>
              <span>🌐 {book.language}</span>
              <span>📦 {book.formats.join(' · ')}</span>
            </div>

            <p className="book-detail__desc">{book.longDescription}</p>

            <div className="book-detail__tags">
              {book.tags.map((t) => (
                <span key={t} className="chip">
                  #{t}
                </span>
              ))}
            </div>

            <div className="book-detail__buy">
              <div className="book-detail__price">
                <span>السعر</span>
                <strong>{formatPrice(book.price)}</strong>
              </div>
              {buyHref ? (
                <a
                  className="btn btn--primary btn--lg"
                  href={buyHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  اشترِ الآن من Gumroad
                </a>
              ) : (
                <button
                  className="snipcart-add-item btn btn--primary btn--lg"
                  data-item-id={book.id}
                  data-item-name={book.title}
                  data-item-price={book.price}
                  data-item-url={typeof window !== 'undefined' ? `${window.location.origin}/book/${book.slug}` : `https://dar-ma3rifa.example/book/${book.slug}`}
                  data-item-description={book.description}
                  data-item-image={`/covers/${book.cover}`}
                  data-item-file-guid={`${book.id}-download`}
                  data-item-metadata='{"format":"PDF+EPUB"}'
                >
                  اشترِ الآن وأضف للسلة
                </button>
              )}

              {book.downloadUrl && (
                <a className="btn btn--ghost btn--lg" href={book.downloadUrl} download>
                  ⬇ تحميل نموذج PDF
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
                  placeholder="بريدك لتأكيد الطلب"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="book-detail__email-input"
                />
                <button type="submit" className="btn btn--ghost btn--sm" disabled={busy || !email}>
                  {busy ? '...' : 'أطلب عبر الإيميل'}
                </button>
              </form>
              {status && (
                <p className={status.ok ? 'book-detail__status--ok' : 'book-detail__status--err'}>
                  {status.msg}
                </p>
              )}
            </div>
            <p className="book-detail__note">
              ✔ تسليم فوري · ✔ روابط تحميل دائمة · ✔ ضمان استرداد 7 أيام
            </p>
          </motion.div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="container">
          <div className="section__head section__head--left">
            <h2 className="section__title">كتب ذات صلة</h2>
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
