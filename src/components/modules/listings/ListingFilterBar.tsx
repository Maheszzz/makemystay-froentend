'use client';

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import {
    Armchair,
    BedDouble,
    Building2,
    Check,
    ChevronDown,
    IndianRupee,
    LayoutGrid,
    Layers,
    MapPin,
    Search,
    SlidersHorizontal,
    Users,
    Utensils,
    Home,
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
    all: <LayoutGrid className="w-[18px] h-[18px] shrink-0" aria-hidden="true" />,
    pg: <BedDouble className="w-[18px] h-[18px] shrink-0" aria-hidden="true" />,
    rent: <Building2 className="w-[18px] h-[18px] shrink-0" aria-hidden="true" />,
    buy: <Home className="w-[18px] h-[18px] shrink-0" aria-hidden="true" />,
    plot: <Layers className="w-[18px] h-[18px] shrink-0" aria-hidden="true" />,
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
                className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 ${active ? 'text-red' : 'text-slate'}`}
            >
                {icon}
            </span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                aria-label={label}
                className={`h-12 w-full min-w-[9.5rem] appearance-none cursor-pointer rounded-[10px] border pl-10 pr-9 text-sm font-medium transition-colors ${FOCUS_RING} ${
                    active
                        ? 'border-red bg-blush-100 text-red'
                        : 'border-line bg-white text-ink hover:border-ink/40'
                }`}
            >
                {children}
            </select>
            <ChevronDown
                aria-hidden="true"
                className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 ${active ? 'text-red' : 'text-slate'}`}
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

    const showPg = activeTabKey === 'pg';
    const showRentBuy = activeTabKey === 'rent' || activeTabKey === 'buy' || activeTabKey === 'all';
    const showPlot = activeTabKey === 'plot';

    const renderBudget = (fullWidth = false) => (
        <div ref={fullWidth ? undefined : budgetRef} className={`relative ${fullWidth ? '' : 'shrink-0'}`}>
            <button
                type="button"
                aria-expanded={budgetOpen}
                aria-controls={budgetPanelId}
                onClick={() => setBudgetOpen((v) => !v)}
                className={`h-12 w-full min-w-[9.5rem] inline-flex items-center gap-2 rounded-[10px] border pl-3.5 pr-3 text-sm font-medium transition-colors cursor-pointer ${FOCUS_RING} ${
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
                                    className={`min-h-[44px] px-3 rounded-lg text-sm border transition-colors cursor-pointer ${FOCUS_RING} ${
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

    /** Area + type-specific dropdowns, shared by the desktop row 2 and the mobile drawer. */
    const renderDropdowns = (fullWidth = false) => {
        const w = fullWidth ? 'w-full' : 'shrink-0';
        return (
            <>
                <SelectControl
                    className={w}
                    icon={<MapPin className="w-4 h-4" />}
                    label="Filter by area"
                    value={areaValue}
                    active={areaValue !== ''}
                    onChange={onAreaChange}
                >
                    <option value="">All of {metroLabel}</option>
                    {areaOptions.map((a) => (
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
                        <option value="">Gender</option>
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
                        <option value="">Meals</option>
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

    const searchInput = (id: string) => (
        <div className="relative flex-1 min-w-0">
            <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate"
            />
            <input
                id={id}
                type="search"
                value={draftQuery}
                onChange={(e) => setDraftQuery(e.target.value)}
                placeholder="Search area, property or landmark..."
                aria-label="Search area, property or landmark"
                enterKeyHint="search"
                className={`h-12 w-full rounded-[10px] border border-line bg-page pl-10 pr-10 text-sm text-ink placeholder:text-slate transition-colors focus:bg-white focus:border-red ${FOCUS_RING}`}
            />
            {draftQuery && (
                <button
                    type="button"
                    aria-label="Clear search text"
                    onClick={() => {
                        setDraftQuery('');
                        if (searchQuery) onSearchSubmit('');
                    }}
                    className={`absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-slate hover:text-ink ${FOCUS_RING}`}
                >
                    <X className="h-4 w-4" aria-hidden="true" />
                </button>
            )}
        </div>
    );

    const tabClass = (active: boolean) =>
        `min-h-[44px] px-4 rounded-[10px] border text-sm whitespace-nowrap inline-flex items-center gap-2 transition-colors cursor-pointer ${FOCUS_RING} ${
            active
                ? 'bg-red border-red text-white font-semibold'
                : 'bg-white border-line text-ink font-medium hover:bg-blush-100'
        }`;

    return (
        <>
            <div
                className={`relative z-20 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 ${
                    overlapHero ? '-mt-[60px]' : 'pt-4'
                } mb-8`}
            >
                <div className="rounded-[14px] border border-line bg-white p-4 md:p-5 shadow-[0_10px_32px_rgba(94,15,18,0.10)]">
                    {/* Row 1: type tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 py-1">
                        <nav aria-label="Property categories" className="flex items-center gap-2">
                            {PRIMARY_TABS.map((cat) => {
                                const active = activeTabKey === cat;
                                const count = propertyCounts?.[cat];
                                return (
                                    <Link
                                        key={cat}
                                        to={categoryHref(cat)}
                                        aria-current={active ? 'page' : undefined}
                                        className={tabClass(active)}
                                    >
                                        {TAB_ICON[cat]}
                                        <span>{LISTING_TAB_LABEL[cat]}</span>
                                        {typeof count === 'number' && (
                                            <span className={`tabular-nums ${active ? 'text-white' : 'text-slate'}`}>
                                                ({count.toLocaleString('en-IN')})
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div ref={moreRef} className="relative shrink-0">
                            <button
                                type="button"
                                aria-expanded={moreOpen}
                                aria-controls={morePanelId}
                                onClick={() => setMoreOpen((v) => !v)}
                                className={tabClass(isMoreActive)}
                            >
                                <Layers className="w-[18px] h-[18px] shrink-0" aria-hidden="true" />
                                <span>{isMoreActive ? LISTING_TAB_LABEL[activeTabKey] : 'More'}</span>
                                <ChevronDown className="w-4 h-4 shrink-0" aria-hidden="true" />
                            </button>
                            {moreOpen && (
                                <ul
                                    id={morePanelId}
                                    className="absolute left-0 top-full z-40 mt-2 w-52 rounded-[14px] border border-line bg-white p-1.5 shadow-lg"
                                >
                                    {MORE_TABS.map((cat) => {
                                        const active = activeTabKey === cat;
                                        const count = propertyCounts?.[cat];
                                        return (
                                            <li key={cat}>
                                                <Link
                                                    to={categoryHref(cat)}
                                                    aria-current={active ? 'page' : undefined}
                                                    onClick={() => setMoreOpen(false)}
                                                    className={`flex min-h-[44px] items-center justify-between gap-2 rounded-lg px-3 text-sm ${FOCUS_RING} ${
                                                        active
                                                            ? 'bg-blush-100 font-semibold text-red'
                                                            : 'font-medium text-ink hover:bg-blush-100'
                                                    }`}
                                                >
                                                    <span className="inline-flex items-center gap-2">
                                                        {TAB_ICON[cat]}
                                                        {LISTING_TAB_LABEL[cat]}
                                                    </span>
                                                    {typeof count === 'number' && (
                                                        <span className="tabular-nums text-slate">({count})</span>
                                                    )}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Row 2 (desktop): search + dropdowns + Search button */}
                    <form
                        role="search"
                        onSubmit={submitSearch}
                        className="hidden lg:flex items-center gap-3 mt-3 pt-4 border-t border-line"
                    >
                        {searchInput('listing-search')}
                        {renderDropdowns(false)}
                        <button
                            type="submit"
                            className={`h-12 shrink-0 inline-flex items-center justify-center gap-2 rounded-[10px] bg-red px-7 text-sm font-semibold text-white transition-colors hover:bg-red-hover cursor-pointer ${FOCUS_RING}`}
                        >
                            <Search className="h-4 w-4" aria-hidden="true" />
                            Search
                        </button>
                    </form>

                    {/* Row 2 (mobile): collapses into a Filters button */}
                    <div className="lg:hidden mt-3 pt-4 border-t border-line">
                        <button
                            ref={filtersBtnRef}
                            type="button"
                            aria-haspopup="dialog"
                            aria-expanded={drawerOpen}
                            onClick={() => setDrawerOpen(true)}
                            className={`h-12 w-full inline-flex items-center justify-center gap-2 rounded-[10px] border border-red bg-white text-sm font-semibold text-red hover:bg-blush-100 cursor-pointer ${FOCUS_RING}`}
                        >
                            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                            <span>Filters</span>
                            {activeFilterPills.length > 0 && (
                                <span className="rounded-full bg-red px-2 py-0.5 text-[11px] font-semibold leading-none text-white tabular-nums">
                                    {activeFilterPills.length}
                                </span>
                            )}
                        </button>
                    </div>

                    {activeFilterPills.length > 0 && (
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <span className="text-xs text-slate">Active:</span>
                            {activeFilterPills.map((pill) => (
                                <button
                                    key={pill.key}
                                    type="button"
                                    onClick={pill.onRemove}
                                    aria-label={`Remove filter ${pill.label}`}
                                    className={`min-h-[44px] px-3 rounded-full bg-blush-100 border border-red text-xs font-semibold text-red hover:bg-white inline-flex items-center gap-1.5 cursor-pointer ${FOCUS_RING}`}
                                >
                                    <Check className="w-3 h-3 shrink-0" aria-hidden="true" />
                                    <span>{pill.label}</span>
                                    <X className="w-3 h-3 shrink-0" aria-hidden="true" />
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={onClearAll}
                                className={`min-h-[44px] px-3 text-sm font-medium text-ink hover:text-red underline underline-offset-4 cursor-pointer ${FOCUS_RING}`}
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
                                className={`flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-blush-100 ${FOCUS_RING}`}
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
                                    <Search className="h-4 w-4" aria-hidden="true" />
                                    {loading ? 'Search' : `Show ${resultCount.toLocaleString('en-IN')} results`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
