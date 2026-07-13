import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../i18n/LanguageContext';

const faqs = [
  {
    qAr: 'كيف أستلم الكتاب بعد الشراء؟',
    qEn: 'How do I receive the book after purchase?',
    aAr: 'فور تأكيد الدفع، يظهر رابط التحميل مباشرة في صفحة إتمام الطلب ورسالة البريد الإلكتروني. الكتب بصيغ PDF وEPUB (وبعضها MOBI) تعمل على كل الأجهزة.',
    aEn: 'Once payment is confirmed, the download link appears instantly on the order-complete page and in your email. Books come in PDF and EPUB (some MOBI) and work on every device.',
  },
  {
    qAr: 'هل الدفع آمن؟',
    qEn: 'Is payment secure?',
    aAr: 'نعم. نستخدم Snipcart كبوابة دفع معتمدة تدعم بطاقات Visa/Mastercard وApple Pay. بيانات بطاقتك لا تمرّ عبر خوادمنا إطلاقاً.',
    aEn: 'Yes. We use Snipcart, a trusted payment gateway supporting Visa/Mastercard and Apple Pay. Your card data never touches our servers.',
  },
  {
    qAr: 'هل يمكنني استرداد قيمة الكتاب؟',
    qEn: 'Can I get a refund?',
    aAr: 'نظراً لطبيعة المنتج الرقمي، نوفّر استرداداً كاملاً خلال 7 أيام إذا واجهت مشكلة في التحميل أو لم يفتح الملف. تواصل معنا عبر الدعم.',
    aEn: 'Given the digital nature, we offer a full refund within 7 days if you hit a download issue or the file will not open. Reach us via support.',
  },
  {
    qAr: 'هل الكتب متاحة للطباعة؟',
    qEn: 'Can I print the books?',
    aAr: 'الكتب للقراءة الشخصية. يحق لك طباعة نسخة لنفسك، لكن إعادة النشر أو التوزيع التجاري غير مسموح بدون إذن كتابي.',
    aEn: 'Books are for personal reading. You may print a copy for yourself, but republication or commercial distribution is not allowed without written permission.',
  },
  {
    qAr: 'هل تدعمون الفرق والشركات؟',
    qEn: 'Do you support teams and companies?',
    aAr: 'نعم — راسلنا لشراء رخص جماعية لفريقك أو شركتك بأسعار مخفّضة وتمنح وصولاً لكل الموظفين.',
    aEn: 'Yes — email us for bulk licenses for your team or company at discounted rates, granting access to every employee.',
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
  const { lang } = useLang();
  return (
    <section className="section faq" id="faq">
      <div className="container faq__inner">
        <div className="section__head">
          <span className="section__eyebrow">{lang === 'ar' ? 'أسئلة شائعة' : 'FAQ'}</span>
          <h2 className="section__title">
            {lang === 'ar' ? 'كل ما تريد معرفته قبل الشراء' : 'Everything you need before buying'}
          </h2>
        </div>
        <div className="faq__list">
          {faqs.map((f) => (
            <FaqItem key={f.qEn} q={lang === 'ar' ? f.qAr : f.qEn} a={lang === 'ar' ? f.aAr : f.aEn} />
          ))}
        </div>
      </div>
    </section>
  );
}
