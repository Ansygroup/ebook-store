import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Book } from '../types';
import { formatPrice } from '../data/books';

interface Props {
  book: Book;
  index?: number;
}

export default function BookCard({ book, index = 0 }: Props) {
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
        <img src={`/covers/${book.cover}`} alt={book.title} loading="lazy" />
        {book.featured && <span className="book-card__flag">مميز</span>}
      </Link>

      <div className="book-card__body">
        <span className="book-card__cat">{book.category}</span>
        <h3 className="book-card__title">
          <Link to={`/book/${book.slug}`}>{book.title}</Link>
        </h3>
        <p className="book-card__author">{book.author}</p>

        <div className="book-card__rating" aria-label={`التقييم ${book.rating} من 5`}>
          {'★'.repeat(Math.round(book.rating))}
          <span className="book-card__rating-value">
            {book.rating.toFixed(1)} ({book.reviews})
          </span>
        </div>

        <div className="book-card__footer">
          <span className="book-card__price">{formatPrice(book.price)}</span>
          <button
            className="snipcart-add-item btn btn--primary btn--sm"
            data-item-id={book.id}
            data-item-name={book.title}
            data-item-price={book.price}
            data-item-url={typeof window !== 'undefined' ? `${window.location.origin}/book/${book.slug}` : `https://dar-ma3rifa.example/book/${book.slug}`}
            data-item-description={book.description}
            data-item-image={`/covers/${book.cover}`}
            data-item-file-guid={`${book.id}-download`}
            data-item-metadata='{"format":"PDF+EPUB"}'
          >
            أضف للسلة
          </button>
        </div>
      </div>
    </motion.article>
  );
}
