import { useLang } from '../i18n/LanguageContext';
import { faqs } from '../data/faq';
import JsonLd from '../components/JsonLd';

export default function Faq() {
  const { lang, t } = useLang();
  const q = (s: string) => (lang === 'ar' ? (faqs.find((f) => f.qEn === s)?.qAr ?? s) : s);
  const a = (s: string) => (lang === 'ar' ? (faqs.find((f) => f.qEn === s)?.aAr ?? s) : (faqs.find((f) => f.qEn === s)?.aEn ?? s));

  const SITE = 'https://ansygroup.github.io/ebook-store';
  const schemaQa = faqs.map((f) => ({
    '@type': 'Question',
    name: f.qEn,
    acceptedAnswer: { '@type': 'Answer', text: f.aEn },
  }));

  return (
    <section className="section faq">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: schemaQa,
        }}
      />
      <div className="container">
        <div className="section__head">
          <span className="section__eyebrow">{t('nav.faq')}</span>
          <h1 className="section__title">{lang === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}</h1>
          <p className="section__sub">
            {lang === 'ar' ? 'إجابات سريعة عن الشراء والتحميل والدعم.' : 'Quick answers about buying, downloading, and support.'}
          </p>
        </div>

        <div className="faq__list">
          {faqs.map((f) => (
            <details key={f.qEn} className="faq__item">
              <summary className="faq__q">{q(f.qEn)}</summary>
              <div className="faq__a">{a(f.qEn)}</div>
            </details>
          ))}
        </div>

        <p className="faq__contact">
          {lang === 'ar' ? 'لم تجد إجابتك؟ راسلنا على ' : "Can't find your answer? Email us at "}
          <a href="mailto:sales@ebook-store.dev">sales@ebook-store.dev</a>
        </p>
      </div>
    </section>
  );
}
