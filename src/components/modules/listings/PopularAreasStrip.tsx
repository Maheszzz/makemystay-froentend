'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { Link } from '@/lib/navigation';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import type { ListingCategoryKey } from '@/lib/listingPageUtils';

export interface PopularAreaItem {
    name: string;
    count: number;
    href: string;
    coverImage?: string;
    active?: boolean;
}

interface PopularAreasStripProps {
    cityLabel: string;
    category: ListingCategoryKey;
    areas: PopularAreaItem[];
    viewAllHref: string;
}

function areaCountLabel(count: number, category: ListingCategoryKey): string {
    const n = count.toLocaleString('en-IN');
    const singular = count === 1;
    switch (category) {
        case 'pg':
            return `${n} ${singular ? 'PG' : 'PGs'}`;
        case 'rent':
            return `${n} ${singular ? 'Flat' : 'Flats'}`;
        case 'buy':
            return `${n} ${singular ? 'Home' : 'Homes'}`;
        case 'plot':
            return `${n} ${singular ? 'Plot' : 'Plots'}`;
        case 'all':
        default:
            return `${n} ${singular ? 'Listing' : 'Listings'}`;
    }
}

function AreaThumb({ coverImage }: { coverImage?: string }) {
    const [failed, setFailed] = useState(false);

    if (!coverImage || failed) {
        return (
            <span
                aria-hidden="true"
                className="w-12 h-12 rounded-[10px] bg-blush-100 shrink-0 flex items-center justify-center"
            >
                <MapPin className="w-5 h-5 text-red" />
            </span>
        );
    }

    return (
        <span className="w-12 h-12 rounded-[10px] bg-blush-100 overflow-hidden shrink-0 relative">
            <OptimizedImage
                src={coverImage}
                alt=""
                ariaHidden
                width={48}
                height={48}
                size="thumbnail"
                className="w-12 h-12 object-cover"
                onError={() => setFailed(true)}
            />
        </span>
    );
}

export function PopularAreasStrip({ cityLabel, category, areas, viewAllHref }: PopularAreasStripProps) {
    const visibleAreas = areas.filter((a) => a.count > 0);
    const scrollerRef = useRef<HTMLDivElement | null>(null);
    const [canLeft, setCanLeft] = useState(false);
    const [canRight, setCanRight] = useState(false);

    const syncButtons = useCallback(() => {
        const el = scrollerRef.current;
        if (!el) return;
        setCanLeft(el.scrollLeft > 4);
        setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    }, []);

    useEffect(() => {
        syncButtons();
        window.addEventListener('resize', syncButtons);
        return () => window.removeEventListener('resize', syncButtons);
    }, [syncButtons, visibleAreas.length]);

    const scrollByStep = (direction: -1 | 1) => {
        const el = scrollerRef.current;
        if (!el) return;
        el.scrollBy({ left: direction * 460, behavior: 'smooth' });
    };

    if (visibleAreas.length === 0) return null;

    return (
        <section aria-labelledby="popular-areas-heading" className="mb-8">
            <div className="flex items-center justify-between gap-4 mb-3.5">
                <h2
                    id="popular-areas-heading"
                    className="font-heading text-lg sm:text-[20px] font-bold text-ink flex items-center gap-2.5"
                >
                    <span aria-hidden="true" className="w-1 h-5 rounded-full bg-red shrink-0" />
                    <span>Popular Areas in {cityLabel}</span>
                </h2>

                <Link
                    to={viewAllHref}
                    className="inline-flex items-center gap-1.5 min-h-[44px] px-1 text-sm font-semibold text-red hover:text-red-hover hover:underline underline-offset-4 whitespace-nowrap rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2"
                >
                    <span>View all areas</span>
                    <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </Link>
            </div>

            <div className="relative">
                {canLeft && (
                    <button
                        type="button"
                        aria-label="Scroll popular areas left"
                        onClick={() => scrollByStep(-1)}
                        className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-11 h-11 rounded-full bg-white border border-line shadow-sm items-center justify-center text-ink hover:border-red hover:text-red transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2"
                    >
                        <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                    </button>
                )}

                <nav
                    ref={scrollerRef}
                    aria-label="Popular areas"
                    onScroll={syncButtons}
                    className="flex items-stretch gap-3 overflow-x-auto no-scrollbar scroll-smooth py-1 pr-12"
                >
                    {visibleAreas.map((area) => (
                        <Link
                            key={`${area.name}-${area.href}`}
                            to={area.href}
                            aria-current={area.active ? 'page' : undefined}
                            className={`w-[220px] shrink-0 rounded-[12px] border bg-white p-2.5 flex items-center gap-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 ${
                                area.active
                                    ? 'border-red bg-blush-100/40'
                                    : 'border-line hover:border-red/45'
                            }`}
                        >
                            <AreaThumb coverImage={area.coverImage} />
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-ink truncate leading-snug">{area.name}</p>
                                <p className="text-xs text-slate tabular-nums mt-0.5">
                                    {areaCountLabel(area.count, category)}
                                </p>
                            </div>
                        </Link>
                    ))}
                </nav>

                {canRight && (
                    <button
                        type="button"
                        aria-label="Scroll popular areas right"
                        onClick={() => scrollByStep(1)}
                        className="flex absolute right-0 top-1/2 -translate-y-1/2 sm:translate-x-2 z-10 w-11 h-11 rounded-full bg-white border border-line shadow-sm items-center justify-center text-ink hover:border-red hover:text-red transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2"
                    >
                        <ChevronRight className="w-5 h-5" aria-hidden="true" />
                    </button>
                )}
            </div>
        </section>
    );
}
