// src/views/OfficeLandingPage.tsx
// Office landing page – search hub for a given office location.
// Reuses existing SEO utilities, property fetching, and UI components.

import { notFound } from 'next/navigation';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { FaqSection } from '@/components/seo/FaqSection';
import { SEOHead } from '@/components/seo/SEOHead';
import { PlaceSchema } from '@/components/seo/PlaceSchema';
import { ItemListSchema } from '@/components/seo/ItemListSchema';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PropertyCard } from '@/components/modules/listings/PropertyCard';
import { OfficeInternalLinkHub } from '@/components/seo/OfficeInternalLinkHub';
import { propertyApi } from '@/lib/api/properties';
import Properties from '@/views/Properties';
import { OFFICES } from '@/data/offices';
import { generateOfficeSeoInput } from '@/lib/officeSeoGenerator';
import { haversineDistance } from '@/lib/geo';
import type { Property } from '@/types/api';

/**
 * Server component that renders the office hub page.
 * It fetches a list of nearby properties, builds SEO metadata, and composes UI sections.
 */
export default async function OfficeLandingPage({ slug = '' }: { slug?: string } = {}) {
  // Find office metadata
  const office = OFFICES.find((o) => o.slug === slug);
  if (!office) {
    notFound();
  }

  // Fetch all properties (or a reasonable large batch) for server‑side SEO rendering.
  // The backend supports pagination; we request up to 200 items to have enough for filtering.
  let allProperties: Property[] = [];
  try {
    const result = await propertyApi.getAll({ limit: 200 });
    allProperties = result.items ?? [];
  } catch (e) {
    console.warn('Failed to fetch properties for office page', slug, e);
  }

  // Filter properties that are near the office.
  const nearby: Property[] = [];
  if (office.lat && office.lng) {
    for (const p of allProperties) {
      if (!p.latitude || !p.longitude) continue;
      const dist = haversineDistance(office.lat, office.lng, Number(p.latitude), Number(p.longitude));
      if (dist <= 5) { // 5 km radius – easy to adjust later
        nearby.push(p);
      }
    }
  } else {
    // Fallback: match locality name in property.location string.
    const nameLower = office.name.toLowerCase();
    for (const p of allProperties) {
      if (p.location && p.location.toLowerCase().includes(nameLower)) {
        nearby.push(p);
      }
    }
  }

  // Build SEO using the shared generator.
  const seoInput = generateOfficeSeoInput(slug, nearby);
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Offices', path: '/office' },
    { name: office.name, path: `/office/${slug}` },
  ];

  // Simple FAQs for the page – can be expanded later.
  const faqs = [
    { question: `What is the average rent near ${office.name}?`, answer: `${nearby.reduce((sum, p) => {
      const price = Number(p.price?.replace(/[^0-9]/g, ''));
      return sum + (isNaN(price) ? 0 : price);
    }, 0) / (nearby.length || 1)} per month (approx.)` },
    { question: `How far is ${office.name} from major IT parks?`, answer: 'Within a few kilometres – check individual property listings for exact distances.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <SEOHead
        title={seoInput.title}
        description={seoInput.description}
        keywords={seoInput.keywords}
        canonicalHref={seoInput.canonicalHref}
        ogImage={seoInput.ogImage}
        noindex={seoInput.noindex}
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <PlaceSchema name={office.name} description={`Office hub near ${office.name}, Bangalore – listings of PGs, coliving spaces and rentals within close proximity.`} />
      <ItemListSchema items={nearby.map((p) => ({ url: `/property/${p.slug ?? p.id}`, name: p.title }))} />

      <Navbar />
      <main id="main-content" className="flex-grow pt-20 pb-16">
        {/* Hero */}
        <section className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
            <BreadcrumbNav items={breadcrumbItems} />
            <h1 className="type-h1 text-slate-900">
              {office.name} Office Hub
            </h1>
            <p className="mt-2 text-slate-500 text-sm md:text-base max-w-2xl">
              Discover verified PGs, coliving spaces and rental homes near {office.name}. Ideal for professionals working in the surrounding tech parks.
            </p>
          </div>
        </section>

        {/* Initial property cards – server rendered for SEO */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {nearby.slice(0, 20).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>

        {/* Client‑side interactive listing */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <Properties
            hideChrome
            initialCategory="all"
            initialCity={office.name}
            pageTitle={`${office.name} – Nearby Stays`}
            pageSubtitle={`Browse PGs, coliving and rentals close to ${office.name}`}
            showMapPanel
          />
        </div>

        {/* Internal linking hub */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
          <OfficeInternalLinkHub officeSlug={slug} nearbyProperties={nearby} />
        </div>

        {/* FAQ */}
        <FaqSection id="office-faq" title={`Frequently asked – ${office.name}`} items={faqs} collapsible />
      </main>
      <Footer />
    </div>
  );
}
