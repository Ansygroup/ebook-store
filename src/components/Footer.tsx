import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';

export default function Footer() {
  const { t, lang } = useLang();
  return (
    <footer className="footer" id="contact">
      <div className="container footer__inner">
        <div className="footer__col footer__col--brand">
          <div className="brand brand--light">
            <span className="brand__mark">D</span>
            <span className="brand__name">{t('seo.siteName')}</span>
          </div>
          <p>
            {lang === 'ar'
              ? 'متجر رقمي متخصص في الكتب الإلكترونية العربية عالية الجودة. نُشرِف على كل كتاب لنقدّم لك محتوى يستحق وقتك ومالك.'
              : 'A global digital store for high-quality ebooks on leadership, business, and personal growth — bilingual (Arabic + English), with instant PDF download.'}
          </p>
        </div>

        <div className="footer__col">
          <h4>{lang === 'ar' ? 'روابط سريعة' : 'Quick links'}</h4>
          <Link to="/shop">{t('nav.shop')}</Link>
          <Link to="/blog">{t('nav.blog')}</Link>
          <Link to="/pricing">{t('nav.pricing')}</Link>
          <Link to="/faq">{t('nav.faq')}</Link>
        </div>

        <div className="footer__col">
          <h4>{lang === 'ar' ? 'القانونية' : 'Legal'}</h4>
          <Link to="/privacy">{t('footer.privacy')}</Link>
          <Link to="/terms">{t('footer.terms')}</Link>
          <a href="mailto:support@dar-ma3rifa.example">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</a>
        </div>
      </div>
      <div className="footer__bottom container">
        <span>© {new Date().getFullYear()} {t('seo.siteName')} — {lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</span>
        <span>{lang === 'ar' ? 'الدفع آمن عبر Gumroad · التسليم فوري' : 'Secure checkout via Gumroad · Instant delivery'}</span>
      </div>
    </footer>
  );
}
