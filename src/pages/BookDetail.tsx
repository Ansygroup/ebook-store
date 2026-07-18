import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getBookBySlug, formatPrice, books, buyHref, SELLER_EMAIL } from '../data/books';
import BookCard from '../components/BookCard';
import JsonLd from '../components/JsonLd';
import Breadcrumbs from '../components/Breadcrumbs';
import { posts } from '../data/posts';
import { couponByCode, isExpired, coupons, trackCoupon } from '../data/coupons';
import { pushRecent } from '../data/wishlist';
import { asset } from '../data/assets';

export default function BookDetail() {
  const { slug } = useParams<{ slug: string }>();
  const book = slug ? getBookBySlug(slug) : undefined;
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [coupon, setCoupon] = useState<ReturnType<typeof couponByCode> | null>(null);
  const [couponErr, setCouponErr] = useState('');

  function applyCoupon() {
    const c = couponByCode(couponInput);
    if (!c) {
      setCoupon(null);
      setCouponErr('Invalid code');
      return;
    }
    if (isExpired(c)) {
      setCoupon(null);
      setCouponErr('Code expired');
      return;
    }
    setCoupon(c);
    setCouponErr('');
    trackCoupon('ViewContent', c.code, discounted);
  }
  const discounted = coupon && book ? Math.round(book.price * (1 - coupon.percent / 100) * 100) / 100 : book?.price ?? 0;

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
          ? { ok: true, msg: '✅ Download link sent to your email' }
          : { ok: false, msg: '❌ ' + (j.error || 'Order failed') },
      );
    } catch {
      // last-resort: open a pre-filled email (no backend needed)
      const subj = encodeURIComponent(`Order: ${book.title} (${book.slug})`);
      const body = encodeURIComponent(`Email: ${email}\nBook: ${book.title}\nSlug: ${book.slug}`);
      window.location.href = `mailto:${SELLER_EMAIL}?subject=${subj}&body=${body}`;
      setStatus({ ok: true, msg: '📧 Opened your mail app to send your order' });
    } finally {
      setBusy(false);
    }
  }

  if (!book) {
    return (
      <section className="section container">
        <h1 className="section__title">Book not found</h1>
        <Link to="/shop" className="btn btn--primary">
          Back to shop
        </Link>
      </section>
    );
  }

  const related = books
    .filter((b) => b.id !== book.id)
    .sort((a, b) => {
      if (a.category === book.category && b.category !== book.category) return -1;
      if (a.category !== book.category && b.category === book.category) return 1;
      return b.rating - a.rating;
    })
    .slice(0, 3);

  // "Frequently bought together": this book + top 2 related → bundle CTA
  const bundle = [book, ...related].slice(0, 3);
  const bundleTotal = bundle.reduce((s, b) => s + b.price, 0);
  const bundleSave = Math.round(bundleTotal * 0.3 * 100) / 100; // BUNDLE30
  const bundlePrice = Math.round((bundleTotal - bundleSave) * 100) / 100;

  const relatedPosts = posts
    .filter((p) => p.relatedBook === book.slug)
    .slice(0, 3);

  const href = buyHref(book);

  const title = book.title;
  const author = book.author;
  const category = book.category;
  const longDesc = book.longDescription;
  const tags = book.tags;

  const SITE = 'https://ansygroup.github.io/ebook-store';
  const ogImage = `${SITE}/og/${book.slug}.png`;

  // inject per-book Open Graph tags so shared links show the right cover
  useEffect(() => {
    const set = (prop: string, content: string) => {
      let m = document.head.querySelector(`meta[property="${prop}"]`);
      if (!m) { m = document.createElement('meta'); m.setAttribute('property', prop); document.head.appendChild(m); }
      m.setAttribute('content', content);
    };
    set('og:title', title);
    set('og:description', longDesc);
    set('og:image', ogImage);
    set('twitter:image', ogImage);
    // unique canonical per book (index.html ships a static home canonical that we override here)
    const can = document.head.querySelector('link[rel="canonical"]');
    if (can) can.setAttribute('href', `https://ansygroup.github.io/ebook-store/book/${slug}/`);
    if (slug) pushRecent(slug);
  }, [title, longDesc, ogImage, slug]);

  return (
    <section className="section book-detail">
      <div
        className="book-detail__hero"
        style={{ backgroundImage: `linear-gradient(0deg, var(--bg) 5%, transparent 60%), url(${asset(`/covers/${book.cover}`)})` }}
        aria-hidden="true"
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Book',
          name: title,
          author: { '@type': 'Person', name: author },
          description: longDesc,
          inLanguage: book.language || 'en',
          bookFormat: 'https://schema.org/EBook',
          numberOfPages: book.pages,
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: book.rating,
            reviewCount: book.reviews,
          },
          offers: {
            '@type': 'Offer',
            price: book.price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          },
        }}
      />
      <Breadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Shop', path: '/shop' },
          { name: title, path: `/book/${book.slug}` },
        ]}
      />
      <div className="container">
        <Link to="/shop" className="book-detail__back">
          ← Back to shop
        </Link>

        <div className="book-detail__grid">
          <motion.div
            className="book-detail__cover"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img src={asset(`/covers/${book.cover}`)} alt={title} />
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
                {book.rating.toFixed(1)} ({book.reviews} reviews)
              </span>
            </div>

            <div className="book-detail__meta">
              <span>📄 {book.pages} pages</span>
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
                <span>Price</span>
                {coupon ? (
                  <strong>
                    <s style={{ opacity: 0.5, fontWeight: 400, marginRight: 8 }}>{formatPrice(book.price)}</s>
                    {formatPrice(discounted)}
                    <em style={{ fontSize: '0.7em', color: '#22c55e', marginLeft: 6 }}>{coupon.code}</em>
                  </strong>
                ) : (
                  <strong>{formatPrice(book.price)}</strong>
                )}
              </div>

              <div className="coupon">
                <input
                  className="coupon__input"
                  placeholder="Coupon code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                />
                <button className="btn btn--ghost btn--sm" onClick={applyCoupon} type="button">
                  Apply
                </button>
              </div>
              {couponErr && <p className="coupon__err">{couponErr}</p>}
              {!coupon && (
                <p className="coupon__hint">
                  Try: {coupons.map((c) => c.code).join(' · ')}
                </p>
              )}

              <a
                className="btn btn--primary btn--lg"
                href={coupon ? `${href}${href.includes('?') ? '&' : '?'}coupon=${coupon.code}` : href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => coupon && trackCoupon('InitiateCheckout', coupon.code, discounted)}
              >
                Buy now via Stripe
              </a>

              {book.downloadUrl && (
                <a className="btn btn--ghost btn--lg" href={asset(book.downloadUrl)} download>
                  ⬇ Download sample PDF
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
                  placeholder="Your email to confirm order"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="book-detail__email-input"
                />
                <button type="submit" className="btn btn--ghost btn--sm" disabled={busy || !email}>
                  {busy ? '...' : 'Order by email'}
                </button>
              </form>
              {status && (
                <p className={status.ok ? 'book-detail__status--ok' : 'book-detail__status--err'}>
                  {status.msg}
                </p>
              )}
            </div>
            <p className="book-detail__note">
              ✔ Instant delivery · ✔ Permanent download links · ✔ 7-day refund guarantee
            </p>
          </motion.div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="container">
          <div className="bundle">
            <div className="bundle__head">
              <h2 className="section__title">Frequently bought together</h2>
              <p className="bundle__save">Save {formatPrice(bundleSave)} with code BUNDLE30</p>
            </div>
            <div className="bundle__items">
              {bundle.map((b, i) => (
                <div className="bundle__item" key={b.id}>
                  {i > 0 && <span className="bundle__plus">+</span>}
                  <img src={asset(`/covers/${b.cover}`)} alt={b.title} className="bundle__cover" />
                  <span className="bundle__name">{b.title}</span>
                  <span className="bundle__price">{formatPrice(b.price)}</span>
                </div>
              ))}
            </div>
            <div className="bundle__cta">
              <span className="bundle__total">
                <s>{formatPrice(bundleTotal)}</s> <strong>{formatPrice(bundlePrice)}</strong>
              </span>
              <a
                className="btn btn--primary btn--lg"
                href={`#`}
                onClick={(e) => {
                  e.preventDefault();
                  bundle.forEach((b) => window.open(buyHref(b), '_blank', 'noopener'));
                }}
              >
                Buy all 3
              </a>
            </div>
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="container">
          <div className="section__head section__head--left">
            <h2 className="section__title">Related books</h2>
          </div>
          <div className="book-grid">
            {related.map((b, i) => (
              <BookCard key={b.id} book={b} index={i} />
            ))}
          </div>
        </div>
      )}

      {relatedPosts.length > 0 && (
        <div className="container">
          <div className="section__head section__head--left">
            <h2 className="section__title">Related articles</h2>
          </div>
          <div className="blog-grid">
            {relatedPosts.map((p) => (
              <Link key={p.slug} to={`/blog/${p.slug}/`} className="blog-card">
                {p.cover && <img src={asset(`/${p.cover}`)} alt={p.title} className="blog-card__cover" />}
                <div className="blog-card__body">
                  <h3 className="blog-card__title">{p.title}</h3>
                  <p className="blog-card__excerpt">{p.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
