import { SmartSearchBar } from '@/components/modules/search/SmartSearchBar';


interface HeroProps {
    category: 'buy' | 'rent';
    setCategory: (category: 'buy' | 'rent') => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export function Hero({ category, setCategory, searchQuery, setSearchQuery }: HeroProps) {
    return (
        <section id="home" className="relative min-h-[85vh] md:min-h-screen overflow-hidden flex items-center justify-center">
            {/* Full-width Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1920"
                    alt="Luxury Home"
                    className="w-full h-full object-cover"
                    loading="eager"
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-20 md:pt-0 flex flex-col items-center text-center">

                {/* 1. Eyebrow Tagline — Elegant & Spaced */}
                <div className="mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <span
                        className="text-[10px] md:text-xs text-white/90 tracking-[0.8em] uppercase font-medium flex items-center gap-6 before:h-[1px] before:w-12 before:bg-white/30 after:h-[1px] after:w-12 after:bg-white/30"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Professional • Trusted • Seamless
                    </span>
                </div>

                {/* 2. Main Title — Cormorant Garamond / Luxury Height */}
                <div className="relative mb-6 md:mb-8">
                    {/* Subtle Gold Glow behind title */}
                    <div className="absolute -inset-10 bg-brand-gold/5 blur-[80px] rounded-full pointer-events-none"></div>

                    <h1
                        className="text-4xl sm:text-6xl md:text-8xl text-white leading-[1.1] tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100"
                        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
                    >
                        From Clicks to <span className="italic font-normal">Closure</span>
                    </h1>
                </div>

                {/* 3. Secondary Headline — Cormorant / Muted Gold */}
                <h2
                    className="text-xl sm:text-2xl md:text-3xl text-brand-gold/90 mb-8 md:mb-10 tracking-wide font-light animate-in fade-in slide-in-from-bottom-7 duration-1000 delay-200"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                    Your Next Home Is Just a Click Away
                </h2>

                {/* 4. Description — Refined Balance */}
                <div className="max-w-2xl mx-auto mb-12 md:mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                    <p className="text-sm md:text-lg text-white/90 leading-relaxed font-light tracking-widest px-8">
                        Affordable, flexible, and secure stays meticulously curated for
                        <span className="text-white font-normal mx-2 border-b border-brand-gold/50 pb-0.5">students</span> &
                        <span className="text-white font-normal mx-2 border-b border-brand-gold/50 pb-0.5">professionals</span>.
                    </p>
                </div>

                {/* 5. Smart Search Bar — Glassmorphism Effect */}
                <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500 flex justify-center">
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
