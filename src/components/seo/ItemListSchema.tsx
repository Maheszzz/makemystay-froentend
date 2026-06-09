import { JsonLd } from '@/components/seo/JsonLd';

export interface ItemListEntry {
  url: string;
  name: string;
}

/** Render JSON‑LD ItemList for a list of entities */
export function ItemListSchema({ items }: { items: ItemListEntry[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: item.url,
      name: item.name,
    })),
  };
  return <JsonLd data={data} id="itemlist-ld" />;
}
