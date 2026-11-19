import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/lib/navigation';
import type { CityInventoryCounts } from '@/views/Home';

interface CityData {
    key: keyof CityInventoryCounts;
    name: string;
    image: string;
    areas: string[];
    href: string;
    accentColor: string;
}

const CITY_CONFIG: CityData[] = [
    {
        key: 'bangalore',
        name: 'Bengaluru',
        image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&q=85&auto=format&fit=crop',
        areas: ['Whitefield', 'Koramangala', 'HSR Layout'],
        href: '/properties/in/bangalore',
        accentColor: '#C5A021',
    },
    {
        key: 'hyderabad',
        name: 'Hyderabad',
        image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=85&auto=format&fit=crop',
        areas: ['HITEC City', 'Gachibowli', 'Kondapur'],
        href: '/properties/in/hyderabad',
        accentColor: '#60a5fa',
    },
    {
        key: 'pune',
        name: 'Pune',
        image: 'https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=600&q=85&auto=format&fit=crop',
        areas: ['Hinjewadi', 'Kharadi', 'Baner'],
        href: '/properties/in/pune',
        accentColor: '#4ade80',
    },
];

interface PresentInCitiesProps {
    hideSectionLabel?: boolean;
    cityCounts?: CityInventoryCounts;
}

export function PresentInCities({ hideSectionLabel = false, cityCounts }: PresentInCitiesProps) {
    return (
        <div id="present-in" className="w-full">
            {/* Section heading */}
            {!hideSectionLabel && (
                <div className="flex items-center justify-between mb-5 md:mb-6">
                    <div>
                        <p
                            className="text-[10px] font-bold tracking-[0.22em] uppercase mb-1.5 text-slate-500"
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                            Where we operate
                        </p>
                        <h2
                            className="text-xl sm:text-2xl font-black text-slate-900 leading-tight tracking-tight"
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                            Present in
                        </h2>
                    </div>
                </div>
            )}

            {/* City cards — responsive grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                {CITY_CONFIG.map((city) => {
                    const liveCount = cityCounts?.[city.key] ?? 0;
                    const isActive =
                        city.key === 'bangalore' ? true : liveCount > 0;
                    const countText = isActive
                        ? liveCount > 0
                            ? liveCount.toLocaleString('en-IN')
                            : 'Live'
                        : 'Coming soon';
                    const countLabel = isActive
                        ? liveCount > 0
                            ? 'live listings'
                            : 'listings available'
                        : 'expanding soon';

                    return (
                        <div
                            key={city.name}
                            className="flex flex-col bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full relative group"
                        >
                            {isActive ? (
                                <Link
                                    to={city.href}
                                    className="absolute inset-0 z-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60 rounded-2xl"
                                    aria-label={`Explore all listings in ${city.name}`}
                                />
                            ) : (
                                <div className="absolute inset-0 z-0" aria-label={`${city.name} — coming soon`} />
                            )}

                            <div className="w-full aspect-[16/10] bg-slate-100 overflow-hidden relative pointer-events-none z-0">
                                <OptimizedImage
                                    src={city.image}
                                    alt={`${city.name} properties`}
                                    fill
                                    size="medium"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    style={{ filter: isActive ? 'none' : 'saturate(0.4) brightness(0.9)' }}
                                />
                            </div>

                            <div className="flex flex-col flex-1 p-4 relative z-10 pointer-events-none">
                                <h3
                                    className="text-lg font-bold text-slate-900 mb-2.5"
                                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                                >
                                    {city.name}
                                </h3>

                                {/* Area Tags */}
                                <div className="flex flex-wrap gap-1.5 mb-4 pointer-events-auto">
                                    {city.areas.map((area) => {
                                        if (isActive) {
                                            return (
                                                <Link
                                                    key={area}
                                                    to={`${city.href}?q=${encodeURIComponent(area)}`}
                                                    className="px-2.5 py-1 text-[10px] font-semibold bg-slate-100 text-slate-600 rounded-md hover:bg-brand-red hover:text-white transition-colors z-20 relative shadow-sm"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {area}
                                                </Link>
                                            );
                                        }
                                        return (
                                            <span
                                                key={area}
                                                className="px-2.5 py-1 text-[10px] font-semibold bg-slate-50 text-slate-400 rounded-md shadow-sm"
                                            >
                                                {area}
                                            </span>
                                        );
                                    })}
                                </div>

                                <div className="mt-auto pt-3 border-t border-slate-100 flex items-end justify-between gap-2">
                                    <div className="flex flex-col">
                                        <span
                                            className="font-bold text-sm sm:text-base leading-none mb-1"
                                            style={{ color: isActive ? '#10b981' : '#d97706' }}
                                        >
                                            {countText}
                                        </span>
                                        <span className="text-[10px] sm:text-xs text-slate-500 whitespace-nowrap">
                                            {countLabel}
                                        </span>
                                    </div>
                                    <div
                                        className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold tracking-wide uppercase shrink-0 pb-[1px]"
                                        style={{ color: isActive ? '#0f172a' : '#d97706' }}
                                    >
                                        <span>{isActive ? 'Explore' : 'Soon'}</span>
                                        {isActive && <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
