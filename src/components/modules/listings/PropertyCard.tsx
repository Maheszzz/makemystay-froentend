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
        <Link to={propertyPath} state={{ from }} className="block group">
            <div className="bg-white rounded-3xl overflow-hidden transition-all duration-300 border border-slate-100/80 shadow-listing hover:shadow-listing-hover hover:-translate-y-1">
                {/* Image: object-cover for editorial framing; switch to object-contain if uncropped photos are required */}
                <div className="relative w-full h-[240px] sm:h-[260px] overflow-hidden bg-slate-900 rounded-t-3xl">
                    {displayImage ? (
                        <img
                            src={displayImage}
                            alt={displayTitle}
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

                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                    <button
                        onClick={handleHeartClick}
                        className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 active:scale-95 touch-manipulation shadow-sm border border-slate-200/60"
                        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        <Heart className={`w-4 h-4 transition-colors ${wishlisted ? 'fill-brand-red text-brand-red' : 'text-slate-500'}`} />
                    </button>

                    <div className="absolute top-3 left-3 z-10 flex flex-col items-start gap-1.5 pointer-events-none">
                        <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase leading-tight px-2.5 py-1 rounded-full bg-white/95 text-slate-800 shadow-sm backdrop-blur-md border border-white/60">
                            {property.category === 'buy' ? 'For Sale' : 'For Rent'}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold tracking-wide uppercase leading-tight px-2.5 py-1 rounded-full text-white bg-slate-900/88 backdrop-blur-sm shadow-sm border border-white/10">
                            <TrendingUp className="w-3 h-3 shrink-0 opacity-95" aria-hidden />
                            {scarcityLabel}
                        </span>
                    </div>
                </div>

                <div className="p-5">
                    <div className="flex items-center gap-1.5 mb-2">
                        {(property.rating ?? 0) > 0 ? (
                            <>
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                <span className="text-xs font-bold text-slate-700">{(property.rating ?? 0).toFixed(1)}</span>
                                <span className="text-xs text-slate-500">({reviewsLabel(property.reviews || 0)})</span>
                            </>
                        ) : (
                            <>
                                <Star className="w-3.5 h-3.5 fill-slate-200 text-slate-200" />
                                <span className="text-xs font-semibold text-slate-400">New Listing</span>
                            </>
                        )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-red transition-colors leading-snug line-clamp-2 mb-1">
                        {displayTitle}
                    </h3>

                    <div className="flex items-center text-slate-500 text-xs gap-1 mb-3.5">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-brand-red/70" />
                        <span className="truncate">
                            <span className="font-semibold text-slate-700">{property.location?.split(',')[0]}</span>
                            {property.location?.includes(',')
                                ? `, ${property.location.split(',').slice(1).join(',').trim()}`
                                : ''}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-500 text-xs mb-4 pb-4 border-b border-slate-100">
                        {isPlot ? (
                            <>
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-brand-red/70" />
                                    <span>Plot Land</span>
                                </div>
                                {property.sqft && property.sqft !== 'On Request' && (
                                    <>
                                        <span className="text-slate-200">|</span>
                                        <span>{property.sqft} sqft</span>
                                    </>
                                )}
                            </>
                        ) : isServiceOriented ? (
                            <>
                                <div className="flex items-center gap-1">
                                    <Users className="w-3.5 h-3.5 text-brand-red/70" />
                                    <span>
                                        {(() => {
                                            const parts = (Array.isArray(property.sharing) ? property.sharing : []).filter(
                                                (s) => s === 'Single' || s === 'Double'
                                            );
                                            return parts.length > 0 ? `${parts.join('/')} sharing` : 'Shared room';
                                        })()}
                                    </span>
                                </div>
                                <span className="text-slate-200">|</span>
                                <div className="flex items-center gap-1">
                                    <Utensils className="w-3.5 h-3.5 text-brand-red/70" />
                                    <span>{property.food ? 'Food Included' : 'No Food'}</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-1">
                                    <Bed className="w-3.5 h-3.5 text-brand-red/70" />
                                    <span>{property.beds} Beds</span>
                                </div>
                                <span className="text-slate-200">|</span>
                                <div className="flex items-center gap-1">
                                    <Bath className="w-3.5 h-3.5 text-brand-red/70" />
                                    <span>{property.baths} Bath</span>
                                </div>
                                {property.sqft && property.sqft !== 'On Request' && (
                                    <>
                                        <span className="text-slate-200">|</span>
                                        <span>{property.sqft} sqft</span>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
                        <div>
                            <p className="text-xs text-slate-500 leading-tight mb-1">Starting at</p>
                            <p className="text-xl font-bold leading-tight text-brand-red">{property.price}</p>
                            {property.category === 'rent' && (
                                <p className="text-xs text-slate-500 mt-1">Per month</p>
                            )}
                        </div>
                        <span className="inline-flex self-start sm:self-auto items-center rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600 border border-slate-200/80">
                            Only {rooms} Rooms Left
                        </span>
                    </div>

                    {amenities.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {amenities.slice(0, 4).map((amenity) => {
                                const icon = amenityIconMap[amenity.toLowerCase()];
                                return (
                                    <span
                                        key={amenity}
                                        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-full px-2.5 py-1"
                                    >
                                        {icon && (
                                            <span className="text-slate-600 [&>svg]:w-3.5 [&>svg]:h-3.5 [&>svg]:shrink-0">
                                                {icon}
                                            </span>
                                        )}
                                        {amenity}
                                    </span>
                                );
                            })}
                            {amenities.length > 4 && (
                                <span className="inline-flex items-center text-xs font-medium text-brand-red bg-red-50 border border-brand-red/15 rounded-full px-2.5 py-1">
                                    +{amenities.length - 4} more
                                </span>
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-2.5 pt-1">
                        <span className="flex-1 text-center py-3 rounded-xl text-white text-xs font-bold tracking-wide bg-gradient-to-br from-brand-red to-red-900 shadow-md shadow-brand-red/15 transition-all hover:brightness-[1.03] hover:shadow-lg hover:shadow-brand-red/20 active:scale-[0.98]">
                            Book a Visit
                        </span>
                        <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl text-xs font-semibold transition-all border active:scale-[0.98] text-brand-red border-brand-red/25 bg-brand-red/[0.06] hover:bg-brand-red/[0.1]"
                        >
                            <MessageCircle className="w-3.5 h-3.5 shrink-0" aria-hidden />
                            Chat
                        </a>
                    </div>
                </div>
            </div>
        </Link>
    );
}
