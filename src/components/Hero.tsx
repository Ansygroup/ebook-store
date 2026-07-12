import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { featuredBooks, formatPrice } from '../data/books';

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
  return (
    <section className="hero">
      <div className="hero__glow" aria-hidden="true" />
      <div className="container hero__inner">
        <motion.div
          className="hero__text"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.span className="hero__badge" variants={item}>
            ✦ أكثر من 6 كتب رقمية مُتقَنة
          </motion.span>
          <motion.h1 className="hero__title" variants={item}>
            اكتشف كتباً تُغيّر
            <span className="hero__title-accent"> مسار حياتك المهنية</span>
          </motion.h1>
          <motion.p className="hero__subtitle" variants={item}>
            متجر دار المعرفة يقدّم أفضل الكتب الإلكترونية في القيادة والأعمال
            والإنتاجية — حمّلها فوراً بعد الشراء وابدأ رحلتك اليوم.
          </motion.p>
          <motion.div className="hero__actions" variants={item}>
            <Link to="/shop" className="btn btn--primary btn--lg">
              تسوّق الآن
            </Link>
            <a href="#featured" className="btn btn--ghost btn--lg">
              الكتب المميزة
            </a>
          </motion.div>
          <motion.div className="hero__stats" variants={item}>
            <div className="stat">
              <strong>6+</strong>
              <span>كتاب رقمي</span>
            </div>
            <div className="stat">
              <strong>4.8</strong>
              <span>متوسط التقييم</span>
            </div>
            <div className="stat">
              <strong>2000+</strong>
              <span>قارئ راضٍ</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero__books"
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 }}
        >
          {featuredBooks.slice(0, 3).map((book, i) => (
            <motion.div
              key={book.id}
              className="hero__book"
              style={{ ['--i' as string]: i }}
              animate={{ y: [0, -14, 0] }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.4,
              }}
            >
              <img src={`/covers/${book.cover}`} alt={book.title} loading="lazy" />
              <div className="hero__book-meta">
                <span>{book.title}</span>
                <strong>{formatPrice(book.price)}</strong>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
