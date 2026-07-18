import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: 820 }}>
      <h1>Terms &amp; conditions</h1>
      <p style={{ opacity: 0.7, marginBottom: '1.5rem' }}>
        Last updated: 2026
      </p>
      <h2>License</h2>
      <p>
        On purchase you receive a personal, non-exclusive license. Resale or redistribution is not permitted.
      </p>
      <h2>Refunds</h2>
      <p>
        Full refund within 7 days of purchase if a technical file issue occurs.
      </p>
      <h2>Liability</h2>
      <p>
        Content is provided "as is" for educational purposes. Results vary by reader effort and application.
      </p>
      <p style={{ marginTop: '2rem' }}>
        <Link to="/" className="btn btn--ghost">Back home</Link>
      </p>
    </div>
  );
}
