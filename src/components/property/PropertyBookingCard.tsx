'use client';

import { useId, useMemo } from 'react';
import { Calendar, MessageCircle } from 'lucide-react';
import { buildPropertyWhatsappUrl } from '@/lib/whatsapp';
import type { Property } from '@/types/api';

const VISIT_TIME_SLOTS = ['10:00 AM', '12:30 PM', '4:00 PM', '6:30 PM'] as const;

export interface SharingPriceRow {
    label: string;
    price: number;
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
    onPayToken,
    isPaymentProcessing = false,
}: PropertyBookingCardProps) {
    const dateInputId = useId();
    const minDate = useMemo(() => new Date().toISOString().split('T')[0], []);

    const visitSummary = [visitDate, visitTime].filter(Boolean).join(' at ');
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

    return (
        <aside
            aria-label="Booking and enquiry"
            className="bg-pdp-surface border border-pdp-border rounded-[var(--radius-pdp)] p-6 shadow-[0_2px_12px_rgba(22,24,29,0.05)]"
        >
            {/* Price (highest-contrast element) */}
            <div className="pb-5 border-b border-pdp-border">
                <p className="text-sm text-pdp-muted mb-1">{priceContextLabel}</p>
                <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-3xl font-semibold text-pdp-ink tracking-tight tabular-nums leading-none">
                        {property.price || 'Price on request'}
                    </span>
                    {isMonthly && hasNumericPrice && (
                        <span className="text-base font-normal text-pdp-muted">/month</span>
                    )}
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                    <span className="text-pdp-muted">Security deposit</span>
                    <span className="font-medium text-pdp-ink text-right">{depositDisplay}</span>
                </div>
            </div>

            {/* Sharing Prices (only rows that exist) */}
            {sharingRows.length > 0 && (
                <div className="py-4 border-b border-pdp-border space-y-2.5">
                    <p className="text-sm font-medium text-pdp-ink">Price by sharing</p>
                    <div className="space-y-2">
                        {sharingRows.map((row) => (
                            <div key={row.label} className="flex items-center justify-between text-sm">
                                <span className="text-pdp-muted">{row.label}</span>
                                <span className="font-medium text-pdp-ink tabular-nums">
                                    ₹{row.price.toLocaleString('en-IN')}/month
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Visit Date Picker & Time Chips */}
            <div className="py-5 space-y-4">
                <div>
                    <label htmlFor={dateInputId} className="block text-sm font-medium text-pdp-ink mb-2">
                        Preferred visit date
                    </label>
                    <div className="relative">
                        <Calendar
                            className="w-4 h-4 text-pdp-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                            aria-hidden
                        />
                        <input
                            id={dateInputId}
                            type="date"
                            min={minDate}
                            value={visitDate}
                            onChange={(e) => onVisitDateChange(e.target.value)}
                            className="w-full min-h-[44px] pl-10 pr-3 py-2 rounded-[10px] border border-pdp-border bg-pdp-bg text-sm text-pdp-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink"
                        />
                    </div>
                </div>

                <div>
                    <p className="text-sm font-medium text-pdp-ink mb-2">Preferred time slot</p>
                    <div className="grid grid-cols-2 gap-2" role="group" aria-label="Preferred visit time">
                        {VISIT_TIME_SLOTS.map((slot) => {
                            const selected = visitTime === slot;
                            return (
                                <button
                                    key={slot}
                                    type="button"
                                    aria-pressed={selected}
                                    onClick={() => onVisitTimeChange(selected ? '' : slot)}
                                    className={`min-h-[44px] px-3 py-2 rounded-[10px] border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink ${
                                        selected
                                            ? 'bg-pdp-ink text-white border-pdp-ink'
                                            : 'bg-pdp-surface text-pdp-ink border-pdp-border hover:bg-pdp-bg'
                                    }`}
                                >
                                    {slot}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
                <button
                    type="button"
                    onClick={onBookVisit}
                    className="w-full min-h-[48px] px-5 py-3 rounded-[10px] bg-pdp-cta hover:bg-pdp-cta-hover text-white text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pdp-cta cursor-pointer"
                >
                    Book a visit
                </button>

                <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full min-h-[44px] px-5 py-2.5 rounded-[10px] border border-pdp-border bg-pdp-surface hover:bg-pdp-bg text-pdp-ink text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink"
                >
                    <MessageCircle className="w-4 h-4 shrink-0" aria-hidden />
                    <span>WhatsApp</span>
                </a>

                {onPayToken && property.is_available !== false && (
                    <button
                        type="button"
                        onClick={onPayToken}
                        disabled={isPaymentProcessing}
                        className="w-full min-h-[44px] text-sm text-pdp-muted hover:text-pdp-ink underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink rounded-lg cursor-pointer"
                    >
                        {isPaymentProcessing ? 'Processing payment...' : 'Reserve with booking token'}
                    </button>
                )}
            </div>
        </aside>
    );
}
