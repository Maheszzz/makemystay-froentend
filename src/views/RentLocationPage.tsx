'use client';

import { useCallback, useMemo, useState } from 'react';
import { Link, useParams } from '@/lib/navigation';
import { Home, ChevronRight, MapPin } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { FaqSection } from '@/components/seo/FaqSection';
import { RelatedSearchesBlock } from '@/components/seo/RelatedSearchesBlock';
import locJson from '@/data/pg-locations.json';
import { getPgLocationBySlug } from '@/data/pgLocations';
import { getLocalitySeoProfile } from '@/lib/locality';
import { resolveLocalityProfile } from '@/lib/pgLocalityContent';
import { buildRentLocationFaqs } from '@/lib/rentLocalityFaqs';
import { buildPageSEO, rentLocationHubSeo } from '@/lib/seo';
import { buildPgHubItemListSchema, buildPgLocationCombinedGraph } from '@/lib/schema';
import type { Property } from '@/types/api';
import Properties from '@/views/Properties';

interface RentLocationPageProps {
    overrideSlug?: string;
    initialProperties?: Property[];
    initialTotalCount?: number;
    initialPropertyCounts?: Record<string, number>;
}

export default function RentLocationPage({
    overrideSlug,
    initialProperties,
    initialTotalCount,
    initialPropertyCounts,
}: RentLocationPageProps = {}) {
    const { slug: locationParam } = useParams<{ slug: string }>();
    const param = (overrideSlug || locationParam || '').toLowerCase();
    const loc = getPgLocationBySlug(param) ?? getLocalitySeoProfile(param)?.locality;

    if (!loc) {
        return (
            <Properties
                key={`rent-${locationParam ?? 'hub'}`}
                initialCategory="rent"
                initialCity={locationParam ?? 'all'}
                initialProperties={initialProperties}
                initialTotalCount={initialTotalCount}
                initialPropertyCounts={initialPropertyCounts}
            />
        );
    }

    const { name, slug } = loc;
    const locMeta = getPgLocationBySlug(slug);
    const areaProfile = resolveLocalityProfile(slug);
    const helmet = buildPageSEO(rentLocationHubSeo(name, slug));
    const faqs = buildRentLocationFaqs(name, slug);
    const breadcrumbItems = [
        { name: 'Home', path: '/' },
        { name: 'Rent', path: '/rent/bangalore' },
        { name: `Rent in ${name}`, path: `/rent/${slug}` },
    ];
    const combinedLd = buildPgLocationCombinedGraph(faqs, breadcrumbItems, name);

    const [hubListingsForSeo, setHubListingsForSeo] = useState<Property[]>(initialProperties ?? []);
    const liveRentCount = initialTotalCount ?? initialProperties?.length ?? 0;
    const livePrices = (initialProperties ?? [])
        .map((p) => Number(p.price))
        .filter((n) => Number.isFinite(n) && n > 0);
    const liveMinRent = livePrices.length > 0 ? Math.min(...livePrices) : null;
    const liveMaxRent = livePrices.length > 0 ? Math.max(...livePrices) : null;

    const neighborRentHubs = useMemo(() => {
        const fromProfile = (areaProfile.nearbySlugs || [])
            .filter((s) => s && s !== slug)
            .map((s) => getPgLocationBySlug(s))
            .filter((l): l is NonNullable<typeof l> => Boolean(l));
        if (fromProfile.length >= 3) return fromProfile.slice(0, 6);
        const fallback = locJson
            .filter((l) => l.slug && l.slug !== slug && !fromProfile.some((f) => f.slug === l.slug))
            .slice(0, 6 - fromProfile.length);
        return [...fromProfile, ...fallback];
    }, [areaProfile.nearbySlugs, slug]);
    const onDisplayedListingsForSeo = useCallback((list: Property[]) => {
        setHubListingsForSeo((prev) => {
            if (prev.length === list.length && prev.every((p, i) => p.id === list[i]?.id)) {
                return prev;
            }
            return list;
        });
    }, []);

    const itemListLd = useMemo(
        () =>
            buildPgHubItemListSchema(hubListingsForSeo, {
                name: `Rent listings in ${name}`,
                description: `Verified flats and houses for rent in ${name}, Bangalore — same URLs as on-page cards.`,
            }),
        [hubListingsForSeo, name]
    );

    const [] = useState(false);

    return (
        <div className="min-h-screen bg-page text-ink font-sans flex flex-col">
            <SEOHead {...helmet} />
            <JsonLd data={combinedLd} id="rent-location-ld-json" />
            {itemListLd ? <JsonLd data={itemListLd} id="rent-location-itemlist-ld-json" /> : null}
            <Navbar />

            <main id="main-content" className="flex-grow pt-[52px] md:pt-[56px] pb-16">
                <Properties
                    hideChrome
                    initialCategory="rent"
                    initialCity={name}
                    initialProperties={initialProperties}
                    initialTotalCount={initialTotalCount}
                    initialPropertyCounts={initialPropertyCounts}
                    pageTitle={`Flats & Houses for Rent in ${name}`}
                    pageSubtitle={`Verified 1BHK, 2BHK, 3BHK flats and independent houses for rent in ${name}, Bangalore — zero brokerage.`}
                    hero={{
                        breadcrumbs: [
                            { name: 'Home', path: '/' },
                            { name: 'Flats', path: '/rent/bangalore' },
                            { name: `Flats for rent in ${name}` },
                        ],
                        title: `Flats & Houses for Rent in ${name}`,
                        subtitle: `Verified 1BHK, 2BHK, 3BHK flats and independent houses for rent in ${name}, Bangalore — zero brokerage.`,
                        extra: (
                            <Link
                                to={`/pg/${slug}`}
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-white hover:underline underline-offset-4"
                            >
                                <Home className="w-4 h-4 shrink-0" aria-hidden="true" />
                                PGs in {name}
                                <ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                            </Link>
                        ),
                    }}
                    onDisplayedListingsForSeo={onDisplayedListingsForSeo}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 space-y-10">
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-4">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-brand-red shrink-0" aria-hidden />
                            Renting a Flat or House in {name}, Bangalore
                        </h2>
                        <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-4xl">
                            Looking for an independent flat rather than a shared PG in {name}? Rental apartments in{' '}
                            {name} give couples, families, and working professionals full privacy, a dedicated kitchen,
                            and flexible furnishing choices (unfurnished, semi-furnished, or fully furnished 1BHK, 2BHK,
                            and 3BHK homes).{' '}
                            {liveRentCount > 0 ? (
                                <>
                                    MakeMyStay currently lists <strong>{liveRentCount} verified rental {liveRentCount === 1 ? 'home' : 'homes'}</strong>{' '}
                                    in {name}
                                    {liveMinRent && liveMaxRent
                                        ? ` priced between ₹${liveMinRent.toLocaleString('en-IN')} and ₹${liveMaxRent.toLocaleString('en-IN')}/month`
                                        : ''}
                                    .
                                </>
                            ) : (
                                <>
                                    Browse verified zero-brokerage rental flats in {name} and compare monthly rent,
                                    security deposit, and society amenities directly with owners.
                                </>
                            )}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-sm text-slate-700">
                            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                                <h3 className="font-bold text-slate-900 mb-1">Commute &amp; Landmarks</h3>
                                <p className="leading-relaxed">
                                    {locMeta?.landmarks?.length ? (
                                        <>Key landmarks around {name}: {locMeta.landmarks.join(', ')}. </>
                                    ) : null}
                                    {areaProfile.nearbyOffices?.length ? (
                                        <>Convenient access to {areaProfile.nearbyOffices.slice(0, 4).join(', ')}.</>
                                    ) : (
                                        <>Well connected to nearby Bangalore employment corridors and daily essentials.</>
                                    )}
                                </p>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                                <h3 className="font-bold text-slate-900 mb-1">Transit &amp; Metro</h3>
                                <p className="leading-relaxed">
                                    {areaProfile.metro || `${name} is connected via BMTC bus routes, autos, and cabs across Bangalore.`}
                                </p>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                                <h3 className="font-bold text-slate-900 mb-1">Flat vs PG in {name}</h3>
                                <p className="leading-relaxed">
                                    Flats suit longer stays (11-month lease) with separate utility bills, while{' '}
                                    <Link to={`/pg/${slug}`} className="font-semibold text-brand-red hover:underline">
                                        PGs in {name}
                                    </Link>{' '}
                                    bundle WiFi, meals, and lower deposits for shorter stays.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2">
                            <Link
                                to={`/1bhk/${slug}`}
                                className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-brand-red/40 hover:text-brand-red"
                            >
                                1 BHK for Rent in {name}
                            </Link>
                            <Link
                                to={`/2bhk/${slug}`}
                                className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-brand-red/40 hover:text-brand-red"
                            >
                                2 BHK for Rent in {name}
                            </Link>
                            <Link
                                to={`/3bhk/${slug}`}
                                className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-brand-red/40 hover:text-brand-red"
                            >
                                3 BHK for Rent in {name}
                            </Link>
                        </div>
                    </section>

                    <FaqSection
                        id={`rent-${slug}-faq`}
                        title={`Flats for Rent in ${name} — FAQs`}
                        items={faqs}
                        variant="light"
                        titleAdornment={<MapPin className="h-5 w-5 text-brand-red shrink-0" aria-hidden />}
                    />

                    <section className="pt-6 border-t border-slate-200/60">
                        <h2 className="font-heading text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                            <div className="w-1.5 h-5 bg-brand-red rounded-full" />
                            Nearby Areas for Flats on Rent
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {neighborRentHubs.map((item) => (
                                <Link
                                    key={item.slug}
                                    to={`/rent/${item.slug}`}
                                    className="group flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-slate-200/80 hover:border-brand-red/30 hover:shadow-md transition-all duration-200"
                                >
                                    <MapPin className="w-3 h-3 text-slate-400 group-hover:text-brand-red shrink-0 transition-colors" />
                                    <span className="text-[12px] font-semibold text-slate-600 group-hover:text-brand-red transition-colors truncate">
                                        Rent in {item.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </section>

                    <RelatedSearchesBlock currentSlug={slug} localityName={name} variant="rent" />
                </div>
            </main>

            <Footer />
        </div>
    );
}
