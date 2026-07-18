import { faqs } from '../data/faq';
import JsonLd from '../components/JsonLd';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Faq() {
  const schemaQa = faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
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
        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'FAQ', path: '/faq' },
          ]}
        />
        <div className="section__head">
          <span className="section__eyebrow">FAQ</span>
          <h1 className="section__title">Frequently Asked Questions</h1>
          <p className="section__sub">
            Quick answers about buying, downloading, and support.
          </p>
        </div>

        <div className="faq__list">
          {faqs.map((f) => (
            <details key={f.q} className="faq__item">
              <summary className="faq__q">{f.q}</summary>
              <div className="faq__a">{f.a}</div>
            </details>
          ))}
        </div>

        <p className="faq__contact">
          Can't find your answer? Email us at{' '}
          <a href="mailto:sales@ebook-store.dev">sales@ebook-store.dev</a>
        </p>
      </div>
    </section>
  );
}
