import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLang } from '../i18n/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const { t } = useLang();
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="navbar"
    >
      <div className="container navbar__inner">
        <Link to="/" className="brand">
          <span className="brand__mark">د</span>
          <span className="brand__name">{t('seo.siteName')}</span>
        </Link>

        <nav className="nav" aria-label="Main navigation">
          <Link to="/" className="nav__link">
            {t('nav.home')}
          </Link>
          <Link to="/shop" className="nav__link">
            {t('nav.shop')}
          </Link>
          <a href="/#faq" className="nav__link">
            {t('faq.title')}
          </a>
        </nav>

        <div className="navbar__actions">
          <LanguageSwitcher />
          <Link to="/shop" className="btn btn--ghost">
            {t('nav.shop')}
          </Link>
          <button className="snipcart-checkout btn btn--primary cart-btn" aria-label="Cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span>{t('lang.toggle') === 'English' ? 'Cart' : 'السلة'}</span>
            <span className="snipcart-items-count cart-count">0</span>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
