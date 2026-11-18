'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
    Calendar,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Info,
    MessageCircle,
} from 'lucide-react';
import { buildPropertyWhatsappUrl } from '@/lib/whatsapp';
import type { Property } from '@/types/api';

const VISIT_TIME_SLOTS = [
    { label: '10:00 AM', minutesOfDay: 10 * 60 },
    { label: '12:30 PM', minutesOfDay: 12 * 60 + 30 },
    { label: '4:00 PM', minutesOfDay: 16 * 60 },
    { label: '6:30 PM', minutesOfDay: 18 * 60 + 30 },
] as const;

const WEEKDAY_HEADERS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as const;

function toLocalDateKey(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function parseLocalDateKey(key: string): Date | null {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
    if (!match) return null;
    const d = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    return Number.isNaN(d.getTime()) ? null : d;
}

function addDays(base: Date, days: number): Date {
    return new Date(base.getFullYear(), base.getMonth(), base.getDate() + days);
}

function formatReadableDate(key: string): string {
    const d = parseLocalDateKey(key);
    if (!d) return key;
    return d.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
    });
}

function formatShortChipDate(d: Date): string {
    return d.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
    });
}

export interface SharingPriceRow {
    label: string;
    price: number;
}

export interface ConfirmedVisitBooking {
    date: string;
    time: string;
}

interface PropertyBookingCardProps {
    property: Property;
    displayTitle: string;
    canonicalPath: string;
    isMonthly: boolean;
    hasNumericPrice: boolean;
    depositDisplay: string;
    sharingRows: SharingPriceRow[];
    visitDate: string;
    onVisitDateChange: (value: string) => void;
    visitTime: string;
    onVisitTimeChange: (value: string) => void;
    onBookVisit: () => void;
    confirmedBooking?: ConfirmedVisitBooking | null;
    onResetBooking?: () => void;
    onPayToken?: () => void;
    isPaymentProcessing?: boolean;
}

export function PropertyBookingCard({
    property,
    displayTitle,
    canonicalPath,
    isMonthly,
    hasNumericPrice,
    depositDisplay,
    sharingRows,
    visitDate,
    onVisitDateChange,
    visitTime,
    onVisitTimeChange,
    onBookVisit,
    confirmedBooking = null,
    onResetBooking,
    onPayToken,
    isPaymentProcessing = false,
}: PropertyBookingCardProps) {
    const calendarPopoverId = useId();
    const tokenPopoverId = useId();

    const [now, setNow] = useState<Date | null>(null);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [viewMonth, setViewMonth] = useState<Date | null>(null);
    const [tokenInfoOpen, setTokenInfoOpen] = useState(false);

    const calendarContainerRef = useRef<HTMLDivElement | null>(null);
    const tokenPopoverRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const current = new Date();
        setNow(current);
        setViewMonth(new Date(current.getFullYear(), current.getMonth(), 1));
    }, []);

    const todayKey = useMemo(() => (now ? toLocalDateKey(now) : ''), [now]);
    const currentMinutesOfDay = now ? now.getHours() * 60 + now.getMinutes() : -1;

    // Close calendar popover on outside click or Escape
    useEffect(() => {
        if (!calendarOpen) return;
        const onPointerDown = (e: MouseEvent) => {
            if (calendarContainerRef.current && !calendarContainerRef.current.contains(e.target as Node)) {
                setCalendarOpen(false);
            }
        };
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setCalendarOpen(false);
        };
        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [calendarOpen]);

    // Close token popover on outside click or Escape
    useEffect(() => {
        if (!tokenInfoOpen) return;
        const onPointerDown = (e: MouseEvent) => {
            if (tokenPopoverRef.current && !tokenPopoverRef.current.contains(e.target as Node)) {
                setTokenInfoOpen(false);
            }
        };
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setTokenInfoOpen(false);
        };
        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [tokenInfoOpen]);

    // Clear selected slot if user picks Today and that slot has already passed
    useEffect(() => {
        if (!visitDate || !visitTime || !todayKey || visitDate !== todayKey) return;
        const slotObj = VISIT_TIME_SLOTS.find((s) => s.label === visitTime);
        if (slotObj && currentMinutesOfDay >= slotObj.minutesOfDay - 15) {
            onVisitTimeChange('');
        }
    }, [visitDate, visitTime, todayKey, currentMinutesOfDay, onVisitTimeChange]);

    // Quick-pick chips: Today, Tomorrow, and upcoming weekend days (non-overlapping)
    const quickDateChips = useMemo(() => {
        if (!now) return [];
        const chips: { key: string; label: string; ariaLabel: string }[] = [];
        const seen = new Set<string>();

        const pushChip = (d: Date, prefix?: string) => {
            const key = toLocalDateKey(d);
            if (seen.has(key)) return;
            seen.add(key);
            const shortDate = formatShortChipDate(d);
            chips.push({
                key,
                label: prefix ?? shortDate,
                ariaLabel: `${prefix ? `${prefix}, ` : ''}${formatReadableDate(key)}`,
            });
        };

        pushChip(now, 'Today');
        pushChip(addDays(now, 1), 'Tomorrow');

        // Pick next 2 weekend days strictly after tomorrow
        let weekendAdded = 0;
        for (let offset = 2; offset <= 9 && weekendAdded < 2; offset++) {
            const candidate = addDays(now, offset);
            const day = candidate.getDay();
            if (day === 6 || day === 0) {
                pushChip(candidate);
                weekendAdded++;
            }
        }
        return chips;
    }, [now]);

    const isCustomPickedDate =
        Boolean(visitDate) && !quickDateChips.some((c) => c.key === visitDate);

    // Calendar month grid (Mon-first)
    const calendarDays = useMemo(() => {
        if (!viewMonth) return [];
        const year = viewMonth.getFullYear();
        const month = viewMonth.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        // Convert Sunday=0..Saturday=6 into Monday-first index (Mon=0..Sun=6)
        const startOffset = (firstDayOfMonth.getDay() + 6) % 7;

        const cells: ({ key: string; day: number; isPast: boolean } | null)[] = [];
        for (let i = 0; i < startOffset; i++) {
            cells.push(null);
        }
        for (let d = 1; d <= daysInMonth; d++) {
            const cellDate = new Date(year, month, d);
            const key = toLocalDateKey(cellDate);
            cells.push({
                key,
                day: d,
                isPast: Boolean(todayKey && key < todayKey),
            });
        }
        return cells;
    }, [viewMonth, todayKey]);

    const canGoPrevMonth = useMemo(() => {
        if (!now || !viewMonth) return false;
        return (
            viewMonth.getFullYear() > now.getFullYear() ||
            (viewMonth.getFullYear() === now.getFullYear() &&
                viewMonth.getMonth() > now.getMonth())
        );
    }, [now, viewMonth]);

    const handleMonthStep = (delta: number) => {
        if (!viewMonth) return;
        setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + delta, 1));
    };

    const visitSummary = [
        visitDate ? formatReadableDate(visitDate) : '',
        visitTime,
    ]
        .filter(Boolean)
        .join(' at ');

    const whatsappHref = useMemo(
        () =>
            buildPropertyWhatsappUrl(
                displayTitle || property.title,
                property.location || 'Bangalore',
                canonicalPath,
                visitSummary || undefined,
            ),
        [displayTitle, property.title, property.location, canonicalPath, visitSummary],
    );

    const priceContextLabel =
        property.category === 'buy'
            ? 'Sale price'
            : property.category === 'plot'
              ? 'Plot price'
              : 'Starting rent';

    const hasDate = Boolean(visitDate);
    const hasTime = Boolean(visitTime);
    const canBookVisit = hasDate && hasTime;

    const missingHelperText = (() => {
        if (!hasDate && !hasTime) return 'Select a visit date and time slot to enable booking.';
        if (!hasDate) return 'Select a visit date above to enable booking.';
        if (!hasTime) return 'Select a time slot above to enable booking.';
        return `Selected: ${formatReadableDate(visitDate)} · ${visitTime}`;
    })();

    const hasTokenDetails =
        property.token_amount != null ||
        Boolean(property.token_refund_terms && property.token_refund_terms.trim());

    const formattedTokenAmount = (() => {
        if (property.token_amount == null) return null;
        if (typeof property.token_amount === 'number') {
            return `₹${property.token_amount.toLocaleString('en-IN')}`;
        }
        return String(property.token_amount);
    })();

    return (
        <aside
            aria-label="Booking and enquiry"
            className="bg-pdp-surface border border-pdp-border rounded-[var(--radius-pdp)] p-6 shadow-[var(--shadow-pdp-card)]"
        >
            {/* Price (highest-contrast element) */}
            <div className="pb-5 border-b border-pdp-border">
                <p className="pdp-type-caption text-pdp-muted mb-1">{priceContextLabel}</p>
                <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-3xl font-semibold text-pdp-ink tracking-tight tabular-nums leading-none">
                        {property.price || 'Price on request'}
                    </span>
                    {isMonthly && hasNumericPrice && (
                        <span className="pdp-type-body text-pdp-muted">/month</span>
                    )}
                </div>
                <div className="mt-4 flex items-center justify-between gap-3 pdp-type-caption">
                    <span className="text-pdp-muted">Security deposit</span>
                    <span className="font-medium text-pdp-ink text-right tabular-nums">
                        {depositDisplay}
                    </span>
                </div>
            </div>

            {/* Sharing Prices (only rows that exist) */}
            {sharingRows.length > 0 && (
                <div className="py-4 border-b border-pdp-border space-y-2">
                    <p className="pdp-type-caption font-medium text-pdp-ink">Price by sharing</p>
                    <div className="space-y-2">
                        {sharingRows.map((row) => (
                            <div
                                key={row.label}
                                className="flex items-center justify-between pdp-type-caption"
                            >
                                <span className="text-pdp-muted">{row.label}</span>
                                <span className="font-medium text-pdp-ink tabular-nums">
                                    ₹{row.price.toLocaleString('en-IN')}/month
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Inline Confirmation State after Booking */}
            {confirmedBooking ? (
                <div
                    role="status"
                    aria-live="polite"
                    className="py-6 space-y-4"
                >
                    <div className="rounded-[12px] border border-pdp-verified/25 bg-pdp-verified-bg p-4 space-y-2">
                        <div className="flex items-center gap-2 text-pdp-verified font-medium pdp-type-caption">
                            <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden />
                            <span>Visit request submitted</span>
                        </div>
                        <p className="text-base font-semibold text-pdp-ink tabular-nums">
                            {formatReadableDate(confirmedBooking.date)} · {confirmedBooking.time}
                        </p>
                        <p className="pdp-type-caption text-pdp-muted">
                            Next step: our coordinator will reach out by phone or WhatsApp to confirm
                            the walkthrough timing and share exact directions.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <a
                            href={whatsappHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full min-h-[44px] px-4 py-2.5 rounded-[10px] border border-pdp-border bg-pdp-surface hover:bg-pdp-bg text-pdp-ink pdp-type-caption font-medium inline-flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink"
                        >
                            <MessageCircle className="w-4 h-4 shrink-0" aria-hidden />
                            <span>Message on WhatsApp</span>
                        </a>
                        {onResetBooking && (
                            <button
                                type="button"
                                onClick={onResetBooking}
                                className="w-full min-h-[40px] px-4 py-2 pdp-type-caption font-medium text-pdp-muted hover:text-pdp-ink underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink rounded-lg cursor-pointer"
                            >
                                Change date or time
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    {/* Quick-Pick Date Chips & Calendar Popover */}
                    <div className="py-5 space-y-4">
                        <div ref={calendarContainerRef} className="relative">
                            <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="pdp-type-caption font-medium text-pdp-ink">
                                    Preferred visit date
                                </span>
                                {visitDate && (
                                    <span className="pdp-type-caption font-medium text-pdp-ink tabular-nums">
                                        {formatReadableDate(visitDate)}
                                    </span>
                                )}
                            </div>

                            <div
                                className="flex flex-wrap gap-2"
                                role="group"
                                aria-label="Quick-pick visit dates"
                            >
                                {quickDateChips.length > 0 ? (
                                    quickDateChips.map((chip) => {
                                        const selected = visitDate === chip.key;
                                        return (
                                            <button
                                                key={chip.key}
                                                type="button"
                                                aria-pressed={selected}
                                                aria-label={chip.ariaLabel}
                                                onClick={() => {
                                                    onVisitDateChange(selected ? '' : chip.key);
                                                    setCalendarOpen(false);
                                                }}
                                                className={`min-h-[38px] px-3 py-1.5 rounded-[10px] border pdp-type-caption font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink cursor-pointer ${
                                                    selected
                                                        ? 'bg-pdp-ink text-white border-pdp-ink'
                                                        : 'bg-pdp-surface text-pdp-ink border-pdp-border hover:bg-pdp-bg hover:border-pdp-ink/40'
                                                }`}
                                            >
                                                {chip.label}
                                            </button>
                                        );
                                    })
                                ) : (
                                    <div className="flex gap-2">
                                        <span className="h-[38px] w-16 rounded-[10px] bg-pdp-bg border border-pdp-border" />
                                        <span className="h-[38px] w-20 rounded-[10px] bg-pdp-bg border border-pdp-border" />
                                    </div>
                                )}

                                <button
                                    type="button"
                                    aria-haspopup="dialog"
                                    aria-expanded={calendarOpen}
                                    aria-controls={calendarPopoverId}
                                    onClick={() => setCalendarOpen((v) => !v)}
                                    className={`min-h-[38px] px-3 py-1.5 rounded-[10px] border pdp-type-caption font-medium inline-flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink cursor-pointer ${
                                        isCustomPickedDate || calendarOpen
                                            ? 'bg-pdp-ink text-white border-pdp-ink'
                                            : 'bg-pdp-surface text-pdp-ink border-pdp-border hover:bg-pdp-bg hover:border-pdp-ink/40'
                                    }`}
                                >
                                    <Calendar className="w-3.5 h-3.5 shrink-0" aria-hidden />
                                    <span>
                                        {isCustomPickedDate
                                            ? formatReadableDate(visitDate)
                                            : 'Pick a date'}
                                    </span>
                                </button>
                            </div>

                            {calendarOpen && viewMonth && (
                                <div
                                    id={calendarPopoverId}
                                    role="dialog"
                                    aria-label="Choose visit date"
                                    className="mt-2 p-4 rounded-[12px] border border-pdp-border bg-pdp-surface shadow-[var(--shadow-pdp-card)] z-30"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <button
                                            type="button"
                                            disabled={!canGoPrevMonth}
                                            onClick={() => handleMonthStep(-1)}
                                            aria-label="Previous month"
                                            className="min-w-[36px] min-h-[36px] rounded-lg border border-pdp-border inline-flex items-center justify-center text-pdp-ink hover:bg-pdp-bg disabled:opacity-35 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink cursor-pointer"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <span className="pdp-type-caption font-semibold text-pdp-ink">
                                            {viewMonth.toLocaleDateString('en-IN', {
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleMonthStep(1)}
                                            aria-label="Next month"
                                            className="min-w-[36px] min-h-[36px] rounded-lg border border-pdp-border inline-flex items-center justify-center text-pdp-ink hover:bg-pdp-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink cursor-pointer"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-7 gap-1 text-center mb-1">
                                        {WEEKDAY_HEADERS.map((wd) => (
                                            <span
                                                key={wd}
                                                className="py-1 text-[11px] font-medium text-pdp-muted"
                                            >
                                                {wd}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-7 gap-1">
                                        {calendarDays.map((cell, idx) => {
                                            if (!cell) {
                                                return <span key={`empty-${idx}`} className="h-9" />;
                                            }
                                            const selected = visitDate === cell.key;
                                            const isToday = cell.key === todayKey;
                                            return (
                                                <button
                                                    key={cell.key}
                                                    type="button"
                                                    disabled={cell.isPast}
                                                    aria-pressed={selected}
                                                    aria-label={formatReadableDate(cell.key)}
                                                    onClick={() => {
                                                        onVisitDateChange(cell.key);
                                                        setCalendarOpen(false);
                                                    }}
                                                    className={`h-9 rounded-lg text-xs font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink ${
                                                        cell.isPast
                                                            ? 'text-pdp-muted/40 line-through cursor-not-allowed'
                                                            : selected
                                                              ? 'bg-pdp-ink text-white cursor-pointer'
                                                              : isToday
                                                                ? 'border border-pdp-ink text-pdp-ink hover:bg-pdp-bg cursor-pointer'
                                                                : 'text-pdp-ink hover:bg-pdp-bg cursor-pointer'
                                                    }`}
                                                >
                                                    {cell.day}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Preferred Time Slots */}
                        <div>
                            <p className="pdp-type-caption font-medium text-pdp-ink mb-2">
                                Preferred time slot
                            </p>
                            <div
                                className="grid grid-cols-2 gap-2"
                                role="group"
                                aria-label="Preferred visit time"
                            >
                                {VISIT_TIME_SLOTS.map((slot) => {
                                    const selected = visitTime === slot.label;
                                    const isPastSlotToday =
                                        Boolean(todayKey) &&
                                        visitDate === todayKey &&
                                        currentMinutesOfDay >= slot.minutesOfDay - 15;
                                    return (
                                        <button
                                            key={slot.label}
                                            type="button"
                                            disabled={isPastSlotToday}
                                            aria-pressed={selected}
                                            title={
                                                isPastSlotToday
                                                    ? 'This time slot has passed for today'
                                                    : undefined
                                            }
                                            onClick={() =>
                                                onVisitTimeChange(selected ? '' : slot.label)
                                            }
                                            className={`min-h-[44px] px-3 py-2 rounded-[10px] border pdp-type-caption font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink focus-visible:ring-offset-1 ${
                                                isPastSlotToday
                                                    ? 'bg-pdp-bg text-pdp-muted/45 border-pdp-border/60 line-through cursor-not-allowed'
                                                    : selected
                                                      ? 'bg-pdp-ink text-white border-pdp-ink cursor-pointer'
                                                      : 'bg-pdp-surface text-pdp-ink border-pdp-border hover:bg-pdp-bg hover:border-pdp-ink/40 cursor-pointer'
                                            }`}
                                        >
                                            {slot.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <p
                            role="status"
                            aria-live="polite"
                            className={`pdp-type-caption ${
                                canBookVisit ? 'text-pdp-ink font-medium' : 'text-pdp-muted'
                            }`}
                        >
                            {missingHelperText}
                        </p>

                        <button
                            type="button"
                            disabled={!canBookVisit}
                            onClick={onBookVisit}
                            className={`w-full min-h-[48px] px-5 py-3 rounded-[10px] text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                                canBookVisit
                                    ? 'bg-pdp-cta hover:bg-pdp-cta-hover text-white focus-visible:ring-pdp-cta cursor-pointer'
                                    : 'bg-pdp-border text-pdp-muted focus-visible:ring-pdp-ink cursor-not-allowed'
                            }`}
                        >
                            Book a visit
                        </button>

                        <a
                            href={whatsappHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full min-h-[44px] px-5 py-2.5 rounded-[10px] border border-pdp-border bg-pdp-surface hover:bg-pdp-bg text-pdp-ink pdp-type-caption font-medium inline-flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink"
                        >
                            <MessageCircle className="w-4 h-4 shrink-0" aria-hidden />
                            <span>WhatsApp</span>
                        </a>

                        {onPayToken && property.is_available !== false && (
                            <div
                                ref={tokenPopoverRef}
                                className="relative flex items-center justify-center gap-1.5 pt-1"
                            >
                                <button
                                    type="button"
                                    onClick={onPayToken}
                                    disabled={isPaymentProcessing}
                                    className="min-h-[40px] px-2 pdp-type-caption text-pdp-muted hover:text-pdp-ink underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink rounded-lg cursor-pointer"
                                >
                                    {isPaymentProcessing
                                        ? 'Processing payment...'
                                        : 'Reserve with booking token'}
                                </button>

                                {hasTokenDetails && (
                                    <>
                                        <button
                                            type="button"
                                            aria-label="Booking token amount and refund terms"
                                            aria-haspopup="dialog"
                                            aria-expanded={tokenInfoOpen}
                                            aria-controls={tokenPopoverId}
                                            onClick={() => setTokenInfoOpen((v) => !v)}
                                            className="min-w-[32px] min-h-[32px] rounded-full inline-flex items-center justify-center text-pdp-muted hover:text-pdp-ink hover:bg-pdp-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink cursor-pointer"
                                        >
                                            <Info className="w-4 h-4" aria-hidden />
                                        </button>
                                        {tokenInfoOpen && (
                                            <div
                                                id={tokenPopoverId}
                                                role="dialog"
                                                aria-label="Booking token terms"
                                                className="absolute bottom-full right-0 mb-2 w-64 rounded-[12px] border border-pdp-border bg-pdp-surface p-3.5 shadow-[var(--shadow-pdp-card)] z-30 text-left space-y-1.5"
                                            >
                                                {formattedTokenAmount && (
                                                    <p className="pdp-type-caption font-semibold text-pdp-ink tabular-nums">
                                                        Token amount: {formattedTokenAmount}
                                                    </p>
                                                )}
                                                {property.token_refund_terms && (
                                                    <p className="pdp-type-caption text-pdp-muted">
                                                        {property.token_refund_terms}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}
        </aside>
    );
}
