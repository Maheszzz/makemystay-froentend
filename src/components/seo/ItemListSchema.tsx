import { JsonLd } from '@/components/seo/JsonLd';
import { buildItemListSchema } from '@/lib/schema';

export interface ItemListEntry {
  url: string;
  name: string;
}

/** Render JSON‑LD ItemList for a list of entities */
export function ItemListSchema({ items }: { items: ItemListEntry[] }) {
  const data = buildItemListSchema(items);
  return <JsonLd data={data} id="itemlist-ld" />;
}

