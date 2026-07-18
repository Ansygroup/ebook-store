import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';
import { posts, pick } from '../data/posts';
import Breadcrumbs from '../components/Breadcrumbs';
import { asset } from '../data/assets';

export default function BlogList() {
  const { lang, t } = useLang();
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <section className="section container">
      <Breadcrumbs
        items={[
          { name: lang === 'ar' ? 'الرئيسية' : 'Home', path: '/' },
          { name: lang === 'ar' ? 'المدونة' : 'Blog', path: '/blog' },
        ]}
      />
      <h1 className="section__title">{lang === 'ar' ? 'المدونة' : 'Blog'}</h1>
      <p className="section__sub">{t('blog.sub')}</p>
      <div className="blog-grid">
        {sorted.map((p) => {
          const title = pick<string>(p, 'title', lang);
          const excerpt = pick<string>(p, 'excerpt', lang);
          return (
            <article key={p.slug} className="blog-card">
              {p.cover && <img src={asset(`/${p.cover}`)} alt={title} className="blog-card__cover" loading="lazy" />}
              <div className="blog-card__body">
                <time className="blog-card__date">{p.date}</time>
                <h2 className="blog-card__title">
                  <Link to={`/blog/${p.slug}`}>{title}</Link>
                </h2>
                <p className="blog-card__excerpt">{excerpt}</p>
                <Link to={`/blog/${p.slug}`} className="blog-card__more">
                  {lang === 'ar' ? 'اقرأ المزيد ←' : 'Read more →'}
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
