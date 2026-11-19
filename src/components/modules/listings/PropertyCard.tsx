'use client';

import {
    AirVent,
    ArrowRight,
    Bed,
    Building2,
    Check,
    ChevronLeft,
    ChevronRight,
    Dumbbell,
    Flame,
    Heart,
    MapPin,
    MessageCircle,
    ParkingSquare,
    Refrigerator,
    ShieldCheck,
    Shirt,
    Sparkles,
    Tv,
    Users,
    Utensils,
    Wifi,
    Zap,
    ArrowUpDown,
    ChefHat,
} from 'lucide-react';
import { Fragment, memo, useCallback, useMemo, useState } from 'react';
import { Link } from '@/lib/navigation';

import { useWishlist } from '@/context/WishlistContext';
import { normalizeDisplayName } from '@/lib/displayName';
import { formatPropertyTitle } from '@/lib/formatPropertyTitle';
import { formatVerifiedDate } from '@/lib/freshness';
import { formatFurnishingLabel } from '@/lib/listingPageUtils';
import {
    getAmenityTiles,
    getRealImages,
    getSharingLabel,
    hasRealMeals,
    isNewlyVerified,
    type AmenityIconKey,
} from '@/lib/listingCardData';
import { getPropertyDetailPath } from '@/lib/propertyRouting';
import { buildPropertyWhatsappUrl } from '@/lib/whatsapp';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import type { Property } from '@/types/api';

export type PropertyCardVariant = 'list' | 'grid' | 'auto';

interface PropertyCardProps {
    property: Property;
    priority?: boolean;
    variant?: PropertyCardVariant;
}

const FOCUS_RING =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2';

function renderTileIcon(key: AmenityIconKey) {
    const cls = 'w-[18px] h-[18px] text-ink/80 shrink-0';
    switch (key) {
        case 'wifi':
            return <Wifi className={cls} aria-hidden="true" />;
        case 'ac':
            return <AirVent className={cls} aria-hidden="true" />;
        case 'laundry':
            return <Shirt className={cls} aria-hidden="true" />;
        case 'housekeeping':
            return <Sparkles className={cls} aria-hidden="true" />;
        case 'security':
            return <ShieldCheck className={cls} aria-hidden="true" />;
        case 'meals':
            return <Utensils className={cls} aria-hidden="true" />;
        case 'power':
            return <Zap className={cls} aria-hidden="true" />;
        case 'fridge':
            return <Refrigerator className={cls} aria-hidden="true" />;
        case 'lift':
            return <ArrowUpDown className={cls} aria-hidden="true" />;
        case 'hotwater':
            return <Flame className={cls} aria-hidden="true" />;
        case 'tv':
            return <Tv className={cls} aria-hidden="true" />;
        case 'parking':
            return <ParkingSquare className={cls} aria-hidden="true" />;
        case 'gym':
            return <Dumbbell className={cls} aria-hidden="true" />;
        case 'kitchen':
            return <ChefHat className={cls} aria-hidden="true" />;
        default:
            return <Check className={cls} aria-hidden="true" />;
    }
}

function PropertyCardComponent({ property, priority = false, variant = 'grid' }: PropertyCardProps) {
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

    const realImages = useMemo(() => getRealImages(property, 6), [property]);
    const [activeIdx, setActiveIdx] = useState(0);
    const safeIdx = activeIdx < realImages.length ? activeIdx : 0;

    const prevPhoto = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (realImages.length <= 1) return;
            setActiveIdx((i) => (i - 1 + realImages.length) % realImages.length);
        },
        [realImages.length],
    );

    const nextPhoto = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (realImages.length <= 1) return;
            setActiveIdx((i) => (i + 1) % realImages.length);
        },
        [realImages.length],
    );

    const typeLower = (property.type || '').toLowerCase();
    const isServiceOriented = property.category === 'pg' || typeLower === 'pg' || typeLower === 'hostel';
    const isMonthlyRent = property.category === 'pg' || property.category === 'rent' || isServiceOriented;
    const isPlot = property.category === 'plot' || typeLower === 'plot';

    const propertyPath = getPropertyDetailPath(property);
    const displayTitle = useMemo(() => formatPropertyTitle(property.title) || property.title, [property.title]);
    const displayType = useMemo(() => normalizeDisplayName(property.type), [property.type]);
    const waLink = useMemo(
        () => buildPropertyWhatsappUrl(displayTitle, property.location || '', propertyPath),
        [displayTitle, property.location, propertyPath],
    );

    const verifiedDateLabel = useMemo(() => formatVerifiedDate(property.last_verified_at), [property.last_verified_at]);
    const newlyVerified = useMemo(() => isNewlyVerified(property), [property]);
    const sharingLabel = useMemo(() => (isServiceOriented ? getSharingLabel(property) : null), [isServiceOriented, property]);
    const mealsAvailable = useMemo(() => (isServiceOriented ? hasRealMeals(property) : false), [isServiceOriented, property]);
    const furnishingLabel = useMemo(
        () => (property.furnishing ? formatFurnishingLabel(property.furnishing) : null),
        [property.furnishing],
    );
    const { tiles: amenityTiles, moreCount } = useMemo(() => getAmenityTiles(property, 5), [property]);

    const isAvailable = property.is_available !== false;
    const hasNumericPrice = Boolean(property.price && !/request|negotiable/i.test(property.price));
    const hasRealSqft = Boolean(property.sqft && !/request/i.test(property.sqft));

    const metaItems = useMemo(() => {
        const items: { key: string; icon?: React.ReactNode; label: string }[] = [];
        if (property.location?.trim()) {
            items.push({
                key: 'loc',
                icon: <MapPin className="w-3.5 h-3.5 text-red shrink-0" aria-hidden="true" />,
                label: property.location.trim(),
            });
        }
        if (displayType) {
            items.push({ key: 'type', label: displayType });
        }
        if (isServiceOriented) {
            if (sharingLabel) {
                items.push({
                    key: 'sharing',
                    icon: <Users className="w-3.5 h-3.5 text-slate shrink-0" aria-hidden="true" />,
                    label: sharingLabel,
                });
            }
            if (mealsAvailable) {
                items.push({
                    key: 'meals',
                    icon: <Utensils className="w-3.5 h-3.5 text-slate shrink-0" aria-hidden="true" />,
                    label: 'Meals available',
                });
            }
        } else if (isPlot) {
            if (hasRealSqft) {
                items.push({ key: 'sqft', label: property.sqft });
            }
        } else {
            if (property.beds > 0 && !/\bbhk\b/i.test(displayType)) {
                items.push({
                    key: 'beds',
                    icon: <Bed className="w-3.5 h-3.5 text-slate shrink-0" aria-hidden="true" />,
                    label: `${property.beds} Bed`,
                });
            }
            if (furnishingLabel) {
                items.push({ key: 'furnishing', label: furnishingLabel });
            }
            if (hasRealSqft) {
                items.push({ key: 'sqft', label: property.sqft });
            }
        }
        return items;
    }, [
        property.location,
        property.beds,
        property.sqft,
        displayType,
        isServiceOriented,
        sharingLabel,
        mealsAvailable,
        isPlot,
        hasRealSqft,
        furnishingLabel,
    ]);

    // Responsive layout classes based on variant ('grid' | 'list' | 'auto')
    const isList = variant === 'list';
    const isAuto = variant === 'auto';

    const articleLayout = isList
        ? 'flex-col md:flex-row md:items-stretch'
        : isAuto
          ? 'flex-col lg:flex-row lg:items-stretch'
          : 'flex-col h-full';

    const imageBoxLayout = isList
        ? 'w-full md:w-[40%] md:max-w-[440px] shrink-0'
        : isAuto
          ? 'w-full lg:w-[40%] lg:max-w-[440px] shrink-0'
          : 'w-full shrink-0';

    const middleLayout = isList
        ? 'flex-1 min-w-0 flex flex-col justify-center gap-3 pt-3.5 md:pt-1 md:px-5'
        : isAuto
          ? 'flex-1 min-w-0 flex flex-col justify-center gap-3 pt-3.5 lg:pt-1 lg:px-5'
          : 'flex-1 min-w-0 flex flex-col gap-3 pt-3.5';

    const rightLayout = isList
        ? 'mt-4 pt-3.5 border-t border-line md:mt-0 md:pt-0 md:border-t-0 md:border-l md:pl-5 md:w-[220px] lg:w-[232px] shrink-0 flex flex-col justify-center'
        : isAuto
          ? 'mt-4 pt-3.5 border-t border-line lg:mt-0 lg:pt-0 lg:border-t-0 lg:border-l lg:pl-5 lg:w-[232px] shrink-0 flex flex-col justify-center'
          : 'mt-auto pt-3.5 border-t border-line flex flex-col gap-3';

    const priceAlignment = isList ? 'md:text-center' : isAuto ? 'lg:text-center' : '';

    return (
        <article
            className={`bg-white rounded-[14px] border border-line hover:border-red/40 transition-colors duration-200 p-3.5 sm:p-4 flex overflow-hidden relative ${articleLayout}`}
        >
            {/* Image Area (4:3) */}
            <div className={`relative aspect-[4/3] rounded-[10px] overflow-hidden bg-blush-100 ${imageBoxLayout}`}>
                {realImages.length > 0 ? (
                    <Link
                        to={propertyPath}
                        aria-label={`View photos for ${displayTitle}`}
                        className={`block h-full w-full ${FOCUS_RING} rounded-[10px]`}
                    >
                        <OptimizedImage
                            src={realImages[safeIdx]}
                            alt={`${displayTitle} in ${property.location || 'Bangalore'}`}
                            fill
                            priority={priority && safeIdx === 0}
                            size="medium"
                            sizes={
                                variant === 'grid'
                                    ? '(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw'
                                    : '(max-width: 1023px) 100vw, 440px'
                            }
                            className="object-cover"
                        />
                    </Link>
                ) : (
                    <Link
                        to={propertyPath}
                        aria-label={`View details for ${displayTitle}`}
                        className={`flex h-full w-full flex-col items-center justify-center gap-1.5 bg-blush-100 text-red/75 ${FOCUS_RING} rounded-[10px]`}
                    >
                        <Building2 className="w-8 h-8" aria-hidden="true" />
                        <span className="text-xs font-medium text-slate">Photos coming soon</span>
                    </Link>
                )}

                {/* Top Left Badge (only when real) */}
                {(!isAvailable || newlyVerified || property.listing_badge) && (
                    <div className="pointer-events-none absolute top-3 left-3 z-10 flex flex-wrap gap-1.5 pr-12">
                        {!isAvailable ? (
                            <span className="px-3 py-1 bg-red-900 rounded-full text-xs font-semibold text-white">
                                Fully booked
                            </span>
                        ) : newlyVerified ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/95 rounded-full text-xs font-semibold text-ink border border-line shadow-xs">
                                <Check className="w-3.5 h-3.5 text-red stroke-[2.5]" aria-hidden="true" />
                                Newly verified
                            </span>
                        ) : property.listing_badge ? (
                            <span className="px-3 py-1 bg-white/95 rounded-full text-xs font-semibold text-ink border border-line shadow-xs">
                                {property.listing_badge}
                            </span>
                        ) : null}
                    </div>
                )}

                {/* Wishlist Heart — 44px tap target */}
                <button
                    type="button"
                    aria-label={wishlisted ? `Remove ${displayTitle} from wishlist` : `Save ${displayTitle} to wishlist`}
                    aria-pressed={wishlisted}
                    onClick={handleHeartClick}
                    className={`absolute top-2 right-2 z-10 w-11 h-11 rounded-full bg-black/45 hover:bg-black/65 border border-white/25 flex items-center justify-center transition-colors cursor-pointer ${FOCUS_RING}`}
                >
                    <Heart
                        className={`w-[18px] h-[18px] transition-colors ${
                            wishlisted ? 'fill-red text-red' : 'text-white'
                        }`}
                        aria-hidden="true"
                    />
                </button>

                {/* Carousel Arrows & Dots (only when multiple real photos exist) */}
                {realImages.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={prevPhoto}
                            aria-label="Previous photo"
                            className={`absolute left-1 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full cursor-pointer ${FOCUS_RING}`}
                        >
                            <span className="w-8 h-8 rounded-full bg-white/95 hover:bg-white text-ink shadow-sm flex items-center justify-center transition-colors">
                                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={nextPhoto}
                            aria-label="Next photo"
                            className={`absolute right-1 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full cursor-pointer ${FOCUS_RING}`}
                        >
                            <span className="w-8 h-8 rounded-full bg-white/95 hover:bg-white text-ink shadow-sm flex items-center justify-center transition-colors">
                                <ChevronRight className="w-4 h-4" aria-hidden="true" />
                            </span>
                        </button>

                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 h-5 rounded-full bg-black/45 px-2 flex items-center gap-1.5"
                        >
                            {realImages.map((_, idx) => {
                                const active = idx === safeIdx;
                                return (
                                    <span
                                        key={idx}
                                        className={`block rounded-full transition-all ${
                                            active ? 'w-2.5 h-2.5 bg-red ring-1 ring-white' : 'w-1.5 h-1.5 bg-white/85'
                                        }`}
                                    />
                                );
                            })}
                        </div>
                        <div
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 flex items-center"
                            role="group"
                            aria-label="Photo pagination"
                        >
                            {realImages.map((_, idx) => {
                                const active = idx === safeIdx;
                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        aria-label={`View photo ${idx + 1} of ${realImages.length}`}
                                        aria-current={active ? 'true' : undefined}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setActiveIdx(idx);
                                        }}
                                        className={`h-11 w-6 rounded-full cursor-pointer ${FOCUS_RING}`}
                                    />
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            {/* Middle Column: Title, Meta Row, Amenity Tiles */}
            <div className={middleLayout}>
                <div>
                    <h3 title={displayTitle}>
                        <Link
                            to={propertyPath}
                            className={`font-heading font-bold text-ink text-lg sm:text-[20px] leading-snug line-clamp-2 hover:text-red transition-colors rounded ${FOCUS_RING}`}
                        >
                            {displayTitle}
                        </Link>
                    </h3>

                    {metaItems.length > 0 && (
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-slate">
                            {metaItems.map((item, idx) => (
                                <Fragment key={item.key}>
                                    {idx > 0 && (
                                        <span aria-hidden="true" className="h-3.5 w-px bg-line shrink-0" />
                                    )}
                                    <span className="inline-flex items-center gap-1.5 min-w-0">
                                        {item.icon}
                                        <span className={item.key === 'loc' ? 'font-medium text-ink truncate max-w-[180px]' : ''}>
                                            {item.label}
                                        </span>
                                    </span>
                                </Fragment>
                            ))}
                        </div>
                    )}
                </div>

                {/* Amenity Tiles Row (up to 5 real features + "+N more"; hidden if none) */}
                {amenityTiles.length > 0 && (
                    <div className="flex flex-wrap items-stretch gap-2 pt-1">
                        {amenityTiles.map((tile) => (
                            <div
                                key={tile.key}
                                className="rounded-[10px] border border-line bg-white px-2.5 py-2 flex flex-col items-center justify-center gap-1 min-w-[70px] flex-1 max-w-[104px] text-center"
                            >
                                {renderTileIcon(tile.icon)}
                                <span className="text-[11px] font-medium text-ink leading-tight truncate max-w-full">
                                    {tile.label}
                                </span>
                            </div>
                        ))}
                        {moreCount > 0 && (
                            <div className="rounded-[10px] border border-line bg-page px-2.5 py-2 flex items-center justify-center min-w-[70px] text-xs font-semibold text-slate whitespace-nowrap">
                                +{moreCount} more
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Right Column / Card Footer: Price + View Details + WhatsApp + Verified Date */}
            <div className={rightLayout}>
                <div className={priceAlignment}>
                    {hasNumericPrice && (
                        <p className="text-xs text-slate mb-1">
                            {isMonthlyRent ? 'Starting from' : 'Price'}
                        </p>
                    )}
                    <div
                        className={`flex items-baseline gap-1 flex-wrap ${
                            isList ? 'md:justify-center' : isAuto ? 'lg:justify-center' : ''
                        }`}
                    >
                        <span className="font-heading text-2xl sm:text-[26px] font-bold text-red leading-none whitespace-nowrap tabular-nums">
                            {property.price}
                        </span>
                        {isMonthlyRent && hasNumericPrice && (
                            <span className="text-sm font-medium text-ink">/mo</span>
                        )}
                    </div>
                </div>

                <div className="mt-3.5 flex flex-col gap-2">
                    <Link
                        to={propertyPath}
                        className={`min-h-[44px] w-full px-4 rounded-[10px] bg-red hover:bg-red-hover text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors ${FOCUS_RING}`}
                    >
                        <span>View details</span>
                        <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                    </Link>

                    <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Chat on WhatsApp about ${displayTitle}`}
                        className={`min-h-[44px] w-full px-4 rounded-[10px] border border-line bg-white hover:bg-blush-100 hover:border-red/45 text-ink text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors ${FOCUS_RING}`}
                    >
                        <MessageCircle className="w-4 h-4 shrink-0 text-verified" aria-hidden="true" />
                        <span>WhatsApp</span>
                    </a>
                </div>

                {verifiedDateLabel && (
                    <p className="mt-2.5 inline-flex items-center justify-center gap-1.5 text-xs text-slate">
                        <ShieldCheck className="w-3.5 h-3.5 text-verified shrink-0" aria-hidden="true" />
                        <span>Verified {verifiedDateLabel}</span>
                    </p>
                )}
            </div>
        </article>
    );
}

export const PropertyCard = memo(PropertyCardComponent);
