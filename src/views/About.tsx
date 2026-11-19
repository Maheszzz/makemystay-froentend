'use client';

import Image from 'next/image';
import {
    ArrowRight,
    CalendarCheck,
    Camera,
    Check,
    CheckCircle2,
    Compass,
    IndianRupee,
    Linkedin,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Target,
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { JsonLd } from '@/components/seo/JsonLd';
import { SEOHead } from '@/components/seo/SEOHead';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { BRAND_CONTACT, FOUNDER_PROFILE } from '@/lib/brandEntity';
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
    founderPhoto?: string | null;
}

const FOCUS_RING =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2';

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
        title: 'Last-verified dates',
        description:
            'Listings are reviewed before going live, with last-verified dates displayed on verified properties.',
    },
] as const;

const MISSION_POINTS = [
    'Simplify property discovery across Bangalore',
    'Show transparent pricing before you schedule a visit',
    'Review photo consistency and operator identity before listings go live',
    'Keep tenant brokerage at zero on supported listings',
] as const;

export default function About({
    heroPhotos = [],
    topLocalities = [],
    founderPhoto = null,
}: AboutProps) {
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
        <div className="min-h-screen bg-page text-ink flex flex-col font-sans">
            <SEOHead {...helmet} />
            <JsonLd id="about-breadcrumb" data={breadcrumbLd} />
            <JsonLd id="about-schema" data={buildAboutPageSchema()} />

            <Navbar />

            <main id="main-content" className="flex-grow pt-16 sm:pt-20 bg-page">
                {/* 1. Hero (bg-page) */}
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
                                    MakeMyStay.ai is a Bangalore-first platform for PGs, coliving spaces,
                                    rental flats, resale homes, and plots — with real photos, transparent
                                    pricing, and zero brokerage for tenants on supported listings.
                                </p>
                                <div className="mt-8 flex flex-wrap items-center gap-3">
                                    <Link
                                        to="/pg"
                                        className={`min-h-[44px] px-5 py-2.5 rounded-[10px] bg-red text-white pdp-type-caption font-medium inline-flex items-center gap-2 hover:bg-red-hover transition-colors ${FOCUS_RING}`}
                                    >
                                        <span>Browse PGs</span>
                                        <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                                    </Link>
                                    <Link
                                        to="/rent"
                                        className={`min-h-[44px] px-5 py-2.5 rounded-[10px] border border-ink bg-white text-ink pdp-type-caption font-medium inline-flex items-center gap-2 hover:bg-blush-100 transition-colors ${FOCUS_RING}`}
                                    >
                                        <span>Browse flats</span>
                                    </Link>
                                </div>
                            </div>

                            {hasPhotos && (
                                <div className="lg:col-span-5">
                                    <div
                                        className={`grid gap-2.5 rounded-[14px] overflow-hidden border border-line bg-blush-100 ${
                                            visiblePhotos.length <= 2
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
                                                    className={`relative w-full overflow-hidden bg-blush-100 ${tileCls} ${FOCUS_RING}`}
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

                {/* 2. What you can expect (bg-blush-100) */}
                <section className="py-12 md:py-20 bg-blush-100 border-b border-line">
                    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="pdp-type-heading text-ink mb-10">
                            What you can expect
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10 max-w-4xl">
                            {EXPECTATIONS.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <div key={item.title} className="flex items-start gap-4">
                                        <span className="w-10 h-10 rounded-full bg-white border border-line flex items-center justify-center shrink-0 text-red mt-0.5">
                                            <Icon className="w-5 h-5" aria-hidden="true" />
                                        </span>
                                        <div className="min-w-0">
                                            <h3 className="text-lg font-semibold text-ink">
                                                {item.title}
                                            </h3>
                                            <p className="mt-1.5 pdp-type-body text-slate">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* 3. Our story (moved from homepage, bg-white, left-aligned two-column layout) */}
                <section id="story" className="py-12 md:py-20 bg-white border-b border-line">
                    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                            <div className="lg:col-span-4">
                                <h2 className="pdp-type-heading text-ink">
                                    Our story
                                </h2>
                                <p className="mt-3 pdp-type-body text-slate">
                                    Founded in 2026 in Bengaluru.
                                </p>
                            </div>
                            <div className="lg:col-span-8 space-y-5 pdp-type-body text-slate max-w-[66ch]">
                                <p>
                                    MakeMyStay was founded in <strong className="font-semibold text-ink">2026</strong> in{' '}
                                    <strong className="font-semibold text-ink">Bengaluru</strong> to replace scattered
                                    listing threads, opaque pricing, and repeated broker follow-ups with one clear
                                    property directory.
                                </p>
                                <p>
                                    Whether you are comparing PGs near an IT corridor or shortlisting a flat for rent,
                                    every listing puts upfront pricing, room options, and direct visit scheduling
                                    first — so you know what to expect before stepping onto the property.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Vision & Mission (single --color-red-900 dark band, two columns separated by thin champagne divider) */}
                <section className="py-12 md:py-20 bg-red-900 text-white border-b border-champagne/25">
                    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-0">
                            <div className="md:pr-10 lg:pr-12">
                                <div className="flex items-center gap-3 mb-4">
                                    <Compass className="w-6 h-6 text-champagne shrink-0" aria-hidden="true" />
                                    <h2 className="pdp-type-heading text-white">Our vision</h2>
                                </div>
                                <p className="text-lg font-semibold text-white mb-3">
                                    Clarity before you book a visit.
                                </p>
                                <p className="pdp-type-body text-red-subtitle max-w-[52ch]">
                                    To be Bangalore&apos;s most reliable home discovery platform — where tenants
                                    and buyers compare real photos, clear rents, and verified dates without
                                    unnecessary middlemen.
                                </p>
                            </div>

                            <div className="pt-8 border-t border-champagne/30 md:pt-0 md:border-t-0 md:border-l md:border-champagne/30 md:pl-10 lg:pl-12">
                                <div className="flex items-center gap-3 mb-4">
                                    <Target className="w-6 h-6 text-champagne shrink-0" aria-hidden="true" />
                                    <h2 className="pdp-type-heading text-white">Our mission</h2>
                                </div>
                                <p className="text-lg font-semibold text-white mb-4">
                                    Simplify. Empower. Deliver.
                                </p>
                                <ul className="space-y-3 text-red-subtitle">
                                    {MISSION_POINTS.map((point) => (
                                        <li key={point} className="flex items-start gap-2.5 text-sm md:text-base leading-relaxed">
                                            <Check className="w-4 h-4 text-champagne shrink-0 mt-1" aria-hidden="true" />
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. Founder (bg-page; photo/quote/LinkedIn shown only when supplied) */}
                <section id="founder" className="py-12 md:py-20 bg-page border-b border-line">
                    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                            <div className="lg:col-span-4">
                                <h2 className="pdp-type-heading text-ink">
                                    Founder
                                </h2>
                            </div>
                            <div className="lg:col-span-8">
                                <div className={founderPhoto ? 'flex flex-col sm:flex-row items-start gap-6' : 'max-w-[62ch]'}>
                                    {founderPhoto && (
                                        <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 overflow-hidden rounded-[14px] border border-line bg-blush-100">
                                            <Image
                                                src={founderPhoto}
                                                alt={FOUNDER_PROFILE.name}
                                                fill
                                                sizes="128px"
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <h3 className="text-xl font-bold text-ink">{FOUNDER_PROFILE.name}</h3>
                                        <p className="mt-0.5 text-sm font-semibold text-red">{FOUNDER_PROFILE.role}</p>
                                        <p className="mt-4 pdp-type-body text-slate">{FOUNDER_PROFILE.bio}</p>
                                        {FOUNDER_PROFILE.quote && (
                                            <blockquote className="mt-5 pl-4 border-l-2 border-red text-ink text-base leading-relaxed">
                                                &ldquo;{FOUNDER_PROFILE.quote}&rdquo;
                                            </blockquote>
                                        )}
                                        {FOUNDER_PROFILE.linkedinUrl && (
                                            <div className="mt-5">
                                                <a
                                                    href={FOUNDER_PROFILE.linkedinUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`inline-flex items-center gap-2 min-h-[44px] text-sm font-semibold text-red hover:text-red-hover hover:underline underline-offset-4 rounded ${FOCUS_RING}`}
                                                >
                                                    <Linkedin className="w-4 h-4 shrink-0" aria-hidden="true" />
                                                    <span>LinkedIn profile</span>
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 6. How we verify listings (bg-blush-100) */}
                <section className="py-12 md:py-20 bg-blush-100 border-b border-line">
                    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-[66ch]">
                            <h2 className="pdp-type-heading text-ink">
                                How we verify listings
                            </h2>
                            <p className="mt-4 pdp-type-body text-slate">
                                Listings go through baseline checks for photo consistency, owner or operator
                                identity on file, and transparent pricing before going live, with last-verified
                                dates displayed on verified properties.
                            </p>
                            <div className="mt-8">
                                <Link
                                    to="/how-we-verify"
                                    className={`min-h-[44px] px-5 py-2.5 rounded-[10px] border border-red bg-white text-red hover:bg-red hover:text-white pdp-type-caption font-medium inline-flex items-center gap-2 transition-colors ${FOCUS_RING}`}
                                >
                                    <span>See how we verify listings</span>
                                    <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 7. Where we list in Bangalore (bg-white) */}
                {topLocalities.length > 0 && (
                    <section className="py-12 md:py-20 bg-white border-b border-line">
                        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="pdp-type-heading text-ink mb-3">
                                Where we list in Bangalore
                            </h2>
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
                                            className={`pdp-type-body font-medium text-red hover:text-red-hover hover:underline underline-offset-4 transition-colors rounded ${FOCUS_RING}`}
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

                {/* 8. Talk to us + Owner link (bg-blush-100) */}
                <section className="py-12 md:py-20 bg-blush-100">
                    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="pdp-type-heading text-ink mb-6">
                            Talk to us
                        </h2>
                        <div className="space-y-4 pdp-type-body text-ink max-w-[66ch]">
                            <p className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-red shrink-0 mt-1" aria-hidden="true" />
                                <span>
                                    <strong className="font-semibold">{LEGAL_ENTITY_NAME}</strong> — HSR Layout,
                                    Sector 7, Bengaluru, Karnataka 560102
                                </span>
                            </p>
                            <p className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-red shrink-0" aria-hidden="true" />
                                <a
                                    href={`mailto:${BRAND_CONTACT.email}`}
                                    className={`text-red hover:text-red-hover hover:underline underline-offset-4 transition-colors rounded ${FOCUS_RING}`}
                                >
                                    {BRAND_CONTACT.email}
                                </a>
                            </p>
                            <p className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-red shrink-0" aria-hidden="true" />
                                <a
                                    href={`tel:${BRAND_CONTACT.telephone}`}
                                    className={`text-red hover:text-red-hover hover:underline underline-offset-4 transition-colors tabular-nums rounded ${FOCUS_RING}`}
                                >
                                    +91 81500 99911
                                </a>
                            </p>
                            <div className="pt-2">
                                <a
                                    href={whatsappHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`min-h-[44px] px-5 py-2.5 rounded-[10px] border border-ink bg-white text-ink pdp-type-caption font-medium inline-flex items-center gap-2 hover:bg-red-800 hover:text-white hover:border-red-800 transition-colors ${FOCUS_RING}`}
                                >
                                    <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                                    <span>Chat on WhatsApp</span>
                                </a>
                            </div>
                        </div>

                        <p className="mt-10 pt-8 border-t border-line pdp-type-body text-slate">
                            Own a property?{' '}
                            <Link
                                to="/for-owners"
                                className={`font-medium text-red hover:text-red-hover hover:underline underline-offset-4 transition-colors rounded ${FOCUS_RING}`}
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
