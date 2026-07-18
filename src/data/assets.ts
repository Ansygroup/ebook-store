// Resolves asset URLs against the Vite `base` so they work under the
// GitHub Pages subpath (/ebook-store/) in production and "/" in dev.
// import.meta.env.BASE_URL is "/" locally and "/ebook-store/" in build.
const BASE = import.meta.env.BASE_URL || '/';

export function asset(path: string): string {
  if (!path) return path;
  if (/^https?:\/\//.test(path)) return path;
  if (path.startsWith('data:')) return path;
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return `${BASE}${clean}`;
}
