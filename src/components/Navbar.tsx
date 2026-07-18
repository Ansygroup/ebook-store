import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getWishlist } from '../data/wishlist';

export default function Navbar() {
  const [wishCount, setWishCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    setWishCount(getWishlist().length);
    const onStorage = () => setWishCount(getWishlist().length);
    window.addEventListener('storage', onStorage);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`navbar ${scrolled ? 'is-scrolled' : ''}`}
    >
      <div className="container navbar__inner">
        <Link to="/" className="brand">
          <span className="brand__mark">A</span>
          <span className="brand__name">ANSY</span>
        </Link>

        <nav className="nav" aria-label="Main navigation">
          <Link to="/" className="nav__link">
            Home
          </Link>
          <Link to="/shop" className="nav__link">
            Shop
          </Link>
          <Link to="/blog" className="nav__link">
            Blog
          </Link>
          <Link to="/pricing" className="nav__link">
            Pricing
          </Link>
          <Link to="/faq" className="nav__link">
            FAQ
          </Link>
          <Link to="/wishlist" className="nav__link">
            Wishlist
            {wishCount > 0 && <span className="nav__badge">{wishCount}</span>}
          </Link>
        </nav>

        <div className="navbar__actions">
          <Link to="/shop" className="btn btn--ghost">
            Shop
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
