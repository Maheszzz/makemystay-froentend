/**
 * LocalitySeoProfileSections
 * Pure Server Component that renders all dynamic SEO and AEO content sections
 * for a Bangalore locality powered by the central Locality SEO Engine.
 *
 * Renders:
 * - About Area
 * - Rental Guide (Single, Double, Triple, Luxury, Budget pricing tiers)
 * - Nearby Tech Parks
 * - Nearby Metro Stations
 * - Nearby Hospitals
 * - Nearby Colleges
 * - Nearby Companies
 * - Amenities
 * - Who Should Stay
 * - Related Localities & Internal Link Clusters
 */

import React from 'react';
import { OFFICES } from '@/data/offices';
import type { LocalitySeoProfile } from '@/lib/locality';
import { getAmenityIcon } from '@/lib/amenityIcons';
import {
    Building2,
    Train,
    Hospital as HospitalIcon,
    GraduationCap,
    Briefcase,
    MapPin,
    ExternalLink,
    Sparkles,
    Users,
    ChevronRight,
    Wallet,
    ShieldCheck,
    Award,
    BookOpen
} from 'lucide-react';

export interface LocalitySeoProfileSectionsProps {
    profile: LocalitySeoProfile;
}

export function LocalitySeoProfileSections({ profile }: LocalitySeoProfileSectionsProps) {
    const {
        locality,
        aboutArea,
        rentalGuide,
        nearbyTechParks,
        nearbyMetroStations,
        nearbyHospitals,
        nearbyColleges,
        nearbyCompanies,
        topAmenities,
        whoShouldStay,
        internalLinks
    } = profile;

    return (
        <div className="space-y-12">
            {/* 1. ABOUT AREA NARRATIVE */}
            <section
                id="about-area"
                className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm ring-1 ring-slate-900/5"
            >
                <div className="flex items-center gap-2 text-brand-red mb-3">
                    <MapPin className="w-5 h-5 shrink-0" aria-hidden />
                    <span className="text-xs font-bold uppercase tracking-wider">Locality Profile</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                    About {locality.name}, Bangalore
                </h2>
                <p
                    data-seo="about-area"
                    className="text-slate-700 text-base md:text-lg leading-relaxed whitespace-pre-line"
                >
                    {aboutArea}
                </p>
            </section>

            {/* 2. RENTAL GUIDE & PRICING TIERS */}
            <section
                id="rental-guide"
                className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm ring-1 ring-slate-900/5"
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-2 text-brand-red mb-1">
                            <Wallet className="w-5 h-5 shrink-0" aria-hidden />
                            <span className="text-xs font-bold uppercase tracking-wider">Pricing Guide</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            PG Rental Guide &amp; Cost in {locality.name}
                        </h2>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-1.5 text-sm font-semibold text-brand-red border border-red-100 shrink-0">
                        Average: {rentalGuide.averageRent}
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                        rentalGuide.singleSharing,
                        rentalGuide.doubleSharing,
                        rentalGuide.tripleSharing,
                        rentalGuide.luxuryPg,
                        rentalGuide.budgetPg
                    ].map((tier) => (
                        <div
                            key={tier.category}
                            className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 flex flex-col justify-between hover:border-slate-300 transition-colors"
                        >
                            <div>
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <h3 className="font-bold text-slate-900 text-base">{tier.category}</h3>
                                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-white text-slate-800 border border-slate-200">
                                        {tier.priceRange}
                                    </span>
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed">{tier.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <p className="mt-4 text-xs text-slate-500 italic border-t border-slate-100 pt-3">
                    {rentalGuide.note}
                </p>
            </section>

            {/* 3. NEARBY TECH PARKS & IT CORRIDORS */}
            {nearbyTechParks.length > 0 && (
                <section
                    id="nearby-tech-parks"
                    className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm ring-1 ring-slate-900/5"
                >
                    <div className="flex items-center gap-2 text-brand-red mb-1">
                        <Building2 className="w-5 h-5 shrink-0" aria-hidden />
                        <span className="text-xs font-bold uppercase tracking-wider">IT Corridors</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">
                        Nearby Tech Parks &amp; IT Campuses
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {nearbyTechParks.filter((tp) => OFFICES.some((o) => o.slug === tp.slug)).map((tp) => (
                            <a
                                key={tp.id}
                                href={`/office/${tp.slug}`}
                                className="group rounded-xl border border-slate-200 p-5 hover:border-brand-red/30 hover:shadow-md transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h3 className="font-bold text-slate-900 group-hover:text-brand-red transition-colors">
                                            {tp.name}
                                        </h3>
                                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-brand-red shrink-0" />
                                    </div>
                                    <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                                        {tp.description}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between text-xs font-medium text-slate-500 border-t border-slate-100 pt-3">
                                    <span>10–25 min commute</span>
                                    <span className="text-brand-red font-bold">View PGs →</span>
                                </div>
                            </a>
                        ))}
                    </div>
                </section>
            )}

            {/* 4. NEARBY METRO & TRANSIT CONNECTIVITY */}
            {nearbyMetroStations.length > 0 && (
                <section
                    id="nearby-metro"
                    className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm ring-1 ring-slate-900/5"
                >
                    <div className="flex items-center gap-2 text-brand-red mb-1">
                        <Train className="w-5 h-5 shrink-0" aria-hidden />
                        <span className="text-xs font-bold uppercase tracking-wider">Metro Transit</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">
                        Metro Stations near {locality.name}
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {nearbyMetroStations.map((station) => (
                            <div
                                key={station.id}
                                className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 flex items-start justify-between gap-4"
                            >
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-slate-900">{station.name}</h3>
                                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold bg-purple-100 text-purple-800">
                                            {station.line} Line
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600">
                                        {station.isOperational ? 'Operational' : 'Upcoming'} · Locality: {station.locality}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* 5. NEARBY HOSPITALS & HEALTHCARE */}
            {nearbyHospitals.length > 0 && (
                <section
                    id="nearby-hospitals"
                    className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm ring-1 ring-slate-900/5"
                >
                    <div className="flex items-center gap-2 text-brand-red mb-1">
                        <HospitalIcon className="w-5 h-5 shrink-0" aria-hidden />
                        <span className="text-xs font-bold uppercase tracking-wider">Emergency Healthcare</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">
                        Nearby Multispecialty Hospitals
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {nearbyHospitals.map((hosp) => (
                            <div key={hosp.id} className="rounded-xl border border-slate-200 p-5 bg-white">
                                <h3 className="font-bold text-slate-900 mb-1">{hosp.name}</h3>
                                <p className="text-xs font-medium text-brand-red mb-2">
                                    {hosp.emergency24x7 ? '24/7 Emergency Available' : 'Healthcare Facility'}
                                </p>
                                <p className="text-xs text-slate-600">
                                    {hosp.specialties.join(', ')}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* 6. NEARBY COLLEGES & UNIVERSITIES */}
            {nearbyColleges.length > 0 && (
                <section
                    id="nearby-colleges"
                    className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm ring-1 ring-slate-900/5"
                >
                    <div className="flex items-center gap-2 text-brand-red mb-1">
                        <GraduationCap className="w-5 h-5 shrink-0" aria-hidden />
                        <span className="text-xs font-bold uppercase tracking-wider">Education</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">
                        Colleges &amp; Universities near {locality.name}
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {nearbyColleges.map((col) => (
                            <div key={col.id} className="rounded-xl border border-slate-200 p-5 bg-white">
                                <h3 className="font-bold text-slate-900 mb-1">{col.name}</h3>
                                {col.shortName && (
                                    <p className="text-xs font-medium text-slate-500 mb-2">{col.shortName}</p>
                                )}
                                <p className="text-xs text-slate-600">
                                    {col.coursesOffered.join(' · ')}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* 7. NEARBY COMPANIES & MNCs */}
            {nearbyCompanies.length > 0 && (
                <section
                    id="nearby-companies"
                    className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm ring-1 ring-slate-900/5"
                >
                    <div className="flex items-center gap-2 text-brand-red mb-1">
                        <Briefcase className="w-5 h-5 shrink-0" aria-hidden />
                        <span className="text-xs font-bold uppercase tracking-wider">Corporate Offices</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">
                        Major Employers around {locality.name}
                    </h2>
                    <div className="flex flex-wrap gap-2.5">
                        {nearbyCompanies.map((comp) => (
                            <div
                                key={comp.id}
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-medium text-slate-800"
                            >
                                <span className="font-bold">{comp.name}</span>
                                <span className="text-xs text-slate-500">({comp.industry})</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* 8. TOP AMENITIES */}
            {topAmenities.length > 0 && (
                <section
                    id="amenities"
                    className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm ring-1 ring-slate-900/5"
                >
                    <div className="flex items-center gap-2 text-brand-red mb-1">
                        <Sparkles className="w-5 h-5 shrink-0" aria-hidden />
                        <span className="text-xs font-bold uppercase tracking-wider">Stay Inclusions</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">
                        Top Coliving Amenities in {locality.name} PGs
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {topAmenities.map((amenity) => (
                            <div
                                key={amenity.id}
                                className="rounded-xl border border-slate-200 p-4 bg-white flex items-start gap-3"
                            >
                                <div className="text-brand-red mt-0.5 shrink-0">
                                    {getAmenityIcon(amenity.name)}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 text-sm">{amenity.name}</h3>
                                    <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{amenity.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* 9. WHO SHOULD STAY RECOMMENDATIONS */}
            <section
                id="who-should-stay"
                className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm ring-1 ring-slate-900/5"
            >
                <div className="flex items-center gap-2 text-brand-red mb-1">
                    <Users className="w-5 h-5 shrink-0" aria-hidden />
                    <span className="text-xs font-bold uppercase tracking-wider">Tenant Recommendations</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    Who Should Stay in {locality.name}?
                </h2>
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
                        <h3 className="font-bold text-slate-900 text-base mb-2">Working Professionals</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {whoShouldStay.workingProfessionals}
                        </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
                        <h3 className="font-bold text-slate-900 text-base mb-2">College Students</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {whoShouldStay.students}
                        </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
                        <h3 className="font-bold text-slate-900 text-base mb-2">Newcomers to Bangalore</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {whoShouldStay.newcomers}
                        </p>
                    </div>
                </div>
            </section>

            {/* 10. RELATED LOCALITIES & INTERNAL LINK HUBS */}
            <section
                id="related-localities"
                className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm ring-1 ring-slate-900/5"
            >
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    Explore Related Bangalore Localities &amp; IT Corridors
                </h2>

                {/* Nearby Areas */}
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
                        Adjacent PG Localities
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                        {internalLinks.nearbyLocalities.map((link) => (
                            <a
                                key={link.url}
                                href={link.url}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 hover:border-brand-red hover:text-brand-red transition-all"
                            >
                                {link.name}
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Popular PG Areas */}
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
                        Popular Coliving Destinations in Bangalore
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                        {internalLinks.popularPgAreas.map((link) => (
                            <a
                                key={link.url}
                                href={link.url}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 hover:border-brand-red hover:text-brand-red transition-all"
                            >
                                {link.name}
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Related Landing Pages */}
                <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
                        MakeMyStay Authority Resources
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                        {internalLinks.relatedLandingPages.map((link) => (
                            <a
                                key={link.url}
                                href={link.url}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-white hover:border-brand-red hover:text-brand-red transition-all"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Related Guides & Nearby Tech Parks Section */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm ring-1 ring-slate-900/5">
                <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-5 h-5 text-brand-red shrink-0" />
                    <h2 className="text-xl font-bold text-slate-900">Related {locality.name} Coliving & Rent Guides</h2>
                </div>
                <p className="text-sm text-slate-600 mb-6">
                    Explore our in-depth research articles, cost of living breakdowns, and nearby tech park commute guides for {locality.name}, Bangalore.
                </p>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Blog Guides */}
                    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-5">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3.5">
                            In-Depth Research Blogs
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href={`/blog/best-pg-in-${locality.slug}`}
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800 hover:text-brand-red transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4 text-brand-red shrink-0" />
                                    Best PG in {locality.name} (2026): Complete Guide to Rent & Amenities
                                </a>
                            </li>
                            <li>
                                <a
                                    href={`/blog/cost-of-living-${locality.slug}`}
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800 hover:text-brand-red transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4 text-brand-red shrink-0" />
                                    Cost of Living in {locality.name} 2026: Rent, Food, Commute & Monthly Budget
                                </a>
                            </li>
                            <li>
                                <a
                                    href={`/blog/luxury-pg-${locality.slug}`}
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800 hover:text-brand-red transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4 text-brand-red shrink-0" />
                                    Luxury Coliving & Single Sharing PG in {locality.name}
                                </a>
                            </li>
                            <li>
                                <a
                                    href={`/blog/single-sharing-pg-${locality.slug}`}
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800 hover:text-brand-red transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4 text-brand-red shrink-0" />
                                    Single Sharing PG in {locality.name} — Rooms & Rental Breakdown
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Nearby Tech Park Landing Guides */}
                    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-5">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3.5">
                            PG Near Tech Parks & Workplaces
                        </h3>
                        <p className="text-xs text-slate-500 mb-4">
                            Direct commute guides for major business parks near {locality.name}:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {locality.nearbyTechParks.map((tp) => {
                                const hubPath = tp.slug.startsWith('pg-near') ? tp.slug : `pg-near-${tp.slug}`;
                                return (
                                    <a
                                        key={tp.slug}
                                        href={`/${hubPath}`}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:border-brand-red hover:text-brand-red transition-all shadow-xs"
                                    >
                                        PG near {tp.name}
                                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Visible Author & Reviewer EEAT Credentials Card */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm ring-1 ring-slate-900/5">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span className="text-sm font-bold text-slate-900">MakeMyStay Verified Editorial & Legal Review</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200/60">
                            <Award className="w-3.5 h-3.5" />
                            100% Zero-Brokerage Verified
                        </span>
                        <span className="text-xs font-semibold text-slate-500">Last Reviewed: July 2026 · MakeMyStay Realty</span>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Primary Author */}
                    <div className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-5">
                        <div className="flex-1">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Written & Curated By</p>
                            <p className="text-base font-extrabold text-slate-900 mt-1">Arjun Rao</p>
                            <p className="text-xs font-bold text-brand-red mt-0.5">Real Estate & Coliving Research Lead · 8+ yrs experience</p>
                            <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                                RERA Certified Real Estate Advisor & Bangalore Rental Market Specialist. Regularly audits coliving pricing trends, commute times, and locality safety ratings across {locality.name}.
                            </p>
                        </div>
                    </div>

                    {/* Expert Reviewer */}
                    <div className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-5">
                        <div className="flex-1">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Legally & Physically Reviewed By</p>
                            <p className="text-base font-extrabold text-slate-900 mt-1">Priya Sharma</p>
                            <p className="text-xs font-bold text-brand-red mt-0.5">Legal & Property Verification Head · 10+ yrs experience</p>
                            <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                                LL.B Real Estate Property Law & 50-Point Physical Verification Specialist. Ensures all {locality.name} PGs meet mandatory safety standards, zero-brokerage agreements, and RERA compliance.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
