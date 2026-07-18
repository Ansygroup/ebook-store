import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { featuredBooks, formatPrice, books } from '../data/books';
import { asset } from '../data/assets';
import { useLang } from '../i18n/LanguageContext';

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
  const { lang } = useLang();
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
            {lang === 'ar' ? '✦ أكثر من 10 كتب رقمية مُتقنة' : '✦ 10+ expertly crafted ebooks'}
          </motion.span>
          <motion.h1 className="hero__title" variants={item}>
            {lang === 'ar' ? 'اكتشف كتباً تُغيّر' : 'Discover books that change'}
            <span className="hero__title-accent">
              {lang === 'ar' ? ' مسار حياتك المهنية' : ' your career trajectory'}
            </span>
          </motion.h1>
          <motion.p className="hero__subtitle" variants={item}>
            {lang === 'ar'
              ? 'متجر دار المعرفة يقدّم أفضل الكتب الإلكترونية في القيادة والأعمال والإنتاجية — حمّلها فوراً بعد الشراء وابدأ رحلتك اليوم.'
              : 'Dar Al-Maarifa offers the best ebooks on leadership, business & productivity — download instantly after purchase and start your journey today.'}
          </motion.p>
          <motion.div className="hero__actions" variants={item}>
            <Link to="/shop" className="btn btn--primary btn--lg">
              {lang === 'ar' ? 'تسوّق الآن' : 'Shop now'}
            </Link>
            <a href="#featured" className="btn btn--ghost btn--lg">
              {lang === 'ar' ? 'الكتب المميزة' : 'Featured books'}
            </a>
          </motion.div>
          <motion.div className="hero__stats" variants={item}>
            <div className="stat">
              <strong>10+</strong>
              <span>{lang === 'ar' ? 'كتاب رقمي' : 'ebooks'}</span>
            </div>
            <div className="stat">
              <strong>4.8</strong>
              <span>{lang === 'ar' ? 'متوسط التقييم' : 'avg. rating'}</span>
            </div>
            <div className="stat">
              <strong>2000+</strong>
              <span>{lang === 'ar' ? 'قارئ راضٍ' : 'happy readers'}</span>
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
              <img src={asset(`/covers/${book.cover}`)} alt={pick<string>(book, 'title', lang)} loading="lazy" />
              <div className="hero__book-meta">
                <span>{pick<string>(book, 'title', lang)}</span>
                <strong>{formatPrice(book.price)}</strong>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
