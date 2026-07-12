import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getBookBySlug, formatPrice, books } from '../data/books';
import BookCard from '../components/BookCard';

export default function BookDetail() {
  const { slug } = useParams<{ slug: string }>();
  const book = slug ? getBookBySlug(slug) : undefined;

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
    .filter((b) => b.id !== book.id && b.category === book.category)
    .slice(0, 3);

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
