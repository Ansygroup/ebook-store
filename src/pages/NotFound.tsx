import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem', minHeight: '50vh' }}>
      <h1 style={{ fontSize: '5rem', margin: 0, color: 'var(--accent)' }}>404</h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--muted)' }}>
        عذرًا، الصفحة التي تبحث عنها غير موجودة.
      </p>
      <Link to="/" className="btn btn--primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
        العودة للرئيسية
      </Link>
    </div>
  );
}
