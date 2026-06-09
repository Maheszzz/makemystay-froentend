import { JsonLd } from '@/components/seo/JsonLd';

export interface FaqItem {
  question: string;
  answer: string;
}

/** Render JSON‑LD FAQPage */
export function FAQSchema({ items }: { items: FaqItem[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
  return <JsonLd data={data} id="faq-ld" />;
}
