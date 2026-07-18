import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { books } from '../data/books';
import BookCard from '../components/BookCard';
import { getWishlist } from '../data/wishlist';

export default function Wishlist() {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    setSlugs(getWishlist());
  }, []);

  const wished = books.filter((b) => slugs.includes(b.slug));

  return (
    <section className="section">
      <div className="container">
        <div className="section__head section__head--left">
          <h1 className="section__title">My Wishlist ♥</h1>
        </div>

        {wished.length === 0 ? (
          <div className="wishlist__empty">
            <p>No saved books yet.</p>
            <Link to="/shop" className="btn btn--primary">Browse the shop</Link>
          </div>
        ) : (
          <div className="book-grid">
            {wished.map((b, i) => (
              <BookCard key={b.id} book={b} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
