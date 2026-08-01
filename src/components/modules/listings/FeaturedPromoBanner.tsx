'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Star,
    Sparkles,
    CheckCircle2,
    MapPin,
    MessageCircle,
    Flame
} from 'lucide-react';
import { Link } from '@/lib/navigation';
import { getPropertyDetailPath } from '@/lib/propertyRouting';
import { buildPropertyWhatsappUrl } from '@/lib/whatsapp';
import { FEATURED_LAUNCH } from '@/data/featuredLaunch';
import type { Property } from '@/types/api';

interface FeaturedPromoBannerProps {
    properties?: Property[];
    launchProperty?: Property | null;
}

interface PromoSlide {
    id: string;
    keyword: string;
    title: string;
    subtitle: string;
    badge: string;
    rating: number;
    reviews: string;
    price: string;
    location: string;
    highlights: string[];
    image: string;
    fallbackId: number;
}

const PROMO_SLIDES: PromoSlide[] = [
    {
        id: 'infinity',
        keyword: 'infinity',
        title: 'Ekta – Infinity Apartments',
        subtitle: 'Luxury 2BHK & 3BHK Rental Homes in HSR Layout',
        badge: '🔥 LIMITED OFFER',
        rating: 4.9,
        reviews: '1,350 Reviews',
        price: 'Starting from ₹20,000 /month',
        location: 'HSR Layout & Chikkakannalli, Bangalore',
        highlights: ['✓ No Brokerage', '✓ Fully Furnished', '✓ Move Today'],
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
        fallbackId: 299,
    },
    {
        id: 'signature',
        keyword: 'signature',
        title: 'Signature Luxury Coliving PG',
        subtitle: 'Premium Rooms with Rooftop Lounge & Gourmet Meals',
        badge: '⭐ FEATURED PG OF THE WEEK',
        rating: 4.9,
        reviews: '1,250+ Residents',
        price: 'Starting from ₹14,999 /month',
        location: 'Bellandur & HSR Layout, Bangalore',
        highlights: ['✓ Daily Housekeeping', '✓ Hi-Speed WiFi', '✓ Zero Deposit'],
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=85',
        fallbackId: 301,
    },
    {
        id: 'cozy-colive',
        keyword: 'cozy',
        title: 'Cozy Colive & Studios',
        subtitle: 'Vibrant Community Living Designed for Tech Professionals',
        badge: '🎉 NO BROKERAGE SPECIAL',
        rating: 4.8,
        reviews: '1,180 Reviews',
        price: 'Starting from ₹12,500 /month',
        location: 'Koramangala & HSR Layout, Bangalore',
        highlights: ['✓ Gym & Gaming Area', '✓ Work From Home Ready', '✓ Move This Week'],
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=85',
        fallbackId: 302,
    },
];

export function FeaturedPromoBanner({ properties = [], launchProperty }: FeaturedPromoBannerProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Find matching live properties from loaded inventory for routing
    const slideProperties = useMemo(() => {
        return PROMO_SLIDES.map((slide) => {
            const matched = properties.find((p) => {
                const titleLower = (p.title || '').toLowerCase();
                return titleLower.includes(slide.keyword);
            });
            return {
                ...slide,
                detailPath: matched ? getPropertyDetailPath(matched) : `/properties/${slide.fallbackId}`,
                realPrice: matched?.price ? `From ${matched.price}/mo` : slide.price,
                realRating: Number(matched?.rating ?? matched?.average_rating ?? slide.rating) || slide.rating,
                realReviews: (matched?.reviews || matched?.review_count)
                    ? `${matched?.reviews || matched?.review_count} Reviews`
                    : slide.reviews,
            };
        });
    }, [properties]);

    // Auto-advance slides every 4.5 seconds
    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % PROMO_SLIDES.length);
        }, 4500);
        return () => clearInterval(timer);
    }, [isPaused]);

    const activeSlide = slideProperties[currentSlide] || slideProperties[0];
    const waUrl = buildPropertyWhatsappUrl(activeSlide.title, activeSlide.location);

    const ektaTitle = launchProperty?.title || 'Ekta – Infinity';
    const ektaLocation = launchProperty?.location || 'HSR Layout, Bangalore';
    const ektaWaUrl = buildPropertyWhatsappUrl(ektaTitle, ektaLocation);
    const ektaPath = launchProperty ? getPropertyDetailPath(launchProperty) : '/properties/299';

    const handlePrev = () => {
        setCurrentSlide((prev) => (prev - 1 + PROMO_SLIDES.length) % PROMO_SLIDES.length);
    };

    const handleNext = () => {
        setCurrentSlide((prev) => (prev + 1) % PROMO_SLIDES.length);
    };

    return (
        <div className="mb-10 md:mb-14 space-y-6 md:space-y-8 animate-fade-in">
            {/* ========================================================
               SECTION 1: ROTATING AUTO SLIDER (Infinity, Signature, Cozy Colive)
               ======================================================== */}
            <div
                className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-900 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.3)] group"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Background Image with Gradient Overlays */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={activeSlide.image}
                        alt={activeSlide.title}
                        className="w-full h-full object-cover transition-all duration-700 ease-out transform scale-[1.03] group-hover:scale-[1.06] opacity-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/30 md:bg-gradient-to-r md:from-slate-950 md:via-slate-950/85 md:to-transparent" />
                </div>

                {/* Slider Content */}
                <div className="relative z-10 px-6 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12 lg:py-14 max-w-3xl flex flex-col justify-between min-h-[380px] sm:min-h-[400px] lg:min-h-[420px]">
                    <div>
                        {/* Top Badge & Rating Strip */}
                        <div className="flex flex-wrap items-center gap-2.5 mb-4 sm:mb-5">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-red text-white text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-md">
                                <Sparkles className="w-3.5 h-3.5" />
                                {activeSlide.badge}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold">
                                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                <span>{activeSlide.realRating.toFixed(1)}</span>
                                <span className="text-white/60">• {activeSlide.realReviews}</span>
                            </span>
                        </div>

                        {/* Property Title & Subtitle */}
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-extrabold text-white leading-[1.15] tracking-tight mb-2.5 font-luxury">
                            {activeSlide.title}
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg text-slate-200/90 font-medium max-w-xl mb-4 sm:mb-6">
                            {activeSlide.subtitle}
                        </p>

                        {/* Location */}
                        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 mb-5">
                            <MapPin className="w-4 h-4 text-brand-red shrink-0" />
                            <span>{activeSlide.location}</span>
                        </div>

                        {/* Highlights List */}
                        <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8">
                            {activeSlide.highlights.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 text-xs sm:text-sm font-bold text-white"
                                >
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom CTA Button Group & Price */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/15">
                        <div>
                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-0.5">
                                Limited Offer Price
                            </p>
                            <p className="text-xl sm:text-2xl font-black text-white tracking-tight">
                                {activeSlide.realPrice}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                            <Link
                                to={activeSlide.detailPath}
                                className="px-5 py-3 rounded-xl bg-brand-red hover:bg-red-600 text-white text-xs sm:text-sm font-black uppercase tracking-widest shadow-lg shadow-brand-red/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                            >
                                <span>Book a Visit</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>

                            <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-2"
                            >
                                <MessageCircle className="w-4 h-4 text-emerald-400" />
                                <span>WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Left / Right Slider Navigation Arrows */}
                <div className="absolute right-4 top-4 sm:top-auto sm:bottom-8 z-20 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handlePrev}
                        aria-label="Previous slide"
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900/80 hover:bg-slate-900 border border-white/20 text-white flex items-center justify-center transition-all hover:scale-105"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        type="button"
                        onClick={handleNext}
                        aria-label="Next slide"
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900/80 hover:bg-slate-900 border border-white/20 text-white flex items-center justify-center transition-all hover:scale-105"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Interactive Slide Indicator Pills (Infinity • Signature • Cozy Colive) */}
                <div className="absolute left-6 bottom-3 sm:left-8 sm:bottom-4 z-20 flex items-center gap-2">
                    {PROMO_SLIDES.map((slide, idx) => {
                        const active = idx === currentSlide;
                        return (
                            <button
                                key={slide.id}
                                type="button"
                                onClick={() => setCurrentSlide(idx)}
                                aria-label={`Go to slide ${slide.title}`}
                                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                                    active
                                        ? 'bg-brand-red text-white shadow-md scale-105'
                                        : 'bg-black/40 hover:bg-black/60 text-white/70 border border-white/10'
                                }`}
                            >
                                {slide.id.replace('-', ' ')}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ========================================================
               SECTION 2: HIGH DEMAND FEATURED SPOTLIGHT (Ekta Infinity)
               ======================================================== */}
            <div className="relative overflow-hidden rounded-2xl border border-red-200/80 bg-gradient-to-r from-red-50/90 via-white to-white p-5 sm:p-6 shadow-md transition-all hover:shadow-lg mb-4 sm:mb-0">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
                    {/* Left: Badge & High Demand Copy */}
                    <div className="space-y-2.5 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-red text-white text-[10px] font-black uppercase tracking-widest shadow-sm">
                                <Flame className="w-3.5 h-3.5 fill-white animate-pulse" />
                                <span>High Demand</span>
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-700">
                                <span>#01 Featured Property</span>
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
                                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                <span>5.0 (320+ Happy Tenants)</span>
                            </span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-luxury">
                            {FEATURED_LAUNCH.headlineLead}{' '}
                            <span className="text-brand-red italic">{FEATURED_LAUNCH.headlineAccent}</span>
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 font-medium">
                            {FEATURED_LAUNCH.subheadline}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-1">
                            {FEATURED_LAUNCH.bullets.map((item, i) => (
                                <span
                                    key={i}
                                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-700"
                                >
                                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-red" />
                                    <span>{item}</span>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Right: Pricing & Quick Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col sm:items-center lg:items-end justify-between gap-3.5 sm:gap-4 shrink-0 border-t lg:border-t-0 pt-3.5 lg:pt-0 border-slate-200">
                        <div className="text-left lg:text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Monthly Rent
                            </p>
                            <p className="text-base sm:text-xl font-black text-slate-900 tracking-tight leading-snug">
                                {FEATURED_LAUNCH.priceFromLabel}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                            <Link
                                to={ektaPath}
                                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-1.5 shrink-0"
                            >
                                <span>Explore Ekta Infinity</span>
                                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                            </Link>

                            <a
                                href={ektaWaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
                            >
                                <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>Inquire</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
