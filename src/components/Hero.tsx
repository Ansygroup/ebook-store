import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { featuredBooks, formatPrice } from '../data/books';
import { asset } from '../data/assets';

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { y: 30, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function Hero() {
  const heroBook = featuredBooks[0];
  const bgCover = asset(`/covers/${heroBook.cover}`);
  return (
    <section className="hero">
      <div
        className="hero__bg"
        style={{ backgroundImage: `url(${bgCover})` }}
        aria-hidden="true"
      />
      <div className="hero__scrim" aria-hidden="true" />
      <div className="container hero__inner">
        <motion.div
          className="hero__text"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.span className="hero__badge" variants={item}>
            ✦ 10+ ebooks written by ANSY
          </motion.span>
          <motion.h1 className="hero__title" variants={item}>
            Books that change
            <span className="hero__title-accent"> your trajectory</span>
          </motion.h1>
          <motion.p className="hero__subtitle" variants={item}>
            Leadership, business, and self-mastery, written the way a friend
            would tell you the truth. Download instantly after purchase and
            start today.
          </motion.p>
          <motion.div className="hero__actions" variants={item}>
            <Link to={`/book/${heroBook.slug}`} className="btn btn--lg">
              ▶ Explore {heroBook.title}
            </Link>
            <Link to="/shop" className="btn btn--ghost btn--lg">
              Browse library
            </Link>
          </motion.div>
          <motion.div className="hero__stats" variants={item}>
            <div className="stat">
              <strong>10+</strong>
              <span>ebooks</span>
            </div>
            <div className="stat">
              <strong>4.8</strong>
              <span>avg. rating</span>
            </div>
            <div className="stat">
              <strong>2000+</strong>
              <span>happy readers</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <div className="hero__scroll">Scroll ↓</div>
    </section>
  );
}
