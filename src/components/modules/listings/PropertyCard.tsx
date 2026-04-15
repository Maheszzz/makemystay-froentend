import {
    Bath,
    Bed,
    Heart,
    MapPin,
    MessageCircle,
    Star,
    TrendingUp,
    Users,
    Utensils,
} from 'lucide-react';
import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useWishlist } from '@/context/WishlistContext';
import { amenityIconMap } from '@/lib/amenityIcons';
import { formatPropertyTitle, reviewsLabel } from '@/lib/formatPropertyTitle';
import { getPropertyDetailPath } from '@/lib/propertyRouting';
import type { Property } from '@/types/api';

interface PropertyCardProps {
    property: Property;
}

function getFallbackImageForType(type?: string): string {
    const t = (type || '').toLowerCase();
    if (t === 'pg' || t === 'hostel') {
        return 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80';
    }
    if (t === 'plot') {
        return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80';
    }
    if (t.includes('villa') || t.includes('4bhk') || t.includes('3bhk')) {
        return 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80';
    }
    return 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80';
}

export function PropertyCard({ property }: PropertyCardProps) {
    const location = useLocation();
    const { isWishlisted, toggleWishlist } = useWishlist();
    const wishlisted = isWishlisted(String(property.id));

    const handleHeartClick = (e: React.MouseEvent) => {
        e.preventDefault();
        toggleWishlist(property);
    };

    const fallbackImage = useMemo(() => getFallbackImageForType(property.type), [property.type]);

    // Explicit requested dynamic resolver (never .map on non-arrays: API may send a string URL or odd shapes)
    const getImage = (prop: any) => {
        const imgs = Array.isArray(prop.images) ? prop.images : [];
        const parsedImages =
            imgs.length > 0
                ? imgs.map((img: any) => (typeof img === 'string' ? img : img?.image_url)).filter(Boolean)
                : [];

        const ph = Array.isArray(prop.photos) ? prop.photos : [];
        const parsedPhotos =
            ph.length > 0
                ? ph.map((img: any) => (typeof img === 'string' ? img : img?.image_url)).filter(Boolean)
                : [];

        return (
            parsedImages[0] || // RENT
            prop.image || // PG fallback
            parsedPhotos[0] || // Secondary backend fallback
            fallbackImage || // Unsplash generated context fallback
            '/default-property.jpg' // Final explicit
        );
    };

    const displayImage = getImage(property);
    const isServiceOriented = property.type === 'PG' || property.type === 'Hostel';
    const isPlot = property.type === 'Plot' || property.type?.toLowerCase() === 'plot';

    // Build amenity pills
    const amenities: string[] = [];
    if (property.wifi) amenities.push('WiFi');
    if (property.power_backup) amenities.push('Backup');
    if (isServiceOriented) {
        if (property.housekeeping) amenities.push('Service');
        if (property.lounge) amenities.push('Lounge');
    } else {
        if (property.modern_kitchen) amenities.push('Kitchen');
        if (property.balcony) amenities.push('Balcony');
        if (property.attached_bathroom) amenities.push('Att. Bath');
    }
    if (property.gym) amenities.push('Gym');
    if (property.pool) amenities.push('Pool');
    if (property.lounge && !isServiceOriented) amenities.push('Lounge');
    if (property.cctv) amenities.push('Security');
    if (property.geyser) amenities.push('Geyser');
    if (isPlot && Array.isArray(property.features) && property.features.length > 0) {
        amenities.push(...property.features);
    }

    const propertyPath = getPropertyDetailPath(property);

    // Deterministic social proof & scarcity (vary by id)
    const idx = (Number(property.id) || 0) % 3;
    const scarcityLabels = ['Limited Availability', 'High Demand', 'Most Viewed'];
    const scarcityLabel = scarcityLabels[idx];
    const roomsLeft = [2, 3, 1];
    const rooms = roomsLeft[idx];

    const displayTitle = useMemo(() => formatPropertyTitle(property.title), [property.title]);
    const waLink = `https://wa.me/918150099911?text=${encodeURIComponent(`Hi! I'm interested in ${displayTitle} at ${property.location}. Please share more details.`)}`;

    const from = `${location.pathname}${location.search}${location.hash}`;

    return (
        <Link to={propertyPath} state={{ from }} className="block h-full group outline-none focus-visible:ring-2 focus-visible:ring-brand-red/30 focus-visible:ring-offset-2 rounded-2xl">
            <div className="bg-white rounded-2xl overflow-hidden transition-all duration-300 border border-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,0.06)] hover:shadow-[0_12px_40px_-12px_rgba(15,23,42,0.14)] hover:border-slate-300/90 hover:-translate-y-0.5 h-full flex flex-col">
                {/* Image: object-cover for editorial framing; switch to object-contain if uncropped photos are required */}
                <div className="relative w-full h-[220px] sm:h-[240px] shrink-0 overflow-hidden bg-slate-100 rounded-t-2xl ring-1 ring-inset ring-black/[0.04]">
                    {displayImage ? (
                        <img
                            src={displayImage}
                            alt={`${displayTitle}${property.location ? ` in ${property.location}` : ''} — ${property.type || 'Property'} photo for ${property.category === 'buy' ? 'sale' : 'rent'} listing on MakeMyStay`}
                            loading="lazy"
                            onError={(e) => {
                                const target = e.currentTarget;
                                if (target.src !== '/default-property.jpg') {
                                    target.src = '/default-property.jpg';
                                }
                            }}
                            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-900" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />

                    <button
                        onClick={handleHeartClick}
                        className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 touch-manipulation shadow-sm border border-slate-200/70"
                        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        <Heart className={`w-4 h-4 transition-colors ${wishlisted ? 'fill-brand-red text-brand-red' : 'text-slate-500'}`} />
                    </button>

                    <div className="absolute top-3 left-3 z-10 flex flex-col items-start gap-1.5 pointer-events-none">
                        <span className="text-[10px] font-semibold tracking-[0.12em] uppercase leading-none px-2.5 py-1.5 rounded-md bg-white text-slate-800 shadow-sm border border-slate-200/80">
                            {property.category === 'buy' ? 'For Sale' : 'For Rent'}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium tracking-wide uppercase leading-tight px-2.5 py-1.5 rounded-md text-white bg-slate-900/90 backdrop-blur-sm border border-white/10 shadow-sm">
                            <TrendingUp className="w-3 h-3 shrink-0 opacity-90" aria-hidden />
                            {scarcityLabel}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col flex-1 min-h-0 px-5 pt-5 pb-5 sm:px-6 sm:pb-6">
                    <div className="flex items-center gap-1.5 mb-3">
                        {(property.rating ?? 0) > 0 ? (
                            <>
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden />
                                <span className="text-[13px] font-semibold tabular-nums text-slate-800">{(property.rating ?? 0).toFixed(1)}</span>
                                <span className="text-[12px] text-slate-500">{reviewsLabel(property.reviews || 0)}</span>
                            </>
                        ) : (
                            <>
                                <Star className="w-3.5 h-3.5 text-slate-300" aria-hidden />
                                <span className="text-[12px] font-medium text-slate-400">New listing</span>
                            </>
                        )}
                    </div>

                    <h3 className="text-[15px] sm:text-base font-semibold text-slate-900 tracking-tight group-hover:text-brand-red transition-colors leading-snug line-clamp-2 min-h-[2.75rem]">
                        {displayTitle}
                    </h3>

                    <div className="flex items-start text-slate-600 text-[13px] gap-1.5 mt-1.5 mb-4">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" aria-hidden />
                        <span className="line-clamp-2 leading-snug">
                            <span className="text-slate-800">{property.location?.split(',')[0]}</span>
                            {property.location?.includes(',')
                                ? `, ${property.location.split(',').slice(1).join(',').trim()}`
                                : ''}
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-600 text-[12px] mb-4 pb-4 border-b border-slate-100">
                        {isPlot ? (
                            <>
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400" aria-hidden />
                                    <span>Plot Land</span>
                                </div>
                                {property.sqft && property.sqft !== 'On Request' && (
                                    <>
                                        <span className="text-slate-300" aria-hidden>
                                            ·
                                        </span>
                                        <span>{property.sqft} sqft</span>
                                    </>
                                )}
                            </>
                        ) : isServiceOriented ? (
                            <>
                                <div className="flex items-center gap-1">
                                    <Users className="w-3.5 h-3.5 text-slate-400" aria-hidden />
                                    <span>
                                        {(() => {
                                            const parts = (Array.isArray(property.sharing) ? property.sharing : []).filter(
                                                (s) => s === 'Single' || s === 'Double'
                                            );
                                            return parts.length > 0 ? `${parts.join('/')} sharing` : 'Shared room';
                                        })()}
                                    </span>
                                </div>
                                <span className="text-slate-300" aria-hidden>
                                    ·
                                </span>
                                <div className="flex items-center gap-1">
                                    <Utensils className="w-3.5 h-3.5 text-slate-400" aria-hidden />
                                    <span>{property.food ? 'Food included' : 'No food'}</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-1">
                                    <Bed className="w-3.5 h-3.5 text-slate-400" aria-hidden />
                                    <span>{property.beds} beds</span>
                                </div>
                                <span className="text-slate-300" aria-hidden>
                                    ·
                                </span>
                                <div className="flex items-center gap-1">
                                    <Bath className="w-3.5 h-3.5 text-slate-400" aria-hidden />
                                    <span>{property.baths} bath</span>
                                </div>
                                {property.sqft && property.sqft !== 'On Request' && (
                                    <>
                                        <span className="text-slate-300" aria-hidden>
                                            ·
                                        </span>
                                        <span>{property.sqft} sqft</span>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
                        <div className="min-w-0">
                            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400 mb-1">From</p>
                            <p className="text-2xl font-semibold tabular-nums tracking-tight text-slate-900 leading-none">
                                <span className="text-brand-red">{property.price}</span>
                            </p>
                            {property.category === 'rent' && (
                                <p className="text-[12px] text-slate-500 mt-1.5">per month</p>
                            )}
                        </div>
                        <span className="inline-flex shrink-0 items-center self-start rounded-md bg-slate-100 px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-600 border border-slate-200/90">
                            {rooms} left
                        </span>
                    </div>

                    <div className="flex flex-wrap content-start gap-1.5 mb-5 min-h-[5.5rem]">
                        {amenities.slice(0, 4).map((amenity) => {
                            const icon = amenityIconMap[amenity.toLowerCase()];
                            return (
                                <span
                                    key={amenity}
                                    className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600 bg-slate-50/90 border border-slate-100 rounded-md px-2 py-1"
                                >
                                    {icon && (
                                        <span className="text-slate-500 [&>svg]:w-3 [&>svg]:h-3 [&>svg]:shrink-0">
                                            {icon}
                                        </span>
                                    )}
                                    {amenity}
                                </span>
                            );
                        })}
                        {amenities.length > 4 && (
                            <span className="inline-flex items-center text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 rounded-md px-2 py-1">
                                +{amenities.length - 4} more
                            </span>
                        )}
                    </div>

                    <div className="mt-auto flex items-stretch gap-2 pt-1 border-t border-slate-100">
                        <span className="flex-1 flex items-center justify-center min-h-[44px] rounded-lg text-white text-[13px] font-semibold tracking-wide bg-brand-red shadow-sm shadow-brand-red/20 transition-all group-hover:bg-brand-red/95 group-hover:shadow-md group-hover:shadow-brand-red/25 active:scale-[0.99]">
                            Book a visit
                        </span>
                        <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center justify-center gap-1.5 min-w-[44px] min-h-[44px] px-3 rounded-lg text-[13px] font-semibold transition-colors border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.99]"
                        >
                            <MessageCircle className="w-4 h-4 shrink-0 text-slate-500" aria-hidden />
                            Chat
                        </a>
                    </div>
                </div>
            </div>
        </Link>
    );
}
