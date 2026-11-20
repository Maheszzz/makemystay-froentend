'use client';

import {
    ArrowRight,
    Bath,
    Bed,
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
import { formatVerifiedDate } from '@/lib/freshness';
import { haversineDistance } from '@/lib/geo';
import { getPropertyDetailPath } from '@/lib/propertyRouting';
import { getQualifiedRatingSummary } from '@/lib/ratings';
import { buildPropertyWhatsappUrl } from '@/lib/whatsapp';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import type { Property } from '@/types/api';

interface PropertyCardProps {
    property: Property;
    priority?: boolean;
    /** Optional category label override (e.g., "PG" on curated PG listing page). */
    categoryLabel?: string;
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
        return `${metroPlace.distance} to metro`;
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
            return bestKm < 1 ? `${Math.round(bestKm * 1000)}m to metro` : `${bestKm.toFixed(1)}km to metro`;
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

function formatFurnishingLabel(raw?: string): string | null {
    if (!raw) return null;
    const clean = raw.replace(/_/g, ' ').trim().toLowerCase();
    if (!clean) return null;
    return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function PropertyCardComponent({ property, priority = false, categoryLabel }: PropertyCardProps) {
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
    const verifiedDateLabel = useMemo(() => formatVerifiedDate(property.last_verified_at), [property.last_verified_at]);
    const furnishingLabel = useMemo(() => formatFurnishingLabel(property.furnishing), [property.furnishing]);
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
                className="block h-full group outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 rounded-[var(--radius-pdp)]"
                aria-label={`View details for ${displayTitle}`}
            >
                <article className="bg-white rounded-[var(--radius-pdp)] border border-line hover:border-ink/45 transition-colors duration-200 h-full flex flex-col overflow-hidden relative">
                    {/* Image Area - 4:3 Aspect Ratio */}
                    <div className="relative w-full aspect-[4/3] shrink-0 overflow-hidden bg-blush-100">
                        <OptimizedImage
                            src={displayImage}
                            alt={`${displayTitle} in ${property.location || 'Bangalore'}`}
                            fill
                            priority={priority}
                            size="medium"
                            className="object-cover"
                        />

                        {/* Top Left Badge (availability or API badge only) */}
                        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5 pr-14">
                            {!isAvailable ? (
                                <span className="px-2.5 py-1 bg-red-900/90 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                                    Fully booked
                                </span>
                            ) : property.listing_badge ? (
                                <span className="px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-medium text-ink border border-line">
                                    {property.listing_badge}
                                </span>
                            ) : null}
                        </div>

                        {/* Wishlist Heart — 44px tap target */}
                        <button
                            type="button"
                            aria-label={wishlisted ? `Remove ${displayTitle} from wishlist` : `Save ${displayTitle} to wishlist`}
                            onClick={handleHeartClick}
                            className="absolute top-2.5 right-2.5 z-10 w-11 h-11 rounded-full bg-white/95 border border-line flex items-center justify-center transition-colors hover:bg-blush-100 cursor-pointer"
                        >
                            <Heart
                                className={`w-4 h-4 transition-colors ${
                                    wishlisted ? 'fill-red text-red' : 'text-ink'
                                }`}
                            />
                        </button>

                        {/* Bottom Image Signals — real rating (>= 3 reviews) and video tour only */}
                        {(hasRealRating || hasVideoTour) && (
                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                                {hasRealRating ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-900/90 backdrop-blur-sm rounded-full text-xs font-medium text-white tabular-nums">
                                        <Star className="w-3.5 h-3.5 fill-champagne text-champagne" />
                                        <span>{ratingVal.toFixed(1)}</span>
                                        <span className="text-red-subtitle">({reviewCount})</span>
                                    </span>
                                ) : (
                                    <span />
                                )}
                                {hasVideoTour && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-900/90 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                                        <Video className="w-3.5 h-3.5" /> Video tour
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col flex-1 p-5">
                        <div className="mb-3">
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                                <span className="text-xs font-medium text-slate">
                                    {categoryLabel || property.type || 'Listing'}
                                </span>
                                {typeof property.units_remaining === 'number' &&
                                    property.units_remaining > 0 &&
                                    property.units_remaining <= 5 && (
                                        <span className="text-xs font-semibold text-champagne-text bg-blush-100 border border-champagne px-2 py-0.5 rounded-md tabular-nums">
                                            {property.units_remaining} {property.units_remaining === 1 ? 'unit' : 'units'} left
                                        </span>
                                    )}
                            </div>

                            <h3
                                title={displayTitle}
                                className="font-heading text-[20px] font-bold text-ink leading-snug line-clamp-2 min-h-[3.3rem] mb-1.5 group-hover:underline decoration-champagne underline-offset-4"
                            >
                                {displayTitle}
                            </h3>

                            <div className="flex items-center gap-2 text-slate text-sm w-full min-h-[1.25rem]">
                                <div className="flex items-center gap-1.5 min-w-0 flex-shrink">
                                    <MapPin className="w-3.5 h-3.5 shrink-0 text-champagne-text" />
                                    <span className="truncate">{property.location}</span>
                                </div>
                                {metroLabel && (
                                    <>
                                        <span aria-hidden="true" className="text-line">·</span>
                                        <div className="flex items-center gap-1 shrink-0 text-xs">
                                            <Map className="w-3.5 h-3.5 shrink-0 text-slate" />
                                            <span className="whitespace-nowrap">{metroLabel}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Room / Home Facts */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {isServiceOriented ? (
                                <>
                                    <span className="px-2.5 py-1 bg-page text-ink text-xs font-medium border border-line rounded-lg inline-flex items-center gap-1.5">
                                        <Users className="w-3.5 h-3.5 text-champagne-text" />
                                        {Array.isArray(property.sharing) && property.sharing.length > 0
                                            ? property.sharing.slice(0, 2).join(', ')
                                            : 'Shared'}
                                    </span>
                                    {property.food && (
                                        <span className="px-2.5 py-1 bg-page text-ink text-xs font-medium border border-line rounded-lg inline-flex items-center gap-1.5">
                                            <Utensils className="w-3.5 h-3.5 text-champagne-text" />
                                            Meals included
                                        </span>
                                    )}
                                </>
                            ) : isPlot ? (
                                <span className="px-2.5 py-1 bg-page text-ink text-xs font-medium border border-line rounded-lg">
                                    {property.sqft && property.sqft !== 'On Request' ? property.sqft : 'Residential plot'}
                                </span>
                            ) : (
                                <>
                                    <span className="px-2.5 py-1 bg-page text-ink text-xs font-medium border border-line rounded-lg inline-flex items-center gap-1.5 tabular-nums">
                                        <Bed className="w-3.5 h-3.5 text-champagne-text" /> {property.beds || 1} Bed
                                    </span>
                                    <span className="px-2.5 py-1 bg-page text-ink text-xs font-medium border border-line rounded-lg inline-flex items-center gap-1.5 tabular-nums">
                                        <Bath className="w-3.5 h-3.5 text-champagne-text" /> {property.baths || 1} Bath
                                    </span>
                                    {furnishingLabel && (
                                        <span className="px-2.5 py-1 bg-page text-ink text-xs font-medium border border-line rounded-lg">
                                            {furnishingLabel}
                                        </span>
                                    )}
                                </>
                            )}
                        </div>

                        {/* 1px Champagne Line above Verified-Date Row */}
                        <div className="min-h-[1.75rem] mb-3 pt-2.5 border-t border-champagne flex items-center justify-between gap-2 text-xs">
                            {verifiedDateLabel ? (
                                <span className="inline-flex items-center gap-1.5 text-champagne-text font-medium">
                                    <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-champagne-text" />
                                    Verified {verifiedDateLabel}
                                </span>
                            ) : (
                                <span className="text-slate">
                                    {isAvailable ? 'Available for visits' : 'Currently full'}
                                </span>
                            )}
                        </div>

                        {/* Price & Action */}
                        <div className="mt-auto flex items-end justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-xs text-slate mb-0.5">
                                    {isMonthlyRent ? 'Starting from' : 'Price'}
                                </p>
                                <div className="flex items-baseline gap-1.5 flex-wrap">
                                    <span className="font-heading text-xl font-bold text-ink leading-none whitespace-nowrap tabular-nums">
                                        {property.price}
                                    </span>
                                    {isMonthlyRent && hasNumericPrice && (
                                        <span className="text-xs text-slate">/mo</span>
                                    )}
                                    {originalPriceInr && (
                                        <span className="text-xs text-slate line-through tabular-nums">
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
                                    className="w-11 h-11 rounded-[10px] border border-line bg-white flex items-center justify-center text-ink hover:bg-blush-100 hover:border-ink/45 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                </button>
                                <span className="h-11 px-4 rounded-[10px] border border-line bg-page text-ink flex items-center justify-center text-sm font-medium gap-1.5 transition-colors group-hover:bg-red group-hover:text-white group-hover:border-red whitespace-nowrap">
                                    View details
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </span>
                            </div>
                        </div>
                    </div>
                </article>
            </Link>

            <LeadCaptureModal
                isOpen={isLeadModalOpen}
                onClose={() => setIsLeadModalOpen(false)}
                title="Chat on WhatsApp"
                subtitle={`Connect with our team regarding ${displayTitle}.`}
                source="Listing Card - WhatsApp"
                actionLabel="Continue to WhatsApp"
                propertyTitle={displayTitle || property.title}
                propertyLocation={property.location}
                whatsappUrl={waLink}
            />
        </>
    );
}

export const PropertyCard = memo(PropertyCardComponent);
