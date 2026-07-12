export interface Book {
  id: string;
  slug: string;
  title: string;
  author: string;
  category: string;
  description: string;
  longDescription: string;
  price: number;
  pages: number;
  language: string;
  formats: string[];
  rating: number;
  reviews: number;
  cover: string;
  tags: string[];
  featured: boolean;
}
