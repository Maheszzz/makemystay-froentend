import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { PgLocalitySeoContent } from '@/components/seo/PgLocalitySeoContent';
import { getPgLocationBySlug, resolveLegacyPgSlug } from '@/data/pgLocations';
import { buildPgLocationFaqs } from '@/lib/pgLocalityFaqs';
import { buildPageSEO, pgLocationSeoWithQuery, stablePgListingCanonical } from '@/lib/seo';
import { buildPgLocationCombinedGraph } from '@/lib/schema';
import Properties from '@/pages/Properties';

export default function PGLocationPage() {
    const { location: locationParam } = useParams<{ location: string }>();
    const [searchParams] = useSearchParams();
    const [hasEmptyListings, setHasEmptyListings] = useState(false);
    const legacyTarget = resolveLegacyPgSlug(locationParam);
    if (legacyTarget) {
        return <Navigate to={`/pg/${legacyTarget}`} replace />
    }

    const loc = getPgLocationBySlug(locationParam);

    if (!loc) {
        return <Navigate to="/pg" replace />;
    }

    const { name, slug } = loc;
    const seoInput = pgLocationSeoWithQuery(name, slug, searchParams);
    const helmet = buildPageSEO(seoInput);
    const faqs = buildPgLocationFaqs(name);
    const canonicalListingPath = stablePgListingCanonical(slug, searchParams);
    const breadcrumbItems = [
        { name: 'Home', path: '/' },
        { name: 'PG', path: '/pg' },
        { name: `PG in ${name}`, path: canonicalListingPath },
    ];
    const combinedLd = buildPgLocationCombinedGraph(faqs, breadcrumbItems, name);

    const pageTitle = `PG in ${name}`;
    const pageSubtitle = `Verified paying guest stays in ${name} — filter by budget, food plan, and room type.`;

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <SEOHead {...helmet} noindex={helmet.noindex || hasEmptyListings} />
            <JsonLd data={combinedLd} id="pg-location-ld-json" />

            <Navbar />

            <main id="main-content" className="flex-grow pt-28 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm ring-1 ring-slate-900/5">
                        <header className="max-w-4xl">
                            <BreadcrumbNav
                                items={[
                                    { name: 'Home', path: '/' },
                                    { name: 'PG', path: '/pg' },
                                    { name: `PG in ${name}` },
                                ]}
                            />
                            <p className="mt-2 text-sm">
                                <Link to="/pg/bangalore" className="font-semibold text-brand-red hover:underline">
                                    PG in Bangalore — full city guide →
                                </Link>
                            </p>
                            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                Bangalore · PG
                            </p>
                            <h1 className="mt-2 text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                                PG in {name}
                            </h1>
                            <p className="mt-3 text-slate-600 text-base md:text-lg leading-relaxed">
                                Discover verified PG accommodations in <strong>{name}</strong> with transparent pricing. Use
                                the filters below to match rent, room type, and amenities — then shortlist or secure your
                                room online.
                            </p>
                        </header>
                    </div>

                    <PgLocalitySeoContent name={name} slug={slug} />
                </div>

                <div className="mt-10 border-t border-slate-200/80 bg-white">
                    <Properties
                        hideChrome
                        initialCategory="pg"
                        initialCity={name}
                        pageTitle={pageTitle}
                        pageSubtitle={pageSubtitle}
                        onEmptyResultsChange={setHasEmptyListings}
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}
