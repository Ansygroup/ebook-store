import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';

export default function Terms() {
  const { lang } = useLang();
  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: 820 }}>
      <h1>{lang === 'ar' ? 'الشروط والأحكام' : 'Terms & conditions'}</h1>
      <p style={{ opacity: 0.7, marginBottom: '1.5rem' }}>
        {lang === 'ar' ? 'آخر تحديث: ٢٠٢٦' : 'Last updated: 2026'}
      </p>
      <h2>{lang === 'ar' ? 'الترخيص' : 'License'}</h2>
      <p>
        {lang === 'ar'
          ? 'بشراء كتاب، تحصل على ترخيص استخدام شخصي غير حصري. إعادة البيع أو التوزيع غير مسموحة.'
          : 'On purchase you receive a personal, non-exclusive license. Resale or redistribution is not permitted.'}
      </p>
      <h2>{lang === 'ar' ? 'الاسترداد' : 'Refunds'}</h2>
      <p>
        {lang === 'ar'
          ? 'استرداد كامل خلال ٧ أيام من الشراء في حال وجود مشكلة تقنية في الملف.'
          : 'Full refund within 7 days of purchase if a technical file issue occurs.'}
      </p>
      <h2>{lang === 'ar' ? 'المسؤولية' : 'Liability'}</h2>
      <p>
        {lang === 'ar'
          ? 'المحتوى مقدم "كما هو" لأغراض تعليمية. النتائج تختلف حسب جهد القارئ وتطبيقه.'
          : 'Content is provided "as is" for educational purposes. Results vary by reader effort and application.'}
      </p>
      <p style={{ marginTop: '2rem' }}>
        <Link to="/" className="btn btn--ghost">{lang === 'ar' ? 'العودة للرئيسية' : 'Back home'}</Link>
      </p>
    </div>
  );
}
