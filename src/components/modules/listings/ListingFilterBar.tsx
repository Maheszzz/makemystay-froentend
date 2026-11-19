'use client';

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import {
    Armchair,
    BedDouble,
    Building2,
    Check,
    ChevronDown,
    Home,
    IndianRupee,
    Layers,
    LayoutGrid,
    MapPin,
    Search,
    SlidersHorizontal,
    Users,
    Utensils,
    X,
} from 'lucide-react';
import { Link } from '@/lib/navigation';
import {
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
    activeTabKey: ListingCategoryKey;
    /** Canonical hub URL for a category tab (rendered as a real link). */
    categoryHref: (cat: ListingCategoryKey) => string;
    propertyCounts?: Partial<Record<ListingCategoryKey, number>>;

    searchQuery: string;
    /** Applies the typed text query (Search button / Enter). */
    onSearchSubmit: (q: string) => void;

    metroLabel: string;
    areaOptions: string[];
    /** '' means "All of {metro}". */
    areaValue: string;
    onAreaChange: (value: string) => void;

    minPrice: string;
    maxPrice: string;
    onBudgetApply: (min: string, max: string) => void;
    budgetPresets: BudgetPreset[];

    sortBy: string;
    onSortChange: (val: string) => void;

    typeFilter: string;
    onTypeFilterChange: (val: string) => void;
    genderFilter?: 'male' | 'female';
    onGenderChange: (g: 'male' | 'female' | undefined) => void;
    furnishingFilter: string;
    onFurnishingChange: (f: string) => void;
    foodOn: boolean;
    onFoodChange: (on: boolean) => void;
    plotSizeFilter: string;
    onPlotSizeChange: (bucketId: string) => void;
    availableOptions: AvailableTypeFilters;

    hasGeoCoordinates: boolean;
    showMapPanel: boolean;
    onMapToggle: () => void;

    activeFilterPills: ActiveFilterPill[];
    onClearAll: () => void;
    resultCount: number;
    loading: boolean;
    /** Overlap the hero above by ~60px (default). Disable for standalone placement. */
    overlapHero?: boolean;
}

const FOCUS_RING =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2';

const TAB_ICON: Record<ListingCategoryKey, React.ReactNode> = {
    all: <LayoutGrid className="w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0" aria-hidden="true" />,
    pg: <BedDouble className="w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0" aria-hidden="true" />,
    rent: <Building2 className="w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0" aria-hidden="true" />,
    buy: <Home className="w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0" aria-hidden="true" />,
    plot: <Layers className="w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0" aria-hidden="true" />,
};

const PRIMARY_TABS: ListingCategoryKey[] = ['all', 'pg', 'rent'];
const MORE_TABS: ListingCategoryKey[] = ['buy', 'plot'];

function SelectControl({
    icon,
    label,
    value,
    onChange,
    active,
    children,
    className = '',
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    onChange: (v: string) => void;
    active: boolean;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`relative ${className}`}>
            <span
                aria-hidden="true"
                className={`pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 ${active ? 'text-red' : 'text-slate'}`}
            >
                {icon}
            </span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                aria-label={label}
                className={`h-12 w-full appearance-none cursor-pointer rounded-[10px] border pl-8 pr-7 text-sm font-medium transition-colors ${FOCUS_RING} ${
                    active
                        ? 'border-red bg-blush-100 text-red'
                        : 'border-line bg-white text-ink hover:border-ink/40'
                }`}
            >
                {children}
            </select>
            <ChevronDown
                aria-hidden="true"
                className={`pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 ${active ? 'text-red' : 'text-slate'}`}
            />
        </div>
    );
}

export function ListingFilterBar({
    activeTabKey,
    categoryHref,
    propertyCounts,
    searchQuery,
    onSearchSubmit,
    metroLabel,
    areaOptions,
    areaValue,
    onAreaChange,
    minPrice,
    maxPrice,
    onBudgetApply,
    budgetPresets,
    sortBy,
    onSortChange,
    typeFilter,
    onTypeFilterChange,
    genderFilter,
    onGenderChange,
    furnishingFilter,
    onFurnishingChange,
    foodOn,
    onFoodChange,
    plotSizeFilter,
    onPlotSizeChange,
    availableOptions,
    hasGeoCoordinates,
    showMapPanel,
    onMapToggle,
    activeFilterPills,
    onClearAll,
    resultCount,
    loading,
    overlapHero = true,
}: ListingFilterBarProps) {
    const [draftQuery, setDraftQuery] = useState(searchQuery);
    const [budgetOpen, setBudgetOpen] = useState(false);
    const [moreOpen, setMoreOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const budgetRef = useRef<HTMLDivElement | null>(null);
    const moreRef = useRef<HTMLDivElement | null>(null);
    const filtersBtnRef = useRef<HTMLButtonElement | null>(null);
    const drawerRef = useRef<HTMLDivElement | null>(null);
    const budgetPanelId = useId();
    const morePanelId = useId();

    useEffect(() => {
        setDraftQuery(searchQuery);
    }, [searchQuery]);

    // Close popovers on outside click / Escape.
    useEffect(() => {
        if (!budgetOpen && !moreOpen) return;
        const onDown = (e: MouseEvent) => {
            const t = e.target as Node;
            if (budgetRef.current && !budgetRef.current.contains(t)) setBudgetOpen(false);
            if (moreRef.current && !moreRef.current.contains(t)) setMoreOpen(false);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setBudgetOpen(false);
                setMoreOpen(false);
            }
        };
        document.addEventListener('mousedown', onDown);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDown);
            document.removeEventListener('keydown', onKey);
        };
    }, [budgetOpen, moreOpen]);

    // Drawer: Escape closes, Tab is trapped, body scroll locked, focus restored.
    const closeDrawer = useCallback(() => {
        setDrawerOpen(false);
        filtersBtnRef.current?.focus();
    }, []);

    useEffect(() => {
        if (!drawerOpen) return;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const panel = drawerRef.current;
        const focusables = () =>
            Array.from(
                panel?.querySelectorAll<HTMLElement>(
                    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled])',
                ) ?? [],
            );
        focusables()[0]?.focus();
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                closeDrawer();
                return;
            }
            if (e.key !== 'Tab') return;
            const els = focusables();
            if (els.length === 0) return;
            const first = els[0];
            const last = els[els.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };
        document.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = prevOverflow;
            document.removeEventListener('keydown', onKey);
        };
    }, [drawerOpen, closeDrawer]);

    const isMoreActive = MORE_TABS.includes(activeTabKey);
    const activeMoreCount = isMoreActive ? propertyCounts?.[activeTabKey] : undefined;

    const isBudgetActive = Boolean(minPrice || maxPrice);
    const budgetLabel = useMemo(() => {
        const presetMatch = budgetPresets.find((b) => b.min === minPrice && b.max === maxPrice);
        if (presetMatch) return presetMatch.label;
        if (minPrice && maxPrice) {
            return `₹${Number(minPrice).toLocaleString('en-IN')} – ₹${Number(maxPrice).toLocaleString('en-IN')}`;
        }
        if (minPrice) return `₹${Number(minPrice).toLocaleString('en-IN')}+`;
        if (maxPrice) return `Up to ₹${Number(maxPrice).toLocaleString('en-IN')}`;
        return 'Budget';
    }, [budgetPresets, minPrice, maxPrice]);

    const budgetUnit = activeTabKey === 'buy' || activeTabKey === 'plot' ? 'Budget (INR)' : 'Monthly rent (INR)';

    const submitSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        onSearchSubmit(draftQuery.trim());
    };

    const handleClearSearch = () => {
        setDraftQuery('');
        if (searchQuery) {
            onSearchSubmit('');
        }
    };

    const showPg = activeTabKey === 'pg';
    const showRentBuy = activeTabKey === 'rent' || activeTabKey === 'buy' || activeTabKey === 'all';
    const showPlot = activeTabKey === 'plot';

    const resolvedAreaOptions = useMemo(() => {
        if (!areaValue) return areaOptions;
        if (areaOptions.some((a) => a.toLowerCase() === areaValue.toLowerCase())) return areaOptions;
        return [areaValue, ...areaOptions];
    }, [areaOptions, areaValue]);

    const renderBudget = (fullWidth = false) => (
        <div ref={fullWidth ? undefined : budgetRef} className={`relative ${fullWidth ? 'w-full' : 'shrink-0'}`}>
            <button
                type="button"
                aria-expanded={budgetOpen}
                aria-controls={budgetPanelId}
                onClick={() => setBudgetOpen((v) => !v)}
                className={`h-12 w-full inline-flex items-center gap-1.5 rounded-[10px] border pl-2.5 pr-2 text-sm font-medium transition-colors cursor-pointer ${FOCUS_RING} ${
                    isBudgetActive
                        ? 'border-red bg-blush-100 text-red'
                        : 'border-line bg-white text-ink hover:border-ink/40'
                }`}
            >
                <IndianRupee className={`w-4 h-4 shrink-0 ${isBudgetActive ? 'text-red' : 'text-slate'}`} aria-hidden="true" />
                <span className="flex-1 text-left truncate">{budgetLabel}</span>
                <ChevronDown className={`w-4 h-4 shrink-0 ${isBudgetActive ? 'text-red' : 'text-slate'}`} aria-hidden="true" />
            </button>

            {budgetOpen && (
                <div
                    id={budgetPanelId}
                    role="group"
                    aria-label="Budget range"
                    className={`z-40 rounded-[14px] border border-line bg-white p-4 shadow-lg ${
                        fullWidth ? 'mt-2' : 'absolute left-0 top-full mt-2 w-72'
                    }`}
                >
                    <p className="text-xs font-semibold text-slate mb-2.5">{budgetUnit}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {budgetPresets.map((preset) => {
                            const active = minPrice === preset.min && maxPrice === preset.max;
                            return (
                                <button
                                    key={preset.id}
                                    type="button"
                                    aria-pressed={active}
                                    onClick={() => {
                                        onBudgetApply(active ? '' : preset.min, active ? '' : preset.max);
                                        if (!fullWidth) setBudgetOpen(false);
                                    }}
                                    className={`min-h-[44px] sm:min-h-[36px] px-3 rounded-lg text-sm border transition-colors cursor-pointer ${FOCUS_RING} ${
                                        active
                                            ? 'bg-blush-100 text-red border-red font-semibold'
                                            : 'bg-page text-ink border-line font-medium hover:bg-blush-100'
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
                            inputMode="numeric"
                            min={0}
                            placeholder="Min ₹"
                            value={minPrice}
                            onChange={(e) => onBudgetApply(e.target.value, maxPrice)}
                            aria-label="Minimum price"
                            className={`h-11 w-full rounded-lg border border-line bg-page px-3 text-sm text-ink tabular-nums ${FOCUS_RING}`}
                        />
                        <input
                            type="number"
                            inputMode="numeric"
                            min={0}
                            placeholder="Max ₹"
                            value={maxPrice}
                            onChange={(e) => onBudgetApply(minPrice, e.target.value)}
                            aria-label="Maximum price"
                            className={`h-11 w-full rounded-lg border border-line bg-page px-3 text-sm text-ink tabular-nums ${FOCUS_RING}`}
                        />
                    </div>
                </div>
            )}
        </div>
    );

    /** Area + category-specific dropdowns, shared by desktop row 2 and mobile drawer. */
    const renderDropdowns = (fullWidth = false) => {
        const w = fullWidth ? 'w-full' : 'shrink-0';
        return (
            <>
                <SelectControl
                    className={fullWidth ? 'w-full' : 'shrink-0 max-w-[12.5rem]'}
                    icon={<MapPin className="w-4 h-4" />}
                    label="Filter by area"
                    value={areaValue}
                    active={areaValue !== ''}
                    onChange={onAreaChange}
                >
                    <option value="">All of {metroLabel}</option>
                    {resolvedAreaOptions.map((a) => (
                        <option key={a} value={a}>
                            {a}
                        </option>
                    ))}
                </SelectControl>

                {renderBudget(fullWidth)}

                {showPg && availableOptions.pgGenders.length > 0 && (
                    <SelectControl
                        className={w}
                        icon={<Users className="w-4 h-4" />}
                        label="Filter by gender"
                        value={genderFilter ?? ''}
                        active={Boolean(genderFilter)}
                        onChange={(v) => onGenderChange(v === 'male' || v === 'female' ? v : undefined)}
                    >
                        <option value="">{genderFilter ? 'Any' : 'Gender'}</option>
                        {availableOptions.pgGenders.map((g) => (
                            <option key={g} value={g}>
                                {g === 'male' ? 'Boys' : 'Girls'}
                            </option>
                        ))}
                    </SelectControl>
                )}

                {showPg && availableOptions.hasPgFood && (
                    <SelectControl
                        className={w}
                        icon={<Utensils className="w-4 h-4" />}
                        label="Filter by meals"
                        value={foodOn ? 'included' : ''}
                        active={foodOn}
                        onChange={(v) => onFoodChange(v === 'included')}
                    >
                        <option value="">{foodOn ? 'Any' : 'Meals'}</option>
                        <option value="included">Meals included</option>
                    </SelectControl>
                )}

                {showRentBuy && availableOptions.bhkTypes.length > 0 && (
                    <SelectControl
                        className={w}
                        icon={<Home className="w-4 h-4" />}
                        label="Filter by BHK"
                        value={typeFilter === 'all' ? '' : typeFilter}
                        active={typeFilter !== 'all' && typeFilter !== ''}
                        onChange={(v) => onTypeFilterChange(v || 'all')}
                    >
                        <option value="">BHK</option>
                        {availableOptions.bhkTypes.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </SelectControl>
                )}

                {showRentBuy && availableOptions.furnishingOptions.length > 0 && (
                    <SelectControl
                        className={w}
                        icon={<Armchair className="w-4 h-4" />}
                        label="Filter by furnishing"
                        value={furnishingFilter}
                        active={Boolean(furnishingFilter)}
                        onChange={onFurnishingChange}
                    >
                        <option value="">Furnishing</option>
                        {availableOptions.furnishingOptions.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </SelectControl>
                )}

                {showPlot && availableOptions.plotSizeBuckets.length > 0 && (
                    <SelectControl
                        className={w}
                        icon={<Layers className="w-4 h-4" />}
                        label="Filter by plot size"
                        value={plotSizeFilter}
                        active={Boolean(plotSizeFilter)}
                        onChange={onPlotSizeChange}
                    >
                        <option value="">Plot size</option>
                        {availableOptions.plotSizeBuckets.map((b) => (
                            <option key={b.id} value={b.id}>
                                {b.label}
                            </option>
                        ))}
                    </SelectControl>
                )}
            </>
        );
    };

    const searchInput = (inputId: string, compactMobile = false) => (
        <div className="relative flex-1 min-w-0">
            <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate"
                aria-hidden="true"
            />
            <input
                id={inputId}
                type="search"
                enterKeyHint="search"
                value={draftQuery}
                onChange={(e) => setDraftQuery(e.target.value)}
                placeholder="Search area, property or landmark..."
                aria-label="Search area, property or landmark"
                className={`w-full rounded-[10px] border border-line bg-white pl-9 ${
                    draftQuery ? 'pr-9' : 'pr-3'
                } text-sm text-ink placeholder:text-slate transition-colors focus:border-red ${FOCUS_RING} ${
                    compactMobile ? 'h-11' : 'h-12'
                }`}
            />
            {draftQuery && (
                <button
                    type="button"
                    onClick={handleClearSearch}
                    aria-label="Clear search"
                    className={`absolute right-1 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-lg text-slate hover:text-ink cursor-pointer ${FOCUS_RING}`}
                >
                    <X className="w-4 h-4" aria-hidden="true" />
                </button>
            )}
        </div>
    );

    return (
        <>
            <div
                className={`sticky top-[56px] md:top-[60px] z-30 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 w-full ${
                    overlapHero ? '-mt-[60px] mb-6' : 'pt-4 mb-6'
                }`}
            >
                <div className="bg-white rounded-[14px] border border-line/80 shadow-[0_10px_30px_-8px_rgba(26,20,22,0.10),0_2px_8px_rgba(26,20,22,0.04)] p-3.5 sm:p-5">
                    {/* Row 1: Category tabs with icon + live count, More dropdown (Buy, Plots), plus desktop Sort/Map */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <nav aria-label="Property categories" className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                            {PRIMARY_TABS.map((cat) => {
                                const active = activeTabKey === cat;
                                const count = propertyCounts?.[cat];
                                return (
                                    <Link
                                        key={cat}
                                        to={categoryHref(cat)}
                                        aria-current={active ? 'page' : undefined}
                                        className={`min-h-[44px] sm:min-h-[40px] px-2.5 sm:px-4 rounded-[10px] border text-xs sm:text-sm whitespace-nowrap inline-flex items-center gap-1.5 sm:gap-2 transition-colors ${FOCUS_RING} ${
                                            active
                                                ? 'bg-red text-white border-red font-semibold'
                                                : 'bg-[#F4F2F3] text-ink border-transparent font-medium hover:bg-[#EAE7E8]'
                                        }`}
                                    >
                                        {TAB_ICON[cat]}
                                        <span>{LISTING_TAB_LABEL[cat]}</span>
                                        {typeof count === 'number' && (
                                            <span className={`tabular-nums ${active ? 'text-white/90' : 'text-slate'}`}>
                                                ({count.toLocaleString('en-IN')})
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}

                            <div ref={moreRef} className="relative">
                                <button
                                    type="button"
                                    aria-expanded={moreOpen}
                                    aria-haspopup="menu"
                                    aria-controls={morePanelId}
                                    onClick={() => setMoreOpen((v) => !v)}
                                    className={`min-h-[44px] sm:min-h-[40px] px-2.5 sm:px-4 rounded-[10px] border text-xs sm:text-sm whitespace-nowrap inline-flex items-center gap-1.5 sm:gap-2 transition-colors cursor-pointer ${FOCUS_RING} ${
                                        isMoreActive
                                            ? 'bg-red text-white border-red font-semibold'
                                            : 'bg-[#F4F2F3] text-ink border-transparent font-medium hover:bg-[#EAE7E8]'
                                    }`}
                                >
                                    {isMoreActive ? TAB_ICON[activeTabKey] : TAB_ICON.plot}
                                    <span>{isMoreActive ? LISTING_TAB_LABEL[activeTabKey] : 'More'}</span>
                                    {typeof activeMoreCount === 'number' && (
                                        <span className="tabular-nums text-white/90">
                                            ({activeMoreCount.toLocaleString('en-IN')})
                                        </span>
                                    )}
                                    <ChevronDown className="w-3.5 h-3.5 opacity-80 shrink-0" aria-hidden="true" />
                                </button>

                                {moreOpen && (
                                    <div
                                        id={morePanelId}
                                        role="menu"
                                        aria-label="More property categories"
                                        className="absolute left-0 top-full mt-2 w-52 rounded-[12px] border border-line bg-white p-1.5 shadow-lg z-40"
                                    >
                                        {MORE_TABS.map((cat) => {
                                            const active = activeTabKey === cat;
                                            const count = propertyCounts?.[cat];
                                            return (
                                                <Link
                                                    key={cat}
                                                    role="menuitem"
                                                    to={categoryHref(cat)}
                                                    onClick={() => setMoreOpen(false)}
                                                    className={`min-h-[44px] w-full flex items-center justify-between gap-2 px-3 rounded-lg text-sm transition-colors ${FOCUS_RING} ${
                                                        active
                                                            ? 'bg-blush-100 text-red font-semibold'
                                                            : 'text-ink font-medium hover:bg-blush-100'
                                                    }`}
                                                >
                                                    <span className="inline-flex items-center gap-2">
                                                        {active ? (
                                                            <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                                                        ) : (
                                                            TAB_ICON[cat]
                                                        )}
                                                        <span>{LISTING_TAB_LABEL[cat]}</span>
                                                    </span>
                                                    {typeof count === 'number' && (
                                                        <span className="text-xs text-slate tabular-nums">
                                                            {count.toLocaleString('en-IN')}
                                                        </span>
                                                    )}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </nav>

                        {/* Desktop Sort & Map controls (preserve existing features without changing results header) */}
                        <div className="hidden lg:flex items-center gap-2 ml-auto shrink-0">
                            {hasGeoCoordinates && (
                                <button
                                    type="button"
                                    aria-pressed={showMapPanel}
                                    onClick={onMapToggle}
                                    className={`h-10 px-3 rounded-[10px] border text-sm inline-flex items-center gap-1.5 transition-colors cursor-pointer ${FOCUS_RING} ${
                                        showMapPanel
                                            ? 'bg-blush-100 text-red border-red font-semibold'
                                            : 'bg-white text-ink border-line font-medium hover:bg-blush-100'
                                    }`}
                                >
                                    <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                                    <span>Map</span>
                                </button>
                            )}

                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => onSortChange(e.target.value)}
                                    aria-label="Sort results"
                                    className={`h-10 appearance-none pl-3 pr-8 rounded-[10px] border border-line bg-white text-sm font-medium text-ink cursor-pointer hover:border-ink/40 ${FOCUS_RING}`}
                                >
                                    <option value="newest">Sort: Newest</option>
                                    <option value="price_asc">Price: low to high</option>
                                    <option value="price_desc">Price: high to low</option>
                                </select>
                                <ChevronDown
                                    className="w-4 h-4 text-slate absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                                    aria-hidden="true"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Row 2 (Desktop — single line): Search + Area + Budget + Category Dropdowns + Search CTA */}
                    <form
                        onSubmit={submitSearch}
                        className="hidden lg:flex items-center gap-2.5 mt-3.5 pt-3.5 border-t border-line/70"
                    >
                        <div className="flex-1 min-w-[260px] flex">{searchInput('listing-search-desktop')}</div>
                        {renderDropdowns(false)}
                        <button
                            type="submit"
                            className={`h-12 px-5 shrink-0 inline-flex items-center justify-center gap-2 rounded-[10px] bg-red text-sm font-semibold text-white hover:bg-red-hover transition-colors cursor-pointer ${FOCUS_RING}`}
                        >
                            <Search className="w-4 h-4 shrink-0" aria-hidden="true" />
                            <span>Search</span>
                        </button>
                    </form>

                    {/* Row 2 (Mobile): Search input stays visible + Search submit icon + Filters drawer button */}
                    <form
                        onSubmit={submitSearch}
                        className="lg:hidden mt-3 pt-3 border-t border-line/70 flex items-center gap-2"
                    >
                        {searchInput('listing-search-mobile', true)}
                        <button
                            type="submit"
                            aria-label="Search"
                            className={`h-11 w-11 shrink-0 inline-flex items-center justify-center rounded-[10px] bg-red text-white hover:bg-red-hover transition-colors cursor-pointer ${FOCUS_RING}`}
                        >
                            <Search className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <button
                            ref={filtersBtnRef}
                            type="button"
                            onClick={() => setDrawerOpen(true)}
                            aria-expanded={drawerOpen}
                            className={`h-11 px-3.5 shrink-0 inline-flex items-center justify-center gap-1.5 rounded-[10px] border border-line bg-white text-sm font-medium text-ink hover:bg-blush-100 cursor-pointer ${FOCUS_RING}`}
                        >
                            <SlidersHorizontal className="w-4 h-4 text-red shrink-0" aria-hidden="true" />
                            <span>Filters</span>
                            {activeFilterPills.length > 0 && (
                                <span className="px-1.5 py-0.5 rounded-full bg-red text-white text-[11px] font-semibold tabular-nums leading-none">
                                    {activeFilterPills.length}
                                </span>
                            )}
                        </button>
                    </form>

                    {/* Active Removable Filter Chips (unchanged) */}
                    {activeFilterPills.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mt-3.5 pt-3 border-t border-line/70">
                            <span className="text-xs text-slate">Active:</span>
                            {activeFilterPills.map((pill) => (
                                <button
                                    key={pill.key}
                                    type="button"
                                    onClick={pill.onRemove}
                                    aria-label={`Remove filter ${pill.label}`}
                                    className={`min-h-[44px] sm:min-h-[34px] px-3 rounded-full bg-blush-100 border border-red text-xs font-semibold text-red hover:bg-white inline-flex items-center gap-1.5 cursor-pointer ${FOCUS_RING}`}
                                >
                                    <Check className="w-3 h-3 shrink-0" aria-hidden="true" />
                                    <span>{pill.label}</span>
                                    <X className="w-3 h-3 shrink-0" aria-hidden="true" />
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={onClearAll}
                                className={`min-h-[44px] sm:min-h-[34px] px-3 text-xs font-medium text-ink hover:text-red underline underline-offset-4 cursor-pointer ${FOCUS_RING}`}
                            >
                                Clear all
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile filters drawer */}
            {drawerOpen && (
                <div
                    className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/50"
                    onClick={closeDrawer}
                >
                    <div
                        ref={drawerRef}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Filter listings"
                        className="flex max-h-[88vh] flex-col overflow-hidden rounded-t-[20px] border-t border-line bg-white"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-line px-5 py-3">
                            <h2 className="text-base font-bold text-ink">Filters</h2>
                            <button
                                type="button"
                                aria-label="Close filters"
                                onClick={closeDrawer}
                                className={`flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-blush-100 cursor-pointer ${FOCUS_RING}`}
                            >
                                <X className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>

                        <form
                            onSubmit={(e) => {
                                submitSearch(e);
                                closeDrawer();
                            }}
                            className="flex min-h-0 flex-1 flex-col"
                        >
                            <div className="flex-1 space-y-3 overflow-y-auto p-5">
                                <label htmlFor="drawer-search" className="block text-sm font-semibold text-ink">
                                    Search
                                </label>
                                {searchInput('drawer-search')}

                                <p className="pt-2 text-sm font-semibold text-ink">Filters</p>
                                <div className="flex flex-col gap-3">{renderDropdowns(true)}</div>

                                <div className="pt-2 space-y-2">
                                    <label htmlFor="drawer-sort" className="block text-sm font-semibold text-ink">
                                        Sort by
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="drawer-sort"
                                            value={sortBy}
                                            onChange={(e) => onSortChange(e.target.value)}
                                            className={`h-12 w-full appearance-none rounded-[10px] border border-line bg-white pl-3.5 pr-9 text-sm font-medium text-ink ${FOCUS_RING}`}
                                        >
                                            <option value="newest">Sort: Newest</option>
                                            <option value="price_asc">Price: low to high</option>
                                            <option value="price_desc">Price: high to low</option>
                                        </select>
                                        <ChevronDown
                                            className="w-4 h-4 text-slate absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                                            aria-hidden="true"
                                        />
                                    </div>

                                    {hasGeoCoordinates && (
                                        <button
                                            type="button"
                                            aria-pressed={showMapPanel}
                                            onClick={onMapToggle}
                                            className={`h-12 w-full rounded-[10px] border px-4 text-sm font-medium inline-flex items-center justify-center gap-2 cursor-pointer ${FOCUS_RING} ${
                                                showMapPanel
                                                    ? 'bg-blush-100 text-red border-red font-semibold'
                                                    : 'bg-white text-ink border-line hover:bg-blush-100'
                                            }`}
                                        >
                                            <MapPin className="w-4 h-4" aria-hidden="true" />
                                            <span>{showMapPanel ? 'Hide map view' : 'Show map view'}</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 border-t border-line bg-white p-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        onClearAll();
                                        closeDrawer();
                                    }}
                                    className={`h-12 rounded-[10px] border border-line px-4 text-sm font-medium text-ink cursor-pointer ${FOCUS_RING}`}
                                >
                                    Clear all
                                </button>
                                <button
                                    type="submit"
                                    className={`h-12 flex-1 inline-flex items-center justify-center gap-2 rounded-[10px] bg-red px-5 text-sm font-semibold text-white hover:bg-red-hover cursor-pointer ${FOCUS_RING}`}
                                >
                                    <Search className="w-4 h-4" aria-hidden="true" />
                                    <span>{loading ? 'Search' : `Show ${resultCount.toLocaleString('en-IN')} results`}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
