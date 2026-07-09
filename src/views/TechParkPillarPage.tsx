'use server';

import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { FaqSection } from '@/components/seo/FaqSection';
import { JsonLd } from '@/components/seo/JsonLd';
import { PropertyCard } from '@/components/modules/listings/PropertyCard';
import { Link } from '@/lib/navigation';
import { getTechParkByPath } from '@/data/techParks';
import { buildTechParkPillarGraph, buildTechParkBreadcrumbs, getTechParkFaqs } from '@/lib/techParkContent';
import { propertyApi } from '@/lib/api/properties';
import {
    Building2,
    MapPin,
    Train,
    Bus,
    UtensilsCrossed,
    Heart,
    Dumbbell,
    Coffee,
    ShoppingCart,
    ChevronRight,
    Clock,
    IndianRupee,
    Building,
    Navigation,
} from 'lucide-react';

interface TechParkPillarPageProps {
    /** The URL path segment e.g. "pg-near-embassy-techvillage" */
    parkPath: string;
}

/**
 * SSR pillar page for tech park PG landing pages.
 * Replaces the thin client-side PgNearLandmarkPage for tech park routes.
 */
export default async function TechParkPillarPage({ parkPath }: TechParkPillarPageProps) {
    const park = getTechParkByPath(parkPath);
    if (!park) notFound();

    const canonicalPath = `/${park.path}`;
    const jsonLd = buildTechParkPillarGraph(park, canonicalPath);
    const breadcrumbItems = buildTechParkBreadcrumbs(park);
    const faqs = getTechParkFaqs(park);

    // SSR property fetch — use primary hub locality
    let initialProperties: any[] = [];
    try {
        const result = await propertyApi.getAll({ city: park.hubSlug, limit: 8 });
        initialProperties = result.items ?? [];
    } catch {
        // Graceful degradation — page renders without properties
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <JsonLd data={jsonLd} id="tech-park-pillar-jsonld" />
            <Navbar />

            <main id="main-content" className="flex-grow pt-20 pb-16">

                {/* ── Hero ── */}
                <div className="bg-white border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
                        <BreadcrumbNav items={breadcrumbItems} />
                        <div className="mt-4">
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-1">
                                Bangalore · Tech Park
                            </p>
                            <h1
                                data-seo="tech-park-h1"
                                className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight"
                            >
                                PG near {park.name}
                            </h1>
                            <p className="mt-1 text-slate-500 text-sm">
                                {park.locality} · Average rent {park.avgPgCost}
                            </p>

                            {/* Quick Answer — AEO / Speakable target */}
                            <div
                                data-seo="tech-park-quick-answer"
                                className="mt-4 rounded-xl border border-blue-100 bg-blue-50/60 px-5 py-4 max-w-3xl"
                            >
                                <p className="text-sm text-blue-900 leading-relaxed">
                                    <span className="font-bold">Quick Answer: </span>
                                    {park.quickAnswer}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-10">

                    {/* ── Overview + Companies ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left: Description */}
                        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-brand-red" />
                                About {park.name}
                            </h2>
                            <p className="text-slate-600 text-sm leading-relaxed">{park.description}</p>
                            <p className="mt-3 text-slate-600 text-sm leading-relaxed">{park.tenantProfile}</p>
                        </div>

                        {/* Right: Companies */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <Building className="w-4 h-4 text-brand-red" />
                                Key Companies
                            </h2>
                            <ul className="space-y-2">
                                {park.companies.map((company) => (
                                    <li key={company} className="flex items-center gap-2 text-sm text-slate-700">
                                        <span className="w-1.5 h-1.5 rounded-full bg-brand-red flex-shrink-0" />
                                        {company}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* ── Rental Price Table ── */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="rent-table-heading">
                        <h2 id="rent-table-heading" className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <IndianRupee className="w-5 h-5 text-brand-red" />
                            PG Rent near {park.name} (2026)
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="text-left py-2 pr-4 font-semibold text-slate-700">Room Type</th>
                                        <th className="text-left py-2 pr-4 font-semibold text-slate-700">Price Range</th>
                                        <th className="text-left py-2 font-semibold text-slate-700">Notes</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {park.rentTable.map((row) => (
                                        <tr key={row.roomType} className="hover:bg-slate-50 transition-colors">
                                            <td className="py-3 pr-4 font-medium text-slate-900">{row.roomType}</td>
                                            <td className="py-3 pr-4 text-brand-red font-semibold">{row.priceRange}</td>
                                            <td className="py-3 text-slate-500">{row.note}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-3 text-xs text-slate-400">
                            Prices are indicative for 2026. Verify with individual operators before booking.
                        </p>
                    </section>

                    {/* ── Walking Distance PG Areas ── */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="pg-areas-heading">
                        <h2 id="pg-areas-heading" className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Navigation className="w-5 h-5 text-brand-red" />
                            PG Areas Walking Distance from {park.name}
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {park.walkingDistancePgAreas.map((area) => (
                                <span
                                    key={area}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700"
                                >
                                    <MapPin className="w-3.5 h-3.5 text-brand-red" />
                                    {area}
                                </span>
                            ))}
                        </div>
                        <p className="mt-4 text-sm text-slate-600">
                            PGs in these micro-pockets offer the shortest commute to {park.name}. Most residents walk or take a short 5-minute auto ride to the park gates.
                        </p>
                    </section>

                    {/* ── Commute Table ── */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="commute-table-heading">
                        <h2 id="commute-table-heading" className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-brand-red" />
                            Commute Times from {park.name}
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="text-left py-2 pr-4 font-semibold text-slate-700">From</th>
                                        <th className="text-left py-2 pr-4 font-semibold text-slate-700">To</th>
                                        <th className="text-left py-2 pr-4 font-semibold text-slate-700">Mode</th>
                                        <th className="text-left py-2 pr-4 font-semibold text-slate-700">Peak</th>
                                        <th className="text-left py-2 font-semibold text-slate-700">Off-Peak</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {park.commuteTable.map((row, i) => (
                                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                                            <td className="py-3 pr-4 text-slate-700 text-xs">{row.from}</td>
                                            <td className="py-3 pr-4 text-slate-900 font-medium">{row.to}</td>
                                            <td className="py-3 pr-4 text-slate-500">{row.mode}</td>
                                            <td className="py-3 pr-4 text-orange-600 font-medium">{row.peakTime}</td>
                                            <td className="py-3 text-green-700 font-medium">{row.offPeakTime}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-3 text-xs text-slate-400">Peak hours: 8–10am and 6–8pm on weekdays. Always test your commute route before paying a deposit.</p>
                    </section>

                    {/* ── Metro + Bus ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Metro */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="metro-heading">
                            <h2 id="metro-heading" className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Train className="w-5 h-5 text-brand-red" />
                                Nearest Metro Stations
                            </h2>
                            <ul className="space-y-3">
                                {park.metroStations.map((s) => (
                                    <li key={s.name} className="flex items-start gap-3">
                                        <span className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0 mt-1.5" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{s.name}</p>
                                            <p className="text-xs text-slate-500">{s.distance}{s.note ? ` · ${s.note}` : ''}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Bus Stops */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="bus-heading">
                            <h2 id="bus-heading" className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Bus className="w-5 h-5 text-brand-red" />
                                Nearby BMTC Bus Stops
                            </h2>
                            <ul className="space-y-3">
                                {park.busStops.map((s) => (
                                    <li key={s.name} className="flex items-start gap-3">
                                        <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-1.5" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{s.name}</p>
                                            <p className="text-xs text-slate-500">{s.distance}{s.note ? ` · ${s.note}` : ''}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    {/* ── Featured Properties ── */}
                    {initialProperties.length > 0 && (
                        <section aria-labelledby="properties-heading">
                            <h2 id="properties-heading" className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-brand-red" />
                                Verified PG near {park.name}
                            </h2>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {initialProperties.map((property) => (
                                    <PropertyCard key={property.id} property={property} />
                                ))}
                            </div>
                            <div className="mt-6 text-center">
                                <Link
                                    to={`/pg/${park.hubSlug}`}
                                    className="inline-flex items-center gap-2 rounded-full bg-brand-red px-6 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition-colors"
                                >
                                    View all PG in {park.locality.split(',')[0]}
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </section>
                    )}

                    {/* ── Amenities Grid ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Restaurants */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-labelledby="restaurants-heading">
                            <h2 id="restaurants-heading" className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <UtensilsCrossed className="w-4 h-4 text-brand-red" />
                                Nearby Restaurants
                            </h2>
                            <ul className="space-y-2">
                                {park.restaurants.map((r) => (
                                    <li key={r.name} className="text-sm">
                                        <span className="font-medium text-slate-900">{r.name}</span>
                                        <span className="text-slate-500"> · {r.distance}</span>
                                        {r.note && <span className="block text-xs text-slate-400">{r.note}</span>}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Hospitals */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-labelledby="hospitals-heading">
                            <h2 id="hospitals-heading" className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <Heart className="w-4 h-4 text-brand-red" />
                                Nearby Hospitals
                            </h2>
                            <ul className="space-y-2">
                                {park.hospitals.map((h) => (
                                    <li key={h.name} className="text-sm">
                                        <span className="font-medium text-slate-900">{h.name}</span>
                                        <span className="text-slate-500"> · {h.distance}</span>
                                        {h.note && <span className="block text-xs text-slate-400">{h.note}</span>}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Gyms */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-labelledby="gyms-heading">
                            <h2 id="gyms-heading" className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <Dumbbell className="w-4 h-4 text-brand-red" />
                                Nearby Gyms
                            </h2>
                            <ul className="space-y-2">
                                {park.gyms.map((g) => (
                                    <li key={g.name} className="text-sm">
                                        <span className="font-medium text-slate-900">{g.name}</span>
                                        <span className="text-slate-500"> · {g.distance}</span>
                                        {g.note && <span className="block text-xs text-slate-400">{g.note}</span>}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Cafes */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-labelledby="cafes-heading">
                            <h2 id="cafes-heading" className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <Coffee className="w-4 h-4 text-brand-red" />
                                Nearby Cafes
                            </h2>
                            <ul className="space-y-2">
                                {park.cafes.map((c) => (
                                    <li key={c.name} className="text-sm">
                                        <span className="font-medium text-slate-900">{c.name}</span>
                                        <span className="text-slate-500"> · {c.distance}</span>
                                        {c.note && <span className="block text-xs text-slate-400">{c.note}</span>}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Grocery */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-labelledby="grocery-heading">
                            <h2 id="grocery-heading" className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <ShoppingCart className="w-4 h-4 text-brand-red" />
                                Nearby Grocery Stores
                            </h2>
                            <ul className="space-y-2">
                                {park.groceryStores.map((g) => (
                                    <li key={g.name} className="text-sm">
                                        <span className="font-medium text-slate-900">{g.name}</span>
                                        <span className="text-slate-500"> · {g.distance}</span>
                                        {g.note && <span className="block text-xs text-slate-400">{g.note}</span>}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    {/* ── FAQ Section ── */}
                    <FaqSection
                        id="tech-park-faq-heading"
                        title={`Frequently Asked — PG near ${park.name}`}
                        items={faqs}
                        collapsible
                        titleAdornment={<MapPin className="h-5 w-5 text-brand-red shrink-0" aria-hidden />}
                    />

                    {/* ── Internal Link Hub ── */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="internal-links-heading">
                        <h2 id="internal-links-heading" className="text-lg font-bold text-slate-900 mb-4">
                            Explore More — Nearby Areas &amp; Tech Parks
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Nearby Locality Pages */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Locality PG Guides</h3>
                                <ul className="space-y-2">
                                    {park.nearbySlugs.map((slug) => (
                                        <li key={slug}>
                                            <Link
                                                to={`/pg/${slug}`}
                                                className="flex items-center gap-1.5 text-sm text-brand-red hover:underline font-medium"
                                            >
                                                <ChevronRight className="w-3.5 h-3.5" />
                                                PG in {slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {/* Related Tech Park Pages */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Related Tech Parks</h3>
                                <ul className="space-y-2">
                                    {park.relatedTechParkPaths.map((path) => (
                                        <li key={path}>
                                            <Link
                                                to={`/${path}`}
                                                className="flex items-center gap-1.5 text-sm text-brand-red hover:underline font-medium"
                                            >
                                                <ChevronRight className="w-3.5 h-3.5" />
                                                {path.replace('pg-near-', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        {/* CTA */}
                        <div className="mt-6 rounded-xl bg-brand-red/5 border border-brand-red/20 p-4">
                            <p className="text-sm font-semibold text-slate-900 mb-2">Ready to find your PG?</p>
                            <p className="text-xs text-slate-600 mb-3">Browse verified PGs near {park.name} with transparent pricing, real photos, and zero brokerage on MakeMyStay.ai.</p>
                            <Link
                                to={`/pg/${park.hubSlug}`}
                                className="inline-flex items-center gap-1.5 rounded-full bg-brand-red px-5 py-2 text-xs font-bold text-white hover:bg-red-700 transition-colors"
                            >
                                View Listings in {park.locality.split(',')[0]}
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </section>

                </div>
            </main>

            <Footer />
        </div>
    );
}
