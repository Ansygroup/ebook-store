import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Hero from '../components/Hero';
import BookCard from '../components/BookCard';
import FAQ from '../components/FAQ';
import Newsletter from '../components/Newsletter';
import JsonLd from '../components/JsonLd';
import { featuredBooks, formatPrice, books } from '../data/books';
import { coupons } from '../data/coupons';
import { getRecent } from '../data/wishlist';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const steps = [
  { n: '1', t: 'Browse & pick', d: 'Explore books by category and read reviews.' },
  { n: '2', t: 'Pay securely', d: 'Complete the order via Stripe in seconds.' },
  { n: '3', t: 'Download instantly', d: 'Get the download link straight to your device.' },
];

const testimonials = [
  { name: 'Sara Al-Mutairi', role: 'Product Manager', text: '"The Influential Leader" changed how I manage my team. My work is clearer now.', rating: 5 },
  { name: 'Khalid Al-Otaibi', role: 'Entrepreneur', text: 'I bought "Build Your Empire" and applied its plan in two weeks. Highly recommend it.', rating: 5 },
  { name: 'Mona Al-Ahmed', role: 'Developer', text: 'Instant download and permanent links. A smooth purchase from the first time.', rating: 5 },
];

function buildRows() {
  const byCat = new Map<string, typeof books>();
  for (const b of books) {
    if (!byCat.has(b.category)) byCat.set(b.category, []);
    byCat.get(b.category)!.push(b);
  }
  return Array.from(byCat.entries()).map(([cat, items]) => ({
    cat,
    items: items.sort((a, b) => b.rating - a.rating),
  }));
}

export default function Home() {
  const avgRating = (testimonials.reduce((s, x) => s + x.rating, 0) / testimonials.length).toFixed(1);
  const rows = buildRows();
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Parallax hero
    gsap.to('[data-parallax]', {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
    // Reveal sections
    gsap.utils.toArray('.reveal').forEach((el: any) => {
      gsap.to(el, {
        opacity: 1, y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'ANSY',
          url: 'https://ansygroup.github.io/ebook-store',
          description: 'Global e-book store with expertly crafted titles in leadership, business & self-development, written by ANSY.',
          aggregateRating: { '@type': 'AggregateRating', ratingValue: avgRating, reviewCount: testimonials.length },
        }}
      />
      <Hero />

      {/* Coupon pill */}
      <div className="coupon-banner">
        <div className="coupon-banner__inner">
          <span className="coupon-banner__tag">Limited offer</span>
          <span className="coupon-banner__text">
            {`${coupons[1].percent}% off your first order — code: `}
            <strong>{coupons[1].code}</strong>
          </span>
          <Link to="/shop" className="btn btn--outline btn--sm">Shop ›</Link>
        </div>
      </div>

      {/* Netflix-style rows (dark) */}
      {rows.map((row) => (
        <section className="row reveal" key={row.cat}>
          <div className="row__head">
            <h2 className="row__title">{row.cat}</h2>
            <Link to="/shop" className="row__more">View all ›</Link>
          </div>
          <div className="row__track">
            {row.items.map((book, i) => (
              <motion.div
                key={book.id}
                className="nf-card"
                initial={{ opacity: 0, x: 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.25) }}
              >
                <Link to={`/book/${book.slug}`} className="nf-card__cover">
                  <img src={asset(`/covers/${book.cover}`)} alt={book.title} loading="lazy" />
                  {book.featured && <span className="nf-card__flag">Featured</span>}
                </Link>
                <div className="nf-card__body">
                  <span className="nf-card__cat">{book.category}</span>
                  <h3 className="nf-card__title">{book.title}</h3>
                  <div className="nf-card__meta">
                    <span className="nf-card__price">{formatPrice(book.price)}</span>
                    <span className="nf-card__rating">★ {book.rating.toFixed(1)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      ))}

      {/* Featured (light Apple tile grid) */}
      <section className="section on-light reveal" id="featured">
        <div className="container">
          <div className="section__head">
            <span className="section__eyebrow">Most wanted</span>
            <h2 className="section__title">Our featured books</h2>
            <p className="section__sub">A hand-picked collection to take your next step toward your goals.</p>
          </div>
          <div className="book-grid">
            {featuredBooks.map((book, i) => (
              <BookCard key={book.id} book={book} index={i} />
            ))}
          </div>
          <div className="section__cta">
            <Link to="/shop" className="btn btn--pill btn--lg">View all books ›</Link>
          </div>
        </div>
      </section>

      {/* How it works (dark) */}
      <section className="section on-dark reveal">
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
                initial={{ opacity: 0, y: 20 }}
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

      {/* CTA (dark block, Apple product module) */}
      <section className="cta-band reveal">
        <div className="container">
          <h2>Start your journey today.<br />Less than a monthly coffee.</h2>
          <p>Invest in yourself with just one book — the return lasts a lifetime.</p>
          <div className="cta-band__price">
            <span>Starts at</span>
            <strong>{formatPrice(9.99)}</strong>
            <Link to="/shop" className="btn btn--lg">Shop now</Link>
          </div>
        </div>
      </section>

      {/* Testimonials (light) */}
      <section className="section on-light reveal">
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
                initial={{ opacity: 0, y: 20 }}
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
      <FAQ />
    </div>
  );
}
