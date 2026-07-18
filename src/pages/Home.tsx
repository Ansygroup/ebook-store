import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import BookCard from '../components/BookCard';
import FAQ from '../components/FAQ';
import Newsletter from '../components/Newsletter';
import JsonLd from '../components/JsonLd';
import { featuredBooks, formatPrice, books } from '../data/books';
import { coupons } from '../data/coupons';
import { getRecent } from '../data/wishlist';

const steps = [
  { n: '1', t: 'Browse & pick', d: 'Explore books by category and read the description and reviews.' },
  { n: '2', t: 'Pay securely', d: 'Complete the order via the trusted Stripe gateway in seconds.' },
  { n: '3', t: 'Download instantly', d: 'Get the download link straight to your device.' },
];

const testimonials = [
  { name: 'Sara Al-Mutairi', role: 'Product Manager', text: '"The Influential Leader" changed how I manage my team. My work is clearer now.', rating: 5 },
  { name: 'Khalid Al-Otaibi', role: 'Entrepreneur', text: 'I bought "Build Your Empire" and applied its plan in two weeks. Highly recommend it.', rating: 5 },
  { name: 'Mona Al-Ahmed', role: 'Developer', text: 'Instant download and permanent links. A smooth purchase from the first time.', rating: 5 },
];

export default function Home() {
  const avgRating = (testimonials.reduce((s, x) => s + x.rating, 0) / testimonials.length).toFixed(1);
  const [recent, setRecent] = useState<string[]>([]);
  useEffect(() => { setRecent(getRecent()); }, []);
  const recentBooks = recent.map((s) => books.find((b) => b.slug === s)).filter(Boolean).slice(0, 6);
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'ANSY',
          url: 'https://ansygroup.github.io/ebook-store',
          description: 'Global e-book store with expertly crafted titles in leadership, business & self-development, written by ANSY.',
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: avgRating,
            reviewCount: testimonials.length,
          },
        }}
      />
      <Hero />

      <div className="coupon-banner">
        <div className="container coupon-banner__inner">
          <span className="coupon-banner__tag">Limited offer</span>
          <span className="coupon-banner__text">
            {`${coupons[1].percent}% off your first order — code: `}
            <strong>{coupons[1].code}</strong>
          </span>
          <Link to="/shop" className="btn btn--ghost btn--sm">
            Shop
          </Link>
        </div>
      </div>

      <section className="section" id="featured">
        <div className="container">
          <div className="section__head">
            <span className="section__eyebrow">Most wanted</span>
            <h2 className="section__title">Our featured books</h2>
            <p className="section__sub">
              A hand-picked collection to take your next step toward your goals.
            </p>
          </div>
          <div className="book-grid">
            {featuredBooks.map((book, i) => (
              <BookCard key={book.id} book={book} index={i} />
            ))}
          </div>
          <div className="section__cta">
            <Link to="/shop" className="btn btn--primary btn--lg">
              View all books
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--alt how">
        <div className="container">
          <div className="section__head">
            <span className="section__eyebrow">How it works</span>
            <h2 className="section__title">Three steps and the book is in your hands</h2>
          </div>
          <div className="steps">
            {steps.map((s) => (
              <motion.div
                key={s.n}
                className="step"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5 }}
              >
                <span className="step__n">{s.n}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container cta-band__inner">
          <div>
            <h2>Start your journey today for less than a monthly coffee</h2>
            <p>Invest in yourself with just one book — the return lasts a lifetime.</p>
          </div>
          <div className="cta-band__price">
            <span>Starts at</span>
            <strong>{formatPrice(9.99)}</strong>
            <Link to="/shop" className="btn btn--primary btn--lg">
              Shop now
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--alt testimonials">
        <div className="container">
          <div className="section__head">
            <span className="section__eyebrow">What readers say</span>
            <h2 className="section__title">Thousands of readers trust us</h2>
          </div>
          <div className="testimonial-grid">
            {testimonials.map((tm, i) => (
              <motion.figure
                key={tm.name}
                className="testimonial"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="testimonial__stars">{'★'.repeat(tm.rating)}</div>
                <blockquote>{tm.text}</blockquote>
                <figcaption>
                  <strong>{tm.name}</strong>
                  <span>{tm.role}</span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />

      {recentBooks.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section__head section__head--left">
              <h2 className="section__title">Recently viewed</h2>
            </div>
            <div className="book-grid">
              {recentBooks.map((b, i) => (
                <BookCard key={b!.id} book={b!} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <FAQ />
    </>
  );
}
