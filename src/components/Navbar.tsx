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
        </div>
      </div>
    </motion.header>
  );
}
