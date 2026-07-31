import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbSchema } from '@/lib/schema';

export interface BreadcrumbItem {
  name: string;
  path: string;
}

/** Render JSON‑LD BreadcrumbList */
export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const data = buildBreadcrumbSchema(items);
  return <JsonLd data={data} id="breadcrumb-ld" />;
}

