import JsonLd from './JsonLd';

interface Crumb {
  name: string;
  url: string; // absolute URL
}

const SITE = 'https://ansygroup.github.io/ebook-store';

/**
 * Breadcrumbs — renders invisible JSON-LD (BreadcrumbList) for rich results.
 * Pass relative paths like [{ name: 'Shop', path: '/shop' }].
 */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const list = items.map((it) => ({ '@type': 'ListItem', position: 0, name: it.name, item: `${SITE}${it.path}` }));
  list.forEach((l, i) => (l.position = i + 1));
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: list,
      }}
    />
  );
}
