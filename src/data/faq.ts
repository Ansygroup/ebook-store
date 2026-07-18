export interface Faq {
  q: string;
  a: string;
}

// FAQ — feeds the FAQ page and FAQPage JSON-LD for rich results.
export const faqs: Faq[] = [
  {
    q: 'How do I get my ebook after purchase?',
    a: 'Instantly. After payment you get a permanent download link on the confirmation page and by email. No waiting, no shipping.',
  },
  {
    q: 'What formats are the ebooks in?',
    a: 'Every book ships as PDF (readable on any device) and EPUB (best for e-readers). Most also include MOBI.',
  },
  {
    q: 'Can I read the books on my phone?',
    a: 'Yes. PDF and EPUB open on phones, tablets, and computers. Your download links never expire.',
  },
  {
    q: 'What is your refund policy?',
    a: '7-day no-questions-asked refund. If the book is not right for you, email us and we refund in full.',
  },
  {
    q: 'Are the books available in English only?',
    a: 'Yes. Every title on ANSY is written in English. Each book page shows its language and page count.',
  },
  {
    q: 'Do you offer bulk or team licenses?',
    a: 'Yes. The Full Library plan covers every current and future title. For teams of 10+, contact us for a custom quote.',
  },
  {
    q: 'How do I contact support?',
    a: 'Email sales@ebook-store.dev any time. We reply within one business day.',
  },
];
