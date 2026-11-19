'use client';

import {
    ArrowRight,
    CalendarCheck,
    Camera,
    Check,
    CheckCircle2,
    Compass,
    IndianRupee,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Target,
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { FounderSection } from '@/components/sections/FounderSection';
import { JsonLd } from '@/components/seo/JsonLd';
import { SEOHead } from '@/components/seo/SEOHead';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { BRAND_CONTACT } from '@/lib/brandEntity';
import { Link } from '@/lib/navigation';
import { buildAboutPageSchema, buildBreadcrumbSchema } from '@/lib/schema';
import { buildAboutPageSEO, buildPageSEO } from '@/lib/seo';
import { LEGAL_ENTITY_NAME } from '@/lib/siteConfig';
import { getWhatsappDigits } from '@/lib/whatsapp';

export interface AboutHeroPhoto {
    url: string;
    alt: string;
    href: string;
}

export interface AboutLocalityItem {
    name: string;
    slug: string;
    count: number;
}

interface AboutProps {
    heroPhotos?: AboutHeroPhoto[];
    topLocalities?: AboutLocalityItem[];
}

const EXPECTATIONS = [
    {
        icon: Camera,
        title: 'Real property photos',
        description:
            'Listings use real photos of the property so you can evaluate spaces before scheduling a visit.',
    },
    {
        icon: IndianRupee,
        title: 'Transparent pricing',
        description:
            'Clear upfront rents and sharing options, with zero brokerage for tenants on supported listings.',
    },
    {
        icon: CalendarCheck,
        title: 'Fast enquiry and visit booking',
        description:
            'Book walkthroughs quickly with direct owner or operator context and fewer middlemen.',
    },
    {
        icon: CheckCircle2,
        title: 'Last verified dates',
        description:
            'Listings undergo baseline checks before going live, with last-verified dates displayed on verified properties.',
    },
] as const;

const MISSION_POINTS = [
    'Simplify property discovery with practical area, budget, and amenity filters',
    'Show upfront pricing and zero brokerage for tenants where supported',
    'Run baseline photo and operator checks before listings go live',
    'Help renters book visits directly without unnecessary middlemen',
] as const;

const FOCUS_LIGHT =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2';
const FOCUS_DARK =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-red-900';

export default function About({ heroPhotos = [], topLocalities = [] }: AboutProps) {
    const helmet = buildPageSEO(buildAboutPageSEO());
    const breadcrumbLd = buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
    ]);

    const visiblePhotos = heroPhotos.slice(0, 4);
    const hasPhotos = visiblePhotos.length > 0;
    const whatsappHref = `https://wa.me/${getWhatsappDigits()}?text=${encodeURIComponent(
        'Hi MakeMyStay team, I would like help finding a stay in Bangalore.',
    )}`;

    return (
        <div className="min-h-screen bg-pdp-bg text-pdp-ink flex flex-col font-sans">
            <SEOHead {...helmet} />
            <JsonLd id="about-breadcrumb" data={breadcrumbLd} />
            <JsonLd id="about-schema" data={buildAboutPageSchema()} />

            <Navbar />

            <main id="main-content" className="flex-grow pt-16 sm:pt-20 bg-page">
                {/* 1. Hero */}
                <section className="py-12 md:py-20 border-b border-line bg-page">
                    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div
                            className={`grid grid-cols-1 gap-10 lg:gap-12 items-center ${
                                hasPhotos ? 'lg:grid-cols-12' : ''
                            }`}
                        >
                            <div className={hasPhotos ? 'lg:col-span-7 min-w-0' : 'max-w-[66ch]'}>
                                <h1 className="type-h1 text-ink">
                                    Find a verified place to live in Bangalore without a broker
                                </h1>
                                <p className="mt-5 pdp-type-body text-slate max-w-[58ch]">
                                    MakeMyStay.ai is a Bangalore-first platform for verified PGs, coliving
                                    spaces, rental flats, resale homes, and plots — with real photos,
                                    transparent pricing, and zero brokerage for tenants on supported listings.
                                </p>
                                <div className="mt-8 flex flex-wrap items-center gap-3">
                                    <Link
                                        to="/pg"
                                        className={`min-h-[44px] px-5 py-2.5 rounded-[10px] bg-red text-white pdp-type-caption font-medium inline-flex items-center gap-2 hover:bg-red-hover transition-colors ${FOCUS_LIGHT}`}
                                    >
                                        <span>Browse PGs</span>
                                        <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />
                                    </Link>
                                    <Link
                                        to="/rent"
                                        className={`min-h-[44px] px-5 py-2.5 rounded-[10px] border border-ink bg-white text-ink pdp-type-caption font-medium inline-flex items-center gap-2 hover:bg-blush-100 transition-colors ${FOCUS_LIGHT}`}
                                    >
                                        <span>Browse flats</span>
                                    </Link>
                                </div>
                            </div>

                            {hasPhotos && (
                                <div className="lg:col-span-5">
                                    <div
                                        className={`grid gap-2 rounded-[var(--radius-pdp)] overflow-hidden border border-line bg-blush-100 ${
                                            visiblePhotos.length === 1
                                                ? 'grid-cols-1 h-[280px] sm:h-[340px]'
                                                : visiblePhotos.length === 2
                                                  ? 'grid-cols-2 h-[280px] sm:h-[340px]'
                                                  : 'grid-cols-2 grid-rows-2 h-[320px] sm:h-[360px]'
                                        }`}
                                    >
                                        {visiblePhotos.map((photo, idx) => {
                                            const tileCls =
                                                visiblePhotos.length === 3 && idx === 0
                                                    ? 'row-span-2 h-full'
                                                    : 'h-full';
                                            return (
                                                <Link
                                                    key={photo.url}
                                                    to={photo.href}
                                                    className={`relative w-full overflow-hidden bg-blush-100 ${tileCls} ${FOCUS_LIGHT}`}
                                                    aria-label={photo.alt}
                                                >
                                                    <OptimizedImage
                                                        src={photo.url}
                                                        alt={photo.alt}
                                                        fill
                                                        priority={idx === 0}
                                                        placeholder="blur"
                                                        size="medium"
                                                        sizes="(max-width: 1024px) 50vw, 260px"
                                                        className="object-cover"
                                                    />
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* 2. Our story (moved from homepage) */}
                <section aria-labelledby="about-story-heading" className="py-12 md:py-20 bg-white border-b border-line">
                    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-start">
                            <div className="md:col-span-4">
                                <h2 id="about-story-heading" className="pdp-type-heading text-ink">
                                    Our story
                                </h2>
                            </div>
                            <div className="md:col-span-8 space-y-4 pdp-type-body text-slate max-w-[62ch]">
                                <p>
                                    MakeMyStay was founded in <strong className="font-semibold text-ink">2026</strong> in{' '}
                                    <strong className="font-semibold text-ink">Bengaluru</strong> to make searching for PGs
                                    and rental flats straightforward and transparent.
                                </p>
                                <p>
                                    Traditional rental searches often involve scattered listings, unclear pricing, and
                                    repeated broker follow-ups. MakeMyStay brings real property photos, upfront rent
                                    details, and direct visit scheduling into one platform so renters can shortlist homes
                                    with clearer context.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. What you can expect */}
                <section className="py-12 md:py-20 bg-blush-100 border-b border-line">
                    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="pdp-type-heading text-ink mb-10">What you can expect</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10 max-w-4xl">
                            {EXPECTATIONS.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <div key={item.title} className="flex items-start gap-4">
                                        <span className="w-10 h-10 rounded-full bg-white border border-line flex items-center justify-center shrink-0 text-red mt-0.5">
                                            <Icon className="w-5 h-5" aria-hidden />
                                        </span>
                                        <div className="min-w-0">
                                            <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                                            <p className="mt-1.5 pdp-type-body text-slate">{item.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* 4. Vision & Mission (single --color-red-900 band, two columns separated by champagne divider) */}
                <section
                    aria-labelledby="about-vision-mission-heading"
                    className="py-12 md:py-20 bg-red-900 text-white border-b border-champagne/25"
                >
                    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 id="about-vision-mission-heading" className="sr-only">
                            Vision and mission
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-0">
                            <div className="md:pr-12">
                                <div className="w-11 h-11 rounded-[10px] bg-red-800/70 border border-champagne/30 flex items-center justify-center mb-5 text-white">
                                    <Target className="w-5 h-5" aria-hidden />
                                </div>
                                <h3 className="pdp-type-heading text-white mb-4">Our vision</h3>
                                <p className="pdp-type-body text-red-subtitle max-w-[48ch]">
                                    To make finding, comparing, and securing a home in Bangalore transparent and
                                    straightforward — with real property photos, upfront pricing, and direct visit
                                    scheduling.
                                </p>
                            </div>

                            <div className="pt-10 border-t border-champagne/35 md:pt-0 md:border-t-0 md:pl-12 md:border-l md:border-champagne/35">
                                <div className="w-11 h-11 rounded-[10px] bg-red-800/70 border border-champagne/30 flex items-center justify-center mb-5 text-champagne">
                                    <Compass className="w-5 h-5" aria-hidden />
                                </div>
                                <h3 className="pdp-type-heading text-white mb-4">Our mission</h3>
                                <ul className="space-y-3 text-red-subtitle text-base leading-relaxed">
                                    {MISSION_POINTS.map((point) => (
                                        <li key={point} className="flex items-start gap-3">
                                            <Check
                                                className="w-5 h-5 shrink-0 mt-1 text-champagne"
                                                aria-hidden
                                            />
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. Where we list */}
                {topLocalities.length > 0 && (
                    <section className="py-12 md:py-20 bg-white border-b border-line">
                        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="pdp-type-heading text-ink mb-3">Where we list in Bangalore</h2>
                            <p className="pdp-type-body text-slate max-w-[60ch] mb-8">
                                Explore live inventory across our busiest Bangalore neighbourhoods, ordered by
                                available listings.
                            </p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 max-w-4xl">
                                {topLocalities.map((loc) => (
                                    <li
                                        key={loc.slug}
                                        className="flex items-baseline justify-between gap-4 py-2 border-b border-line"
                                    >
                                        <Link
                                            to={`/pg/${loc.slug}`}
                                            className={`pdp-type-body font-medium text-red hover:text-red-hover hover:underline underline-offset-4 transition-colors rounded ${FOCUS_LIGHT}`}
                                        >
                                            {loc.name}
                                        </Link>
                                        <span className="pdp-type-caption text-slate tabular-nums shrink-0">
                                            {loc.count.toLocaleString('en-IN')}{' '}
                                            {loc.count === 1 ? 'listing' : 'listings'}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                )}

                {/* 6. Our founder */}
                <FounderSection bgClass="bg-blush-100" />

                {/* 7. How we verify listings */}
                <section className="w-full bg-red-800 text-white py-12 md:py-20 border-y border-champagne/25">
                    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-[66ch]">
                            <h2 className="pdp-type-heading text-white mb-4">How we verify listings</h2>
                            <p className="pdp-type-body text-red-subtitle">
                                Listings go through baseline checks for photo consistency, owner or operator
                                identity on file, and transparent pricing before going live, with last-verified
                                dates shown when verified.
                            </p>
                            <div className="mt-8">
                                <Link
                                    to="/how-we-verify"
                                    className={`min-h-[44px] px-5 py-2.5 rounded-[10px] border border-champagne/40 bg-red-900 text-white pdp-type-caption font-medium inline-flex items-center gap-2 hover:bg-red hover:border-red transition-colors ${FOCUS_DARK}`}
                                >
                                    <span>See how we verify listings</span>
                                    <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 8. Talk to us */}
                <section className="py-12 md:py-20 bg-white border-b border-line">
                    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="pdp-type-heading text-ink mb-6">Talk to us</h2>
                        <div className="space-y-4 pdp-type-body text-ink max-w-[66ch]">
                            <p className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-red shrink-0 mt-1" aria-hidden />
                                <span>
                                    <strong className="font-semibold">{LEGAL_ENTITY_NAME}</strong> — HSR Layout,
                                    Sector 7, Bengaluru, Karnataka 560102
                                </span>
                            </p>
                            <p className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-red shrink-0" aria-hidden />
                                <a
                                    href={`mailto:${BRAND_CONTACT.email}`}
                                    className={`text-red hover:text-red-hover hover:underline underline-offset-4 transition-colors rounded ${FOCUS_LIGHT}`}
                                >
                                    {BRAND_CONTACT.email}
                                </a>
                            </p>
                            <p className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-red shrink-0" aria-hidden />
                                <a
                                    href={`tel:${BRAND_CONTACT.telephone}`}
                                    className={`text-red hover:text-red-hover hover:underline underline-offset-4 transition-colors tabular-nums rounded ${FOCUS_LIGHT}`}
                                >
                                    +91 81500 99911
                                </a>
                            </p>
                            <div className="pt-2">
                                <a
                                    href={whatsappHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`min-h-[44px] px-5 py-2.5 rounded-[10px] border border-ink bg-white text-ink pdp-type-caption font-medium inline-flex items-center gap-2 hover:bg-red-800 hover:text-white hover:border-red-800 transition-colors ${FOCUS_LIGHT}`}
                                >
                                    <MessageCircle className="w-4 h-4 shrink-0" aria-hidden />
                                    <span>Chat on WhatsApp</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 9. Quiet one-line owner link */}
                <section className="py-12 md:py-16 bg-page">
                    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                        <p className="pdp-type-body text-slate">
                            Own a property?{' '}
                            <Link
                                to="/for-owners"
                                className={`font-medium text-red hover:text-red-hover hover:underline underline-offset-4 transition-colors rounded ${FOCUS_LIGHT}`}
                            >
                                List with MakeMyStay →
                            </Link>
                        </p>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
