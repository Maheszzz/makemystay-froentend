import { ArrowRight, Heart, MapPin, Sparkles, Star } from 'lucide-react';
import { Link } from '@/lib/navigation';

import { getPropertyDetailPath } from '@/lib/propertyRouting';
import { getQualifiedRatingSummary } from '@/lib/ratings';
import type { Property } from '@/types/api';

interface FeaturedProjectCardProps {
    property: Property;
    rank?: number;
    featured?: boolean;
    /** Homepage new-launch slot — special badge instead of numeric rank */
    launch?: boolean;
}

const FALLBACK_IMAGE =
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80';

const RANK_COLORS = [
    'bg-slate-900',
    'bg-orange-500',
    'bg-emerald-600',
    'bg-blue-600',
    'bg-purple-600',
    'bg-rose-600',
    'bg-amber-500',
    'bg-teal-600',
];

function rankLabel(rank: number) {
    return rank.toString().padStart(2, '0');
}

export function FeaturedProjectCard({ property, rank, featured, launch }: FeaturedProjectCardProps) {
    const detailHref = getPropertyDetailPath(property);
    const title = property.title || 'Untitled Property';
    const image = property.image || FALLBACK_IMAGE;
    const locationLabel = property.location || '';
    const propertyType = property.type || '';
    const priceLabel = property.price && property.price.trim() ? property.price : 'Price on request';
    const isMonthlyRent =
        property.category === 'pg' ||
        property.category === 'rent' ||
        (property.type || '').toLowerCase() === 'pg' ||
        (property.type || '').toLowerCase() === 'hostel';
    const hasNumericPrice = Boolean(priceLabel && !/request/i.test(priceLabel));
    const badgeBg = typeof rank === 'number' && rank > 0 ? RANK_COLORS[(rank - 1) % RANK_COLORS.length] : '';
    const { showRating: hasRealRating, rating: ratingVal, reviewCount } = getQualifiedRatingSummary(property);

    return (
        <Link
            to={detailHref}
            className={`group flex flex-col rounded-[var(--radius-pdp)] bg-white hover:border-ink/35 transition-colors overflow-hidden ${
                launch
                    ? 'border border-red ring-1 ring-red/20'
                    : 'border border-line'
            }`}
        >
            {/* Image + overlays */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-blush-100">
                <img
                    src={image}
                    alt={title}
                    width={400}
                    height={250}
                    decoding="async"
                    className="h-full w-full object-cover"
                    loading="lazy"
                />

                {launch ? (
                    <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-md bg-red px-2.5 py-1 text-xs font-semibold text-white">
                        <Sparkles className="w-3 h-3" />
                        New
                    </span>
                ) : (
                    typeof rank === 'number' &&
                    rank > 0 && (
                        <span
                            className={`absolute left-3 top-3 z-10 flex h-8 w-10 items-center justify-center rounded-md text-sm font-bold text-white ${badgeBg}`}
                        >
                            {rankLabel(rank)}
                        </span>
                    )
                )}

                {/* Heart / wishlist — top-right */}
                <button
                    type="button"
                    aria-label="Save to wishlist"
                    onClick={(e) => e.preventDefault()}
                    className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 border border-line hover:bg-blush-100 transition-colors"
                >
                    <Heart className="h-4 w-4 text-ink group-hover:text-red transition-colors" />
                </button>
            </div>

            {/* Card body */}
            <div className="flex flex-1 flex-col px-3.5 pt-3.5 pb-3.5">
                {/* Title + optional Featured badge */}
                <div className="flex items-start gap-2 mb-0.5">
                    <h3 title={title} className="flex-1 font-serif-display text-[17px] leading-snug font-normal text-ink line-clamp-2 min-h-[2.6rem] group-hover:underline decoration-champagne underline-offset-4">
                        {title}
                    </h3>
                    {featured && (
                        <span className="shrink-0 mt-0.5 inline-flex items-center rounded-full bg-blush-100 px-2 py-0.5 text-[10px] font-semibold text-champagne-text border border-champagne/40">
                            Featured
                        </span>
                    )}
                </div>

                {/* Location */}
                {locationLabel && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-slate">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-slate" />
                        <span className="line-clamp-1">{locationLabel}</span>
                    </div>
                )}

                {/* Rating & Reviews */}
                <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                    {hasRealRating ? (
                        <>
                            <span className="inline-flex items-center gap-1 rounded-md bg-blush-100 px-2 py-0.5 text-[11px] font-semibold text-ink border border-line tabular-nums">
                                <Star className="h-3 w-3 fill-champagne text-champagne" />
                                {ratingVal.toFixed(1)}
                            </span>
                            <span className="text-[11px] font-medium text-slate tabular-nums">
                                ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                            </span>
                        </>
                    ) : (
                        <span className="inline-flex items-center rounded-md bg-page border border-line px-2 py-0.5 text-[11px] font-semibold text-slate">
                            Verified Listing
                        </span>
                    )}
                </div>

                {/* Price + room type */}
                <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-slate">
                        Starting from{' '}
                        <span className="text-[15px] font-bold text-ink tabular-nums">
                            {priceLabel}
                            {isMonthlyRent && hasNumericPrice ? '/mo' : ''}
                        </span>
                    </p>
                    {propertyType && (
                        <span className="shrink-0 inline-flex items-center rounded-md bg-page px-2 py-0.5 text-[10px] font-semibold text-slate border border-line">
                            {propertyType}
                        </span>
                    )}
                </div>

                {/* CTA */}
                <span className="mt-3 w-full rounded-[10px] border border-red px-4 py-2 text-center text-sm font-semibold text-red group-hover:bg-red group-hover:text-white transition-colors inline-flex items-center justify-center gap-1.5">
                    Know more
                    <ArrowRight className="h-4 w-4" />
                </span>
            </div>
        </Link>
    );
}

export default FeaturedProjectCard;
