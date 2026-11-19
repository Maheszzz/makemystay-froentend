'use client';

import React, { useMemo, useState } from 'react';
import {
    ArrowRight,
    Check,
    ChevronLeft,
    ChevronRight,
    MapPin,
    MessageCircle,
    Star,
} from 'lucide-react';

import { Link } from '@/lib/navigation';
import { formatPropertyTitle } from '@/lib/formatPropertyTitle';
import { formatVerifiedDate } from '@/lib/freshness';
import { getPropertyDetailPath } from '@/lib/propertyRouting';
import { getQualifiedRatingSummary } from '@/lib/ratings';
import { buildPropertyWhatsappUrl } from '@/lib/whatsapp';
import type { Property } from '@/types/api';

interface FeaturedPromoBannerProps {
    properties?: Property[];
    launchProperty?: Property | null;
}

function isRealPropertyImage(url?: string): boolean {
    if (!url || typeof url !== 'string') return false;
    const trimmed = url.trim();
    if (!trimmed) return false;
    if (trimmed.includes('images.unsplash.com/')) return false;
    if (trimmed === '/default-property.jpg') return false;
    return true;
}

function isEligibleFeaturedProperty(p: Property | null | undefined): p is Property {
    if (!p || !p.id || !p.title) return false;
    if (p.is_available === false) return false;
    if (!p.price || /request|negotiable/i.test(p.price)) return false;
    const realImg =
        (Array.isArray(p.images) ? p.images.find((img) => isRealPropertyImage(img)) : undefined) ||
        (isRealPropertyImage(p.image) ? p.image : undefined);
    return Boolean(realImg);
}

function resolveRealImage(p: Property): string {
    if (Array.isArray(p.images)) {
        const found = p.images.find((img) => isRealPropertyImage(img));
        if (found) return found;
    }
    return p.image;
}

function getFeaturedBadgeLabel(prop: Property): string | null {
    const ratingSummary = getQualifiedRatingSummary(prop);
    if (prop.last_verified_at) {
        const verifiedTime = new Date(prop.last_verified_at).getTime();
        const ageDays = Number.isFinite(verifiedTime)
            ? (Date.now() - verifiedTime) / (1000 * 60 * 60 * 24)
            : Infinity;
        if (ageDays <= 45) return 'Newly verified';
    }
    if (ratingSummary.showRating) return 'Top pick';
    if (prop.last_verified_at) return 'Verified listing';
    return null;
}

export function FeaturedPromoBanner({ properties = [], launchProperty }: FeaturedPromoBannerProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const eligibleSlides = useMemo(() => {
        const ranked = [...properties]
            .filter(isEligibleFeaturedProperty)
            .sort((a, b) => {
                const aVer = a.last_verified_at ? new Date(a.last_verified_at).getTime() : 0;
                const bVer = b.last_verified_at ? new Date(b.last_verified_at).getTime() : 0;
                if (bVer !== aVer) return bVer - aVer;
                const aRev = getQualifiedRatingSummary(a).showRating ? a.review_count ?? 0 : 0;
                const bRev = getQualifiedRatingSummary(b).showRating ? b.review_count ?? 0 : 0;
                return bRev - aRev;
            });

        const candidates: Property[] = [];
        if (isEligibleFeaturedProperty(launchProperty)) {
            candidates.push(launchProperty);
        }
        for (const p of ranked) {
            if (candidates.some((c) => String(c.id) === String(p.id))) continue;
            candidates.push(p);
            if (candidates.length >= 3) break;
        }

        return candidates.map((prop) => {
            const title = formatPropertyTitle(prop.title) || prop.title;
            const detailPath = getPropertyDetailPath(prop);
            const isMonthly =
                prop.category === 'pg' ||
                prop.category === 'rent' ||
                (prop.type || '').toLowerCase() === 'pg' ||
                (prop.type || '').toLowerCase() === 'hostel';
            const ratingSummary = getQualifiedRatingSummary(prop);
            const verifiedDate = formatVerifiedDate(prop.last_verified_at);

            const facts: string[] = [];
            if (prop.type) facts.push(prop.type);
            if (Array.isArray(prop.sharing) && prop.sharing.length > 0 && prop.category === 'pg') {
                const formatted = prop.sharing.map((s) =>
                    s.toLowerCase() === 'shared' ? 'Shared room' : s,
                );
                facts.push(
                    formatted.length === 1 && formatted[0] === 'Shared room'
                        ? 'Shared room'
                        : `${formatted.join(' / ')} sharing`,
                );
            } else if (prop.furnishing) {
                facts.push(prop.furnishing.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase()));
            }
            if (prop.food) facts.push('Meals available');
            else if (prop.wifi) facts.push('WiFi');
            if (verifiedDate) facts.push(`Verified ${verifiedDate}`);

            return {
                id: String(prop.id),
                title,
                badgeLabel: getFeaturedBadgeLabel(prop),
                location: prop.location || prop.city || 'Bangalore',
                image: resolveRealImage(prop),
                detailPath,
                priceText: isMonthly ? `${prop.price}/mo` : prop.price,
                isMonthly,
                ratingSummary,
                facts: facts.slice(0, 3),
                waUrl: buildPropertyWhatsappUrl(title, prop.location || '', detailPath),
            };
        });
    }, [properties, launchProperty]);

    if (eligibleSlides.length === 0) {
        return null;
    }

    const safeIndex = currentSlide < eligibleSlides.length ? currentSlide : 0;
    const activeSlide = eligibleSlides[safeIndex] || eligibleSlides[0];

    const handlePrev = () => {
        setCurrentSlide((prev) => (prev - 1 + eligibleSlides.length) % eligibleSlides.length);
    };

    const handleNext = () => {
        setCurrentSlide((prev) => (prev + 1) % eligibleSlides.length);
    };

    return (
        <section aria-label="Featured listing" className="mb-8">
            <div className="relative overflow-hidden rounded-[var(--radius-pdp)] border border-pdp-border bg-[#14161A] min-h-[288px] md:h-[304px] group">
                <img
                    src={activeSlide.image}
                    alt={`${activeSlide.title} in ${activeSlide.location}`}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Scrim stays behind text column so the right side photo stays clearly visible */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#14161A]/95 via-[#14161A]/80 via-60% to-[#14161A]/20 md:bg-gradient-to-r md:from-[#14161A]/95 md:via-[#14161A]/75 md:via-52% md:to-transparent"
                />

                <div className="relative z-10 h-full min-h-[288px] md:min-h-[304px] px-5 py-6 sm:px-8 md:px-10 max-w-2xl flex flex-col justify-between gap-4">
                    <div>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            {activeSlide.badgeLabel && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-medium">
                                    <Check className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                                    {activeSlide.badgeLabel}
                                </span>
                            )}
                            {activeSlide.ratingSummary.showRating && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/15 text-white text-xs font-medium tabular-nums">
                                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                                    <span>{activeSlide.ratingSummary.rating.toFixed(1)}</span>
                                    <span className="text-white/75">
                                        ({activeSlide.ratingSummary.reviewCount})
                                    </span>
                                </span>
                            )}
                        </div>

                        <h2 className="font-serif-display text-2xl sm:text-[32px] font-normal text-white leading-[1.15] tracking-[-0.01em] line-clamp-2 max-w-xl">
                            {activeSlide.title}
                        </h2>

                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/85">
                            <span className="inline-flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-white/70 shrink-0" />
                                <span>{activeSlide.location}</span>
                            </span>
                            {activeSlide.facts.map((fact) => (
                                <span key={fact} className="inline-flex items-center gap-2 text-xs text-white/80">
                                    <span aria-hidden="true" className="text-white/40">·</span>
                                    <span>{fact}</span>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-3 border-t border-white/15">
                        <div>
                            <p className="text-xs text-white/75 mb-0.5">
                                {activeSlide.isMonthly ? 'Starting from' : 'Listed price'}
                            </p>
                            <p className="text-xl sm:text-2xl font-semibold text-white tracking-tight tabular-nums">
                                {activeSlide.priceText}
                            </p>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <Link
                                to={activeSlide.detailPath}
                                className="min-h-[44px] px-5 py-2.5 rounded-[10px] bg-pdp-cta hover:bg-pdp-cta-hover text-white text-sm font-medium transition-colors inline-flex items-center justify-center gap-1.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                            >
                                <span>View details</span>
                                <ArrowRight className="w-4 h-4 shrink-0" />
                            </Link>

                            <a
                                href={activeSlide.waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Chat on WhatsApp about ${activeSlide.title}`}
                                className="min-h-[44px] px-4 py-2.5 rounded-[10px] bg-white/10 hover:bg-white/20 border border-white/25 text-white text-sm font-medium transition-colors inline-flex items-center justify-center gap-1.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                            >
                                <MessageCircle className="w-4 h-4 shrink-0" />
                                <span>WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </div>

                {eligibleSlides.length > 1 && (
                    <div className="hidden sm:flex absolute right-4 bottom-4 z-20 items-center gap-1.5">
                        <button
                            type="button"
                            onClick={handlePrev}
                            aria-label="Previous highlighted listing"
                            className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/75 border border-white/20 text-white flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            aria-label="Next highlighted listing"
                            className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/75 border border-white/20 text-white flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
