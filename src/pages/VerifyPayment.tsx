import { useSearchParams, Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';
import { couponByCode } from '../data/coupons';

export default function VerifyPayment() {
  const { t, lang } = useLang();
  const [params] = useSearchParams();
  const paid = params.get('paid') === '1';
  const coupon = params.get('coupon');
  const c = coupon ? couponByCode(coupon) : null;

  if (!paid) {
    return (
      <section className="section">
        <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
          <h1>{lang === 'ar' ? 'لم يتم الدفع' : 'No payment detected'}</h1>
          <p>{lang === 'ar' ? 'لو كملت الدفع ورجعت هنا، تحقق من إيميلك أو تواصل معنا.' : 'If you completed a payment and landed here, check your email or contact us.'}</p>
          <Link to="/shop" className="btn btn--primary btn--lg">{lang === 'ar' ? 'العودة للمتجر' : 'Back to shop'}</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
        <div style={{ fontSize: '4rem' }}>✅</div>
        <h1>{lang === 'ar' ? 'تم الدفع بنجاح!' : 'Payment successful!'}</h1>
        <p>
          {lang === 'ar'
            ? 'رابط تحميل الكتاب اتبعت على إيميلك خلال دقائق. '
            : 'Your book download link was sent to your email within minutes. '}
          {c && (lang === 'ar' ? `كوبون ${c.code} اتطبّق.` : `Coupon ${c.code} applied.`)}
        </p>
        <p style={{ color: 'var(--muted)' }}>
          {lang === 'ar' ? 'ما وصلك الإيميل؟ تأكد من مجلد Spam أو تواصل معنا.' : "Didn't get it? Check spam or contact us."}
        </p>
        <Link to="/shop" className="btn btn--primary btn--lg">{lang === 'ar' ? 'تسوّق المزيد' : 'Shop more'}</Link>
      </div>
    </section>
  );
}
