import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { featuredBooks, books } from '../data/books';
import { asset } from '../data/assets';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const item = {
  hidden: { y: 24, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.25, 0.8, 0.4, 1] } },
};

// All hero stats are derived from the live catalog — never hard-coded, so
// the data and the page can never drift apart.
function buildHeroStats() {
  const totalBooks = books.length;
  const totalCategories = new Set(books.map((b) => b.category)).size;
  const totalPages = books.reduce((sum, b) => sum + (b.pages || 0), 0);
  return { totalBooks, totalCategories, totalPages };
}

export default function Hero() {
  const heroBook = featuredBooks[0];
  const bgCover = asset(`/covers/${heroBook.cover}`);
  const stats = buildHeroStats();
  return (
    <section className="hero on-dark">
      <div className="hero__bg" style={{ backgroundImage: `url(${bgCover})` }} aria-hidden="true" data-parallax />
      <div className="hero__scrim" aria-hidden="true" />
      <div className="hero__inner">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.span className="hero__badge" variants={item}>
            ✦ {stats.totalBooks} ebooks · written by ANSY
          </motion.span>
          <motion.h1 className="hero__title" variants={item}>
            Books that change
            <span className="hero__title-accent"> your trajectory</span>
          </motion.h1>
          <motion.p className="hero__subtitle" variants={item}>
            Leadership, business, and self-mastery — written the way a friend would tell you the truth.
            Download instantly and start today.
          </motion.p>
          <motion.div className="hero__actions" variants={item}>
            <Link to={`/book/${heroBook.slug}`} className="btn btn--lg">
              Explore {heroBook.title}
            </Link>
            <Link to="/shop" className="btn btn--pill btn--lg">
              See all {stats.totalBooks} books
            </Link>
          </motion.div>
          <motion.div className="hero__stats" variants={item}>
            <div className="stat"><strong>{stats.totalBooks}</strong><span>ebooks</span></div>
            <div className="stat"><strong>{stats.totalCategories}</strong><span>categories</span></div>
            <div className="stat"><strong>{stats.totalPages.toLocaleString('en-US')}</strong><span>pages total</span></div>
          </motion.div>
        </motion.div>
      </div>
      <div className="hero__scroll">Scroll ↓</div>
    </section>
  );
}
