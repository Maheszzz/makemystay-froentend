'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, MapPin, Search, SlidersHorizontal, X } from 'lucide-react';
import {
    LISTING_CATEGORY_KEYS,
    LISTING_TAB_LABEL,
    type AvailableTypeFilters,
    type BudgetPreset,
    type ListingCategoryKey,
} from '@/lib/listingPageUtils';

export interface ActiveFilterPill {
    key: string;
    label: string;
    onRemove: () => void;
}

interface ListingFilterBarProps {
    searchQuery: string;
    onSearchChange: (val: string) => void;
    activeTabKey: ListingCategoryKey;
    onSelectCategory: (cat: ListingCategoryKey) => void;
    propertyCounts?: Partial<Record<ListingCategoryKey, number>>;
    minPrice: string;
    maxPrice: string;
    onBudgetApply: (min: string, max: string) => void;
    budgetPresets: BudgetPreset[];
    sortBy: string;
    onSortChange: (val: string) => void;
    typeFilter: string;
    onTypeFilterChange: (val: string) => void;
    genderFilter?: 'male' | 'female';
    onGenderToggle: (g: 'male' | 'female') => void;
    sharingFilter: string;
    onSharingToggle: (s: string) => void;
    furnishingFilter: string;
    onFurnishingToggle: (f: string) => void;
    foodOn: boolean;
    onFoodToggle: () => void;
    plotSizeFilter: string;
    onPlotSizeToggle: (bucketId: string) => void;
    availableOptions: AvailableTypeFilters;
    locationFilter: string;
    onLocationFilterChange: (val: string) => void;
    cities: string[];
    defaultCityLabel: string;
    hasGeoCoordinates: boolean;
    showMapPanel: boolean;
    onMapToggle: () => void;
    activeFilterPills: ActiveFilterPill[];
    onClearAll: () => void;
    resultCount: number;
    loading: boolean;
}

export function ListingFilterBar({
    searchQuery,
    onSearchChange,
    activeTabKey,
    onSelectCategory,
    propertyCounts,
    minPrice,
    maxPrice,
    onBudgetApply,
    budgetPresets,
    sortBy,
    onSortChange,
    typeFilter,
    onTypeFilterChange,
    genderFilter,
    onGenderToggle,
    sharingFilter,
    onSharingToggle,
    furnishingFilter,
    onFurnishingToggle,
    foodOn,
    onFoodToggle,
    plotSizeFilter,
    onPlotSizeToggle,
    availableOptions,
    locationFilter,
    onLocationFilterChange,
    cities,
    defaultCityLabel,
    hasGeoCoordinates,
    showMapPanel,
    onMapToggle,
    activeFilterPills,
    onClearAll,
    resultCount,
    loading,
}: ListingFilterBarProps) {
    const [budgetOpen, setBudgetOpen] = useState(false);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const budgetRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!budgetOpen) return;
        const onDown = (e: MouseEvent) => {
            if (budgetRef.current && !budgetRef.current.contains(e.target as Node)) {
                setBudgetOpen(false);
            }
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setBudgetOpen(false);
        };
        document.addEventListener('mousedown', onDown);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDown);
            document.removeEventListener('keydown', onKey);
        };
    }, [budgetOpen]);

    useEffect(() => {
        if (!mobileDrawerOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setMobileDrawerOpen(false);
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [mobileDrawerOpen]);

    const budgetSummaryLabel = (() => {
        const presetMatch = budgetPresets.find((b) => b.min === minPrice && b.max === maxPrice);
        if (presetMatch) return presetMatch.label;
        if (minPrice && maxPrice) return `₹${Number(minPrice).toLocaleString('en-IN')} – ₹${Number(maxPrice).toLocaleString('en-IN')}`;
        if (minPrice) return `₹${Number(minPrice).toLocaleString('en-IN')}+`;
        if (maxPrice) return `Up to ₹${Number(maxPrice).toLocaleString('en-IN')}`;
        return 'Budget';
    })();

    const isBudgetActive = Boolean(minPrice || maxPrice);

    const chipClass = (active: boolean) =>
        `min-h-[38px] lg:min-h-[36px] px-3 py-1.5 rounded-full text-xs font-medium border transition-colors inline-flex items-center gap-1.5 shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink ${
            active
                ? 'bg-pdp-ink text-white border-pdp-ink'
                : 'bg-pdp-surface text-pdp-ink border-pdp-border hover:border-pdp-ink/40'
        }`;

    const drawerChipClass = (active: boolean) =>
        `min-h-[44px] px-4 py-2 rounded-[10px] text-sm font-medium border transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink ${
            active
                ? 'bg-pdp-ink text-white border-pdp-ink'
                : 'bg-pdp-bg text-pdp-ink border-pdp-border hover:border-pdp-ink/40'
        }`;

    const showPgChips = activeTabKey === 'pg';
    const showRentOrBuyChips = activeTabKey === 'rent' || activeTabKey === 'buy' || activeTabKey === 'all';
    const showPlotChips = activeTabKey === 'plot';

    const renderDynamicFilterChips = (forDrawer = false) => {
        const cls = forDrawer ? drawerChipClass : chipClass;
        return (
            <>
                {showPgChips &&
                    availableOptions.pgGenders.map((g) => (
                        <button
                            key={`gender-${g}`}
                            type="button"
                            aria-pressed={genderFilter === g}
                            onClick={() => onGenderToggle(g)}
                            className={cls(genderFilter === g)}
                        >
                            {g === 'male' ? 'Boys' : 'Girls'}
                        </button>
                    ))}

                {showPgChips &&
                    availableOptions.pgSharing.map((s) => {
                        const active = sharingFilter.toLowerCase() === s.toLowerCase();
                        return (
                            <button
                                key={`sharing-${s}`}
                                type="button"
                                aria-pressed={active}
                                onClick={() => onSharingToggle(s)}
                                className={cls(active)}
                            >
                                {s} sharing
                            </button>
                        );
                    })}

                {showPgChips && availableOptions.hasPgFood && (
                    <button
                        type="button"
                        aria-pressed={foodOn}
                        onClick={onFoodToggle}
                        className={cls(foodOn)}
                    >
                        Meals included
                    </button>
                )}

                {showRentOrBuyChips &&
                    availableOptions.bhkTypes.map((t) => {
                        const active = typeFilter.toLowerCase() === t.toLowerCase();
                        return (
                            <button
                                key={`type-${t}`}
                                type="button"
                                aria-pressed={active}
                                onClick={() => onTypeFilterChange(active ? 'all' : t)}
                                className={cls(active)}
                            >
                                {t}
                            </button>
                        );
                    })}

                {showRentOrBuyChips &&
                    availableOptions.furnishingOptions.map((opt) => {
                        const active = furnishingFilter.toLowerCase() === opt.value.toLowerCase();
                        return (
                            <button
                                key={`furn-${opt.value}`}
                                type="button"
                                aria-pressed={active}
                                onClick={() => onFurnishingToggle(opt.value)}
                                className={cls(active)}
                            >
                                {opt.label}
                            </button>
                        );
                    })}

                {showPlotChips &&
                    availableOptions.plotSizeBuckets.map((b) => {
                        const active = plotSizeFilter === b.id;
                        return (
                            <button
                                key={`plot-${b.id}`}
                                type="button"
                                aria-pressed={active}
                                onClick={() => onPlotSizeToggle(b.id)}
                                className={cls(active)}
                            >
                                {b.label}
                            </button>
                        );
                    })}
            </>
        );
    };

    const mobileActiveCount = activeFilterPills.length;

    return (
        <>
            <div className="sticky top-[52px] md:top-[56px] z-30 bg-pdp-surface/95 backdrop-blur-md border-b border-pdp-border">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    {/* Primary Row: Area Search + Category Switch + Mobile Filters + Right Sort */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-2.5">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 min-w-0">
                            {/* Area Search */}
                            <div className="relative sm:w-56 md:w-64 shrink-0">
                                <Search className="w-4 h-4 text-pdp-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                    placeholder="Search area or property..."
                                    aria-label="Search area or property"
                                    className="w-full h-11 pl-10 pr-9 rounded-[10px] border border-pdp-border bg-pdp-bg text-sm text-pdp-ink placeholder:text-pdp-muted focus:outline-none focus:bg-pdp-surface focus:border-pdp-ink transition-colors"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => onSearchChange('')}
                                        aria-label="Clear search"
                                        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-pdp-muted hover:text-pdp-ink"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>

                            {/* Category Switch (All, PGs, Flats, Buy, Plots) */}
                            <div
                                role="navigation"
                                aria-label="Property categories"
                                className="flex items-center gap-1 p-1 rounded-[10px] bg-pdp-bg border border-pdp-border overflow-x-auto no-scrollbar"
                            >
                                {LISTING_CATEGORY_KEYS.map((cat) => {
                                    const isActive = activeTabKey === cat;
                                    const count = propertyCounts?.[cat];
                                    return (
                                        <button
                                            key={cat}
                                            type="button"
                                            aria-current={isActive ? 'page' : undefined}
                                            onClick={() => onSelectCategory(cat)}
                                            className={`min-h-[36px] px-3 py-1.5 rounded-[7px] text-xs sm:text-sm font-medium whitespace-nowrap transition-colors inline-flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink ${
                                                isActive
                                                    ? 'bg-pdp-surface text-pdp-ink shadow-xs border border-pdp-border/60'
                                                    : 'text-pdp-muted hover:text-pdp-ink'
                                            }`}
                                        >
                                            <span>{LISTING_TAB_LABEL[cat]}</span>
                                            {typeof count === 'number' && (
                                                <span className="text-[11px] text-pdp-muted tabular-nums">
                                                    {count}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Mobile Trigger + Desktop Right Sort */}
                        <div className="flex items-center justify-between lg:justify-end gap-2 shrink-0">
                            <button
                                type="button"
                                onClick={() => setMobileDrawerOpen(true)}
                                className="lg:hidden min-h-[44px] px-4 rounded-[10px] border border-pdp-border bg-pdp-surface text-sm font-medium text-pdp-ink inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink"
                            >
                                <SlidersHorizontal className="w-4 h-4 text-pdp-muted" />
                                <span>Filters</span>
                                {mobileActiveCount > 0 && (
                                    <span className="px-1.5 py-0.5 rounded-full bg-pdp-ink text-white text-[11px] tabular-nums leading-none">
                                        {mobileActiveCount}
                                    </span>
                                )}
                            </button>

                            <div className="flex items-center gap-2.5 ml-auto">
                                {!loading && (
                                    <span className="hidden xl:inline text-xs text-pdp-muted tabular-nums whitespace-nowrap">
                                        {resultCount} {resultCount === 1 ? 'result' : 'results'}
                                    </span>
                                )}

                                {hasGeoCoordinates && (
                                    <button
                                        type="button"
                                        aria-pressed={showMapPanel}
                                        onClick={onMapToggle}
                                        className={`min-h-[44px] lg:min-h-[40px] px-3.5 rounded-[10px] border text-sm font-medium inline-flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink ${
                                            showMapPanel
                                                ? 'bg-pdp-ink text-white border-pdp-ink'
                                                : 'bg-pdp-surface text-pdp-ink border-pdp-border hover:border-pdp-ink/40'
                                        }`}
                                    >
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span>Map</span>
                                    </button>
                                )}

                                <div className="relative">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => onSortChange(e.target.value)}
                                        aria-label="Sort results"
                                        className="min-h-[44px] lg:min-h-[40px] appearance-none pl-3.5 pr-9 rounded-[10px] border border-pdp-border bg-pdp-surface text-sm font-medium text-pdp-ink focus:outline-none focus:border-pdp-ink cursor-pointer"
                                    >
                                        <option value="newest">Sort: Newest</option>
                                        <option value="price_asc">Price: low to high</option>
                                        <option value="price_desc">Price: high to low</option>
                                    </select>
                                    <ChevronDown className="w-4 h-4 text-pdp-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Secondary Row: Area Select + Budget Popover + Real Data Type Chips */}
                    <div className="hidden lg:flex flex-wrap items-center gap-2 mt-2.5 pt-2.5 border-t border-pdp-border/70">
                        {/* Area Select */}
                        <div className="relative">
                            <select
                                value={
                                    locationFilter.toLowerCase() === defaultCityLabel.toLowerCase()
                                        ? 'all'
                                        : locationFilter
                                }
                                onChange={(e) => onLocationFilterChange(e.target.value)}
                                aria-label="Filter by area"
                                className={`min-h-[36px] appearance-none pl-3 pr-8 rounded-full border text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-pdp-ink ${
                                    locationFilter !== 'all' && locationFilter.toLowerCase() !== defaultCityLabel.toLowerCase()
                                        ? 'bg-pdp-ink text-white border-pdp-ink'
                                        : 'bg-pdp-surface text-pdp-ink border-pdp-border hover:border-pdp-ink/40'
                                }`}
                            >
                                <option value="all">All of {defaultCityLabel}</option>
                                {cities.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                className={`w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                                    locationFilter !== 'all' && locationFilter.toLowerCase() !== defaultCityLabel.toLowerCase()
                                        ? 'text-white/80'
                                        : 'text-pdp-muted'
                                }`}
                            />
                        </div>

                        {/* Budget Range Popover */}
                        <div ref={budgetRef} className="relative">
                            <button
                                type="button"
                                aria-expanded={budgetOpen}
                                onClick={() => setBudgetOpen((v) => !v)}
                                className={chipClass(isBudgetActive)}
                            >
                                <span>{budgetSummaryLabel}</span>
                                <ChevronDown className="w-3.5 h-3.5 opacity-75" />
                            </button>

                            {budgetOpen && (
                                <div className="absolute left-0 top-full mt-2 w-72 rounded-[var(--radius-pdp)] border border-pdp-border bg-pdp-surface shadow-lg p-4 z-40">
                                    <p className="text-xs font-medium text-pdp-muted mb-2.5">
                                        {activeTabKey === 'buy' || activeTabKey === 'plot' ? 'Budget (INR)' : 'Monthly rent (INR)'}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {budgetPresets.map((preset) => {
                                            const active = minPrice === preset.min && maxPrice === preset.max;
                                            return (
                                                <button
                                                    key={preset.id}
                                                    type="button"
                                                    onClick={() => {
                                                        onBudgetApply(active ? '' : preset.min, active ? '' : preset.max);
                                                        setBudgetOpen(false);
                                                    }}
                                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                                        active
                                                            ? 'bg-pdp-ink text-white border-pdp-ink'
                                                            : 'bg-pdp-bg text-pdp-ink border-pdp-border hover:border-pdp-ink/40'
                                                    }`}
                                                >
                                                    {preset.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="number"
                                            min={0}
                                            placeholder="Min ₹"
                                            value={minPrice}
                                            onChange={(e) => onBudgetApply(e.target.value, maxPrice)}
                                            aria-label="Minimum price"
                                            className="w-full px-3 py-2 rounded-lg border border-pdp-border bg-pdp-bg text-xs text-pdp-ink tabular-nums focus:outline-none focus:border-pdp-ink"
                                        />
                                        <input
                                            type="number"
                                            min={0}
                                            placeholder="Max ₹"
                                            value={maxPrice}
                                            onChange={(e) => onBudgetApply(minPrice, e.target.value)}
                                            aria-label="Maximum price"
                                            className="w-full px-3 py-2 rounded-lg border border-pdp-border bg-pdp-bg text-xs text-pdp-ink tabular-nums focus:outline-none focus:border-pdp-ink"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Dynamic Real-Data Chips */}
                        {renderDynamicFilterChips(false)}
                    </div>

                    {/* Active Removable Filter Pills */}
                    {activeFilterPills.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mt-2.5 pt-2 border-t border-pdp-border/60">
                            <span className="text-xs text-pdp-muted">Active:</span>
                            {activeFilterPills.map((pill) => (
                                <button
                                    key={pill.key}
                                    type="button"
                                    onClick={pill.onRemove}
                                    className="min-h-[32px] px-2.5 py-1 rounded-full bg-pdp-bg border border-pdp-border text-xs font-medium text-pdp-ink hover:border-pdp-ink/40 inline-flex items-center gap-1.5 cursor-pointer"
                                >
                                    <span>{pill.label}</span>
                                    <X className="w-3 h-3 text-pdp-muted" />
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={onClearAll}
                                className="min-h-[32px] px-2.5 py-1 text-xs font-medium text-pdp-muted hover:text-pdp-ink underline underline-offset-4 cursor-pointer"
                            >
                                Clear all
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Filters Drawer */}
            {mobileDrawerOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Filter listings"
                    className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/50 backdrop-blur-xs"
                    onClick={() => setMobileDrawerOpen(false)}
                >
                    <div
                        className="bg-pdp-surface rounded-t-[20px] border-t border-pdp-border max-h-[85vh] flex flex-col overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-5 py-4 border-b border-pdp-border">
                            <h2 className="text-base font-semibold text-pdp-ink">Filters</h2>
                            <button
                                type="button"
                                aria-label="Close filters"
                                onClick={() => setMobileDrawerOpen(false)}
                                className="w-11 h-11 rounded-full flex items-center justify-center text-pdp-ink hover:bg-pdp-bg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-5 overflow-y-auto space-y-6">
                            <div>
                                <label htmlFor="mobile-area-select" className="block text-sm font-medium text-pdp-ink mb-2">
                                    Area
                                </label>
                                <select
                                    id="mobile-area-select"
                                    value={locationFilter}
                                    onChange={(e) => onLocationFilterChange(e.target.value)}
                                    className="w-full min-h-[44px] px-3.5 rounded-[10px] border border-pdp-border bg-pdp-bg text-sm text-pdp-ink"
                                >
                                    <option value="all">All of {defaultCityLabel}</option>
                                    {cities.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-pdp-ink mb-2.5">
                                    {activeTabKey === 'buy' || activeTabKey === 'plot' ? 'Budget (INR)' : 'Monthly rent (INR)'}
                                </p>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {budgetPresets.map((preset) => {
                                        const active = minPrice === preset.min && maxPrice === preset.max;
                                        return (
                                            <button
                                                key={preset.id}
                                                type="button"
                                                onClick={() => onBudgetApply(active ? '' : preset.min, active ? '' : preset.max)}
                                                className={drawerChipClass(active)}
                                            >
                                                {preset.label}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="grid grid-cols-2 gap-2.5">
                                    <input
                                        type="number"
                                        min={0}
                                        placeholder="Min ₹"
                                        value={minPrice}
                                        onChange={(e) => onBudgetApply(e.target.value, maxPrice)}
                                        aria-label="Minimum budget"
                                        className="w-full min-h-[44px] px-3.5 rounded-[10px] border border-pdp-border bg-pdp-bg text-sm text-pdp-ink tabular-nums"
                                    />
                                    <input
                                        type="number"
                                        min={0}
                                        placeholder="Max ₹"
                                        value={maxPrice}
                                        onChange={(e) => onBudgetApply(minPrice, e.target.value)}
                                        aria-label="Maximum budget"
                                        className="w-full min-h-[44px] px-3.5 rounded-[10px] border border-pdp-border bg-pdp-bg text-sm text-pdp-ink tabular-nums"
                                    />
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-pdp-ink mb-2.5">Property options</p>
                                <div className="flex flex-wrap gap-2">
                                    {renderDynamicFilterChips(true)}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-pdp-border bg-pdp-surface flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    onClearAll();
                                    setMobileDrawerOpen(false);
                                }}
                                className="min-h-[44px] px-4 rounded-[10px] border border-pdp-border text-sm font-medium text-pdp-ink"
                            >
                                Clear all
                            </button>
                            <button
                                type="button"
                                onClick={() => setMobileDrawerOpen(false)}
                                className="flex-1 min-h-[44px] px-5 rounded-[10px] bg-pdp-cta hover:bg-pdp-cta-hover text-white text-sm font-medium"
                            >
                                Show {loading ? 'results' : `${resultCount} results`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
