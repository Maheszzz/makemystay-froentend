/**
 * Tech Park Landing Page Profile Sections Component
 * High-performance Server Component rendering the structured TechParkLandingProfile
 * including Hero, Quick Answer, About, Rental Guide, Commute Table, Metro,
 * Companies, Amenities, FAQs, Internal Links, and Related Tech Parks.
 */

import React from 'react';
import type { TechParkLandingProfile } from '@/lib/landing';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { FaqSection } from '@/components/seo/FaqSection';
import { PropertyCard } from '@/components/modules/listings/PropertyCard';
import { Link } from '@/lib/navigation';
import {
    Building2,
    MapPin,
    Train,
    Clock,
    IndianRupee,
    Building,
    Navigation,
    ChevronRight,
    CheckCircle2,
    Sparkles,
    ShieldCheck,
    Users
} from 'lucide-react';

interface TechParkSeoProfileSectionsProps {
    profile: TechParkLandingProfile;
    initialProperties: any[];
}

export function TechParkSeoProfileSections({
    profile,
    initialProperties
}: TechParkSeoProfileSectionsProps) {
    const {
        park,
        hero,
        quickAnswer,
        aboutTechPark,
        nearbyLocalities,
        rentalGuide,
        nearbyMetro,
        nearbyCompanies,
        topAmenities,
        commuteInfo,
        whoShouldStay,
        faqs,
        breadcrumb,
        internalLinks,
        relatedTechParks
    } = profile;

    const rentalTiers = [
        rentalGuide.walkingDistancePg,
        rentalGuide.budgetPg,
        rentalGuide.luxuryColiving,
        rentalGuide.singleSharing,
        rentalGuide.doubleSharing,
        rentalGuide.tripleSharing
    ];

    return (
        <div className="space-y-12">
            {/* ── Hero ── */}
            <div className="bg-white border-b border-slate-100 -mt-6 pb-8">
                <div className="max-w-7xl mx-auto">
                    <BreadcrumbNav items={breadcrumb} />
                    <div className="mt-4">
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-1">
                            Bangalore · Tech Park Coliving & PG
                        </p>
                        <h1
                            data-seo="tech-park-h1"
                            className="type-h1 text-slate-900"
                        >
                            {hero.heading}
                        </h1>
                        <p className="mt-2 text-slate-600 text-sm md:text-base max-w-3xl leading-relaxed">
                            {hero.subHeading}
                        </p>
                        <p className="mt-1 text-slate-500 text-sm font-medium">
                            {park.locality} · Average rent {rentalGuide.averageRent}
                        </p>

                        {/* Quick Answer — AEO / Speakable target */}
                        <div
                            data-seo="tech-park-quick-answer"
                            className="mt-6 rounded-xl border border-blue-100 bg-blue-50/60 px-5 py-4 max-w-3xl"
                        >
                            <p className="text-sm text-blue-900 leading-relaxed">
                                <span className="font-bold">Quick Answer: </span>
                                {quickAnswer}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Overview + Companies ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Description & Who Should Stay */}
                <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-brand-red" />
                        About {park.name} & Surrounding Area
                    </h2>
                    <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                        {aboutTechPark}
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-brand-red" />
                            Who Should Stay Here?
                        </h3>
                        <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-1">
                            <strong className="text-slate-800">Working Professionals: </strong>
                            {whoShouldStay.workingProfessionals}
                        </p>
                        <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                            <strong className="text-slate-800">Newcomers: </strong>
                            {whoShouldStay.newcomers}
                        </p>
                    </div>
                </div>

                {/* Right: Companies */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <Building className="w-4 h-4 text-brand-red" />
                        Key Companies & Employers
                    </h2>
                    <ul className="space-y-2.5">
                        {nearbyCompanies.map((comp) => (
                            <li key={comp.name} className="flex items-start gap-2.5 text-sm text-slate-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-red flex-shrink-0 mt-2" />
                                <div>
                                    <p className="font-medium text-slate-900">{comp.name}</p>
                                    <p className="text-xs text-slate-400">{comp.industry}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* ── Rental Guide Table ── */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="rent-table-heading">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                    <h2 id="rent-table-heading" className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <IndianRupee className="w-5 h-5 text-brand-red" />
                        PG Rental Price Guide near {park.name} (2026)
                    </h2>
                    <span className="text-xs font-semibold text-brand-red bg-red-50 px-3 py-1 rounded-full w-fit">
                        Avg: {rentalGuide.averageRent}
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-200">
                                <th className="text-left py-3 pr-4 font-semibold text-slate-700">Category / Room Type</th>
                                <th className="text-left py-3 pr-4 font-semibold text-slate-700">Monthly Rent Range</th>
                                <th className="text-left py-3 font-semibold text-slate-700">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {rentalTiers.map((tier) => (
                                <tr key={tier.category} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-3.5 pr-4 font-medium text-slate-900">{tier.category}</td>
                                    <td className="py-3.5 pr-4 text-brand-red font-bold">{tier.priceRange}</td>
                                    <td className="py-3.5 text-slate-600 text-xs md:text-sm">{tier.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="mt-4 text-xs text-slate-500 italic">
                    {rentalGuide.note}
                </p>
            </section>

            {/* ── Walking Distance PG Areas & Localities ── */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="pg-areas-heading">
                <h2 id="pg-areas-heading" className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-brand-red" />
                    Nearby PG Localities & Walking Distance Areas
                </h2>
                <div className="flex flex-wrap gap-3">
                    {nearbyLocalities.map((area) => (
                        <Link
                            key={area.slug}
                            to={`/pg/${area.slug}`}
                            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 hover:border-brand-red hover:text-brand-red transition-colors"
                        >
                            <MapPin className="w-3.5 h-3.5 text-brand-red" />
                            {area.name} ({area.distance})
                        </Link>
                    ))}
                </div>
                <p className="mt-4 text-sm text-slate-600">
                    PGs in these residential layouts offer the shortest commute to {park.name}. Most working professionals either walk or take a brief 5-minute auto-rickshaw ride to campus gates.
                </p>
            </section>

            {/* ── Commute Table ── */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="commute-table-heading">
                <h2 id="commute-table-heading" className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-brand-red" />
                    Commute Times to {park.name}
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-200">
                                <th className="text-left py-2.5 pr-4 font-semibold text-slate-700">From Area</th>
                                <th className="text-left py-2.5 pr-4 font-semibold text-slate-700">To Destination</th>
                                <th className="text-left py-2.5 pr-4 font-semibold text-slate-700">Travel Mode</th>
                                <th className="text-left py-2.5 pr-4 font-semibold text-slate-700">Peak Hours</th>
                                <th className="text-left py-2.5 font-semibold text-slate-700">Off-Peak</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {commuteInfo.commuteTable.map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-3 pr-4 text-slate-700 font-medium text-xs md:text-sm">{row.from}</td>
                                    <td className="py-3 pr-4 text-slate-900 font-medium text-xs md:text-sm">{row.to}</td>
                                    <td className="py-3 pr-4 text-slate-500 text-xs md:text-sm">{row.mode}</td>
                                    <td className="py-3 pr-4 text-orange-600 font-bold text-xs md:text-sm">{row.peakTime}</td>
                                    <td className="py-3 text-green-700 font-bold text-xs md:text-sm">{row.offPeakTime}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="mt-3 text-xs text-slate-400">
                    {commuteInfo.walkingTime} {commuteInfo.metroConnectivity}
                </p>
            </section>

            {/* ── Metro + Amenities ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Metro Stations */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="metro-heading">
                    <h2 id="metro-heading" className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Train className="w-5 h-5 text-brand-red" />
                        Nearest Metro Stations
                    </h2>
                    <ul className="space-y-3">
                        {nearbyMetro.map((s) => (
                            <li key={s.name} className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0 mt-1.5" />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-slate-900">{s.name}</p>
                                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">
                                            {s.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5">{s.line} · {s.distance}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Top Amenities */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="amenities-heading">
                    <h2 id="amenities-heading" className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-brand-red" />
                        Top Coliving & PG Amenities
                    </h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {topAmenities.map((item) => (
                            <li key={item.id} className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{item.name}</p>
                                    <p className="text-[11px] text-slate-500 line-clamp-1">{item.description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>

            {/* ── SSR Property Listings ── */}
            {initialProperties.length > 0 && (
                <section aria-labelledby="properties-heading">
                    <div className="flex items-center justify-between mb-6">
                        <h2 id="properties-heading" className="text-2xl font-bold text-slate-900 tracking-tight">
                            Verified PG Listings near {park.name}
                        </h2>
                        <Link
                            to={`/pg/${park.hubSlug || 'whitefield'}`}
                            className="text-sm font-semibold text-brand-red hover:underline flex items-center gap-1"
                        >
                            View all PGs in {park.locality.split(',')[0]}
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {initialProperties.map((prop) => (
                            <PropertyCard key={prop.id} property={prop} />
                        ))}
                    </div>
                </section>
            )}

            {/* ── FAQs ── */}
            {faqs.length > 0 && (
                <FaqSection
                    title={`Frequently Asked Questions about PGs near ${park.name}`}
                    items={faqs}
                />
            )}

            {/* ── Internal Links & Related Tech Parks ── */}
            <section
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6"
                aria-labelledby="internal-links-heading"
            >
                <h2 id="internal-links-heading" className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-brand-red" />
                    Explore Bangalore PG Corridors & Resources
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Related Localities */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                            Nearby PG Localities
                        </h3>
                        <ul className="space-y-2">
                            {internalLinks.relatedLocalities.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className="flex items-center gap-1.5 text-sm text-brand-red hover:underline font-medium"
                                    >
                                        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Related Tech Parks */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                            Other Bangalore Tech Parks
                        </h3>
                        <ul className="space-y-2">
                            {internalLinks.relatedTechParks.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className="flex items-center gap-1.5 text-sm text-brand-red hover:underline font-medium"
                                    >
                                        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Related Blogs */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                            Rental Guides & Articles
                        </h3>
                        <ul className="space-y-2">
                            {internalLinks.relatedBlogs.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className="flex items-center gap-1.5 text-sm text-brand-red hover:underline font-medium line-clamp-1"
                                    >
                                        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Related Tech Park Cards */}
                {relatedTechParks.length > 0 && (
                    <div className="pt-6 border-t border-slate-100">
                        <h3 className="text-sm font-bold text-slate-800 mb-4">
                            More Coliving Hubs Near Tech Corridors
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {relatedTechParks.slice(0, 3).map((rtp) => (
                                <Link
                                    key={rtp.path}
                                    to={`/${rtp.path}`}
                                    className="block p-4 rounded-xl border border-slate-200 hover:border-brand-red/50 transition-colors bg-slate-50/50 group"
                                >
                                    <p className="font-bold text-slate-900 group-hover:text-brand-red text-sm transition-colors">
                                        PG near {rtp.name}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                        {rtp.description}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* CTA */}
                <div className="mt-6 rounded-xl bg-brand-red/5 border border-brand-red/20 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-base font-bold text-slate-900 mb-1">Looking for a verified PG near {park.name}?</p>
                        <p className="text-xs md:text-sm text-slate-600">
                            Browse zero-brokerage coliving spaces with transparent monthly pricing, food, and daily housekeeping.
                        </p>
                    </div>
                    <Link
                        to={`/pg/${park.hubSlug || 'whitefield'}`}
                        className="inline-flex items-center justify-center gap-1.5 rounded-full bg-brand-red px-6 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition-colors whitespace-nowrap"
                    >
                        Explore PGs in {park.locality.split(',')[0]}
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
