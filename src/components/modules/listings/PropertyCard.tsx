'use client';

import {
    ArrowRight,
    Bath,
    Bed,
    CheckCircle2,
    Clock,
    Heart,
    Map,
    MapPin,
    MessageCircle,
    ShieldCheck,
    Star,
    Users,
    Utensils,
    Video,
} from 'lucide-react';
import { memo, useCallback, useMemo, useState } from 'react';
import { Link } from '@/lib/navigation';

import { useWishlist } from '@/context/WishlistContext';
import { LeadCaptureModal } from '@/components/modals/LeadCaptureModal';
import { METRO_STATIONS } from '@/data/metroStations';
import { formatPropertyTitle } from '@/lib/formatPropertyTitle';
import { haversineDistance } from '@/lib/geo';
import { getPropertyDetailPath } from '@/lib/propertyRouting';
import { getQualifiedRatingSummary } from '@/lib/ratings';
import { buildPropertyWhatsappUrl } from '@/lib/whatsapp';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
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

function getRealMetroLabel(property: Property): string | null {
    const metroPlace = property.nearby_places?.find(
        (p) => /metro/i.test(p.category || '') || /metro/i.test(p.name || ''),
    );
    if (metroPlace?.distance) {
        return `${metroPlace.distance} to Metro`;
    }
    if (typeof property.latitude === 'number' && typeof property.longitude === 'number') {
        let bestKm = Infinity;
        for (const station of METRO_STATIONS) {
            if (!station.isOperational) continue;
            const d = haversineDistance(
                property.latitude,
                property.longitude,
                station.coordinates.latitude,
                station.coordinates.longitude,
            );
            if (d < bestKm) bestKm = d;
        }
        if (bestKm <= 5) {
            return bestKm < 1 ? `${Math.round(bestKm * 1000)}m to Metro` : `${bestKm.toFixed(1)}km to Metro`;
        }
    }
    return null;
}

function parseNumericInr(priceText?: string): number | null {
    if (!priceText) return null;
    const digits = priceText.replace(/[^0-9.]/g, '');
    if (!digits) return null;
    const n = Number(digits);
    return Number.isFinite(n) && n > 0 ? n : null;
}

function PropertyCardComponent({ property }: PropertyCardProps) {
    let wishlisted = false;
    let toggleWishlist = (_p: Property) => {};
    try {
        const wishlistContext = useWishlist();
        wishlisted = wishlistContext.isWishlisted(String(property.id));
        toggleWishlist = wishlistContext.toggleWishlist;
    } catch {
        // Fallback outside WishlistProvider
    }

    const handleHeartClick = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(property);
        },
        [property, toggleWishlist],
    );

    const fallbackImage = useMemo(() => getFallbackImageForType(property.type), [property.type]);

    const displayImage = useMemo(() => {
        const prop: any = property;
        const imgs = Array.isArray(prop.images) ? prop.images : [];
        const ph = Array.isArray(prop.photos) ? prop.photos : [];
        const primaryImgObj =
            imgs.find((img: any) => img && typeof img === 'object' && (img.is_primary || img.isPrimary || img.is_cover)) ||
            ph.find((img: any) => img && typeof img === 'object' && (img.is_primary || img.isPrimary || img.is_cover));
        if (primaryImgObj && (primaryImgObj.image_url || primaryImgObj.url || primaryImgObj.src)) {
            return primaryImgObj.image_url || primaryImgObj.url || primaryImgObj.src;
        }
        const parsedImages = imgs
            .map((img: any) => (typeof img === 'string' ? img : img?.image_url || img?.url || img?.src))
            .filter(Boolean);
        const parsedPhotos = ph
            .map((img: any) => (typeof img === 'string' ? img : img?.image_url || img?.url || img?.src))
            .filter(Boolean);
        return prop.image || parsedImages[0] || parsedPhotos[0] || fallbackImage || '/default-property.jpg';
    }, [property, fallbackImage]);

    const typeLower = (property.type || '').toLowerCase();
    const isServiceOriented = typeLower === 'pg' || typeLower === 'hostel';
    const isMonthlyRent = property.category === 'pg' || property.category === 'rent' || isServiceOriented;
    const isPlot = property.category === 'plot' || typeLower === 'plot';

    const propertyPath = getPropertyDetailPath(property);
    const displayTitle = useMemo(() => formatPropertyTitle(property.title), [property.title]);
    const waLink = useMemo(
        () => buildPropertyWhatsappUrl(displayTitle || property.title, property.location || '', propertyPath),
        [displayTitle, property.title, property.location, propertyPath],
    );

    const { showRating: hasRealRating, rating: ratingVal, reviewCount } = useMemo(
        () => getQualifiedRatingSummary(property),
        [property],
    );
    const hasVideoTour = Array.isArray(property.videos) && property.videos.length > 0;
    const metroLabel = useMemo(() => getRealMetroLabel(property), [property]);
    const isAvailable = property.is_available !== false;
    const hasNumericPrice = Boolean(property.price && !/request/i.test(property.price));

    // Only display a price drop when the backend metadata supplies a genuine higher original price.
    const originalPriceInr = useMemo(() => {
        const meta = (property as any).metadata as Record<string, unknown> | undefined;
        const raw = meta?.original_price ?? meta?.mrp;
        const orig = typeof raw === 'number' ? raw : typeof raw === 'string' ? Number(raw) : NaN;
        const current = parseNumericInr(property.price);
        if (Number.isFinite(orig) && current && orig > current && !/cr/i.test(property.price)) {
            return orig;
        }
        return null;
    }, [property]);

    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

    return (
        <>
            <Link
                to={propertyPath}
                className="block h-full group outline-none focus-visible:ring-2 focus-visible:ring-[#E53935] rounded-[24px]"
                style={{ fontFamily: "'Inter', sans-serif" }}
                aria-label={`View details for ${displayTitle}`}
            >
                <div className="bg-white rounded-[24px] border border-gray-200 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_24px_50px_-12px_rgba(0,0,0,0.15)] hover:-translate-y-1.5 h-full flex flex-col overflow-hidden relative">
                    {/* Image Area - 16:10 Aspect Ratio */}
                    <div className="relative w-full aspect-[16/10] shrink-0 overflow-hidden bg-gray-100">
                        <OptimizedImage
                            src={displayImage}
                            alt={`${displayTitle} in ${property.location || 'Bangalore'}`}
                            fill
                            size="medium"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/75 via-transparent to-black/15" />

                        {/* Top Left Badge (real backend badge or availability only) */}
                        <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 pr-12">
                            {!isAvailable ? (
                                <span className="px-2.5 py-1 bg-slate-900/85 backdrop-blur-md rounded-full text-[11px] font-semibold text-white shadow-sm">
                                    Fully Booked
                                </span>
                            ) : property.listing_badge ? (
                                <span className="px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-full text-[11px] font-semibold text-[#111827] shadow-sm">
                                    {property.listing_badge}
                                </span>
                            ) : null}
                        </div>

                        {/* Wishlist Heart */}
                        <button
                            type="button"
                            aria-label={wishlisted ? `Remove ${displayTitle} from wishlist` : `Save ${displayTitle} to wishlist`}
                            onClick={handleHeartClick}
                            className="absolute top-3.5 right-3.5 z-10 w-10 h-10 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E53935]"
                        >
                            <Heart
                                className={`w-4 h-4 transition-colors ${
                                    wishlisted ? 'fill-[#E53935] text-[#E53935]' : 'text-gray-600'
                                }`}
                            />
                        </button>

                        {/* Bottom Image Info (max 2 clean signals) */}
                        <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between gap-2">
                            <div className="flex flex-col gap-1.5">
                                {hasRealRating ? (
                                    <span className="w-fit flex items-center gap-1 px-2 py-1 bg-[#E53935] rounded-md text-[11px] font-bold text-white shadow-sm">
                                        <Star className="w-3 h-3 fill-white" />
                                        {ratingVal.toFixed(1)}
                                        <span className="text-[10px] font-normal opacity-95 ml-0.5">
                                            ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                                        </span>
                                    </span>
                                ) : (
                                    <span className="w-fit px-2 py-1 bg-black/55 backdrop-blur-md rounded-md text-[10px] font-semibold text-white">
                                        New Listing
                                    </span>
                                )}
                                {hasVideoTour && (
                                    <span className="w-fit flex items-center gap-1 px-2 py-1 bg-black/55 backdrop-blur-md rounded-md text-[10px] font-medium text-white">
                                        <Video className="w-3 h-3" /> Video Tour
                                    </span>
                                )}
                            </div>
                            <span className="px-2.5 py-1 bg-emerald-600/95 backdrop-blur-md rounded-full text-[11px] font-bold text-white shadow-sm flex items-center gap-1 shrink-0">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                            </span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col flex-1 p-5 bg-white">
                        {/* Header: Category/Type & Title */}
                        <div className="mb-3">
                            <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wide">
                                    {property.type?.toUpperCase() || 'PG'}
                                </span>
                                {typeof property.units_remaining === 'number' &&
                                    property.units_remaining > 0 &&
                                    property.units_remaining <= 5 && (
                                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                                            {property.units_remaining} {property.units_remaining === 1 ? 'unit' : 'units'} left
                                        </span>
                                    )}
                            </div>
                            <h3
                                title={displayTitle}
                                className="text-base font-extrabold text-[#111827] leading-snug line-clamp-2 min-h-[2.75rem] mb-2 group-hover:text-[#E53935] transition-colors"
                            >
                                {displayTitle}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-600 text-xs font-medium w-full">
                                <div className="flex items-center gap-1 min-w-0 flex-shrink">
                                    <MapPin className="w-3.5 h-3.5 shrink-0 text-[#E53935]" />
                                    <span className="truncate">{property.location}</span>
                                </div>
                                {metroLabel && (
                                    <>
                                        <div className="w-1 h-1 rounded-full bg-gray-300 shrink-0" />
                                        <div className="flex items-center gap-1 shrink-0">
                                            <Map className="w-3.5 h-3.5 shrink-0 text-gray-500" />
                                            <span className="whitespace-nowrap">{metroLabel}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Room Config / Specs */}
                        <div className="flex flex-wrap gap-2 mt-1 mb-4">
                            {isServiceOriented ? (
                                <>
                                    <span className="px-2.5 py-1 bg-gray-50 text-gray-700 text-[11px] font-semibold border border-gray-200/70 rounded-md flex items-center gap-1.5">
                                        <Users className="w-3.5 h-3.5 text-gray-500" />{' '}
                                        {Array.isArray(property.sharing) && property.sharing.length > 0
                                            ? property.sharing[0]
                                            : 'Shared'}
                                    </span>
                                    <span className="px-2.5 py-1 bg-gray-50 text-gray-700 text-[11px] font-semibold border border-gray-200/70 rounded-md flex items-center gap-1.5">
                                        <Utensils className="w-3.5 h-3.5 text-gray-500" />{' '}
                                        {property.food ? 'Food Incl.' : 'No Food'}
                                    </span>
                                </>
                            ) : isPlot ? (
                                <span className="px-2.5 py-1 bg-gray-50 text-gray-700 text-[11px] font-semibold border border-gray-200/70 rounded-md">
                                    {property.sqft || 'Plot Area On Request'}
                                </span>
                            ) : (
                                <>
                                    <span className="px-2.5 py-1 bg-gray-50 text-gray-700 text-[11px] font-semibold border border-gray-200/70 rounded-md flex items-center gap-1.5">
                                        <Bed className="w-3.5 h-3.5 text-gray-500" /> {property.beds || 1} Bed
                                    </span>
                                    <span className="px-2.5 py-1 bg-gray-50 text-gray-700 text-[11px] font-semibold border border-gray-200/70 rounded-md flex items-center gap-1.5">
                                        <Bath className="w-3.5 h-3.5 text-gray-500" /> {property.baths || 1} Bath
                                    </span>
                                </>
                            )}
                            <span
                                className={`px-2.5 py-1 text-[11px] font-semibold border rounded-md flex items-center gap-1.5 ${
                                    isAvailable
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                        : 'bg-slate-100 text-slate-600 border-slate-200'
                                }`}
                            >
                                <Clock className={`w-3.5 h-3.5 ${isAvailable ? 'text-emerald-600' : 'text-slate-500'}`} />
                                {isAvailable ? 'Ready to Move' : 'Waitlist'}
                            </span>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                                <ShieldCheck className="w-3.5 h-3.5" /> Owner Verified
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Zero Brokerage
                            </div>
                        </div>

                        {/* Price & CTA */}
                        <div className="mt-auto pt-1 flex flex-wrap items-center justify-between gap-y-3 gap-x-2">
                            <div className="flex-1 min-w-[120px]">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                                    {isMonthlyRent ? 'Starting From' : 'Price'}
                                </p>
                                <div className="flex items-baseline gap-1.5 flex-wrap">
                                    <span className="text-[18px] font-black text-[#111827] leading-none whitespace-nowrap">
                                        {property.price}
                                    </span>
                                    {isMonthlyRent && hasNumericPrice && (
                                        <span className="text-[11px] font-bold text-gray-500">/mo</span>
                                    )}
                                    {originalPriceInr && (
                                        <span className="text-xs font-semibold text-gray-400 line-through">
                                            ₹{originalPriceInr.toLocaleString('en-IN')}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    type="button"
                                    aria-label={`Chat on WhatsApp about ${displayTitle}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setIsLeadModalOpen(true);
                                    }}
                                    className="w-10 h-10 rounded-full bg-[#ecfdf5] border border-[#d1fae5] flex items-center justify-center text-[#059669] hover:bg-[#10b981] hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                </button>
                                <span className="h-10 px-4 rounded-full bg-[#111827] text-white flex items-center justify-center text-[12px] font-bold gap-1.5 transition-all group-hover:bg-[#E53935] group-hover:shadow-[0_4px_12px_rgba(229,57,53,0.3)]">
                                    View Details{' '}
                                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>

            <LeadCaptureModal
                isOpen={isLeadModalOpen}
                onClose={() => setIsLeadModalOpen(false)}
                title="Chat on WhatsApp"
                subtitle={`Connect directly with the verified owner of ${displayTitle}.`}
                source="Premium Card - WhatsApp"
                actionLabel="Continue to WhatsApp"
                propertyTitle={displayTitle || property.title}
                propertyLocation={property.location}
                whatsappUrl={waLink}
            />
        </>
    );
}

export const PropertyCard = memo(PropertyCardComponent);
