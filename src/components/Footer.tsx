import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container footer__inner">
        <div className="footer__col footer__col--brand">
          <div className="brand brand--light">
            <span className="brand__mark">د</span>
            <span className="brand__name">دار المعرفة</span>
          </div>
          <p>
            متجر رقمي متخصص في الكتب الإلكترونية العربية عالية الجودة. نُشرِف على
            كل كتاب لنقدّم لك محتوى يستحق وقتك ومالك.
          </p>
        </div>

        <div className="footer__col">
          <h4>روابط سريعة</h4>
          <Link to="/">الرئيسية</Link>
          <Link to="/shop">المتجر</Link>
          <a href="/#faq">الأسئلة الشائعة</a>
        </div>

        <div className="footer__col">
          <h4>الدعم</h4>
          <a href="mailto:support@dar-ma3rifa.example">البريد الإلكتروني</a>
          <a href="/#faq">سياسة الاسترداد</a>
          <a href="/#faq">طريقة التسليم</a>
        </div>
      </div>
      <div className="footer__bottom container">
        <span>© {new Date().getFullYear()} دار المعرفة — جميع الحقوق محفوظة.</span>
        <span>الدفع آمن عبر Snipcart · التسليم فوري</span>
      </div>
    </footer>
  );
}
