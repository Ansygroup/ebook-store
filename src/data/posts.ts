export interface Post {
  slug: string;
  titleEn: string;
  titleAr: string;
  excerptEn: string;
  excerptAr: string;
  bodyEn: string;   // markdown
  bodyAr: string;
  date: string;     // ISO
  tags: string[];
  cover?: string;
}

import postsData from './posts.json';
export const posts: Post[] = postsData as Post[];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function pick<T = string>(post: Post, field: keyof Post, lang: 'en' | 'ar'): T {
  if (lang === 'en') {
    const v = post[`${String(field)}En` as keyof Post];
    if (v) return v as T;
  }
  return post[`${String(field)}Ar` as keyof Post] as T;
}
