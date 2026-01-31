import { SmartSearchBar } from '@/components/modules/search/SmartSearchBar';


interface HeroProps {
    category: 'buy' | 'rent';
    setCategory: (category: 'buy' | 'rent') => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export function Hero({ category, setCategory, searchQuery, setSearchQuery }: HeroProps) {
    return (
        <section id="home" className="relative min-h-[90vh] bg-gradient-to-br from-brand-red to-[#B91C1C] overflow-hidden flex items-center pt-32 pb-20 lg:pt-40 lg:pb-32">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-diagonal-grid opacity-20 pointer-events-none z-0"></div>

            {/* Floating Geometric Accents */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-black/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 flex flex-col items-start space-y-8">
                        {/* Premium Badge with Gold Accent */}
                        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/15 backdrop-blur-xl border border-white/30 shadow-lg">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-300"></span>
                            </span>
                            <span className="text-white text-sm font-semibold tracking-wider uppercase">AI-Powered Real Estate Platform</span>
                        </div>

                        {/* Luxury Typography - Extra Large & Refined */}
                        <div className="space-y-3">
                            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-white leading-[0.95] tracking-tighter">
                                <span className="block">Find Your</span>
                                <span className="block">Dream</span>
                            </h1>
                            <div className="relative inline-block">
                                <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold italic text-white leading-none tracking-tight relative z-10">
                                    Property Today.
                                </h2>
                                {/* Elegant underline accent */}
                                <div className="absolute -bottom-2 left-0 w-2/3 h-1 bg-gradient-to-r from-yellow-300 via-white to-transparent rounded-full"></div>
                            </div>
                        </div>

                        {/* Refined Description with Premium Styling */}
                        <div className="max-w-xl space-y-1 pt-2">
                            <p className="text-xl text-white/95 leading-relaxed font-light tracking-wide">
                                Experience the future of property search with our
                                <span className="font-normal"> AI-native engine.</span>
                            </p>
                            <p className="text-xl text-white font-semibold tracking-wide flex items-center gap-2">
                                <span className="inline-block w-8 h-0.5 bg-yellow-300 rounded-full"></span>
                                Zero commissions, 100% transparency.
                            </p>
                        </div>

                        <div className="mb-10">
                            <SmartSearchBar
                                category={category}
                                setCategory={setCategory}
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <div className="grid grid-cols-3 gap-8">
                                <div className="text-center sm:text-left">
                                    <div className="text-2xl font-bold text-white">1k+</div>
                                    <div className="text-xs text-white/70">Properties Listed</div>
                                </div>
                                <div className="text-center sm:text-left">
                                    <div className="text-2xl font-bold text-white">2k+</div>
                                    <div className="text-xs text-white/70">Happy Clients</div>
                                </div>
                                <div className="text-center sm:text-left">
                                    <div className="text-2xl font-bold text-white">50+</div>
                                    <div className="text-xs text-white/70">Expert Agents</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative animate-in fade-in slide-in-from-right-10 duration-1000 delay-200 hidden lg:block h-full min-h-[500px]">
                        {/* Visual Placeholder - Matching the House Image idea */}
                        <div className="absolute inset-0 bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white/10">
                            <img
                                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000"
                                alt="Luxury Home"
                                className="w-full h-full object-cover opacity-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-charcoal/20 to-black/40 mix-blend-overlay"></div>
                        </div>


                    </div>
                </div>
            </div>
        </section>
    );
}
