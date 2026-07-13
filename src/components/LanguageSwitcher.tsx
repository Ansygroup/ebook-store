import { useLang } from '../i18n/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  return (
    <button
      className="lang-switch"
      onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
      aria-label="Toggle language"
      title={lang === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
    >
      {lang === 'ar' ? 'EN' : 'ع'}
    </button>
  );
}
