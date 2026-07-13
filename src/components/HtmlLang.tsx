import { useEffect } from 'react';
import { useLang } from '../i18n/LanguageContext';

export default function HtmlLang() {
  const { lang } = useLang();
  useEffect(() => {
    const el = document.documentElement;
    el.lang = lang;
    el.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);
  return null;
}
