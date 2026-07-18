export interface Book {
  id: string;
  slug: string;
  title: string;
  titleAr: string;
  titleEn: string;
  author: string;
  authorAr: string;
  authorEn: string;
  category: string;
  categoryAr: string;
  categoryEn: string;
  description: string;
  descriptionAr: string;
  descriptionEn: string;
  longDescription: string;
  longDescriptionAr: string;
  longDescriptionEn: string;
  price: number;
  pages: number;
  language: string;
  formats: string[];
  rating: number;
  reviews: number;
  cover: string;
  tags: string[];
  tagsAr: string[];
  tagsEn: string[];
  featured: boolean;
  gumroadUrl?: string;
  stripeUrl?: string; // Stripe Payment Link (preferred checkout)
  downloadUrl?: string;
}

export type Lang = 'ar' | 'en';
