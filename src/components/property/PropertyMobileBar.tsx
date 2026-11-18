'use client';

import { useMemo } from 'react';
import { MessageCircle } from 'lucide-react';
import { buildPropertyWhatsappUrl } from '@/lib/whatsapp';
import type { Property } from '@/types/api';

interface PropertyMobileBarProps {
    property: Property;
    displayTitle: string;
    canonicalPath: string;
    isMonthly: boolean;
    hasNumericPrice: boolean;
    visitNote?: string;
    onBookVisit: () => void;
}

export function PropertyMobileBar({
    property,
    displayTitle,
    canonicalPath,
    isMonthly,
    hasNumericPrice,
    visitNote,
    onBookVisit,
}: PropertyMobileBarProps) {
    const whatsappHref = useMemo(
        () =>
            buildPropertyWhatsappUrl(
                displayTitle || property.title,
                property.location || 'Bangalore',
                canonicalPath,
                visitNote || undefined,
            ),
        [displayTitle, property.title, property.location, canonicalPath, visitNote],
    );

    return (
        <div
            className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-pdp-surface border-t border-pdp-border px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(22,24,29,0.08)]"
            role="region"
            aria-label="Quick booking bar"
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex items-baseline gap-1 flex-wrap">
                        <span className="text-lg font-semibold text-pdp-ink tabular-nums truncate">
                            {property.price || 'Price on request'}
                        </span>
                        {isMonthly && hasNumericPrice && (
                            <span className="text-xs text-pdp-muted">/month</span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Chat on WhatsApp about this property"
                        className="min-w-[44px] min-h-[44px] rounded-[10px] border border-pdp-border bg-pdp-surface text-pdp-ink inline-flex items-center justify-center hover:bg-pdp-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink"
                    >
                        <MessageCircle className="w-5 h-5" aria-hidden />
                    </a>
                    <button
                        type="button"
                        onClick={onBookVisit}
                        className="min-h-[44px] px-5 py-2.5 rounded-[10px] bg-pdp-cta hover:bg-pdp-cta-hover text-white text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pdp-cta cursor-pointer"
                    >
                        Book a visit
                    </button>
                </div>
            </div>
        </div>
    );
}
