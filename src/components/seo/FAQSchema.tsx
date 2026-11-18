import { JsonLd } from '@/components/seo/JsonLd';
import { buildFaqPageSchema } from '@/lib/schema';

export interface FaqItem {
  question: string;
  answer: string;
}

/** Render JSON‑LD FAQPage */
export function FAQSchema({ items }: { items: FaqItem[] }) {
  const data = buildFaqPageSchema(items);
  return <JsonLd data={data} id="faq-ld" />;
}

