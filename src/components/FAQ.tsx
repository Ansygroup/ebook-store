import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: 'How do I receive the book after purchase?',
    a: 'Once payment is confirmed, the download link appears instantly on the order-complete page and in your email. Books come in PDF and EPUB (some MOBI) and work on every device.',
  },
  {
    q: 'Is payment secure?',
    a: 'Yes. We use Stripe, a PCI-DSS compliant payment gateway supporting Visa/Mastercard, Apple Pay and Arab-issued cards. Your card data never touches our servers.',
  },
  {
    q: 'Can I get a refund?',
    a: 'Given the digital nature, we offer a full refund within 7 days if you hit a download issue or the file will not open. Reach us via support.',
  },
  {
    q: 'Can I print the books?',
    a: 'Books are for personal reading. You may print a copy for yourself, but republication or commercial distribution is not allowed without written permission.',
  },
  {
    q: 'Do you support teams and companies?',
    a: 'Yes — email us for bulk licenses for your team or company at discounted rates, granting access to every employee.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq__item ${open ? 'is-open' : ''}`}>
      <button
        className="faq__q"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{q}</span>
        <span className="faq__icon" aria-hidden="true">
          {open ? '−' : '+'}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="faq__a"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  return (
    <section className="section faq" id="faq">
      <div className="container faq__inner">
        <div className="section__head">
          <span className="section__eyebrow">FAQ</span>
          <h2 className="section__title">
            Everything you need before buying
          </h2>
        </div>
        <div className="faq__list">
          {faqs.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
