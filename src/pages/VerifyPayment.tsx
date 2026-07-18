import { useSearchParams, Link } from 'react-router-dom';
import { couponByCode } from '../data/coupons';

export default function VerifyPayment() {
  const [params] = useSearchParams();
  const paid = params.get('paid') === '1';
  const coupon = params.get('coupon');
  const c = coupon ? couponByCode(coupon) : null;

  if (!paid) {
    return (
      <section className="section">
        <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
          <h1>No payment detected</h1>
          <p>If you completed a payment and landed here, check your email or contact us.</p>
          <Link to="/shop" className="btn btn--primary btn--lg">Back to shop</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
        <div style={{ fontSize: '4rem' }}>✅</div>
        <h1>Payment successful!</h1>
        <p>
          Your book download link was sent to your email within minutes.{' '}
          {c && `Coupon ${c.code} applied.`}
        </p>
        <p style={{ color: 'var(--muted)' }}>
          Didn't get it? Check spam or contact us.
        </p>
        <Link to="/shop" className="btn btn--primary btn--lg">Shop more</Link>
      </div>
    </section>
  );
}
