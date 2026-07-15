import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';
import { books } from '../data/books';

export default function Pricing() {
  const { t, lang } = useLang();
  // group by price tier
  const tiers = [
    {
      name: lang === 'ar' ? 'مبتدئ' : 'Starter',
      price: '$9.99',
      desc: lang === 'ar' ? 'كتاب واحد لتجربة الجودة' : 'One book to try the quality',
      feat: lang === 'ar' ? ['تحميل فوري', 'روابط دائمة', 'PDF + EPUB'] : ['Instant download', 'Permanent links', 'PDF + EPUB'],
    },
    {
      name: lang === 'ar' ? 'الأكثر شيوعًا' : 'Most popular',
      price: '$29.99',
      desc: lang === 'ar' ? '3 كتب في مجالك' : '3 books in your field',
      feat: lang === 'ar' ? ['تحميل فوري', 'روابط دائمة', 'PDF + EPUB', 'توفير 25%'] : ['Instant download', 'Permanent links', 'PDF + EPUB', 'Save 25%'],
      featured: true,
    },
    {
      name: lang === 'ar' ? 'المكتبة الكاملة' : 'Full library',
      price: '$79.99',
      desc: lang === 'ar' ? `كل الـ ${books.length} كتب` : `All ${books.length} books`,
      feat: lang === 'ar' ? ['تحميل فوري', 'روابط دائمة', 'PDF + EPUB', 'توفير 50%', 'تحديثات مجانية'] : ['Instant download', 'Permanent links', 'PDF + EPUB', 'Save 50%', 'Free updates'],
    },
  ];
  return (
    <section className="section container pricing">
      <div className="section__head">
        <span className="section__eyebrow">{lang === 'ar' ? 'الأسعار' : 'Pricing'}</span>
        <h1 className="section__title">{lang === 'ar' ? 'ابدأ اليوم' : 'Start today'}</h1>
        <p className="section__sub">{lang === 'ar' ? 'أسعار بسيطة، تحميل فوري، روابط دائمة.' : 'Simple pricing, instant download, permanent links.'}</p>
      </div>
      <div className="pricing__grid">
        {tiers.map((tier) => (
          <div key={tier.name} className={`pricing__card ${tier.featured ? 'is-featured' : ''}`}>
            {tier.featured && <span className="pricing__badge">{lang === 'ar' ? 'الأفضل' : 'Best'}</span>}
            <h2 className="pricing__name">{tier.name}</h2>
            <div className="pricing__price">{tier.price}</div>
            <p className="pricing__desc">{tier.desc}</p>
            <ul className="pricing__feats">
              {tier.feat.map((f) => <li key={f}>✓ {f}</li>)}
            </ul>
            <Link to="/shop" className="btn btn--primary pricing__cta">{t('nav.shop')}</Link>
          </div>
        ))}
      </div>
    </section>
  );
}
