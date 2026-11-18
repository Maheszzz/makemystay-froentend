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
            className={`group flex flex-col rounded-2xl bg-white shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden ${
                launch
                    ? 'border-2 border-brand-red/40 ring-2 ring-brand-red/10 shadow-[0_12px_40px_-16px_rgba(217,32,39,0.35)]'
                    : 'border border-slate-200/80'
            }`}
        >
            {/* Image + overlays */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                <img
                    src={image}
                    alt={title}
                    width={400}
                    height={250}
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                {launch ? (
                    <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-md bg-brand-red px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
                        <Sparkles className="w-3 h-3" />
                        New
                    </span>
                ) : (
                    typeof rank === 'number' &&
                    rank > 0 && (
                        <span
                            className={`absolute left-3 top-3 z-10 flex h-8 w-10 items-center justify-center rounded-md text-sm font-extrabold text-white ${badgeBg}`}
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
                    className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow backdrop-blur-sm hover:bg-white transition-colors"
                >
                    <Heart className="h-4 w-4 text-slate-500 group-hover:text-rose-500 transition-colors" />
                </button>
            </div>

            {/* Card body */}
            <div className="flex flex-1 flex-col px-3 pt-3 pb-3">
                {/* Title + optional Featured badge */}
                <div className="flex items-start gap-2 mb-0.5">
                    <h3 title={title} className="flex-1 text-[15px] leading-snug font-bold text-slate-900 line-clamp-2 min-h-[2.4rem]">
                        {title}
                    </h3>
                    {featured && (
                        <span className="shrink-0 mt-0.5 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                            Featured
                        </span>
                    )}
                </div>

                {/* Location */}
                {locationLabel && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-slate-600">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                        <span className="line-clamp-1">{locationLabel}</span>
                    </div>
                )}

                {/* Rating & Reviews */}
                <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                    {hasRealRating ? (
                        <>
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200/60">
                                <Star className="h-3 w-3 fill-emerald-600 text-emerald-600" />
                                {ratingVal.toFixed(1)}
                            </span>
                            <span className="text-[11px] font-medium text-slate-600">
                                ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                            </span>
                        </>
                    ) : (
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                            Verified Listing
                        </span>
                    )}
                </div>

                {/* Price + room type */}
                <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-slate-600">
                        Starting from{' '}
                        <span className="text-[15px] font-extrabold text-slate-900">
                            {priceLabel}
                            {isMonthlyRent && hasNumericPrice ? '/mo' : ''}
                        </span>
                    </p>
                    {propertyType && (
                        <span className="shrink-0 inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 border border-slate-200">
                            {propertyType}
                        </span>
                    )}
                </div>

                {/* CTA */}
                <span className="mt-3 w-full rounded-lg border border-brand-red px-4 py-2 text-center text-sm font-bold text-brand-red group-hover:bg-brand-red group-hover:text-white transition-colors inline-flex items-center justify-center gap-1.5">
                    Know more
                    <ArrowRight className="h-4 w-4" />
                </span>
            </div>
        </Link>
    );
}

export default FeaturedProjectCard;
