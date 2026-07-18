import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container footer__inner">
        <div className="footer__col footer__col--brand">
          <div className="brand brand--light">
            <span className="brand__mark">A</span>
            <span className="brand__name">ANSY</span>
          </div>
          <p>
            A global digital store for high-quality ebooks on leadership,
            business, and personal growth, written by ANSY. Instant PDF
            download, every time.
          </p>
        </div>

        <div className="footer__col">
          <h4>Quick links</h4>
          <Link to="/shop">Shop</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/faq">FAQ</Link>
        </div>

        <div className="footer__col">
          <h4>Legal</h4>
          <Link to="/privacy">Privacy policy</Link>
          <Link to="/terms">Terms &amp; conditions</Link>
          <a href="mailto:support@ansy.example">Email</a>
        </div>
      </div>
      <div className="footer__bottom container">
        <span>© {new Date().getFullYear()} ANSY — All rights reserved.</span>
        <span>Secure checkout via Stripe · Instant delivery</span>
      </div>
    </footer>
  );
}
