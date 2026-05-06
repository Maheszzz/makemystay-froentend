import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CityData {
    name: string;
    image: string;
    areas: string[];
    count: string;
    countLabel: string;
    href?: string;
    status: 'active' | 'soon';
    accentColor: string;
}

const cities: CityData[] = [
    {
        name: 'Bengaluru',
        image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&q=85&auto=format&fit=crop',
        areas: ['Whitefield', 'Koramangala', 'HSR Layout'],
        count: '1,200+',
        countLabel: 'verified listings',
        href: '/pg/bangalore',
        status: 'active',
        accentColor: '#C5A021',
    },
    {
        name: 'Hyderabad',
        image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=85&auto=format&fit=crop',
        areas: ['HITEC City', 'Gachibowli', 'Kondapur'],
        count: 'Coming Soon',
        countLabel: 'open now',
        status: 'soon',
        accentColor: '#60a5fa',
    },
    {
        name: 'Pune',
        image: 'https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=600&q=85&auto=format&fit=crop',
        areas: ['Hinjewadi', 'Kharadi', 'Baner'],
        count: 'Coming Soon',
        countLabel: 'open now',
        status: 'soon',
        accentColor: '#4ade80',
    },
];

interface PresentInCitiesProps {
    hideSectionLabel?: boolean;
}

export function PresentInCities({ hideSectionLabel = false }: PresentInCitiesProps) {
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
                {cities.map((city) => {
                    const isActive = city.status === 'active';

                    const CardContent = (
                        <div className="flex flex-col bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full">
                            <div className="w-full aspect-[16/10] bg-slate-100 overflow-hidden">
                                <img
                                    src={city.image}
                                    alt={`${city.name} properties`}
                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                                    loading="lazy"
                                    style={{ filter: isActive ? 'none' : 'saturate(0.4) brightness(0.9)' }}
                                />
                            </div>

                            <div className="flex flex-col flex-1 p-4">
                                <h3
                                    className="text-lg font-bold text-slate-900 mb-1.5"
                                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                                >
                                    {city.name}
                                </h3>
                                <div className="flex items-start gap-1 mb-4">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                                    <span className="text-xs text-slate-500 leading-snug">
                                        {city.areas.join(' · ')}
                                    </span>
                                </div>

                                <div className="mt-auto pt-3 border-t border-slate-100 flex items-end justify-between gap-2">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm sm:text-base leading-none mb-1" style={{ color: isActive ? '#10b981' : '#f59e0b' }}>
                                            {city.count}
                                        </span>
                                        <span className="text-[10px] sm:text-xs text-slate-500 whitespace-nowrap">{city.countLabel}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold tracking-wide uppercase shrink-0 pb-[1px]" style={{ color: isActive ? '#0f172a' : '#f59e0b' }}>
                                        <span>{isActive ? 'Explore' : 'Join'}</span>
                                        <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );

                    if (isActive && city.href) {
                        return (
                            <Link
                                key={city.name}
                                to={city.href}
                                className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60 rounded-2xl group"
                                aria-label={`Explore PG listings in ${city.name}`}
                            >
                                {CardContent}
                            </Link>
                        );
                    }

                    return (
                        <div
                            key={city.name}
                            className="block cursor-pointer group"
                            role="button"
                            aria-label={`${city.name} — coming soon`}
                        >
                            {CardContent}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
