import postsData from './posts.json';

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  body: string;   // markdown
  date: string;
  tags: string[];
  cover?: string;
  relatedBook?: string; // slug of a related book in src/data/books.json
}

export const posts: Post[] = postsData as Post[];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
