import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLang } from '../i18n/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { getWishlist } from '../data/wishlist';

export default function Navbar() {
  const { t } = useLang();
  const [wishCount, setWishCount] = useState(0);
  useEffect(() => {
    setWishCount(getWishlist().length);
    const onStorage = () => setWishCount(getWishlist().length);
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="navbar"
    >
      <div className="container navbar__inner">
        <Link to="/" className="brand">
          <span className="brand__mark">D</span>
          <span className="brand__name">{t('seo.siteName')}</span>
        </Link>

        <nav className="nav" aria-label="Main navigation">
          <Link to="/" className="nav__link">
            {t('nav.home')}
          </Link>
          <Link to="/shop" className="nav__link">
            {t('nav.shop')}
          </Link>
          <Link to="/blog" className="nav__link">
            {t('nav.blog')}
          </Link>
          <Link to="/pricing" className="nav__link">
            {t('nav.pricing')}
          </Link>
          <Link to="/faq" className="nav__link">
            {t('nav.faq')}
          </Link>
          <Link to="/wishlist" className="nav__link">
            {t('nav.wishlist')}
            {wishCount > 0 && <span className="nav__badge">{wishCount}</span>}
          </Link>
        </nav>

        <div className="navbar__actions">
          <LanguageSwitcher />
          <Link to="/shop" className="btn btn--ghost">
            {t('nav.shop')}
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
