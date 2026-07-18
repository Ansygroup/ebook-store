import { Link } from 'react-router-dom';
import { books } from '../data/books';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Pricing() {
  // group by price tier
  const tiers = [
    {
      name: 'Starter',
      price: '$9.99',
      desc: 'One book to try the quality',
      feat: ['Instant download', 'Permanent links', 'PDF + EPUB'],
    },
    {
      name: 'Most popular',
      price: '$29.99',
      desc: '3 books in your field',
      feat: ['Instant download', 'Permanent links', 'PDF + EPUB', 'Save 25%'],
      featured: true,
    },
    {
      name: 'Full library',
      price: '$79.99',
      desc: `All ${books.length} books`,
      feat: ['Instant download', 'Permanent links', 'PDF + EPUB', 'Save 50%', 'Free updates'],
    },
  ];
  return (
    <section className="section container pricing">
      <Breadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Pricing', path: '/pricing' },
        ]}
      />
      <div className="section__head">
        <span className="section__eyebrow">Pricing</span>
        <h1 className="section__title">Start today</h1>
        <p className="section__sub">Simple pricing, instant download, permanent links.</p>
      </div>
      <div className="pricing__grid">
        {tiers.map((tier) => (
          <div key={tier.name} className={`pricing__card ${tier.featured ? 'is-featured' : ''}`}>
            {tier.featured && <span className="pricing__badge">Best</span>}
            <h2 className="pricing__name">{tier.name}</h2>
            <div className="pricing__price">{tier.price}</div>
            <p className="pricing__desc">{tier.desc}</p>
            <ul className="pricing__feats">
              {tier.feat.map((f) => <li key={f}>✓ {f}</li>)}
            </ul>
            <Link to="/shop" className="btn btn--primary pricing__cta">Shop now</Link>
          </div>
        ))}
      </div>
    </section>
  );
}
