import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import App from './App';
import './index.css';

// basename يطابق vite base (GitHub Pages subpath /ebook-store/).
const BASE = import.meta.env.BASE_URL || '/';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <BrowserRouter basename={BASE}>
        <App />
      </BrowserRouter>
    </LanguageProvider>
  </StrictMode>,
);
