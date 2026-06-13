'use server';

import { redirect } from 'next/navigation';
import { getPgLocationBySlug, resolveLegacyPgSlug } from '@/data/pgLocations';
import { buildLocalityFaqs, buildLocalityAeoGraph, resolveLocalityProfile } from '@/lib/pgLocalityContent';
import { buildPageSEO, pgLocationSeoWithQuery, stablePgListingCanonical } from '@/lib/seo';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { QuickAnswer } from '@/components/seo/QuickAnswer';
import { LocalityTrustStrip } from '@/components/trust/LocalityTrustStrip';
import { PgLocationDeepContent } from '@/components/seo/PgLocationDeepContent';
import { FaqSection } from '@/components/seo/FaqSection';
import { LOCALITY_CONTENT } from '@/data/localityContent';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

import { PlaceSchema } from '@/components/seo/PlaceSchema';
import { ItemListSchema } from '@/components/seo/ItemListSchema';


import { LocalityInternalLinkHub } from '@/components/seo/LocalityInternalLinkHub';
import { LocalityAuthoritySections } from '@/components/seo/LocalityAuthoritySections';
import { PgRelatedAreasNav } from '@/components/seo/PgRelatedAreasNav';
import { RelatedSearchesBlock } from '@/components/seo/RelatedSearchesBlock';
import RelatedLocalities from '@/components/RelatedLocalities';
import { PropertyCard } from '@/components/modules/listings/PropertyCard';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MapPin, ChevronRight } from 'lucide-react';
import Properties from '@/views/Properties';
import { propertyApi } from '@/lib/api/properties';
import { Link } from '@/lib/navigation';

/**
 * Server component for a PG locality page.
 * Fetches the first batch of properties on the server for SEO, then renders the client‑side
 * `Properties` component which handles filtering, pagination and further data fetching.
 */
export default async function PGLocationPage({ slug }: { slug: string }) {
  // Legacy slug redirects (e.g., old URL formats)
  const legacyTarget = resolveLegacyPgSlug(slug);
  if (legacyTarget) {
    redirect(`/pg/${legacyTarget}`);
  }

  const loc = getPgLocationBySlug(slug);
  if (!loc) {
    redirect('/pg');
  }

  const { name, slug: locationSlug } = loc;
  const searchParams = new URLSearchParams(); // Empty – client‑side filters will update URL later
  const seoInput = pgLocationSeoWithQuery(name, locationSlug, searchParams);
  const helmet = buildPageSEO(seoInput);
  const profile = resolveLocalityProfile(locationSlug);
  const faqs = buildLocalityFaqs(name, locationSlug);
  const canonicalListingPath = stablePgListingCanonical(locationSlug, searchParams);
const content = LOCALITY_CONTENT[locationSlug] || {};
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'PG', path: '/pg' },
    { name: `PG in ${name}`, path: canonicalListingPath },
  ];
  const combinedLd = buildLocalityAeoGraph(profile, faqs, breadcrumbItems, canonicalListingPath);

  // Fetch initial properties for SSR (no limit – fetch all for full SEO as per user decision)
  // Debug logging for SSR fetch
  console.log('[SSR] propertyApi.getAll called with', { city: locationSlug, limit: 20, baseUrl: process.env.API_BASE_URL });
  let initialProperties = [];
try {
  const result = await propertyApi.getAll({ city: locationSlug, limit: 20 });
  initialProperties = result.items ?? [];
  console.log('[SSR] propertyApi.getAll response - count:', initialProperties.length, 'first item:', initialProperties[0]);
} catch (error) {
  console.warn('[SSR] propertyApi.getAll failed for', locationSlug, error);
  // Continue with empty properties list to avoid 5xx
}
  const hasEmptyListings = initialProperties.length === 0;

  const pageTitle = `PG in ${name}`;
  const pageSubtitle = `Verified paying guest stays in ${name} — filter by budget, food plan, and room type.`;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <SEOHead {...helmet} noindex={helmet.noindex} />
      <JsonLd data={combinedLd} id="pg-location-ld-json" />
<BreadcrumbSchema items={breadcrumbItems} />

<PlaceSchema name={name} description={profile?.description} />
<ItemListSchema items={initialProperties.map(p => ({ url: `/property/${p.slug ?? p.id}`, name: p.title }))} />


      <Navbar />
      <main id="main-content" className="flex-grow pt-20 pb-16">
        {/* Hero Banner */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
            <BreadcrumbNav items={breadcrumbItems} />
            <div className="mt-3 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-1">
                  Bangalore · PG
                </p>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  PG in {name}
                </h1>
                <p className="mt-2 text-slate-500 text-sm md:text-base leading-relaxed max-w-2xl">
                  Verified accommodations in <strong className="text-slate-700">{name}</strong> — transparent pricing,
                  instant shortlist, and secure online booking.
                </p>
                <div className="mt-4 max-w-2xl space-y-3">
                  <QuickAnswer locationName={name}>{profile.quickAnswer}</QuickAnswer>
                  <LocalityTrustStrip slug={locationSlug} name={name} />
                </div>
              </div>
              <Link
                to="/pg/bangalore"
                className="inline-flex items-center gap-1.5 shrink-0 text-xs font-bold text-brand-red hover:underline"
              >
                <MapPin className="w-3.5 h-3.5" />
                Full Bangalore PG guide
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Initial Property Cards rendered on the server for SEO */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {initialProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>

        {/* Client‑side interactive listing component */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <Properties
            hideChrome
            initialCategory="pg"
            initialCity={name}
            pageTitle={pageTitle}
            pageSubtitle={pageSubtitle}
            showMapPanel
          />
        </div>

        {/* Additional locality sections */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 space-y-10">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm ring-1 ring-slate-900/5">
            <PgLocationDeepContent name={name} profile={profile} />
          </section>

{/* Rent Range */}
{loc.rentRange && (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
    <h2 className="text-2xl font-bold text-slate-900 mb-2">Rent Range</h2>
    <p className="text-slate-700">{loc.rentRange}</p>
  </section>
)}

{/* Landmarks */}
{loc.landmarks && loc.landmarks.length > 0 && (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
    <h2 className="text-2xl font-bold text-slate-900 mb-2">Nearby Landmarks</h2>
    <ul className="list-disc pl-5 space-y-1 text-slate-700">
      {loc.landmarks.map((lm) => (
        <li key={lm}>{lm}</li>
      ))}
    </ul>
  </section>
)}

{/* Overview */}
{content.overview && (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
    <h2 className="text-2xl font-bold text-slate-900 mb-2">Overview</h2>
    <p className="text-slate-700">{content.overview}</p>
  </section>
)}

{/* Rent Trends */}
{content.rentTrends && (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
    <h2 className="text-2xl font-bold text-slate-900 mb-2">Rent Trends</h2>
    <p className="text-slate-700">{content.rentTrends}</p>
  </section>
)}

{/* Metro Connectivity */}
{content.metroConnectivity && (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
    <h2 className="text-2xl font-bold text-slate-900 mb-2">Metro Connectivity</h2>
    <p className="text-slate-700">{content.metroConnectivity}</p>
  </section>
)}

{/* Nearby IT Parks */}
{content.nearbyITParks && (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
    <h2 className="text-2xl font-bold text-slate-900 mb-2">Nearby IT Parks</h2>
    <p className="text-slate-700">{content.nearbyITParks}</p>
  </section>
)}

{/* Nearby Colleges */}
{content.nearbyColleges && (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
    <h2 className="text-2xl font-bold text-slate-900 mb-2">Nearby Colleges</h2>
    <p className="text-slate-700">{content.nearbyColleges}</p>
  </section>
)}

{/* Food & Lifestyle */}
{content.foodAndLifestyle && (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
    <h2 className="text-2xl font-bold text-slate-900 mb-2">Food & Lifestyle</h2>
    <p className="text-slate-700">{content.foodAndLifestyle}</p>
  </section>
)}

{/* Safety */}
{content.safety && (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
    <h2 className="text-2xl font-bold text-slate-900 mb-2">Safety</h2>
    <p className="text-slate-700">{content.safety}</p>
  </section>
)}

{/* Who Should Stay Here */}
{content.whoShouldStayHere && (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
    <h2 className="text-2xl font-bold text-slate-900 mb-2">Who Should Stay Here</h2>
    <p className="text-slate-700">{content.whoShouldStayHere}</p>
  </section>
)}

{/* Pros & Cons */}
{content.prosAndCons && (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
    <h2 className="text-2xl font-bold text-slate-900 mb-2">Pros & Cons</h2>
    <p className="text-slate-700">{content.prosAndCons}</p>
  </section>
)}
          <FaqSection
            id="pg-locality-faq-heading"
            title={`Frequently asked — PG in ${name}`}
            items={faqs}
            collapsible
            titleAdornment={<MapPin className="h-5 w-5 text-brand-red shrink-0" aria-hidden />}
          />
          <LocalityInternalLinkHub profile={profile} />
          <RelatedSearchesBlock currentSlug={locationSlug} localityName={name} variant="pg" />
          <PgRelatedAreasNav currentSlug={locationSlug} nearbySlugs={profile.nearbySlugs} />
          <LocalityAuthoritySections profile={profile} />
            <RelatedLocalities locationSlug={locationSlug} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
