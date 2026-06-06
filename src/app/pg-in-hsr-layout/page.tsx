import { SEOHead } from '@/components/seo/SEOHead';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { PeopleAlsoAsk } from '@/components/seo/PeopleAlsoAsk';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { SITE_NAME } from '@/lib/siteConfig';
import { Link } from '@/lib/navigation';

/** Generate static SEO metadata for HSR Layout locality page */
export async function generateMetadata() {
  const title = `PG in HSR Layout Bangalore | Starting ₹7,500 | ${SITE_NAME}`;
  const description = `Explore verified PGs in HSR Layout, Bangalore – rent ranges from ₹7,500 to ₹20,000. Find nearby tech parks, metro stations, and FAQs. Zero brokerage on many stays. ${SITE_NAME}`;
  return {
    title,
    description,
    path: '/pg-in-hsr-layout',
    canonicalUrl: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/pg-in-hsr-layout`,
    ogImage: undefined,
    noindex: false,
    keywords: 'HSR Layout PG, Bangalore PG, PG rent HSR Layout, Zero brokerage',
  };
}

const faqItems = [
  { question: 'What is the average PG rent in HSR Layout?', answer: 'Rent typically ranges from ₹7,500 to ₹20,000 per month, depending on amenities and room type.' },
  { question: 'Which are the best PGs in HSR Layout?', answer: 'Top-rated PGs are located near the Outer Ring Road, IT parks, and the HSR Metro station. Check listings for verified reviews and photos.' },
  { question: 'Are there PGs near major tech parks?', answer: 'Yes, many PGs are within a short commute of tech hubs like Embassy TechVillage and many startups.' },
  { question: 'Are food and WiFi included?', answer: 'Each PG lists its amenities – many include WiFi and meal plans. Look for the tags on the listing page.' },
  { question: 'Are there PGs for working professionals?', answer: 'HSR Layout PGs cater to both students and working professionals, with options for single rooms and shared accommodations.' },
  { question: 'How far is the nearest metro station?', answer: 'The HSR Metro (Purple Line) is within 5‑10 minutes from most PGs in the area.' },
];

export default function HSRLayoutPage() {
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'PG in Bangalore', path: '/pg/bangalore' },
    { name: 'HSR Layout', path: '/pg-in-hsr-layout' },
  ];

  return (
    <>
      <SEOHead {...generateMetadata()} />
      <BreadcrumbNav items={breadcrumbItems} />
      <section className="relative bg-gray-900 text-white py-24">
        <div className="max-w-5xl mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="text-5xl font-extrabold mb-4">PG in HSR Layout Bangalore</h1>
          <p className="text-lg mb-6">Rent ranges from ₹7,500 – ₹20,000. Zero brokerage on many listings.</p>
          <OptimizedImage
            src="/assets/hsr_layout_hero.webp"
            alt="HSR Layout PG building"
            width={1200}
            height={600}
            priority
            className="rounded-xl shadow-xl"
          />
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6">Why choose HSR Layout PGs?</h2>
        <ul className="list-disc list-inside space-y-2 text-lg">
          <li>Strategic location on the Outer Ring Road, excellent connectivity.</li>
          <li>Close to major IT hubs like Embassy TechVillage, startups, and co‑working spaces.</li>
          <li>Excellent public transport – metro, BMTC, and major arterial roads.</li>
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
