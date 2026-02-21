import { useState, useEffect } from 'react';
import { SmartSearchBar } from '@/components/modules/search/SmartSearchBar';

const slides = [
    {
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=90&w=1920',
        eyebrow: 'PROFESSIONAL • TRUSTED • SEAMLESS',
        headline: 'From Clicks to',
        headlineItalic: 'Closure',
        subheadline: 'Your Next Home Is Just a Click Away',
        description: 'Affordable, flexible, and secure stays meticulously curated for students & professionals.',
    },
    {
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=90&w=1920',
        eyebrow: 'CURATED • AFFORDABLE • SECURE',
        headline: 'Find Your',
        headlineItalic: 'Perfect Stay',
        subheadline: 'Zero Broker Fees. 100% Verified.',
        description: 'AI-powered matching connects you to the right property — instantly, seamlessly, affordably.',
    },
    {
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=90&w=1920',
        eyebrow: 'SMART • MODERN • HASSLE-FREE',
        headline: 'Live Where',
        headlineItalic: 'You Belong',
        subheadline: 'Premium Rooms for Students & Professionals',
        description: 'Handpicked furnished rooms and apartments across prime city locations — move in today.',
    },
    {
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=90&w=1920',
        eyebrow: 'TRUSTED • VERIFIED • SEAMLESS',
        headline: 'Your Dream Home,',
        headlineItalic: 'Delivered',
        subheadline: 'Powered by AI. Built for You.',
        description: 'MakeMyStay.ai automates your entire stay journey — from search to settlement.',
    },
];

const SLIDE_INTERVAL = 4500;
const FADE_DURATION = 1500;

interface HeroProps {
    category: 'pg' | 'rent' | 'buy' | 'plot' | 'all';
    setCategory: (category: 'pg' | 'rent' | 'buy' | 'plot' | 'all') => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export function Hero({ category, setCategory, searchQuery, setSearchQuery }: HeroProps) {
    const [current, setCurrent] = useState(0);
    const [contentVisible, setContentVisible] = useState(true);

    // Preload images
    useEffect(() => {
        slides.forEach((slide) => {
            const img = new Image();
            img.src = slide.image;
        });
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setContentVisible(false);
            setTimeout(() => {
                setCurrent(prev => (prev + 1) % slides.length);
                setContentVisible(true);
            }, FADE_DURATION);
        }, SLIDE_INTERVAL);
        return () => clearInterval(timer);
    }, []);

    const slide = slides[current];

    return (
        <section
            id="home"
            className="relative w-full"
            style={{ height: '100dvh', minHeight: '600px', zIndex: 20 }}
        >
            {/* ── Background Image Layers (crossfade) ── */}
            {slides.map((s, idx) => (
                <div
                    key={idx}
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url(${s.image})`,
                        opacity: idx === current ? 1 : 0,
                        transition: `opacity ${FADE_DURATION}ms ease-in-out`,
                        zIndex: 0,
                    }}
                    aria-hidden="true"
                />
            ))}

            {/* ── Overlays ── */}
            <div className="absolute inset-0 bg-black/55" style={{ zIndex: 1 }} />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" style={{ zIndex: 2 }} />
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 100%)', zIndex: 3 }} />

            {/* ── Slide dot indicators ── */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2" style={{ zIndex: 20 }}>
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        aria-label={`Go to slide ${idx + 1}`}
                        onClick={() => {
                            setContentVisible(false);
                            setTimeout(() => { setCurrent(idx); setContentVisible(true); }, FADE_DURATION);
                        }}
                        className="rounded-full transition-all duration-500 cursor-pointer"
                        style={{
                            width: idx === current ? '28px' : '8px',
                            height: '8px',
                            background: idx === current ? '#C5A021' : 'rgba(255,255,255,0.45)',
                        }}
                    />
                ))}
            </div>

            {/* ── Single centered column: fading text + static search bar ── */}
            <div
                className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8"
                style={{ zIndex: 30, paddingTop: '72px' }}
            >
                {/* --- Fading text block --- */}
                <div
                    className="flex flex-col items-center text-center w-full"
                    style={{
                        opacity: contentVisible ? 1 : 0,
                        transition: `opacity ${FADE_DURATION}ms ease-in-out`,
                    }}
                >
                    {/* Eyebrow */}
                    <div className="mb-4 md:mb-6">
                        <span
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                letterSpacing: '0.35em',
                                fontSize: 'clamp(9px, 1.5vw, 13px)',
                            }}
                            className="text-white/80 uppercase font-medium flex items-center gap-4
                                       before:content-[''] before:block before:h-px before:w-8 md:before:w-14 before:bg-white/30
                                       after:content-[''] after:block after:h-px after:w-8 md:after:w-14 after:bg-white/30"
                        >
                            {slide.eyebrow}
                        </span>
                    </div>

                    {/* Main Headline */}
                    <div className="relative mb-4 md:mb-5">
                        <div
                            className="absolute -inset-12 pointer-events-none rounded-full"
                            style={{ background: 'radial-gradient(ellipse, rgba(197,160,33,0.08) 0%, transparent 70%)', filter: 'blur(30px)' }}
                        />
                        <h1
                            className="text-white leading-[1.08] tracking-tight relative"
                            style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontWeight: 300,
                                fontSize: 'clamp(38px, 7.5vw, 96px)',
                                textShadow: '0 2px 24px rgba(0,0,0,0.35)',
                            }}
                        >
                            {slide.headline}{' '}
                            <em style={{ fontStyle: 'italic', fontWeight: 400 }}>{slide.headlineItalic}</em>
                        </h1>
                    </div>

                    {/* Sub-headline */}
                    <h2
                        className="mb-3 md:mb-4 font-light tracking-wide"
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            color: '#FFFFFF',
                            fontSize: 'clamp(15px, 2.3vw, 28px)',
                            textShadow: '0 2px 16px rgba(0,0,0,0.6)',
                        }}
                    >
                        {slide.subheadline}
                    </h2>

                    {/* Description */}
                    <p
                        className="text-white/80 font-light leading-relaxed max-w-lg mx-auto"
                        style={{
                            fontSize: 'clamp(12px, 1.4vw, 15px)',
                            letterSpacing: '0.03em',
                        }}
                    >
                        {slide.description}
                    </p>
                </div>

                {/* --- Static search bar — never fades --- */}
                <div className="w-full max-w-3xl mt-7 md:mt-9">
                    <SmartSearchBar
                        category={category}
                        setCategory={setCategory}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                    />
                </div>
            </div>
        </section>
    );
}
