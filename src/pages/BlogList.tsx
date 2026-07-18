import { Link } from 'react-router-dom';
import { posts } from '../data/posts';
import Breadcrumbs from '../components/Breadcrumbs';
import { asset } from '../data/assets';

export default function BlogList() {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <section className="section container">
      <Breadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
        ]}
      />
      <h1 className="section__title">Blog</h1>
      <p className="section__sub">Ideas, frameworks, and notes from the ANSY library.</p>
      <div className="blog-grid">
        {sorted.map((p) => (
          <article key={p.slug} className="blog-card">
            {p.cover && <img src={asset(`/${p.cover}`)} alt={p.title} className="blog-card__cover" loading="lazy" />}
            <div className="blog-card__body">
              <time className="blog-card__date">{p.date}</time>
              <h2 className="blog-card__title">
                <Link to={`/blog/${p.slug}/`}>{p.title}</Link>
              </h2>
              <p className="blog-card__excerpt">{p.excerpt}</p>
              <Link to={`/blog/${p.slug}/`} className="blog-card__more">
                Read more →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
