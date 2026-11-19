'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ArrowRight, CalendarCheck, Check, KeyRound, MessageCircle, Search } from 'lucide-react';
import { LISTING_HERO_PHOTO } from '@/components/modules/listings/ListingHero';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import type { HomeInventorySummary } from '@/lib/homeInventoryStats';
import { Link } from '@/lib/navigation';
import { getWhatsappDigits } from '@/lib/whatsapp';

interface AboutProps {
    homeStats?: HomeInventorySummary | null;
}

const FOCUS_RING =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2';

const HOW_IT_WORKS_STEPS = [
    {
        step: 1,
        icon: Search,
        title: 'Search and filter',
        description: 'Filter Bangalore PGs and flats by area, budget, gender, meals, or BHK.',
    },
    {
        step: 2,
        icon: CalendarCheck,
        title: 'Book a visit',
        description: 'Pick a visit date and time on any listing page or message us on WhatsApp.',
    },
    {
        step: 3,
        icon: KeyRound,
        title: 'Reserve your room',
        description: 'Lock in your stay with a booking token online where token booking is enabled.',
    },
] as const;

const PROMISES = [
    'Zero brokerage for tenants on supported listings',
    'Real property photos',
    'Baseline checks before going live',
    'Direct visit scheduling & WhatsApp support',
] as const;

export function About({ homeStats }: AboutProps) {
    const [ctaPhotoFailed, setCtaPhotoFailed] = useState(false);

    const mosaicPhotos = homeStats?.mosaicPhotos?.slice(0, 4) ?? [];
    const showMosaic = mosaicPhotos.length >= 4;

    const liveMetrics = [
        homeStats?.totalListings != null && homeStats.totalListings > 0
            ? { value: homeStats.totalListings.toLocaleString('en-IN'), label: 'Active listings' }
            : null,
        homeStats?.pgCount != null && homeStats.pgCount > 0
            ? { value: homeStats.pgCount.toLocaleString('en-IN'), label: 'PGs & coliving' }
            : null,
        homeStats?.rentCount != null && homeStats.rentCount > 0
            ? { value: homeStats.rentCount.toLocaleString('en-IN'), label: 'Flats for rent' }
            : null,
        homeStats?.areaCount != null && homeStats.areaCount > 0
            ? { value: homeStats.areaCount.toLocaleString('en-IN'), label: 'Areas in Bangalore' }
            : null,
    ].filter((m): m is { value: string; label: string } => m !== null);

    const whatsappHref = `https://wa.me/${getWhatsappDigits()}?text=${encodeURIComponent(
        'Hi MakeMyStay team, I would like help finding a stay in Bangalore.',
    )}`;

    return (
        <>
            {/* 1. Intro Teaser + 2x2 Real Listing Mosaic + Live Numbers Row (blush-100) */}
            <section id="about-us" className="py-12 md:py-20 bg-blush-100 border-t border-line">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div
                        className={`grid grid-cols-1 gap-10 lg:gap-12 items-center ${
                            showMosaic ? 'lg:grid-cols-12' : ''
                        }`}
                    >
                        <div className={showMosaic ? 'lg:col-span-6 min-w-0' : 'max-w-[62ch]'}>
                            <h2 className="font-heading font-bold text-ink text-3xl md:text-[40px] leading-[1.15] tracking-[-0.015em]">
                                Verified PGs and flats across Bangalore
                            </h2>
                            <p className="mt-4 text-base md:text-[17px] leading-relaxed text-slate max-w-[56ch]">
                                MakeMyStay.ai brings together PGs, coliving spaces, rental flats, homes to buy, and
                                plots across Bangalore in one place. Browse real property photos, upfront pricing, and
                                direct visit scheduling with zero brokerage for tenants on supported listings.
                            </p>
                            <div className="mt-6">
                                <Link
                                    to="/about"
                                    className={`inline-flex items-center gap-2 min-h-[44px] text-sm font-semibold text-red hover:text-red-hover hover:underline underline-offset-4 rounded ${FOCUS_RING}`}
                                >
                                    <span>Read our story</span>
                                    <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                                </Link>
                            </div>
                        </div>

                        {showMosaic && (
                            <div className="lg:col-span-6">
                                <div className="grid grid-cols-2 gap-3">
                                    {mosaicPhotos.map((photo) => (
                                        <Link
                                            key={photo.url}
                                            to={photo.href}
                                            aria-label={photo.alt}
                                            className={`group relative aspect-[4/3] overflow-hidden rounded-[14px] bg-white ${FOCUS_RING}`}
                                        >
                                            <OptimizedImage
                                                src={photo.url}
                                                alt={photo.alt}
                                                fill
                                                priority={false}
                                                size="medium"
                                                sizes="(max-width: 768px) 45vw, 270px"
                                                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                            />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {liveMetrics.length > 0 && (
                        <dl className="mt-10 md:mt-12 pt-8 border-t border-line grid grid-cols-2 sm:grid-cols-4 gap-6">
                            {liveMetrics.map((metric) => (
                                <div key={metric.label}>
                                    <dt className="text-sm font-medium text-slate">{metric.label}</dt>
                                    <dd className="mt-1 font-heading text-3xl md:text-4xl font-bold text-red tabular-nums">
                                        {metric.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    )}
                </div>
            </section>

            {/* 2. How It Works + Single Promise Row (white) */}
            <section className="py-12 md:py-20 bg-white border-t border-line">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-[56ch]">
                        <h2 className="font-heading font-bold text-ink text-3xl md:text-[40px] leading-[1.15] tracking-[-0.015em]">
                            How MakeMyStay works
                        </h2>
                        <p className="mt-3 text-base md:text-[17px] text-slate leading-relaxed">
                            Three straightforward steps from shortlisting a home to scheduling your visit.
                        </p>
                    </div>

                    <div className="relative mt-10 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                        <div
                            aria-hidden="true"
                            className="hidden md:block absolute top-6 left-[24px] w-[calc(66.666%+12px)] h-px bg-line"
                        />
                        {HOW_IT_WORKS_STEPS.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.step} className="relative flex flex-col items-start">
                                    <div className="relative z-10 w-12 h-12 rounded-full bg-blush-100 text-red flex items-center justify-center">
                                        <Icon className="w-5 h-5" aria-hidden="true" />
                                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red text-white text-[11px] font-bold flex items-center justify-center tabular-nums">
                                            {item.step}
                                        </span>
                                    </div>
                                    <h3 className="mt-5 font-heading text-lg font-bold text-ink">
                                        {item.title}
                                    </h3>
                                    <p className="mt-2 text-sm md:text-[15px] text-slate leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    <ul className="mt-10 md:mt-12 pt-8 border-t border-line flex flex-wrap items-center gap-x-8 gap-y-3">
                        {PROMISES.map((promise) => (
                            <li
                                key={promise}
                                className="inline-flex items-center gap-2 text-sm font-medium text-ink"
                            >
                                <Check className="w-4 h-4 text-red shrink-0" aria-hidden="true" />
                                <span>{promise}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* 3. CTA Band (--gradient-brand + 10% logo line pattern + right skyline photo) */}
            <section className="relative isolate overflow-hidden bg-brand-band min-h-[280px] md:min-h-[340px] flex items-center">
                {!ctaPhotoFailed && (
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-[280px] md:h-full -z-20 overflow-hidden">
                        <Image
                            src={LISTING_HERO_PHOTO}
                            alt=""
                            fill
                            priority={false}
                            sizes="(max-width: 767px) 100vw, 1600px"
                            quality={75}
                            onError={() => setCtaPhotoFailed(true)}
                            className="object-cover object-right"
                        />
                    </div>
                )}
                <div aria-hidden="true" className="listing-hero-overlay absolute inset-0 -z-10" />
                <div aria-hidden="true" className="bg-logo-line-pattern pointer-events-none absolute inset-0 -z-[5]" />

                <div className="relative w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <div className="max-w-[560px]">
                        <h2 className="font-heading font-bold text-3xl md:text-[40px] leading-[1.15] tracking-[-0.015em] text-white">
                            Ready to find your next home?
                        </h2>
                        <p className="mt-3 text-base md:text-[17px] leading-relaxed text-white/90">
                            Browse verified PGs, rental flats, homes to buy, and plots across Bangalore with
                            transparent pricing.
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            <Link
                                to="/properties"
                                className="min-h-[44px] px-6 py-2.5 rounded-[10px] bg-white text-red hover:bg-blush-100 text-sm font-semibold inline-flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-hero-deep"
                            >
                                <span>Explore properties</span>
                                <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                            </Link>
                            <a
                                href={whatsappHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="min-h-[44px] px-6 py-2.5 rounded-[10px] border border-white/85 text-white hover:bg-white/15 text-sm font-semibold inline-flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-hero-deep"
                            >
                                <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                                <span>Chat on WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
