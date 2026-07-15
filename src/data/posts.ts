import postsData from './posts.json';

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

export const posts: Post[] = postsData as Post[];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

type BaseField = 'title' | 'excerpt' | 'body';

export function pick<T = string>(post: Post, field: BaseField, lang: 'en' | 'ar'): T {
  if (lang === 'en') {
    const v = (post as any)[`${field}En`];
    if (v) return v as T;
  }
  return (post as any)[`${field}Ar`] as T;
}
