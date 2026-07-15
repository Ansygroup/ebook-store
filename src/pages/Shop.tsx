import { useMemo, useState } from 'react';
import BookCard from '../components/BookCard';
import { books, categories, pick } from '../data/books';
import { useLang } from '../i18n/LanguageContext';
import Breadcrumbs from '../components/Breadcrumbs';

type SortKey = 'popular' | 'price-asc' | 'price-desc' | 'rating';

export default function Shop() {
  const { t, lang } = useLang();
  const [activeCat, setActiveCat] = useState<string>('all');
  const [sort, setSort] = useState<SortKey>('popular');
  const [query, setQuery] = useState<string>('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = books.filter(
      (b) => activeCat === 'all' || b.categoryEn === activeCat,
    );
    if (q) {
      list = list.filter((b) => {
        const title = pick<string>(b, 'title', lang).toLowerCase();
        const author = pick<string>(b, 'author', lang).toLowerCase();
        const tags = pick<string[]>(b, 'tags', lang).join(' ').toLowerCase();
        const cat = pick<string>(b, 'category', lang).toLowerCase();
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
  }, [activeCat, sort, query, lang]);

  return (
    <section className="section shop">
      <Breadcrumbs
        items={[
          { name: lang === 'ar' ? 'الرئيسية' : 'Home', path: '/' },
          { name: lang === 'ar' ? 'المتجر' : 'Shop', path: '/shop' },
        ]}
      />
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
          <div className="shop__search">
            <input
              type="search"
              className="shop__search-input"
              placeholder={lang === 'ar' ? 'ابحث بالعنوان أو الكاتب أو التصنيف…' : 'Search title, author, or category…'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={lang === 'ar' ? 'ابحث' : 'Search'}
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
                  ? t('shop.all')
                  : c}
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
