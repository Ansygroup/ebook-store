import { useParams, Link } from 'react-router-dom';
import { getPostBySlug } from '../data/posts';
import { getBookBySlug } from '../data/books';
import NotFound from './NotFound';
import JsonLd from '../components/JsonLd';
import Breadcrumbs from '../components/Breadcrumbs';
import { asset } from '../data/assets';

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
  const post = slug ? getPostBySlug(slug) : undefined;
  if (!post) return <NotFound />;

  const title = post.title;
  const body = post.body;
  const excerpt = post.excerpt;

  const SITE = 'https://ansygroup.github.io/ebook-store';

  const relatedBook = post.relatedBook ? getBookBySlug(post.relatedBook) : undefined;
  const bookTitle = relatedBook ? relatedBook.title : '';

  return (
    <article className="section container blog-post">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: title,
          description: excerpt,
          datePublished: post.date,
          inLanguage: 'en',
          mainEntityOfPage: `${SITE}/blog/${post.slug}`,
          author: { '@type': 'Person', name: 'ANSY' },
          publisher: { '@type': 'Organization', name: 'ANSY' },
          keywords: post.tags.join(', '),
        }}
      />
      <Breadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
          { name: title, path: `/blog/${post.slug}` },
        ]}
      />
      <Link to="/blog" className="blog-post__back">← Blog</Link>
      {post.cover && <img src={asset(`/${post.cover}`)} alt={title} className="blog-post__cover" />}
      <time className="blog-post__date">{post.date}</time>
      <h1 className="blog-post__title">{title}</h1>
      <p className="blog-post__excerpt">{excerpt}</p>
      <div className="blog-post__body" dangerouslySetInnerHTML={{ __html: md(body) }} />
      <div className="blog-post__tags">
        {post.tags.map((tag) => <span key={tag} className="tag">#{tag}</span>)}
      </div>
      <p className="blog-post__cta">
        <Link to="/shop" className="btn btn--primary">Shop all books</Link>
      </p>
      {relatedBook && (
        <div className="blog-post__related-book">
          <h2 className="section__title">Related book</h2>
          <Link to={`/book/${relatedBook.slug}`} className="related-book">
            <img src={asset(`/covers/${relatedBook.cover}`)} alt={bookTitle} className="related-book__cover" />
            <div>
              <span className="related-book__title">{bookTitle}</span>
              <span className="related-book__cta">Read more →</span>
            </div>
          </Link>
        </div>
      )}
    </article>
  );
}
