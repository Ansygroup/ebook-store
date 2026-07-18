import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';

export default function Privacy() {
  const { lang } = useLang();
  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: 820 }}>
      <h1>{lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy policy'}</h1>
      <p style={{ opacity: 0.7, marginBottom: '1.5rem' }}>
        {lang === 'ar' ? 'آخر تحديث: ٢٠٢٦' : 'Last updated: 2026'}
      </p>
      <h2>{lang === 'ar' ? 'البيانات التي نجمعها' : 'Data we collect'}</h2>
      <p>
        {lang === 'ar'
          ? 'نجمع بريدك الإلكتروني فقط عند اشتراكك في النشرة أو طلب كتاب. لا نجمع بيانات بطاقتك — الدفع يتم عبر بوابة Stripe.'
          : 'We collect only your email when you subscribe to the newsletter or order a book. We never collect your card data — payment goes through the Stripe gateway.'}
      </p>
      <h2>{lang === 'ar' ? 'كيف نستخدم بريدك' : 'How we use your email'}</h2>
      <p>
        {lang === 'ar'
          ? 'لإرسال رابط التحميل، وكوبونات خصم دورية، ومحتوى مجاني. يمكنك إلغاء الاشتراك بضغطة زر في أي وقت.'
          : 'To send your download link, periodic discount coupons, and free content. You can unsubscribe with one click anytime.'}
      </p>
      <h2>{lang === 'ar' ? 'مشاركة البيانات' : 'Sharing'}</h2>
      <p>
        {lang === 'ar'
          ? 'لا نبيع أو نشارك بريدك مع أي طرف ثالث. مزوّدو الخدمة (الدفع، البريد) يتعاملون مع بياناتك وفق سياساتهم.'
          : 'We do not sell or share your email with any third party. Service providers (payment, email) handle your data under their own policies.'}
      </p>
      <p style={{ marginTop: '2rem' }}>
        <Link to="/" className="btn btn--ghost">{lang === 'ar' ? 'العودة للرئيسية' : 'Back home'}</Link>
      </p>
    </div>
  );
}
