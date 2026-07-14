import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { Lang, STRINGS, StringKey } from './strings';

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: StringKey) => string;
}

const LanguageContext = createContext<Ctx | null>(null);

const STORAGE_KEY = 'site-lang';

function readInitial(): Lang {
  if (typeof window === 'undefined') return 'en';
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (fromUrl === 'ar' || fromUrl === 'en') return fromUrl;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'ar' || saved === 'en') return saved;
  } catch {
    /* no-op: localStorage unavailable */
  }
  return 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitial);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
      const url = new URL(window.location.href);
      url.searchParams.set('lang', l);
      window.history.replaceState({}, '', url.toString());
    } catch {
      /* no-op */
    }
  }, []);

  // مزامنة مع ?lang= في الرابط (للـ hreflang/SEO)
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (fromUrl === 'ar' || fromUrl === 'en') setLang(fromUrl);
  }, []);

  const t = useCallback((k: StringKey) => STRINGS[lang][k] ?? k, [lang]);
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>
  );
}

export function useLang(): Ctx {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
