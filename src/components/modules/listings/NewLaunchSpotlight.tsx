import { useMemo, useState } from 'react';
import { Link } from '@/lib/navigation';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import {
    ArrowRight,
    Bath,
    Bed,
    ChevronLeft,
    ChevronRight,
    Heart,
    MapPin,
    Sparkles,
    Star,
    Thermometer,
} from 'lucide-react';

import { useWishlist } from '@/context/WishlistContext';
import { FEATURED_LAUNCH } from '@/data/featuredLaunch';
import { getPropertyDetailPath } from '@/lib/propertyRouting';
import { buildPropertyWhatsappUrl } from '@/lib/whatsapp';
import type { Property } from '@/types/api';

const FALLBACK_IMAGE =
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85';

const TENANT_AVATARS = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80',
];

interface NewLaunchSpotlightProps {
    property: Property;
}

function collectImages(property: Property): string[] {
    const fromList = (property.images ?? []).filter(Boolean);
    if (fromList.length > 0) return fromList;
    if (property.image) return [property.image];
    return [FALLBACK_IMAGE];
}

function formatPriceMonthly(price: string): string {
    const p = price.trim();
    if (!p) return FEATURED_LAUNCH.priceFromLabel;
    if (p.toLowerCase().includes('/mo') || p.toLowerCase().includes('month')) return p.startsWith('From') ? p : `From ${p}`;
    return `From ${p}/mo`;
}

export function NewLaunchSpotlight({ property }: NewLaunchSpotlightProps) {
    const detailHref = getPropertyDetailPath(property);
    const images = useMemo(() => collectImages(property), [property]);
    const [activeImage, setActiveImage] = useState(0);
    const { isWishlisted, toggleWishlist } = useWishlist();
    const wishlisted = isWishlisted(String(property.id));

    const title = property.title || 'Urban Homes';
    const location = property.location || 'HSR Layout, Bangalore';
    const priceDisplay = formatPriceMonthly(property.price?.trim() || '₹25,000');
    const rating =
        (property.rating || property.average_rating)
            ? Number(property.rating ?? property.average_rating)
            : FEATURED_LAUNCH.socialProof.rating;
    const reviewCount =
        (property.reviews || property.review_count)
            ? (property.reviews ?? property.review_count)
            : FEATURED_LAUNCH.socialProof.reviewCount;
    const waLink = buildPropertyWhatsappUrl(title, location);

    const goImage = (dir: -1 | 1) => {
        setActiveImage((i) => (i + dir + images.length) % images.length);
    };

    return (
        <section className="mb-5 md:mb-6" aria-label="Newly launched property">
            <div className="relative overflow-hidden rounded-[var(--radius-pdp)] border border-line bg-white lg:max-h-[320px]">
                <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-0 lg:max-h-[320px]">
                    {/* Copy */}
                    <div className="relative z-10 flex flex-col justify-center p-4 sm:p-5 lg:py-4 lg:px-6 order-2 lg:order-1 lg:overflow-hidden">
                        <div className="inline-flex items-center gap-1.5 w-fit rounded-full border border-line bg-blush-100 px-2.5 py-1 mb-2.5">
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-red" aria-hidden />
                            <Sparkles className="w-3.5 h-3.5 text-red" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red">
                                {FEATURED_LAUNCH.badge}
                            </span>
                        </div>

                        <h2 className="text-xl sm:text-2xl lg:text-[1.65rem] font-bold text-ink leading-tight tracking-tight font-heading">
                            {FEATURED_LAUNCH.headlineLead}{' '}
                            <span className="text-red italic">{FEATURED_LAUNCH.headlineAccent}</span>
                        </h2>
                        <p className="mt-1.5 text-sm text-slate leading-snug max-w-md">
                            {FEATURED_LAUNCH.subheadline}
                        </p>

                        <ul className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1">
                            {FEATURED_LAUNCH.bullets.map((item) => (
                                <li key={item} className="flex items-center gap-1.5 text-xs text-ink">
                                    <span className="h-1 w-1 shrink-0 rounded-full bg-red" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs font-semibold text-ink">
                            <span className="inline-flex items-center gap-1.5">
                                <Bed className="w-3.5 h-3.5 text-slate" />
                                {property.beds || 1} Bed
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Bath className="w-3.5 h-3.5 text-slate" />
                                {property.baths || 1} Bath
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-red" />
                                {location}
                            </span>
                        </div>

                        <div className="mt-2 inline-flex w-fit rounded-full bg-blush-100 border border-line px-3 py-1">
                            <span className="text-xs font-bold text-red tabular-nums">{priceDisplay}</span>
                        </div>

                        <div className="mt-2.5 flex flex-col sm:flex-row gap-2">
                            <Link
                                to={detailHref}
                                className="inline-flex items-center justify-center gap-1.5 rounded-[10px] bg-red px-4 py-2 text-xs font-semibold text-white hover:bg-red-hover transition-colors"
                            >
                                View Listing
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                            <a
                                href={waLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-1.5 rounded-[10px] border border-ink bg-white px-4 py-2 text-xs font-semibold text-ink hover:bg-blush-100 transition-colors"
                            >
                                Chat on WhatsApp
                            </a>
                        </div>

                        <div className="mt-2.5 hidden sm:flex items-center gap-2 pt-2.5 border-t border-line">
                            <div className="flex -space-x-2">
                                {TENANT_AVATARS.map((src, i) => (
                                    <img
                                        key={src}
                                        src={src}
                                        alt=""
                                        className="h-7 w-7 rounded-full border-2 border-white object-cover shadow-sm"
                                        style={{ zIndex: TENANT_AVATARS.length - i }}
                                    />
                                ))}
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-ink">{FEATURED_LAUNCH.socialProof.label}</p>
                                <p className="flex items-center gap-1 text-[11px] text-slate">
                                    <Star className="w-3 h-3 fill-champagne text-champagne" />
                                    <span className="font-bold text-ink">{rating.toFixed(1)}</span>
                                    <span>({reviewCount} reviews)</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Gallery */}
                    <div className="relative order-1 lg:order-2 min-h-[180px] sm:min-h-[200px] lg:min-h-0 lg:h-full lg:max-h-[320px] aspect-[4/3] lg:aspect-auto bg-blush-100">
                        <OptimizedImage
                            key={images[activeImage]}
                            src={images[activeImage]}
                            alt={title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover"
                        />

                        {images.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => goImage(-1)}
                                    className="absolute left-2 top-1/2 z-20 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-ink border border-line hover:bg-white transition-colors"
                                    aria-label="Previous photo"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => goImage(1)}
                                    className="absolute right-2 top-1/2 z-20 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-ink border border-line hover:bg-white transition-colors lg:right-24"
                                    aria-label="Next photo"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </>
                        )}

                        <div className="absolute top-2.5 left-2.5 z-20 flex flex-wrap gap-1.5">
                            <span className="rounded-md bg-white/95 border border-line px-2 py-0.5 text-[10px] font-semibold text-ink">
                                {property.type || '1BHK'}
                            </span>
                            <span className="inline-flex items-center gap-0.5 rounded-md bg-red-900/90 px-2 py-0.5 text-[10px] font-semibold text-white tabular-nums">
                                <Star className="w-3 h-3 fill-champagne text-champagne" />
                                {rating.toFixed(1)}
                                <span className="font-normal text-red-subtitle">({reviewCount})</span>
                            </span>
                        </div>

                        <button
                            type="button"
                            aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                            onClick={() => toggleWishlist(property)}
                            className="absolute top-2.5 right-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 border border-line hover:bg-blush-100 transition-colors"
                        >
                            <Heart
                                className={`h-4 w-4 transition-colors ${wishlisted ? 'fill-red text-red' : 'text-ink'}`}
                            />
                        </button>

                        <div className="absolute bottom-2.5 right-2.5 left-2.5 sm:left-auto sm:w-[min(100%,200px)] z-20">
                            <div className="rounded-xl bg-red-900/95 border border-champagne/30 p-2.5 text-white">
                                <p className="text-[10px] font-medium text-red-subtitle">
                                    Property price
                                </p>
                                <p className="mt-0.5 text-lg font-bold tabular-nums leading-tight">
                                    {property.price?.trim() || '₹25,000'}
                                    {!property.price?.includes('/mo') && (
                                        <span className="text-sm font-medium text-red-subtitle">/mo</span>
                                    )}
                                </p>
                                <div className="mt-1.5 flex flex-wrap gap-2 text-[10px] font-medium text-red-subtitle">
                                    <span className="inline-flex items-center gap-1">
                                        <Bed className="w-3.5 h-3.5" />
                                        {property.beds || 1} Beds
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                        <Bath className="w-3.5 h-3.5" />
                                        {property.baths || 1} Baths
                                    </span>
                                    {property.geyser && (
                                        <span className="inline-flex items-center gap-1 text-red-subtitle">
                                            <Thermometer className="w-3.5 h-3.5" />
                                            Geyser
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {images.length > 1 && (
                            <div className="absolute bottom-4 left-4 flex gap-1.5 z-20 sm:hidden">
                                {images.slice(0, 5).map((_, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        aria-label={`Photo ${i + 1}`}
                                        onClick={() => setActiveImage(i)}
                                        className={`h-1.5 rounded-full transition-all ${
                                            i === activeImage ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
