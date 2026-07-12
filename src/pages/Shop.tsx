import { useMemo, useState } from 'react';
import BookCard from '../components/BookCard';
import { books, categories } from '../data/books';

type SortKey = 'popular' | 'price-asc' | 'price-desc';

export default function Shop() {
  const [activeCat, setActiveCat] = useState<string>('الكل');
  const [sort, setSort] = useState<SortKey>('popular');

  const filtered = useMemo(() => {
    let list = books.filter(
      (b) => activeCat === 'الكل' || b.category === activeCat,
    );
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'popular') list = [...list].sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [activeCat, sort]);

  return (
    <section className="section shop">
      <div className="container">
        <div className="section__head">
          <span className="section__eyebrow">المتجر</span>
          <h1 className="section__title">كل الكتب الإلكترونية</h1>
          <p className="section__sub">
            {filtered.length} كتاب متاح للتحميل الفوري.
          </p>
        </div>

        <div className="shop__controls" data-testid="shop-controls">
          <div className="shop__cats" role="tablist" aria-label="التصنيفات">
            {['الكل', ...categories].map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={activeCat === c}
                className={`chip ${activeCat === c ? 'is-active' : ''}`}
                onClick={() => setActiveCat(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <label className="shop__sort">
            ترتيب:
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
            >
              <option value="popular">الأكثر تقييماً</option>
              <option value="price-asc">السعر: من الأقل</option>
              <option value="price-desc">السعر: من الأعلى</option>
            </select>
          </label>
        </div>

        <div className="book-grid" data-testid="book-grid">
          {filtered.map((book, i) => (
            <BookCard key={book.id} book={book} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="shop__empty">لا توجد كتب في هذا التصنيف حالياً.</p>
        )}
      </div>
    </section>
  );
}
