import { SEOHead } from '@/components/seo/SEOHead';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { PeopleAlsoAsk } from '@/components/seo/PeopleAlsoAsk';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { SITE_NAME } from '@/lib/siteConfig';
import { Link } from '@/lib/navigation';

/** Generate static SEO metadata for Whitefield locality page */
export async function generateMetadata() {
  const title = `PG in Whitefield Bangalore | Starting ₹6,500 | ${SITE_NAME}`;
  const description = `Explore verified PGs in Whitefield, Bangalore – rent ranges from ₹6,500 to ₹18,000. Find nearby IT parks, metro stations, and FAQs. Zero brokerage on many stays. ${SITE_NAME}`;
  return {
    title,
    description,
    path: '/pg-in-whitefield',
    canonicalUrl: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/pg-in-whitefield`,
    ogImage: undefined,
    noindex: false,
    keywords: 'Whitefield PG, Bangalore PG, PG rent Whitefield, Zero brokerage',
  };
}

const faqItems = [
  { question: 'What is the average PG rent in Whitefield?', answer: 'Rent typically ranges from ₹6,500 to ₹18,000 per month, depending on the amenities and room type.' },
  { question: 'Which are the best PGs in Whitefield?', answer: 'Top-rated PGs are located near ITPL, SAP Labs, and other tech parks. Check the listings for verified reviews and photos.' },
  { question: 'Are there PGs near ITPL?', answer: 'Yes, many PGs are within walking distance of ITPL, offering easy commute for tech professionals.' },
  { question: 'Are food and WiFi included?', answer: 'Each PG lists its amenities – many include WiFi and meal plans. Look for the tags on the listing page.' },
  { question: 'Are there PGs for working professionals?', answer: 'Whitefield PGs cater to both students and working professionals, with options for single rooms and shared accommodations.' },
  { question: 'How far is the nearest metro station?', answer: 'The nearest metro station is Whitefield (Purple Line), typically a 5‑10 minute commute from most PGs.' },
];

export default function WhitefieldPage() {
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'PG in Bangalore', path: '/pg/bangalore' },
    { name: 'Whitefield', path: '/pg-in-whitefield' },
  ];

  return (
    <>
      <SEOHead {...generateMetadata()} />
      <BreadcrumbNav items={breadcrumbItems} />
      <section className="relative bg-gray-900 text-white py-24">
        <div className="max-w-5xl mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="text-5xl font-extrabold mb-4">PG in Whitefield Bangalore</h1>
          <p className="text-lg mb-6">Rent ranges from ₹6,500 – ₹18,000. Zero brokerage on many listings.</p>
          <OptimizedImage
            src="/assets/whitefield_hero.webp"
            alt="Whitefield PG building"
            width={1200}
            height={600}
            priority
            className="rounded-xl shadow-xl"
          />
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6">Why choose Whitefield PGs?</h2>
        <ul className="list-disc list-inside space-y-2 text-lg">
          <li>Close to major IT parks like ITPL, SAP Labs, and TCS.</li>
          <li>Excellent connectivity – metro, bus routes, and major roads.</li>
          <li>Wide range of amenities – WiFi, meals, housekeeping, power backup.</li>
          <li>Verified listings with real photos and transparent pricing.</li>
        </ul>
      </section>
      <section className="max-w-5xl mx-auto px-4 py-12 bg-gray-50 rounded-xl">
        <PeopleAlsoAsk items={faqItems} />
      </section>
      <section className="max-w-5xl mx-auto px-4 py-12">
        <p className="text-center">
          <Link href="/pg/bangalore" className="text-brand-red underline">
            Back to PG Bangalore hub
          </Link>
        </p>
      </section>
    </>
  );
}
