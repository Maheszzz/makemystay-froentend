
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, CheckCircle } from 'lucide-react';
import { SmartSearchBar } from '@/components/modules/search/SmartSearchBar';

const slides = [
    {
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=90&w=1920',
        eyebrow: 'PROFESSIONAL • TRUSTED • SEAMLESS',
        headline: 'Premium Living.',
        headlineItalic: 'Simplified.',
        subheadline: 'Verified stays for students & professionals.',
    },
    {
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=90&w=1920',
        eyebrow: 'CURATED • AFFORDABLE • SECURE',
        headline: 'Live Closer',
        headlineItalic: 'to Work.',
        subheadline: 'Smart stays near Bangalore tech parks.',
    },
    {
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=90&w=1920',
        eyebrow: 'SMART • MODERN • HASSLE-FREE',
        headline: 'Where Comfort',
        headlineItalic: 'Meets Convenience.',
        subheadline: 'Curated homes in prime Bangalore locations.',
    },
    {
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=90&w=1920',
        eyebrow: 'TRUSTED • VERIFIED • SEAMLESS',
        headline: 'Move In',
        headlineItalic: 'This Week.',
        subheadline: 'Seamless process. Fully managed. Zero hassle.',
    },
];

const trustItems = [
    'Instant Online Booking',
    'Prime Locations',
    'Dedicated Support',
];

const SLIDE_INTERVAL = 4500;
const FADE_DURATION = 1500;

interface HeroProps {
    category: 'pg' | 'rent' | 'buy' | 'plot' | 'all';
    setCategory?: (category: 'pg' | 'rent' | 'buy' | 'plot' | 'all') => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    /** Homepage: navigate to SEO listing URLs from hero tabs / search. */
    listingsNavigate?: (tab: 'pg' | 'rent' | 'buy' | 'plot' | 'all', query: string) => void;
}

export function Hero({ category, setCategory, searchQuery, setSearchQuery, listingsNavigate }: HeroProps) {
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
            className="relative w-full h-[45svh] md:h-screen min-h-[300px] md:min-h-[600px] overflow-hidden"
            style={{ zIndex: 20 }}
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

            {/* ── Overlays (60% darkness) ── */}
            <div className="absolute inset-0 bg-black/62" style={{ zIndex: 1 }} />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" style={{ zIndex: 2 }} />
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)', zIndex: 3 }} />


            {/* ── Single centered column: fading text + static search bar ── */}
            <div
                className="absolute inset-0 flex flex-col items-center justify-center px-5 sm:px-8"
                style={{ zIndex: 30, paddingTop: '64px' }}
            >
                {/* --- Fading content block --- */}
                <div
                    className="flex flex-col items-center text-center w-full"
                    style={{
                        opacity: contentVisible ? 1 : 0,
                        transition: `opacity ${FADE_DURATION}ms ease-in-out`,
                    }}
                >
                    {/* Eyebrow */}
                    <div className="mb-2 md:mb-6 hidden md:block">
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
                    <div className="relative mb-2 md:mb-5">
                        <div
                            className="absolute -inset-12 pointer-events-none rounded-full"
                            style={{ background: 'radial-gradient(ellipse, rgba(197,160,33,0.10) 0%, transparent 70%)', filter: 'blur(30px)' }}
                        />
                        <h1
                            className="text-white leading-[1.08] tracking-tight relative"
                            style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontWeight: 300,
                                fontSize: 'clamp(42px, 7.5vw, 96px)',
                                textShadow: '0 2px 24px rgba(0,0,0,0.35)',
                            }}
                        >
                            {slide.headline}{' '}
                            <em style={{ fontStyle: 'italic', fontWeight: 400 }}>{slide.headlineItalic}</em>
                        </h1>
                    </div>

                    {/* Sub-headline */}
                    <h2
                        className="mb-1.5 md:mb-4 font-light tracking-wide"
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            color: '#FFFFFF',
                            fontSize: 'clamp(12px, 2.3vw, 28px)',
                            textShadow: '0 2px 16px rgba(0,0,0,0.6)',
                        }}
                    >
                        {slide.subheadline}
                    </h2>
                </div>

                {/* --- Static search bar — never fades --- */}
                <div className="w-full max-w-3xl mt-4 md:mt-10 mb-2 md:mb-3">
                    {/* Subtle glow ring behind search */}
                    <div
                        className="relative"
                        style={{
                            filter: 'drop-shadow(0 0 18px rgba(197,160,33,0.22))',
                        }}
                    >
                        <SmartSearchBar
                            category={category}
                            setCategory={setCategory}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            listingsNavigate={listingsNavigate}
                        />
                    </div>
                </div>

                {/* Explore PG — visible on small screens (desktop copy lives in trust row below) */}
                <div className="flex md:hidden justify-center w-full max-w-3xl mt-3 mb-1 px-2">
                    <Link
                        to="/pg/bangalore"
                        className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold text-white/90 hover:bg-brand-red hover:border-brand-red transition-all duration-300 text-center max-w-[min(100%,22rem)]"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse shrink-0" />
                        Explore Best PG in Bangalore →
                    </Link>
                </div>

                {/* --- Trust + CTA + carousel + scroll hint — one centered column (no absolute overlap) --- */}
                <div className="hidden md:flex flex-col items-center w-full max-w-3xl mx-auto mt-6 md:mt-7 gap-4 md:gap-5">
                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 w-full px-2">
                        {trustItems.map((item) => (
                            <div key={item} className="flex items-center gap-1.5 min-w-0">
                                <CheckCircle
                                    className="w-3.5 h-3.5 shrink-0 block overflow-visible"
                                    style={{ color: '#C5A021' }}
                                    strokeWidth={2.5}
                                    aria-hidden
                                />
                                <span
                                    className="text-white/[0.88] text-xs font-medium tracking-wide"
                                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                                >
                                    {item}
                                </span>
                            </div>
                        ))}
                    </div>

                    <Link
                        to="/pg/bangalore"
                        className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold text-white/90 hover:bg-brand-red hover:border-brand-red transition-all duration-300 text-center max-w-[min(100%,22rem)]"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse shrink-0" />
                        Explore Best PG in Bangalore →
                    </Link>

                    {/* Slide dots — full-width row so indicators stay visually centered */}
                    <div
                        className="flex w-full min-h-[12px] justify-center items-center gap-2 px-4"
                        role="tablist"
                        aria-label="Hero slides"
                    >
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                role="tab"
                                aria-selected={idx === current}
                                aria-label={`Go to slide ${idx + 1}`}
                                onClick={() => {
                                    setContentVisible(false);
                                    setTimeout(() => {
                                        setCurrent(idx);
                                        setContentVisible(true);
                                    }, FADE_DURATION);
                                }}
                                className="rounded-full transition-all duration-500 cursor-pointer shrink-0 p-0 border-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/70"
                                style={{
                                    width: idx === current ? '28px' : '8px',
                                    height: '8px',
                                    background: idx === current ? '#C5A021' : 'rgba(255,255,255,0.45)',
                                }}
                            />
                        ))}
                    </div>

                    {/* Scroll hint — in document flow below dots (replaces absolute; avoids clash with CTA) */}
                    <div className="flex flex-col items-center gap-1 pt-1 pb-1 animate-bounce opacity-75 pointer-events-none select-none">
                        <span className="text-[10px] text-white/35 tracking-[0.2em] uppercase font-medium">
                            Explore
                        </span>
                        <ChevronDown className="w-4 h-4 text-white/30" aria-hidden />
                    </div>
                </div>
            </div>
        </section>
    );
}
