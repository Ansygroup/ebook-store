export interface Coupon {
  code: string;
  percent: number; // 0-100
  labelEn: string;
  labelAr: string;
  expires?: string; // ISO date
}

// Active promo codes. Edit here or wire to an API later.
export const coupons: Coupon[] = [
  { code: 'LEAD10', percent: 10, labelEn: '10% off leadership', labelAr: '١٠٪ خصم القيادة' },
  { code: 'READ20', percent: 20, labelEn: '20% off first order', labelAr: '٢٠٪ خصم أول طلب' },
  { code: 'BUNDLE30', percent: 30, labelEn: '30% off any 3 books', labelAr: '٣٠٪ خصم على ٣ كتب' },
];

export function couponByCode(code: string): Coupon | undefined {
  const c = code.trim().toUpperCase();
  return coupons.find((x) => x.code === c);
}

export function isExpired(c: Coupon): boolean {
  return !!c.expires && new Date(c.expires) < new Date();
}
