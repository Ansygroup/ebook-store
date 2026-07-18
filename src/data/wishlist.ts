// Lightweight localStorage-backed wishlist + recently-viewed.
// No backend needed; survives reloads.

const WISH_KEY = 'eb_wishlist';
const RECENT_KEY = 'eb_recent';
const MAX_RECENT = 8;

function read(key: string): string[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}
function write(key: string, v: string[]) {
  try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
}

export function getWishlist(): string[] { return read(WISH_KEY); }
export function toggleWishlist(slug: string): string[] {
  const cur = read(WISH_KEY);
  const next = cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug];
  write(WISH_KEY, next);
  return next;
}
export function isWished(slug: string): boolean { return read(WISH_KEY).includes(slug); }

export function getRecent(): string[] { return read(RECENT_KEY); }
export function pushRecent(slug: string): string[] {
  const cur = read(RECENT_KEY).filter((s) => s !== slug);
  const next = [slug, ...cur].slice(0, MAX_RECENT);
  write(RECENT_KEY, next);
  return next;
}
