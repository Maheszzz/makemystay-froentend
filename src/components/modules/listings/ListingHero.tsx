'use client';

import Image from 'next/image';
import { useState, type ReactNode } from 'react';
import { Fragment } from 'react';
import { CalendarCheck, ChevronRight, Home, ShieldCheck, Tag } from 'lucide-react';
import { Link } from '@/lib/navigation';

export type HeroClaimKey = 'verified' | 'brokerage' | 'visit';

/** The only claims the listing hero may show. Each is hidden when it does not apply. */
const HERO_CLAIMS: Record<HeroClaimKey, { text: string; Icon: typeof ShieldCheck }> = {
    verified: { text: 'Last-verified date on every card', Icon: ShieldCheck },
    brokerage: { text: 'Zero brokerage on supported listings', Icon: Tag },
    visit: { text: 'Book a visit in minutes', Icon: CalendarCheck },
};

export interface HeroBreadcrumb {
    name: string;
    path?: string;
}

export interface ListingHeroProps {
    breadcrumbs: HeroBreadcrumb[];
    title: string;
    subtitle?: string;
    /** Live result count; the pill is hidden while null/undefined. */
    count?: number | null;
    claims: HeroClaimKey[];
    /** Optional extra block under the claims (e.g. hub link). */
    extra?: ReactNode;
}

/**
 * Licensed hero photo (Wikimedia Commons, CC BY-SA 4.0, by SlowPhoton) hosted locally.
 * Source, licence and the crop applied are documented in public/images/hero/CREDITS.md.
 * If the file is missing or fails to load, the section falls back cleanly to --gradient-brand.
 */
export const LISTING_HERO_PHOTO = '/images/hero/bangalore-skyline.webp';

export function ListingHero({ breadcrumbs, title, subtitle, count, claims, extra }: ListingHeroProps) {
    const [photoFailed, setPhotoFailed] = useState(false);

    return (
        <header className="relative isolate overflow-hidden bg-brand-band min-h-[280px] md:min-h-[360px]">
            {!photoFailed && (
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[280px] md:h-full -z-20 overflow-hidden">
                    <Image
                        src={LISTING_HERO_PHOTO}
                        alt=""
                        fill
                        priority
                        sizes="(max-width: 767px) 100vw, 1600px"
                        quality={75}
                        onError={() => setPhotoFailed(true)}
                        className="object-cover object-right"
                    />
                </div>
            )}
            <div aria-hidden="true" className="listing-hero-overlay absolute inset-0 -z-10" />

            {!photoFailed && (
                <a
                    href="https://commons.wikimedia.org/wiki/File:Skyline_of_Varthur,_Bangalore.jpg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-3 top-3 z-10 hidden md:inline-flex items-center rounded bg-red-900/90 px-2 py-0.5 text-[11px] font-medium text-white hover:bg-red-900 focus-visible:outline-2 focus-visible:outline-white"
                >
                    Photo: SlowPhoton, CC BY-SA 4.0
                </a>
            )}

            <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-5 md:pt-8 pb-[78px] md:pb-[96px]">
                <nav aria-label="Breadcrumb">
                    <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] text-white">
                        {breadcrumbs.map((crumb, i) => {
                            const isLast = i === breadcrumbs.length - 1;
                            return (
                                <Fragment key={`${crumb.name}-${i}`}>
                                    {i > 0 && (
                                        <li aria-hidden="true" className="flex items-center">
                                            <ChevronRight className="w-3.5 h-3.5 opacity-85" />
                                        </li>
                                    )}
                                    <li className="flex items-center gap-1.5">
                                        {i === 0 && <Home className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
                                        {!isLast && crumb.path ? (
                                            <Link
                                                to={crumb.path}
                                                className="inline-flex items-center min-h-[24px] hover:underline underline-offset-2 rounded focus-visible:outline-2 focus-visible:outline-white"
                                            >
                                                {crumb.name}
                                            </Link>
                                        ) : (
                                            <span aria-current={isLast ? 'page' : undefined} className={isLast ? 'font-medium' : undefined}>
                                                {crumb.name}
                                            </span>
                                        )}
                                    </li>
                                </Fragment>
                            );
                        })}
                    </ol>
                </nav>

                <div className="mt-3 md:mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <h1 className="type-h1 text-white">{title}</h1>
                    {typeof count === 'number' && (
                        <span className="inline-flex items-center rounded-full bg-white px-3.5 py-1 text-sm font-semibold text-red tabular-nums">
                            {count.toLocaleString('en-IN')} {count === 1 ? 'listing' : 'listings'}
                        </span>
                    )}
                </div>

                <div aria-hidden="true" className="mt-3 h-[3px] w-14 rounded-full bg-blush-100" />

                {subtitle && (
                    <p className="mt-2.5 md:mt-3 max-w-[34rem] text-[14px] md:text-base leading-relaxed text-white line-clamp-2 md:line-clamp-none">
                        {subtitle}
                    </p>
                )}

                {claims.length > 0 && (
                    <ul className="mt-3.5 md:mt-4 flex flex-wrap items-center gap-x-6 gap-y-1.5 text-[13px] md:text-sm font-medium text-white">
                        {claims.map((key) => {
                            const { text, Icon } = HERO_CLAIMS[key];
                            return (
                                <li key={key} className="inline-flex items-center gap-2">
                                    <Icon className="w-[18px] h-[18px] shrink-0" aria-hidden="true" />
                                    <span>{text}</span>
                                </li>
                            );
                        })}
                    </ul>
                )}

                {extra && <div className="mt-3">{extra}</div>}
            </div>
        </header>
    );
}
