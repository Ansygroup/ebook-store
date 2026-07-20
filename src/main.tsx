import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// basename يُحسب وقت التشغيل من مسار الصفحة الفعلي، فيعمل على:
//  - GitHub Pages (subpath /ebook-store/)
//  - Vercel / أي دومين على الجذر (/)
// بدون الاعتماد على import.meta.env.BASE_URL (اللي بيبقى "./" ويكسر الراوتر).
const BASE =
  typeof window !== 'undefined' &&
  window.location.pathname.startsWith('/ebook-store/')
    ? '/ebook-store/'
    : '/';

// Register PWA service worker (offline + installable)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${BASE}sw.js`).catch(() => {});
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={BASE}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
