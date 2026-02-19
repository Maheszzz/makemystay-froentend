import { Search, ArrowUpDown } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FilterBarProps {
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    activeFilter: string;
    setActiveFilter: (f: string) => void;
}

export function FilterBar({ searchQuery, setSearchQuery, activeFilter, setActiveFilter }: FilterBarProps) {
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 200) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const filters = [
        "All", "Bommanahalli", "BTM Layout", "HSR Layout", "Ladies Only", "Couple Friendly", "Marathahalli"
    ];

    return (
        <div className={`sticky-filters z-40 bg-white border-b border-gray-200 transition-all duration-300 ${isSticky ? 'py-3 shadow-md' : 'py-4'}`} style={{ top: '64px' }}>
            <div className="max-w-[1320px] mx-auto px-5 md:px-5 flex flex-col md:flex-row gap-4 items-center">

                {/* Search Bar */}
                <div className="relative flex-1 w-full md:max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-full leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-brand-red focus:ring-1 focus:ring-brand-red sm:text-sm transition-colors"
                        placeholder="Search by location, property name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Filter Chips */}
                <div className="flex-1 w-full overflow-x-auto scrollbar-hide">
                    <div className="flex gap-2">
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`filter-chip whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === filter
                                    ? 'bg-brand-red text-white shadow-lg shadow-red-200 border-transparent'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-red hover:text-brand-red'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sort Button */}
                <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-brand-red hover:text-brand-red transition-colors">
                    <ArrowUpDown className="h-4 w-4" />
                    <span>Sort</span>
                </button>
            </div>
        </div>
    );
}
