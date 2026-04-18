"use client";

import { Search, MapPin, X } from 'lucide-react';

export interface SmartSearchBarProps {
    category?: 'pg' | 'rent' | 'buy' | 'plot' | 'all';
    setCategory?: (category: 'pg' | 'rent' | 'buy' | 'plot' | 'all') => void;
    searchQuery?: string;
    setSearchQuery?: (query: string) => void;
    /**
     * When set (homepage hero), tab clicks and search submit navigate to SEO listing URLs
     * instead of mutating local `?category=` on `/`.
     */
    listingsNavigate?: (tab: 'pg' | 'rent' | 'buy' | 'plot' | 'all', query: string) => void;
}

import { useState, useRef, useEffect } from 'react';
import { propertyApi } from '@/lib/api';

function mergeCommittedQuery(searchQuery: string | undefined, pendingInput: string): string {
    const parts = (searchQuery || '').split(',').map((s) => s.trim()).filter(Boolean);
    const t = pendingInput.trim();
    if (t && !parts.includes(t)) parts.push(t);
    return parts.join(',');
}

export function SmartSearchBar({
    category,
    setCategory,
    searchQuery,
    setSearchQuery,
    listingsNavigate,
}: SmartSearchBarProps) {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const suggestionRef = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState('');
    const [activeTab, setActiveTab] = useState<'pg' | 'rent' | 'buy' | 'plot' | 'all'>(category ?? 'all');

    useEffect(() => {
        if (listingsNavigate) return;
        setActiveTab(category ?? 'all');
    }, [category, listingsNavigate]);

    const effectiveCategory = listingsNavigate ? activeTab : (category ?? 'all');

    // Dynamic suggestions with debounce
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (inputValue && inputValue.trim().length >= 1) {
                try {
                    setIsLoadingSuggestions(true);
                    const results = await propertyApi.getSuggestions(inputValue);
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
    }, [inputValue]);

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
        const parts = (searchQuery || '').split(',').filter(Boolean);
        if (!parts.includes(suggestion.trim())) {
            setSearchQuery?.([...parts, suggestion].join(','));
        }
        setInputValue('');
        setShowSuggestions(false);
    };

    return (
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl md:rounded-[2rem] shadow-2xl p-2.5 md:p-6 max-w-3xl w-full relative border border-white/10">
            {/* BUY / RENT / PLOT Toggle */}
            <div className="flex w-full max-w-[380px] sm:max-w-none sm:w-fit mx-auto gap-1 mb-3 md:mb-5 bg-white/5 rounded-full p-1 border border-white/10 hide-scrollbar flex-wrap sm:flex-nowrap justify-center items-stretch">
                {[
                    { id: 'all', label: 'ALL' },
                    { id: 'pg', label: 'PG' },
                    { id: 'rent', label: 'RENT' },
                    { id: 'buy', label: 'BUY' },
                    { id: 'plot', label: 'PLOT' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                            const id = tab.id as 'buy' | 'rent' | 'plot' | 'pg' | 'all';
                            if (listingsNavigate) {
                                setActiveTab(id);
                                listingsNavigate(id, (searchQuery || '').trim());
                            } else {
                                setCategory?.(id);
                            }
                        }}
                        className={`flex-1 sm:flex-none py-2 px-2.5 sm:px-4 md:px-6 rounded-full text-[10px] sm:text-xs md:text-sm font-semibold tracking-wider transition-all duration-300 min-h-[40px] md:min-h-[42px] whitespace-nowrap flex items-center justify-center ${effectiveCategory === tab.id
                            ? 'bg-brand-gold text-white shadow-md'
                            : 'bg-transparent text-white/60 hover:text-brand-gold'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Search Input Area */}
            <div className="relative flex items-stretch bg-white/5 border border-white/10 rounded-full group focus-within:ring-2 focus-within:ring-brand-gold/50 focus-within:border-brand-gold/50 transition-all min-h-[48px] md:min-h-[52px] pl-10 md:pl-12 pr-24 md:pr-28">
                <MapPin className="absolute left-3 md:left-4 top-1/2 z-[1] -translate-y-1/2 w-5 h-5 text-white/50 group-focus-within:text-brand-gold transition-colors duration-300 pointer-events-none" />

                <div className="flex flex-1 min-w-0 min-h-[48px] md:min-h-[52px] flex-wrap items-center content-center gap-2 py-1.5 md:py-2">
                    {/* Selected Locations (Chips) */}
                    {(searchQuery || '').split(',').filter(Boolean).map((loc, idx) => (
                        <div key={idx} className="flex items-center gap-1 bg-white/10 text-white text-[11px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-full shrink-0">
                            <span className="truncate max-w-[120px] md:max-w-xs">{loc}</span>
                            <button
                                type="button"
                                onClick={() => {
                                    const newLocations = (searchQuery || '').split(',').filter(Boolean).filter((_, i) => i !== idx);
                                    setSearchQuery?.(newLocations.join(','));
                                }}
                                className="hover:text-brand-gold transition-colors"
                            >
                                <X className="w-3 h-3 md:w-3.5 md:h-3.5" />
                            </button>
                        </div>
                    ))}

                    <input
                        type="text"
                        aria-label="Search properties"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onFocus={() => {
                            if (inputValue && inputValue.length > 0) setShowSuggestions(true);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !inputValue && searchQuery) {
                                const newLocations = searchQuery.split(',').filter(Boolean).slice(0, -1);
                                setSearchQuery?.(newLocations.join(','));
                            }
                            if (e.key === 'Enter') {
                                if (inputValue.trim()) {
                                    const merged = mergeCommittedQuery(searchQuery, inputValue);
                                    if (listingsNavigate) {
                                        listingsNavigate(effectiveCategory, merged);
                                    } else {
                                        const parts = (searchQuery || '').split(',').filter(Boolean);
                                        if (!parts.includes(inputValue.trim())) {
                                            setSearchQuery?.([...parts, inputValue.trim()].join(','));
                                        }
                                    }
                                    setInputValue('');
                                    setShowSuggestions(false);
                                } else if (listingsNavigate) {
                                    listingsNavigate(effectiveCategory, (searchQuery || '').trim());
                                    setShowSuggestions(false);
                                }
                            }
                        }}
                        placeholder={(searchQuery || '').trim() ? "" : "Search multiple locations..."}
                        className="flex-1 min-w-[80px] min-h-0 self-center bg-transparent text-white placeholder:text-white/60 outline-none text-sm leading-normal"
                    />
                </div>

                {(searchQuery || inputValue) && (
                    <button
                        onClick={() => {
                            setSearchQuery?.('');
                            setInputValue('');
                            setShowSuggestions(false);
                            setFilteredSuggestions([]);
                        }}
                        className="absolute right-14 md:right-16 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                        aria-label="Clear all"
                    >
                        <X className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                )}

                <button
                    aria-label="Search"
                    onClick={() => {
                        const merged = mergeCommittedQuery(searchQuery, inputValue);
                        if (listingsNavigate) {
                            listingsNavigate(effectiveCategory, merged);
                            setInputValue('');
                            setShowSuggestions(false);
                            if (merged !== (searchQuery || '').trim()) {
                                setSearchQuery?.(merged);
                            }
                            return;
                        }
                        if (inputValue.trim()) {
                            const parts = (searchQuery || '').split(',').filter(Boolean);
                            if (!parts.includes(inputValue.trim())) {
                                setSearchQuery?.([...parts, inputValue.trim()].join(','));
                            }
                            setInputValue('');
                            setShowSuggestions(false);
                        }
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 md:w-11 md:h-11 bg-brand-gold hover:bg-brand-gold/90 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                    <Search className="w-4 h-4 md:w-5 md:h-5 text-white pointer-events-none" />
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
