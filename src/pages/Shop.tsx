import { useMemo, useState } from 'react';
import BookCard from '../components/BookCard';
import { books, categories } from '../data/books';
import Breadcrumbs from '../components/Breadcrumbs';

type SortKey = 'popular' | 'price-asc' | 'price-desc' | 'rating';

export default function Shop() {
  const [activeCat, setActiveCat] = useState<string>('all');
  const [sort, setSort] = useState<SortKey>('popular');
  const [query, setQuery] = useState<string>('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = books.filter(
      (b) => activeCat === 'all' || b.category === activeCat,
    );
    if (q) {
      list = list.filter((b) => {
        const title = b.title.toLowerCase();
        const author = b.author.toLowerCase();
        const tags = b.tags.join(' ').toLowerCase();
        const cat = b.category.toLowerCase();
        return (
          title.includes(q) || author.includes(q) || tags.includes(q) || cat.includes(q)
        );
      });
    }
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'popular') list = [...list].sort((a, b) => b.reviews - a.reviews);
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [activeCat, sort, query]);

  return (
    <section className="section shop">
      <Breadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Shop', path: '/shop' },
        ]}
      />
      <div className="container">
        <div className="section__head">
          <span className="section__eyebrow">Shop</span>
          <h1 className="section__title">
            All ebooks
          </h1>
          <p className="section__sub">
            {filtered.length} books available for instant download.
          </p>
        </div>

        <div className="shop__controls" data-testid="shop-controls">
          <div className="shop__search">
            <input
              type="search"
              className="shop__search-input"
              placeholder="Search title, author, or category…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search"
            />
          </div>

          <div className="shop__cats" role="tablist" aria-label="Categories">
            {['all', ...categories].map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={activeCat === c}
                className={`chip ${activeCat === c ? 'is-active' : ''}`}
                onClick={() => setActiveCat(c)}
              >
                {c === 'all'
                  ? 'All'
                  : c}
              </button>
            ))}
          </div>

          <label className="shop__sort">
            Sort:
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
            >
              <option value="popular">Featured first</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="rating">Top rated</option>
            </select>
          </label>
        </div>

        <div className="book-grid" data-testid="book-grid">
          {filtered.map((book, i) => (
            <BookCard key={book.id} book={book} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="shop__empty">
            No books in this category yet.
          </p>
        )}
      </div>
    </section>
  );
}
