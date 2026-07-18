export interface Coupon {
  code: string;
  percent: number; // 0-100
  labelEn: string;
  labelAr: string;
  expires?: string; // ISO date
  tracked?: boolean; // fire Meta Pixel ViewContent/InitiateCheckout events
}

// Active promo codes. Edit here or wire to an API later.
export const coupons: Coupon[] = [
  { code: 'LEAD10', percent: 10, labelEn: '10% off leadership', labelAr: '١٠٪ خصم القيادة', tracked: true },
  { code: 'READ20', percent: 20, labelEn: '20% off first order', labelAr: '٢٠٪ خصم أول طلب', tracked: true },
  { code: 'BUNDLE30', percent: 30, labelEn: '30% off any 3 books', labelAr: '٣٠٪ خصم على ٣ كتب', tracked: true },
];

export function couponByCode(code: string): Coupon | undefined {
  const c = code.trim().toUpperCase();
  return coupons.find((x) => x.code === c);
}

export function isExpired(c: Coupon): boolean {
  return !!c.expires && new Date(c.expires) < new Date();
}

// Fire Meta Pixel event if pixel.js is loaded (no-op if absent)
export function trackCoupon(event: 'ViewContent' | 'InitiateCheckout', code: string, value?: number) {
  const c = couponByCode(code);
  if (!c?.tracked) return;
  try {
    const w = window as unknown as { fbq?: (...a: unknown[]) => void };
    if (typeof w.fbq === 'function') {
      w.fbq('track', event, { content_name: code, value: value ?? c.percent, currency: 'USD' });
    }
    // also store locally for /verify conversion attribution
    localStorage.setItem('coupon_conversion', JSON.stringify({ code, event, ts: Date.now() }));
  } catch {
    /* no-op */
  }
}
