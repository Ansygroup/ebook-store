import { useMemo, useState } from 'react';
import BookCard from '../components/BookCard';
import { books, categories } from '../data/books';
import { useLang } from '../i18n/LanguageContext';

type SortKey = 'popular' | 'price-asc' | 'price-desc' | 'rating';

export default function Shop() {
  const { t, lang } = useLang();
  const [activeCat, setActiveCat] = useState<string>('all');
  const [sort, setSort] = useState<SortKey>('popular');

  const filtered = useMemo(() => {
    let list = books.filter(
      (b) => activeCat === 'all' || b.categoryAr === activeCat,
    );
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'popular') list = [...list].sort((a, b) => b.reviews - a.reviews);
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [activeCat, sort]);

  return (
    <section className="section shop">
      <div className="container">
        <div className="section__head">
          <span className="section__eyebrow">{t('nav.shop')}</span>
          <h1 className="section__title">
            {lang === 'ar' ? 'كل الكتب الإلكترونية' : 'All ebooks'}
          </h1>
          <p className="section__sub">
            {filtered.length} {t('shop.count')} {lang === 'ar' ? 'متاح للتحميل الفوري.' : 'available for instant download.'}
          </p>
        </div>

        <div className="shop__controls" data-testid="shop-controls">
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
                  ? t('shop.all')
                  : (lang === 'ar' ? c : (books.find((b) => b.categoryAr === c)?.categoryEn ?? c))}
              </button>
            ))}
          </div>

          <label className="shop__sort">
            {t('shop.sort')}:
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
            >
              <option value="popular">{lang === 'ar' ? 'الأكثر تقييماً' : t('shop.sortFeatured')}</option>
              <option value="price-asc">{t('shop.sortPriceAsc')}</option>
              <option value="price-desc">{t('shop.sortPriceDesc')}</option>
              <option value="rating">{t('shop.sortRating')}</option>
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
            {lang === 'ar' ? 'لا توجد كتب في هذا التصنيف حالياً.' : 'No books in this category yet.'}
          </p>
        )}
      </div>
    </section>
  );
}
