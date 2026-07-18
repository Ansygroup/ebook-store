import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Book } from '../types';
import { formatPrice, pick, buyHref } from '../data/books';
import { useLang } from '../i18n/LanguageContext';

interface Props {
  book: Book;
  index?: number;
}

export default function BookCard({ book, index = 0 }: Props) {
  const { lang } = useLang();
  const href = buyHref(book);
  const title = pick<string>(book, 'title', lang);
  const author = pick<string>(book, 'author', lang);
  const category = pick<string>(book, 'category', lang);
  return (
    <motion.article
      className="book-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
      whileHover={{ y: -8 }}
    >
      <Link to={`/book/${book.slug}`} className="book-card__cover">
        <img src={`/covers/${book.cover}`} alt={title} loading="lazy" />
        {book.featured && (
          <span className="book-card__flag">{lang === 'ar' ? 'مميز' : 'Featured'}</span>
        )}
      </Link>

      <div className="book-card__body">
        <span className="book-card__cat">{category}</span>
        <h3 className="book-card__title">
          <Link to={`/book/${book.slug}`}>{title}</Link>
        </h3>
        <p className="book-card__author">{author}</p>

        <div className="book-card__rating" aria-label={`${lang === 'ar' ? 'التقييم' : 'Rating'} ${book.rating} / 5`}>
          {'★'.repeat(Math.round(book.rating))}
          <span className="book-card__rating-value">
            {book.rating.toFixed(1)} ({book.reviews})
          </span>
        </div>

        <div className="book-card__footer">
          <span className="book-card__price">{formatPrice(book.price)}</span>
          <a
            className="btn btn--primary btn--sm"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {lang === 'ar' ? 'اشترِ الآن' : 'Buy now'}
          </a>
        </div>
      </div>
    </motion.article>
  );
}
