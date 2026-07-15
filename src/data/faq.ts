export interface Faq {
  qEn: string;
  qAr: string;
  aEn: string;
  aAr: string;
}

// Bilingual FAQ — feeds the FAQ page and FAQPage JSON-LD for rich results.
export const faqs: Faq[] = [
  {
    qEn: 'How do I get my ebook after purchase?',
    qAr: 'كيف أحصل على الكتاب بعد الشراء؟',
    aEn: 'Instantly. After payment you get a permanent download link on the confirmation page and by email. No waiting, no shipping.',
    aAr: 'فورًا. بعد الدفع تحصل على رابط تحميل دائم في صفحة التأكيد وعبر البريد. بلا انتظار وبلا شحن.',
  },
  {
    qEn: 'What formats are the ebooks in?',
    qAr: 'بأي صيغ الكتب الإلكترونية؟',
    aEn: 'Every book ships as PDF (readable on any device) and EPUB (best for e-readers). Most also include MOBI.',
    aAr: 'كل كتاب بصيغة PDF (يعمل على أي جهاز) وEPUB (الأفضل لقرّاء الكتب). معظمها يشمل MOBI أيضًا.',
  },
  {
    qEn: 'Can I read the books on my phone?',
    qAr: 'هل أستطيع قراءة الكتب على هاتفي؟',
    aEn: 'Yes. PDF and EPUB open on phones, tablets, and computers. Your download links never expire.',
    aAr: 'نعم. PDF وEPUB يفتحان على الهواتف والأجهزة اللوحية والحواسيب. روابط التحميل لا تنتهي أبدًا.',
  },
  {
    qEn: 'What is your refund policy?',
    qAr: 'ما سياسة الاسترداد لديكم؟',
    aEn: '7-day no-questions-asked refund. If the book is not right for you, email us and we refund in full.',
    aAr: 'استرداد 7 أيام بلا أسئلة. إن لم يكن الكتاب مناسبًا، راسلنا ونعيد المبلغ كاملًا.',
  },
  {
    qEn: 'Are the books available in Arabic and English?',
    qAr: 'هل الكتب متاحة بالعربية والإنجليزية؟',
    aEn: 'The store defaults to English with full bilingual support. Each book page shows the language of that title; many are available in both.',
    aAr: 'المتجر افتراضيًا إنجليزي مع دعم ثنائي كامل. كل صفحة كتاب توضّح لغة ذلك العنوان؛ الكثير متاح باللغتين.',
  },
  {
    qEn: 'Do you offer bulk or team licenses?',
    qAr: 'هل تقدمون تراخيص جماعية أو للفرق؟',
    aEn: 'Yes. The Full Library plan covers every current and future title. For teams of 10+, contact us for a custom quote.',
    aAr: 'نعم. باقلة المكتبة الكاملة تغطي كل العناوين الحالية والمستقبلية. للفرق 10+ تواصلوا معنا لعرض مخصص.',
  },
  {
    qEn: 'How do I contact support?',
    qAr: 'كيف أتواصل مع الدعم؟',
    aEn: 'Email sales@ebook-store.dev any time. We reply within one business day.',
    aAr: 'راسلوا sales@ebook-store.dev في أي وقت. نرد خلال يوم عمل واحد.',
  },
];
