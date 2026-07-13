import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import BookCard from '../components/BookCard';
import FAQ from '../components/FAQ';
import Newsletter from '../components/Newsletter';
import { featuredBooks, formatPrice } from '../data/books';

const steps = [
  { n: '١', t: 'تصفّح واختر', d: 'استكشف الكتب حسب التصنيف واقرأ الوصف والتقييمات.' },
  { n: '٢', t: 'ادفع بأمان', d: 'أكمل الطلب عبر بوابة Snipcart المعتمدة في ثوانٍ.' },
  { n: '٣', t: 'حمّل فوراً', d: 'تحصل على رابط التحميل مباشرة على جهازك.' },
];

const testimonials = [
  { name: 'سارة المطيري', role: 'مديرة منتجات', text: 'كتاب "القائد المؤثر" غيّر طريقة إدارتي لفريقي. عملي أصبح أوضح.', rating: 5 },
  { name: 'خالد العتيبي', role: 'رائد أعمال', text: 'اشتريت "بناء إمبراطورية" وطبّقت خطته في أسبوعين. أنصح به بشدة.', rating: 5 },
  { name: 'منى الأحمد', role: 'مطوّرة', text: 'تحميل فوري وروابط دائمة. تجربة شراء سلسة من أول مرة.', rating: 5 },
];

export default function Home() {
  return (
    <>
      <Hero />

      <section className="section" id="featured">
        <div className="container">
          <div className="section__head">
            <span className="section__eyebrow">الأكثر طلباً</span>
            <h2 className="section__title">كتبنا المميزة</h2>
            <p className="section__sub">
              مجموعة مختارة بعناية لتنقلك خطوة جدية نحو أهدافك.
            </p>
          </div>
          <div className="book-grid">
            {featuredBooks.map((book, i) => (
              <BookCard key={book.id} book={book} index={i} />
            ))}
          </div>
          <div className="section__cta">
            <Link to="/shop" className="btn btn--primary btn--lg">
              عرض كل الكتب
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--alt how">
        <div className="container">
          <div className="section__head">
            <span className="section__eyebrow">كيف يعمل</span>
            <h2 className="section__title">ثلاث خطوات وكتابك بين يديك</h2>
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
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container cta-band__inner">
          <div>
            <h2>ابدأ رحلتك اليوم بأقل من فنجان قهوة شهرياً</h2>
            <p>استثمر في نفسك بكتاب واحد فقط — العائد يدوم مدى الحياة.</p>
          </div>
          <div className="cta-band__price">
            <span>يبدأ من</span>
            <strong>{formatPrice(9.99)}</strong>
            <Link to="/shop" className="btn btn--primary btn--lg">
              تسوّق الآن
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--alt testimonials">
        <div className="container">
          <div className="section__head">
            <span className="section__eyebrow">ماذا يقول القرّاء</span>
            <h2 className="section__title">آلاف القرّاء يثقون بنا</h2>
          </div>
          <div className="testimonial-grid">
            {testimonials.map((t, i) => (
              <motion.figure
                key={t.name}
                className="testimonial"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="testimonial__stars">{'★'.repeat(t.rating)}</div>
                <blockquote>{t.text}</blockquote>
                <figcaption>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
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
