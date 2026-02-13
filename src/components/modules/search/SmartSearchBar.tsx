"use client";

import { Search, MapPin } from 'lucide-react';

export interface SmartSearchBarProps {
    category?: 'buy' | 'rent';
    setCategory?: (category: 'buy' | 'rent') => void;
    searchQuery?: string;
    setSearchQuery?: (query: string) => void;
}

export function SmartSearchBar({ category, setCategory, searchQuery, setSearchQuery }: SmartSearchBarProps) {
    return (
        <div className="bg-white rounded-2xl shadow-2xl p-3 md:p-5 max-w-2xl w-full">
            {/* BUY / RENT Toggle */}
            <div className="flex gap-1 mb-3 md:mb-4 bg-gray-100 rounded-full p-1 w-fit mx-auto">
                {[
                    { id: 'buy', label: 'BUY' },
                    { id: 'rent', label: 'RENT' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setCategory?.(tab.id as 'buy' | 'rent')}
                        className={`py-2 px-6 md:px-8 rounded-full text-xs md:text-sm font-semibold tracking-wider transition-all duration-300 min-h-[40px] ${category === tab.id
                            ? 'bg-white text-gray-900 shadow-md'
                            : 'bg-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Search Input */}
            <div className="relative flex items-center">
                <MapPin className="absolute left-3 md:left-4 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery?.(e.target.value)}
                    placeholder="Search by location, project..."
                    className="w-full pl-10 md:pl-12 pr-14 md:pr-16 py-3 md:py-4 bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red/50 rounded-full text-gray-800 placeholder:text-gray-400 outline-none transition-all text-sm"
                />
                <button className="absolute right-2 w-10 h-10 md:w-11 md:h-11 bg-gray-900 hover:bg-black rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                    <Search className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </button>
            </div>
        </div>
    );
}
