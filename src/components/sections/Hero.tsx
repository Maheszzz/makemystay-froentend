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

            {/* Content - Centered */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center pt-24 md:pt-32 pb-16 md:pb-20">
                {/* Premium Badge */}
                <div className="inline-flex items-center gap-2 px-4 md:px-5 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <span className="text-amber-400 text-[10px] md:text-xs font-normal tracking-[0.2em] uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>Premium Properties</span>
                </div>

                {/* Main Heading — Playfair Display */}
                <h1
                    className="text-3xl sm:text-4xl md:text-6xl text-white mb-4 md:mb-6 leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100"
                    style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
                >
                    From Clicks to Closure
                </h1>

                {/* Subtitle */}
                <p className="text-xs sm:text-base text-white/70 tracking-[0.15em] md:tracking-[0.25em] uppercase font-normal mb-8 md:mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200" style={{ fontFamily: "'Playfair Display', serif" }}>
                    AI-Powered. Professional. Trusted.
                </p>

                {/* Smart Search Bar */}
                <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
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
