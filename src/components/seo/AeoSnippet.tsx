import React from 'react';
import { Property } from '@/types/api';
import { SITE_NAME } from '@/lib/siteConfig';

interface AeoSnippetProps {
    property: Property;
}

/**
 * Concise property summary block using factual listing fields only.
 */
export const AeoSnippet: React.FC<AeoSnippetProps> = ({ property }) => {
    if (!property) return null;

    const type = property.type || 'property';
    const location = property.location;
    const price = property.price;
    const hasPrice = Boolean(price && !/request|negotiable/i.test(price));
    const isPG = property.category === 'pg' || type === 'PG' || type === 'Hostel';
    const isBuyOrPlot = property.category === 'buy' || property.category === 'plot';

    const pricePhrase = hasPrice
        ? isBuyOrPlot
            ? ` listed at ${price}`
            : ` starting from ${price}/mo`
        : '';

    const intro = isPG
        ? `This ${type} in ${location} is available${pricePhrase}.`
        : isBuyOrPlot
          ? `This ${type} in ${location} is listed${pricePhrase}.`
          : `This ${type} in ${location} is available for rent${pricePhrase}.`;

    const summaryText = `${intro} Book a visit or enquire directly through ${SITE_NAME}.`;

    return (
        <div
            id="aeo-summary"
            className="mb-8 p-5 bg-white border border-line rounded-[var(--radius-pdp)]"
            aria-label="Property Summary"
        >
            <p className="text-[15px] text-slate leading-relaxed font-medium">
                {summaryText}
            </p>
        </div>
    );
};
