"use client";

import { Search, MapPin } from 'lucide-react';

export interface SmartSearchBarProps {
    category?: 'buy' | 'rent';
    setCategory?: (category: 'buy' | 'rent') => void;
    searchQuery?: string;
    setSearchQuery?: (query: string) => void;
}

import { useState, useRef, useEffect } from 'react';
import { propertyApi } from '@/lib/api';

export function SmartSearchBar({ category, setCategory, searchQuery, setSearchQuery }: SmartSearchBarProps) {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const suggestionRef = useRef<HTMLDivElement>(null);

    // Dynamic suggestions with debounce
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery && searchQuery.trim().length >= 1) {
                try {
                    setIsLoadingSuggestions(true);
                    const results = await propertyApi.getSuggestions(searchQuery);
                    setFilteredSuggestions(results);
                    setShowSuggestions(results.length > 0);
                } catch (error) {
                    console.error('Failed to fetch suggestions:', error);
                    setFilteredSuggestions([]);
                    setShowSuggestions(false);
                } finally {
                    setIsLoadingSuggestions(false);
                }
            } else {
                setFilteredSuggestions([]);
                setShowSuggestions(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchSuggestions();
        }, 300); // 300ms debounce

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectSuggestion = (suggestion: string) => {
        setSearchQuery?.(suggestion);
        setShowSuggestions(false);
    };

    return (
        <div className="bg-black/40 backdrop-blur-xl rounded-[2rem] shadow-2xl p-4 md:p-6 max-w-3xl w-full relative border border-white/10">
            {/* BUY / RENT Toggle */}
            <div className="flex gap-1 mb-3 md:mb-4 bg-white/5 rounded-full p-1 w-fit mx-auto border border-white/10">
                {[
                    { id: 'buy', label: 'BUY' },
                    { id: 'rent', label: 'RENT' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setCategory?.(tab.id as 'buy' | 'rent')}
                        className={`py-2 px-6 md:px-8 rounded-full text-xs md:text-sm font-semibold tracking-wider transition-all duration-300 min-h-[40px] ${category === tab.id
                            ? 'bg-brand-gold text-white shadow-md'
                            : 'bg-transparent text-white/60 hover:text-brand-gold'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Search Input */}
            <div className="relative flex items-center group">
                <MapPin className="absolute left-3 md:left-4 w-5 h-5 text-white/50 group-focus-within:text-brand-gold transition-colors duration-300" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery?.(e.target.value)}
                    onFocus={() => {
                        if (searchQuery && searchQuery.length > 0) setShowSuggestions(true);
                    }}
                    placeholder="Search by property name, location, or project..."
                    className="w-full pl-10 md:pl-12 pr-14 md:pr-16 py-3 md:py-4 bg-white/5 border border-white/10 focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold/50 rounded-full text-white placeholder:text-white/50 outline-none transition-all text-sm group-hover:border-brand-gold/30"
                />
                <button className="absolute right-2 w-10 h-10 md:w-11 md:h-11 bg-brand-gold hover:bg-brand-gold/90 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                    <Search className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </button>
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && (
                <div
                    ref={suggestionRef}
                    className="absolute z-50 left-0 right-0 top-full mt-2 bg-brand-charcoal/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/10 overflow-hidden max-h-60 overflow-y-auto"
                >
                    {isLoadingSuggestions ? (
                        <div className="px-6 py-4 text-center text-white/50 flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/20 border-t-brand-gold rounded-full animate-spin"></div>
                            <span className="text-sm">Searching...</span>
                        </div>
                    ) : (
                        <>
                            {filteredSuggestions.length > 0 ? (
                                filteredSuggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSelectSuggestion(suggestion)}
                                        className="w-full text-left px-6 py-3 hover:bg-white/5 flex items-center gap-3 text-white/80 transition-colors group border-b border-white/5 last:border-0"
                                    >
                                        <MapPin className="w-4 h-4 text-white/40 group-hover:text-brand-gold transition-colors" />
                                        <span className="text-sm font-medium group-hover:text-white transition-colors">{suggestion}</span>
                                    </button>
                                ))
                            ) : (
                                <div className="px-6 py-4 text-center text-white/50 text-sm">
                                    No results found
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
