import { useEffect } from 'react';

// Injects a JSON-LD <script> into <head> for the lifetime of the component.
// Used for SEO rich results (Book, Article, BreadcrumbList, Organization).
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  useEffect(() => {
    const id = 'jsonld-' + Math.random().toString(36).slice(2);
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    el.textContent = JSON.stringify(data);
    document.head.appendChild(el);
    return () => {
      document.getElementById(id)?.remove();
    };
  }, [data]);
  return null;
}
