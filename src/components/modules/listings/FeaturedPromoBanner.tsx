'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    MapPin,
    MessageCircle,
    Star,
} from 'lucide-react';

import { Link } from '@/lib/navigation';
import { formatPropertyTitle } from '@/lib/formatPropertyTitle';
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

export function FeaturedPromoBanner({ properties = [], launchProperty }: FeaturedPromoBannerProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const eligibleSlides = useMemo(() => {
        const candidates: Property[] = [];
        if (isEligibleFeaturedProperty(launchProperty)) {
            candidates.push(launchProperty);
        }
        for (const p of properties) {
            if (!isEligibleFeaturedProperty(p)) continue;
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
            const highlights = [
                prop.wifi ? 'WiFi' : null,
                prop.food ? 'Food Available' : null,
                prop.housekeeping ? 'Housekeeping' : null,
                prop.power_backup ? 'Power Backup' : null,
                'Zero Brokerage',
            ].filter((v): v is string => Boolean(v));

            return {
                id: String(prop.id),
                title,
                type: prop.type || 'Listing',
                location: prop.location || prop.city || 'Bangalore',
                image: resolveRealImage(prop),
                detailPath,
                priceText: isMonthly ? `${prop.price} /mo` : prop.price,
                isMonthly,
                ratingSummary,
                highlights: highlights.slice(0, 4),
                waUrl: buildPropertyWhatsappUrl(title, prop.location || '', detailPath),
            };
        });
    }, [properties, launchProperty]);

    useEffect(() => {
        if (currentSlide >= eligibleSlides.length) {
            setCurrentSlide(0);
        }
    }, [eligibleSlides.length, currentSlide]);

    useEffect(() => {
        if (isPaused || eligibleSlides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % eligibleSlides.length);
        }, 4500);
        return () => clearInterval(timer);
    }, [isPaused, eligibleSlides.length]);

    if (eligibleSlides.length === 0) {
        return null;
    }

    const activeSlide = eligibleSlides[currentSlide] || eligibleSlides[0];

    const handlePrev = () => {
        setCurrentSlide((prev) => (prev - 1 + eligibleSlides.length) % eligibleSlides.length);
    };

    const handleNext = () => {
        setCurrentSlide((prev) => (prev + 1) % eligibleSlides.length);
    };

    return (
        <div className="mb-10 md:mb-14 animate-fade-in">
            <div
                className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-900 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.3)] group"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Real Property Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={activeSlide.image}
                        alt={`${activeSlide.title} in ${activeSlide.location}`}
                        className="w-full h-full object-cover transition-all duration-700 ease-out transform scale-[1.03] group-hover:scale-[1.06] opacity-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-900/30 md:bg-gradient-to-r md:from-slate-950 md:via-slate-950/85 md:to-transparent" />
                </div>

                {/* Slider Content */}
                <div className="relative z-10 px-5 pt-6 pb-16 sm:px-8 sm:py-10 md:px-12 md:py-12 lg:py-14 max-w-3xl flex flex-col justify-between min-h-[360px] sm:min-h-[380px]">
                    <div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-4 sm:mb-5 pr-20 sm:pr-0">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-red text-white text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-md">
                                Featured {activeSlide.type}
                            </span>
                            {activeSlide.ratingSummary.showRating && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold">
                                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                                    <span>{activeSlide.ratingSummary.rating.toFixed(1)}</span>
                                    <span className="text-white/75">
                                        ({activeSlide.ratingSummary.reviewCount} reviews)
                                    </span>
                                </span>
                            )}
                        </div>

                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-extrabold text-white leading-[1.15] tracking-tight mb-3 font-luxury">
                            {activeSlide.title}
                        </h2>

                        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-200 mb-5">
                            <MapPin className="w-4 h-4 text-brand-red shrink-0" />
                            <span>{activeSlide.location}</span>
                        </div>

                        {activeSlide.highlights.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 sm:gap-3 mb-6 sm:mb-8">
                                {activeSlide.highlights.map((item) => (
                                    <span
                                        key={item}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 text-xs sm:text-sm font-bold text-white"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 pt-4 border-t border-white/15">
                        <div>
                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-300 mb-0.5">
                                {activeSlide.isMonthly ? 'Starting Rent' : 'Listed Price'}
                            </p>
                            <p className="text-xl sm:text-2xl font-black text-white tracking-tight">
                                {activeSlide.priceText}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
                            <Link
                                to={activeSlide.detailPath}
                                className="flex-1 sm:flex-initial justify-center px-4 py-3 rounded-xl bg-brand-red hover:bg-red-600 text-white text-xs sm:text-sm font-black uppercase tracking-widest shadow-lg shadow-brand-red/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-1.5 shrink-0"
                            >
                                <span>Book a Visit</span>
                                <ArrowRight className="w-4 h-4 shrink-0" />
                            </Link>

                            <a
                                href={activeSlide.waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 sm:flex-initial justify-center px-4 py-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 shrink-0"
                            >
                                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </div>

                {eligibleSlides.length > 1 && (
                    <>
                        <div className="absolute right-4 top-4 sm:top-auto sm:bottom-8 z-20 flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handlePrev}
                                aria-label="Previous featured listing"
                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900/80 hover:bg-slate-900 border border-white/20 text-white flex items-center justify-center transition-all hover:scale-105"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                type="button"
                                onClick={handleNext}
                                aria-label="Next featured listing"
                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900/80 hover:bg-slate-900 border border-white/20 text-white flex items-center justify-center transition-all hover:scale-105"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="absolute left-5 bottom-3.5 sm:left-8 sm:bottom-4 z-20 flex items-center gap-1.5 sm:gap-2">
                            {eligibleSlides.map((slide, idx) => {
                                const active = idx === currentSlide;
                                return (
                                    <button
                                        key={slide.id}
                                        type="button"
                                        onClick={() => setCurrentSlide(idx)}
                                        aria-label={`View ${slide.title}`}
                                        className={`h-2 rounded-full transition-all ${
                                            active
                                                ? 'w-6 bg-brand-red'
                                                : 'w-2 bg-white/40 hover:bg-white/70'
                                        }`}
                                    />
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
