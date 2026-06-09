import { JsonLd } from '@/components/seo/JsonLd';

export interface BreadcrumbItem {
  name: string;
  path: string;
}

/** Render JSON‑LD BreadcrumbList */
export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: `${process.env.NEXT_PUBLIC_SITE_URL}${item.path}`,
    })),
  };
  return <JsonLd data={data} id="breadcrumb-ld" />;
}
