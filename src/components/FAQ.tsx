import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: 'كيف أستلم الكتاب بعد الشراء؟',
    a: 'فور تأكيد الدفع، يظهر رابط التحميل مباشرة في صفحة إتمام الطلب ورسالة البريد الإلكتروني. الكتب بصيغ PDF وEPUB (وبعضها MOBI) تعمل على كل الأجهزة.',
  },
  {
    q: 'هل الدفع آمن؟',
    a: 'نعم. نستخدم Snipcart كبوابة دفع معتمدة تدعم بطاقات Visa/Mastercard وApple Pay. بيانات بطاقتك لا تمرّ عبر خوادمنا إطلاقاً.',
  },
  {
    q: 'هل يمكنني استرداد قيمة الكتاب؟',
    a: 'نظراً لطبيعة المنتج الرقمي، نوفّر استرداداً كاملاً خلال 7 أيام إذا واجهت مشكلة في التحميل أو لم يفتح الملف. تواصل معنا عبر الدعم.',
  },
  {
    q: 'هل الكتب متاحة للطباعة؟',
    a: 'الكتب للقراءة الشخصية. يحق لك طباعة نسخة لنفسك، لكن إعادة النشر أو التوزيع التجاري غير مسموح بدون إذن كتابي.',
  },
  {
    q: 'هل تدعمون الفرق والشركات؟',
    a: 'نعم — راسلنا لشراء رخص جماعية لفريقك أو شركتك بأسعار مخفّضة وتمنح وصولاً لكل الموظفين.',
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
          <span className="section__eyebrow">أسئلة شائعة</span>
          <h2 className="section__title">كل ما تريد معرفته قبل الشراء</h2>
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
