import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import BookCard from '../components/BookCard';
import FAQ from '../components/FAQ';
import Newsletter from '../components/Newsletter';
import { featuredBooks, formatPrice } from '../data/books';
import { useLang } from '../i18n/LanguageContext';

const steps = [
  { n: '١', tAr: 'تصفّح واختر', tEn: 'Browse & pick', dAr: 'استكشف الكتب حسب التصنيف واقرأ الوصف والتقييمات.', dEn: 'Explore books by category and read the description and reviews.' },
  { n: '٢', tAr: 'ادفع بأمان', tEn: 'Pay securely', dAr: 'أكمل الطلب عبر بوابة Snipcart المعتمدة في ثوانٍ.', dEn: 'Complete the order via the trusted Snipcart gateway in seconds.' },
  { n: '٣', tAr: 'حمّل فوراً', tEn: 'Download instantly', dAr: 'تحصل على رابط التحميل مباشرة على جهازك.', dEn: 'Get the download link straight to your device.' },
];

const testimonials = [
  { nameAr: 'سارة المطيري', nameEn: 'Sara Al-Mutairi', roleAr: 'مديرة منتجات', roleEn: 'Product Manager', textAr: 'كتاب "القائد المؤثر" غيّر طريقة إدارتي لفريقي. عملي أصبح أوضح.', textEn: '"The Influential Leader" changed how I manage my team. My work is clearer now.', rating: 5 },
  { nameAr: 'خالد العتيبي', nameEn: 'Khalid Al-Otaibi', roleAr: 'رائد أعمال', roleEn: 'Entrepreneur', textAr: 'اشتريت "بناء إمبراطورية" وطبّقت خطته في أسبوعين. أنصح به بشدة.', textEn: 'I bought "Build Your Empire" and applied its plan in two weeks. Highly recommend it.', rating: 5 },
  { nameAr: 'منى الأحمد', nameEn: 'Mona Al-Ahmed', roleAr: 'مطوّرة', roleEn: 'Developer', textAr: 'تحميل فوري وروابط دائمة. تجربة شراء سلسة من أول مرة.', textEn: 'Instant download and permanent links. A smooth purchase from the first time.', rating: 5 },
];

export default function Home() {
  const { t, lang } = useLang();
  return (
    <>
      <Hero />

      <section className="section" id="featured">
        <div className="container">
          <div className="section__head">
            <span className="section__eyebrow">{t('home.featuredEyebrow')}</span>
            <h2 className="section__title">{t('home.featuredTitle')}</h2>
            <p className="section__sub">
              {t('home.featuredSub')}
            </p>
          </div>
          <div className="book-grid">
            {featuredBooks.map((book, i) => (
              <BookCard key={book.id} book={book} index={i} />
            ))}
          </div>
          <div className="section__cta">
            <Link to="/shop" className="btn btn--primary btn--lg">
              {t('home.viewAll')}
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--alt how">
        <div className="container">
          <div className="section__head">
            <span className="section__eyebrow">{t('home.howEyebrow')}</span>
            <h2 className="section__title">{t('home.howTitle')}</h2>
          </div>
          <div className="steps">
            {steps.map((s) => (
              <motion.div
                key={s.n}
                className="step"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5 }}
              >
                <span className="step__n">{s.n}</span>
                <h3>{lang === 'ar' ? s.tAr : s.tEn}</h3>
                <p>{lang === 'ar' ? s.dAr : s.dEn}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container cta-band__inner">
          <div>
            <h2>{t('home.ctaTitle')}</h2>
            <p>{t('home.ctaSub')}</p>
          </div>
          <div className="cta-band__price">
            <span>{t('home.ctaStarts')}</span>
            <strong>{formatPrice(9.99)}</strong>
            <Link to="/shop" className="btn btn--primary btn--lg">
              {lang === 'ar' ? 'تسوّق الآن' : 'Shop now'}
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--alt testimonials">
        <div className="container">
          <div className="section__head">
            <span className="section__eyebrow">{t('home.testiEyebrow')}</span>
            <h2 className="section__title">{t('home.testiTitle')}</h2>
          </div>
          <div className="testimonial-grid">
            {testimonials.map((tm, i) => (
              <motion.figure
                key={tm.nameEn}
                className="testimonial"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="testimonial__stars">{'★'.repeat(tm.rating)}</div>
                <blockquote>{lang === 'ar' ? tm.textAr : tm.textEn}</blockquote>
                <figcaption>
                  <strong>{lang === 'ar' ? tm.nameAr : tm.nameEn}</strong>
                  <span>{lang === 'ar' ? tm.roleAr : tm.roleEn}</span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />

      <FAQ />
    </>
  );
}
