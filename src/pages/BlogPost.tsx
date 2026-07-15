import { useParams, Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';
import { getPostBySlug, pick } from '../data/posts';
import { getBookBySlug, pick as pickBook } from '../data/books';
import NotFound from './NotFound';
import JsonLd from '../components/JsonLd';

// Tiny markdown renderer: ## h2, ### h3, > blockquote, - li, **bold**, blank-line paragraphs.
function md(src: string): string {
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  const lines = src.split('\n');
  let html = '';
  let list = false;
  let para = '';
  const flush = () => {
    if (para.trim()) { html += `<p>${esc(para)}</p>`; para = ''; }
  };
  for (const line of lines) {
    if (/^###\s+/.test(line)) { flush(); html += `<h3>${esc(line.replace(/^###\s+/, ''))}</h3>`; }
    else if (/^##\s+/.test(line)) { flush(); html += `<h2>${esc(line.replace(/^##\s+/, ''))}</h2>`; }
    else if (/^>\s+/.test(line)) { flush(); html += `<blockquote>${esc(line.replace(/^>\s+/, ''))}</blockquote>`; }
    else if (/^-\s+/.test(line)) {
      if (!list) { flush(); html += '<ul>'; list = true; }
      html += `<li>${esc(line.replace(/^-\s+/, ''))}</li>`;
    } else if (line.trim() === '') { flush(); if (list) { html += '</ul>'; list = false; } }
    else { para += (para ? ' ' : '') + line; }
  }
  flush(); if (list) html += '</ul>';
  return html;
}

export default function BlogPost() {
  const { slug } = useParams();
  const { lang, t } = useLang();
  const post = slug ? getPostBySlug(slug) : undefined;
  if (!post) return <NotFound />;

  const title = pick<string>(post, 'title', lang);
  const body = pick<string>(post, 'body', lang);
  const excerpt = pick<string>(post, 'excerpt', lang);

  const SITE = 'https://ansygroup.github.io/ebook-store';

  const relatedBook = post.relatedBook ? getBookBySlug(post.relatedBook) : undefined;
  const bookTitle = relatedBook ? pickBook<string>(relatedBook, 'title', lang) : '';

  return (
    <article className="section container blog-post">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: title,
          description: excerpt,
          datePublished: post.date,
          inLanguage: lang,
          mainEntityOfPage: `${SITE}/blog/${post.slug}`,
          author: { '@type': 'Organization', name: 'Dar Al-Maarifa' },
          publisher: { '@type': 'Organization', name: 'Dar Al-Maarifa' },
          keywords: post.tags.join(', '),
        }}
      />
      <Link to="/blog" className="blog-post__back">← {lang === 'ar' ? 'المدونة' : 'Blog'}</Link>
      {post.cover && <img src={`/${post.cover}`} alt={title} className="blog-post__cover" />}
      <time className="blog-post__date">{post.date}</time>
      <h1 className="blog-post__title">{title}</h1>
      <p className="blog-post__excerpt">{excerpt}</p>
      <div className="blog-post__body" dangerouslySetInnerHTML={{ __html: md(body) }} />
      <div className="blog-post__tags">
        {post.tags.map((tag) => <span key={tag} className="tag">#{tag}</span>)}
      </div>
      <p className="blog-post__cta">
        <Link to="/shop" className="btn btn--primary">{t('nav.shop')}</Link>
      </p>
      {relatedBook && (
        <div className="blog-post__related-book">
          <h2 className="section__title">{lang === 'ar' ? 'كتاب ذو صلة' : 'Related book'}</h2>
          <Link to={`/book/${relatedBook.slug}`} className="related-book">
            <img src={`/covers/${relatedBook.cover}`} alt={bookTitle} className="related-book__cover" />
            <div>
              <span className="related-book__title">{bookTitle}</span>
              <span className="related-book__cta">{lang === 'ar' ? 'اقرأ المزيد ←' : 'Read more →'}</span>
            </div>
          </Link>
        </div>
      )}
    </article>
  );
}
