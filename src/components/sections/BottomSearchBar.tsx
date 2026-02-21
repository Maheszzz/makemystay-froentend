import { useState, type FormEvent } from 'react';
import { Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface BottomSearchBarProps {
    category: 'buy' | 'rent';
    setCategory: (c: 'buy' | 'rent') => void;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
}

export function BottomSearchBar({ category, setCategory, searchQuery, setSearchQuery }: BottomSearchBarProps) {
    const [inputValue, setInputValue] = useState(searchQuery);
    const location = useLocation();

    // Only show on homepage
    if (location.pathname !== '/') return null;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setSearchQuery(inputValue);
        // Scroll down to listings
        const listings = document.getElementById('listings');
        if (listings) listings.scrollIntoView({ behavior: 'smooth' });
        else {
            const main = document.querySelector('main');
            if (main) main.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-40 hidden md:block"
            style={{
                background: 'rgba(10, 10, 15, 0.62)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                borderTop: '1px solid rgba(255,255,255,0.10)',
                boxShadow: '0 -4px 40px rgba(0,0,0,0.35)',
            }}
        >
            <form
                onSubmit={handleSubmit}
                className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4"
            >
                {/* Buy | Rent Toggle */}
                <div
                    className="flex items-center shrink-0 rounded-xl p-1 gap-1"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                    {(['buy', 'rent'] as const).map(opt => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => setCategory(opt)}
                            className="px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer"
                            style={
                                category === opt
                                    ? {
                                        background: '#C5A021',
                                        color: '#0a0a0a',
                                        boxShadow: '0 2px 12px rgba(197,160,33,0.45)',
                                    }
                                    : {
                                        color: 'rgba(255,255,255,0.65)',
                                    }
                            }
                        >
                            {opt === 'buy' ? 'Buy' : 'Rent'}
                        </button>
                    ))}
                </div>

                {/* Vertical divider */}
                <div className="w-px h-8 shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }} />

                {/* Search Input */}
                <input
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    placeholder="Search by property name, location, or project..."
                    className="flex-1 bg-transparent outline-none text-white placeholder-white/40 text-sm font-light"
                    style={{ letterSpacing: '0.02em', minWidth: 0 }}
                />

                {/* Gold Search Button */}
                <button
                    type="submit"
                    aria-label="Search"
                    className="shrink-0 flex items-center justify-center rounded-full transition-all duration-300 active:scale-95 cursor-pointer"
                    style={{
                        width: '48px',
                        height: '48px',
                        background: 'linear-gradient(135deg, #D4A017 0%, #C5A021 100%)',
                        boxShadow: '0 4px 20px rgba(197,160,33,0.5)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 6px 28px rgba(197,160,33,0.7)')}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(197,160,33,0.5)')}
                >
                    <Search className="w-5 h-5 text-black" strokeWidth={2.5} />
                </button>
            </form>
        </div>
    );
}
