'use server';

import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { FaqSection } from '@/components/seo/FaqSection';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { PgLocationDeepContent } from '@/components/seo/PgLocationDeepContent';
import { buildGenderLocalityFaqs, PgGenderLocalityContent } from '@/components/seo/PgGenderLocalityContent';
import { QuickAnswer } from '@/components/seo/QuickAnswer';
import { LOCALITY_CONTENT } from '@/data/localityContent';
import { getPgLocationBySlug, resolveLegacyPgSlug } from '@/data/pgLocations';
import { buildLocalityAeoGraph, buildLocalityFaqs, resolveLocalityProfile } from '@/lib/pgLocalityContent';
import { absoluteUrl, buildPageSEO, pgLocationSeoWithQuery, stablePgListingCanonical } from '@/lib/seo';
import { notFound, redirect } from 'next/navigation';
import { getAuthorityProfile } from '@/data/authority';
import { getPropertyDetailPath } from '@/lib/propertyRouting';
import AuthorityLocalityPage from '@/views/AuthorityLocalityPage';
import { getLocalitySeoProfile, generateLocalityHelmetSeo } from '@/lib/locality';
import { LocalitySeoProfileSections } from '@/components/seo/LocalitySeoProfileSections';

import { ItemListSchema } from '@/components/seo/ItemListSchema';
import { PlaceSchema } from '@/components/seo/PlaceSchema';


import RelatedLocalities from '@/components/RelatedLocalities';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { LocalityAuthoritySections } from '@/components/seo/LocalityAuthoritySections';
import { LocalityInternalLinkHub } from '@/components/seo/LocalityInternalLinkHub';
import { PgRelatedAreasNav } from '@/components/seo/PgRelatedAreasNav';
import { RelatedSearchesBlock } from '@/components/seo/RelatedSearchesBlock';
import { fetchPropertiesServer } from '@/lib/server/fetchPropertiesServer';
import { fetchPgLocalityStats } from '@/lib/server/localityInventory';
import { Link } from '@/lib/navigation';
import Properties from '@/views/Properties';
import { ChevronRight, MapPin } from 'lucide-react';

/**
 * Server component for a PG locality page.
 * Fetches the first batch of properties on the server for SEO, then renders the client‑side
 * `Properties` component which handles filtering, pagination and further data fetching.
 */
export interface PGLocationPageProps {
    slug?: string;
    overrideSlug?: string;
    overrideMaxPrice?: string;
    overrideGender?: string;
    overrideFeature?: string;
}


export default async function PGLocationPage({ slug, overrideSlug, overrideMaxPrice, overrideGender, overrideFeature }: PGLocationPageProps) {
  const actualSlug = overrideSlug || slug || '';
  const normalizedGender: 'male' | 'female' | undefined =
    overrideGender?.toLowerCase() === 'female'
      ? 'female'
      : overrideGender?.toLowerCase() === 'male'
        ? 'male'
        : undefined;
  // Legacy slug redirects (e.g., old URL formats)
  const legacyTarget = resolveLegacyPgSlug(actualSlug);
  if (legacyTarget) {
    redirect(`/pg/${legacyTarget}`);
  }

  const authorityProfile = getAuthorityProfile(actualSlug);
  if (authorityProfile) {
      return <AuthorityLocalityPage 
          profile={authorityProfile} 
          overrideMaxPrice={overrideMaxPrice}
          overrideGender={overrideGender}
          overrideFeature={overrideFeature}
      />;
  }

  const selfCanonicalPathFor = (baseSlug: string): string => {
    if (overrideGender) {
      const genderWord = overrideGender.toLowerCase() === 'female' ? 'girls' : 'boys';
      return `/pg-for-${genderWord}-in-${baseSlug}`;
    }
    if (overrideMaxPrice) return `/pg-in-${baseSlug}-under-${overrideMaxPrice}`;
    if (overrideFeature) return `/pg-in-${baseSlug}-with-${overrideFeature.toLowerCase()}`;
    return `/pg/${baseSlug}`;
  };

  const baseLocalityProfile = getLocalitySeoProfile(actualSlug);
  if (baseLocalityProfile) {
    const [{ items: initialProperties, total, propertyCounts }, liveStats] = await Promise.all([
      fetchPropertiesServer({
        category: 'pg',
        city: baseLocalityProfile.locality.name,
        is_available: true,
        limit: 24,
        sort_by: 'newest',
      }),
      fetchPgLocalityStats(actualSlug),
    ]);
    // Re-generate the profile with live pricing so the quick answer, rental guide,
    // FAQ and FAQ schema reflect real listings instead of generic ranges.
    const localitySeoProfile = liveStats
      ? getLocalitySeoProfile(actualSlug, liveStats) ?? baseLocalityProfile
      : baseLocalityProfile;

    const baseHelmet = generateLocalityHelmetSeo(localitySeoProfile.locality, liveStats);
    const genderLabel = normalizedGender === 'female' ? 'Girls PG' : 'Boys PG';
    const helmet = {
      ...baseHelmet,
      ...(normalizedGender
        ? {
            title: `${genderLabel} in ${localitySeoProfile.locality.name}, Bangalore | Verified Stays | MakeMyStay`,
            description:
              normalizedGender === 'female'
                ? `Find safe, verified girls PG and ladies hostels in ${localitySeoProfile.locality.name}, Bangalore with CCTV, WiFi, meals, and zero brokerage.`
                : `Find verified boys PG and men's coliving stays in ${localitySeoProfile.locality.name}, Bangalore with WiFi, meals, and zero brokerage.`,
          }
        : {}),
      canonicalHref: absoluteUrl(selfCanonicalPathFor(actualSlug)),
    };
    const isProgrammatic = !!(overrideMaxPrice || overrideGender || overrideFeature);
    // Only noindex when a page has 0 listings AND lacks rich server-rendered guide content (< 300 words).
    const hasRichGuideContent = Boolean(normalizedGender || localitySeoProfile);
    const effectiveNoindex = helmet.noindex || (isProgrammatic && initialProperties.length === 0 && !hasRichGuideContent);

    const heroTitle = normalizedGender
      ? `${genderLabel} in ${localitySeoProfile.locality.name}`
      : localitySeoProfile.hero.heading;
    const heroSubtitle = normalizedGender
      ? normalizedGender === 'female'
        ? `Safe, verified girls PGs and women's coliving stays in ${localitySeoProfile.locality.name} — real photos, CCTV, WiFi, meals & zero brokerage.`
        : `Verified boys PGs and men's coliving stays in ${localitySeoProfile.locality.name} — transparent rent, WiFi, meals & zero brokerage.`
      : localitySeoProfile.hero.subHeading;

    const livePrices = initialProperties.map((p) => Number(p.price)).filter((n) => Number.isFinite(n) && n > 0);
    const liveMinPrice = livePrices.length > 0 ? Math.min(...livePrices) : null;
    const liveMaxPrice = livePrices.length > 0 ? Math.max(...livePrices) : null;
    const deepProfile = resolveLocalityProfile(actualSlug);
    const locMeta = getPgLocationBySlug(actualSlug);
    const genderFaqs = normalizedGender
      ? buildGenderLocalityFaqs(
          localitySeoProfile.locality.name,
          normalizedGender,
          locMeta?.rentRange,
          deepProfile.nearbyOffices,
          deepProfile.metro,
        )
      : localitySeoProfile.faqs;

    return (
      <div className="min-h-screen bg-page text-ink font-sans flex flex-col">
        <SEOHead {...helmet} noindex={effectiveNoindex} />
        <JsonLd data={localitySeoProfile.jsonLdSchema} id="pg-locality-seo-ld" />

        <Navbar />
        <main id="main-content" className="flex-grow pt-[52px] md:pt-[56px] pb-16">
          <Properties
            hideChrome
            initialCategory="pg"
            initialCity={localitySeoProfile.locality.name}
            forcedGenderFilter={normalizedGender}
            pageTitle={heroTitle}
            pageSubtitle={heroSubtitle}
            initialProperties={initialProperties}
            initialTotalCount={total}
            initialPropertyCounts={propertyCounts}
            hero={{
              breadcrumbs: normalizedGender
                ? [
                    { name: 'Home', path: '/' },
                    { name: 'PG', path: '/pg' },
                    { name: `${genderLabel} in ${localitySeoProfile.locality.name}` },
                  ]
                : localitySeoProfile.breadcrumb,
              title: heroTitle,
              subtitle: heroSubtitle,
              extra: (
                <Link
                  to="/pg/bangalore"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-white hover:underline underline-offset-4"
                >
                  <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
                  All Bangalore PGs
                  <ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </Link>
              ),
            }}
          />

          {/* Comprehensive Locality SEO Engine sections */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 space-y-10">
            {normalizedGender ? (
              <PgGenderLocalityContent
                name={localitySeoProfile.locality.name}
                slug={actualSlug}
                gender={normalizedGender}
                rentRange={locMeta?.rentRange}
                landmarks={locMeta?.landmarks}
                profile={deepProfile}
                content={LOCALITY_CONTENT[actualSlug]}
                liveListingCount={total || initialProperties.length}
                liveMinPrice={liveMinPrice}
                liveMaxPrice={liveMaxPrice}
                nearbySlugs={deepProfile.nearbySlugs}
              />
            ) : (
              <>
                <QuickAnswer locationName={localitySeoProfile.locality.name}>
                  {localitySeoProfile.quickAnswer}
                </QuickAnswer>
                <LocalitySeoProfileSections profile={localitySeoProfile} />
              </>
            )}

            <FaqSection
              id="pg-locality-faq-heading"
              title={
                normalizedGender
                  ? `Frequently asked — ${genderLabel} in ${localitySeoProfile.locality.name}`
                  : `Frequently asked — PG in ${localitySeoProfile.locality.name}`
              }
              items={genderFaqs}
              collapsible
              titleAdornment={<MapPin className="h-5 w-5 text-brand-red shrink-0" aria-hidden />}
            />

            <RelatedSearchesBlock currentSlug={localitySeoProfile.slug} localityName={localitySeoProfile.locality.name} variant="pg" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const loc = getPgLocationBySlug(actualSlug);
  if (!loc) {
    notFound();
  }

  const { name, slug: locationSlug } = loc;
  const searchParams = new URLSearchParams(); // Empty – client‑side filters will update URL later
  const seoInput = pgLocationSeoWithQuery(name, locationSlug, searchParams);
  const selfPath = selfCanonicalPathFor(locationSlug);
  const helmet = {
    ...buildPageSEO(seoInput),
    canonicalHref: absoluteUrl(selfPath),
  };
  const profile = resolveLocalityProfile(locationSlug);
  const faqs = buildLocalityFaqs(name, locationSlug);
  const canonicalListingPath = overrideGender || overrideMaxPrice || overrideFeature
    ? selfPath
    : stablePgListingCanonical(locationSlug, searchParams);
  const content = LOCALITY_CONTENT[locationSlug] || {};
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'PG', path: '/pg' },
    { name: `PG in ${name}`, path: canonicalListingPath },
  ];
  const combinedLd = buildLocalityAeoGraph(profile, faqs, breadcrumbItems, canonicalListingPath);

  const { items: initialProperties, total, propertyCounts } = await fetchPropertiesServer({
    category: 'pg',
    city: name,
    is_available: true,
    limit: 24,
    sort_by: 'newest',
  });

  const isProgrammatic = !!(overrideMaxPrice || overrideGender || overrideFeature);
  // Only noindex when a page has 0 listings AND lacks rich server-rendered guide content (< 300 words).
  const hasRichGuideContent = Boolean(normalizedGender || loc);
  const effectiveNoindex = helmet.noindex || (isProgrammatic && initialProperties.length === 0 && !hasRichGuideContent);

  const genderLabel = normalizedGender === 'female' ? 'Girls PG' : 'Boys PG';
  const pageTitle = normalizedGender ? `${genderLabel} in ${name}` : `PGs in ${name}`;
  const pageSubtitle = normalizedGender
    ? normalizedGender === 'female'
      ? `Safe, verified girls PGs and women's coliving stays in ${name} — CCTV, WiFi, meals, and zero brokerage.`
      : `Verified boys PGs and men's coliving stays in ${name} — WiFi, meals, transparent rent, and zero brokerage.`
    : `PGs and coliving stays in ${name} — filter by budget, meals, and gender.`;

  const effectiveFaqs = normalizedGender
    ? buildGenderLocalityFaqs(name, normalizedGender, loc.rentRange, profile.nearbyOffices, profile.metro)
    : faqs;
  const effectiveBreadcrumbs = normalizedGender
    ? [
        { name: 'Home', path: '/' },
        { name: 'PG', path: '/pg' },
        { name: `${genderLabel} in ${name}`, path: selfPath },
      ]
    : breadcrumbItems;
  const effectiveCombinedLd = normalizedGender
    ? buildLocalityAeoGraph(profile, effectiveFaqs, effectiveBreadcrumbs, selfPath)
    : combinedLd;
  const livePrices = initialProperties.map((p) => Number(p.price)).filter((n) => Number.isFinite(n) && n > 0);
  const liveMinPrice = livePrices.length > 0 ? Math.min(...livePrices) : null;
  const liveMaxPrice = livePrices.length > 0 ? Math.max(...livePrices) : null;

  return (
    <div className="min-h-screen bg-page text-ink font-sans flex flex-col">
      <SEOHead {...helmet} noindex={effectiveNoindex} />
      <JsonLd data={effectiveCombinedLd} id="pg-location-ld" />
      <BreadcrumbSchema items={effectiveBreadcrumbs} />

      <PlaceSchema name={name} description={profile?.description} />
      <ItemListSchema items={initialProperties.map(p => ({ url: getPropertyDetailPath(p), name: p.title }))} />


      <Navbar />
      <main id="main-content" className="flex-grow pt-[52px] md:pt-[56px] pb-16">
        <Properties
          hideChrome
          initialCategory="pg"
          initialCity={name}
          forcedGenderFilter={normalizedGender}
          pageTitle={pageTitle}
          pageSubtitle={pageSubtitle}
          initialProperties={initialProperties}
          initialTotalCount={total}
          initialPropertyCounts={propertyCounts}
          hero={{
            breadcrumbs: [
              { name: 'Home', path: '/' },
              { name: 'PG', path: '/pg' },
              { name: pageTitle },
            ],
            title: pageTitle,
            subtitle: pageSubtitle,
            extra: (
              <Link
                to="/pg/bangalore"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-white hover:underline underline-offset-4"
              >
                <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
                All Bangalore PGs
                <ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </Link>
            ),
          }}
        />

        {/* Additional locality sections */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 space-y-10">
          {normalizedGender ? (
            <PgGenderLocalityContent
              name={name}
              slug={locationSlug}
              gender={normalizedGender}
              rentRange={loc.rentRange}
              landmarks={loc.landmarks}
              profile={profile}
              content={content}
              liveListingCount={total || initialProperties.length}
              liveMinPrice={liveMinPrice}
              liveMaxPrice={liveMaxPrice}
              nearbySlugs={profile.nearbySlugs}
            />
          ) : (
            <>
              <QuickAnswer locationName={name}>{profile.quickAnswer}</QuickAnswer>
              <section className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm ring-1 ring-slate-900/5">
                <PgLocationDeepContent name={name} profile={profile} />
              </section>
            </>
          )}

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
            title={normalizedGender ? `Frequently asked — ${genderLabel} in ${name}` : `Frequently asked — PG in ${name}`}
            items={effectiveFaqs}
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
