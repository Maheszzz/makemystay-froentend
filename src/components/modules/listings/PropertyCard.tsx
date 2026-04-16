import {
    Bath,
    Bed,
    Heart,
    MapPin,
    MessageCircle,
    Star,
    Users,
    Utensils,
    Check,
} from 'lucide-react';
import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useWishlist } from '@/context/WishlistContext';
import { amenityIconMap } from '@/lib/amenityIcons';
import { formatPropertyTitle, reviewsLabel } from '@/lib/formatPropertyTitle';
import { getPropertyDetailPath } from '@/lib/propertyRouting';
import { buildPropertyWhatsappUrl } from '@/lib/whatsapp';
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
        e.stopPropagation();
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

    const displayTitle = useMemo(() => formatPropertyTitle(property.title), [property.title]);
    const waLink = buildPropertyWhatsappUrl(displayTitle || property.title, property.location || '');
    const secondaryBadge =
        property.listing_badge?.trim() ||
        (property.is_available === false ? 'Fully booked' : '');
    const unitsLeft =
        typeof property.units_remaining === 'number' && property.units_remaining > 0
            ? property.units_remaining
            : null;

    const from = `${location.pathname}${location.search}${location.hash}`;

    const hasRating = (property.rating ?? 0) > 0;

    return (
        <Link
            to={propertyPath}
            state={{ from }}
            className="block h-full group outline-none focus-visible:ring-2 focus-visible:ring-brand-red/35 focus-visible:ring-offset-2 rounded-[1.35rem]"
        >
            <div className="bg-white rounded-[1.35rem] overflow-hidden transition-all duration-500 ease-out border border-slate-200/70 shadow-listing hover:shadow-listing-hover hover:border-slate-300/80 hover:-translate-y-1 h-full flex flex-col ring-1 ring-black/[0.02]">
                {/* Image — editorial frame + rating glass on photo */}
                <div className="relative w-full h-[200px] sm:h-[224px] shrink-0 overflow-hidden bg-slate-200 rounded-t-[1.35rem]">
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
                            className="w-full h-full object-cover object-center transition-transform duration-[650ms] ease-out group-hover:scale-[1.045]"
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-900" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/10" />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />

                    <button
                        type="button"
                        onClick={handleHeartClick}
                        className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 hover:shadow-md active:scale-95 touch-manipulation shadow-md border border-white/80"
                        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        <Heart className={`w-[18px] h-[18px] transition-colors ${wishlisted ? 'fill-brand-red text-brand-red' : 'text-slate-500'}`} />
                    </button>

                    <div className="absolute top-3 left-3 z-10 flex flex-col items-start gap-1.5 pointer-events-none max-w-[82%]">
                        <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.14em] uppercase leading-none px-2.5 py-1.5 rounded-lg bg-white/98 text-slate-900 shadow-md border border-slate-200/90 font-heading">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            {property.category === 'buy' ? 'For Sale' : 'For Rent'}
                        </span>
                        {(property as any).is_verified !== false && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide uppercase leading-tight px-2.5 py-1.5 rounded-lg text-white bg-emerald-600/90 backdrop-blur-md border border-emerald-400/30 shadow-lg">
                                <Check className="w-3 h-3" strokeWidth={3} />
                                Verified
                            </span>
                        )}
                        {secondaryBadge && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide uppercase leading-tight px-2.5 py-1.5 rounded-lg text-white bg-slate-950/88 backdrop-blur-md border border-white/15 shadow-lg line-clamp-2">
                                {secondaryBadge}
                            </span>
                        )}
                        {hasRating && (property.rating ?? 0) >= 4.5 && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide uppercase leading-tight px-2.5 py-1.5 rounded-lg text-white bg-amber-500/90 backdrop-blur-md border border-amber-400/30 shadow-lg">
                                <Star className="w-3 h-3 fill-white" />
                                High Rated
                            </span>
                        )}
                    </div>

                    {/* Rating + type — on-image glass strip */}
                    <div className="absolute bottom-0 left-0 right-0 z-10 p-3 flex items-end justify-between gap-2 pointer-events-none">
                        <div
                            className={`flex items-center gap-1.5 min-w-0 rounded-full pl-2 pr-2.5 py-1.5 border shadow-sm ${
                                hasRating
                                    ? 'bg-black/45 backdrop-blur-md border-white/20 text-white'
                                    : 'bg-white/92 backdrop-blur-md border-slate-200/80 text-slate-700'
                            }`}
                        >
                            {hasRating ? (
                                <>
                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" aria-hidden />
                                    <span className="text-[12px] font-bold tabular-nums">{(property.rating ?? 0).toFixed(1)}</span>
                                    <span className="text-[11px] text-white/85 truncate">{reviewsLabel(property.reviews || 0)}</span>
                                </>
                            ) : (
                                <>
                                    <Star className="w-3.5 h-3.5 text-amber-400/90 shrink-0" aria-hidden />
                                    <span className="text-[11px] font-semibold tracking-wide">New listing</span>
                                </>
                            )}
                        </div>
                        {property.type && (
                            <span className="shrink-0 rounded-full bg-brand-gold/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-md border border-white/25 font-heading">
                                {property.type}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex flex-col flex-1 min-h-0 px-4 pt-4 pb-4 sm:px-5 sm:pb-5">
                    <h3 className="font-heading text-[15px] sm:text-[17px] font-bold text-slate-900 tracking-tight group-hover:text-brand-red transition-colors duration-300 leading-snug line-clamp-2 min-h-[2.5rem]">
                        {displayTitle}
                    </h3>

                    <div className="flex items-start gap-2 mt-2 mb-3 text-slate-600 text-[12px] sm:text-[13px]">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                            <MapPin className="w-3.5 h-3.5" aria-hidden />
                        </span>
                        <span className="line-clamp-2 leading-snug pt-0.5">
                            <span className="font-medium text-slate-800">{property.location?.split(',')[0]}</span>
                            {property.location?.includes(',')
                                ? `, ${property.location.split(',').slice(1).join(',').trim()}`
                                : ''}
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-slate-700 text-[11px] sm:text-[12px] mb-3.5 pb-3.5 border-b border-slate-100/90">
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

                    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-stretch sm:justify-between mb-3.5">
                        <div className="min-w-0 flex-1 rounded-xl border border-slate-200/90 bg-gradient-to-br from-slate-50/95 to-white pl-3 pr-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] border-l-[3px] border-l-brand-gold">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 font-heading mb-1">From</p>
                            <p className="text-[1.65rem] sm:text-[1.75rem] font-bold tabular-nums tracking-tight leading-none font-heading">
                                <span className="inline-block bg-gradient-to-br from-[#e6282f] via-brand-red to-[#b01018] bg-clip-text text-transparent">
                                    {property.price}
                                </span>
                            </p>
                            {property.category === 'rent' && (
                                <p className="text-[11px] text-slate-500 mt-1 font-medium">per month</p>
                            )}
                        </div>
                        {unitsLeft != null && (
                            <span className="inline-flex shrink-0 items-center justify-center self-start sm:self-stretch rounded-xl bg-amber-50/90 px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-amber-900 border border-amber-200/80 font-heading">
                                {unitsLeft} left
                            </span>
                        )}
                    </div>

                    <div className="flex flex-wrap content-start gap-1.5 mb-4 min-h-0">
                        {amenities.slice(0, 4).map((amenity) => {
                            const icon = amenityIconMap[amenity.toLowerCase()];
                            return (
                                <span
                                    key={amenity}
                                    className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-slate-700 bg-white border border-slate-200/90 rounded-full px-2.5 py-1 shadow-[0_1px_0_rgba(15,23,42,0.04)]"
                                >
                                    {icon && (
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-600 [&>svg]:w-3 [&>svg]:h-3 [&>svg]:shrink-0">
                                            {icon}
                                        </span>
                                    )}
                                    {amenity}
                                </span>
                            );
                        })}
                        {amenities.length > 4 && (
                            <span className="inline-flex items-center text-[10px] sm:text-[11px] font-bold text-slate-600 bg-slate-100/80 border border-slate-200/80 rounded-full px-2.5 py-1">
                                +{amenities.length - 4} more
                            </span>
                        )}
                    </div>

                    <div className="mt-auto flex items-stretch gap-2 pt-3 border-t border-slate-100/90">
                        <span
                            onClick={() => {
                                console.log('[TRACK] Book visit clicked', { id: property.id, title: property.title, from: location.pathname });
                            }}
                            className="flex-1 flex items-center justify-center min-h-[46px] rounded-xl text-white text-[13px] font-bold tracking-wide font-heading bg-gradient-to-b from-[#e92e35] via-brand-red to-[#b01018] shadow-[0_4px_14px_-2px_rgba(217,32,39,0.45)] transition-all group-hover:brightness-[1.03] group-hover:shadow-[0_8px_22px_-4px_rgba(217,32,39,0.5)] active:scale-[0.99] cursor-pointer ring-1 ring-white/10"
                        >
                            Book a visit
                        </span>
                        <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                                e.stopPropagation();
                                console.log('[TRACK] WhatsApp chat clicked', { id: property.id, title: property.title, from: location.pathname });
                            }}
                            className="inline-flex items-center justify-center gap-1.5 min-w-[48px] min-h-[46px] px-3.5 rounded-xl text-[13px] font-bold font-heading transition-all border-2 border-slate-200/90 bg-white text-slate-800 hover:border-emerald-500/40 hover:bg-emerald-50/50 hover:text-emerald-900 active:scale-[0.99] shadow-sm"
                        >
                            <MessageCircle className="w-4 h-4 shrink-0 text-emerald-600" aria-hidden />
                            Chat
                        </a>
                    </div>
                </div>
            </div>
        </Link>
    );
}
