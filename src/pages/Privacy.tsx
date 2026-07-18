import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: 820 }}>
      <h1>Privacy policy</h1>
      <p style={{ opacity: 0.7, marginBottom: '1.5rem' }}>
        Last updated: 2026
      </p>
      <h2>Data we collect</h2>
      <p>
        We collect only your email when you subscribe to the newsletter or order a book. We never collect your card data — payment goes through the Stripe gateway.
      </p>
      <h2>How we use your email</h2>
      <p>
        To send your download link, periodic discount coupons, and free content. You can unsubscribe with one click anytime.
      </p>
      <h2>Sharing</h2>
      <p>
        We do not sell or share your email with any third party. Service providers (payment, email) handle your data under their own policies.
      </p>
      <p style={{ marginTop: '2rem' }}>
        <Link to="/" className="btn btn--ghost">Back home</Link>
      </p>
    </div>
  );
}
