// Resolves asset URLs against the GitHub Pages subpath (/ebook-store/).
// Vite's import.meta.env.BASE_URL proved unreliable in this build, so we
// hardcode the known production base. In dev the site is served at "/",
// but dev also has no /ebook-store subpath, so we detect via location.
const isProd = typeof window !== 'undefined' && window.location.pathname.startsWith('/ebook-store/');
const BASE = isProd ? '/ebook-store/' : '/';

export function asset(path: string): string {
  if (!path) return path;
  if (/^https?:\/\//.test(path)) return path;
  if (path.startsWith('data:')) return path;
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return `${BASE}${clean}`;
}
