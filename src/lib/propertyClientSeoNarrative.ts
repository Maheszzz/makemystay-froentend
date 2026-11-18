/**
 * Factual listing copy helpers when API `seo_about` is absent.
 * Avoid templated filler, invented distances, or unverified claims.
 */

import type { Property } from '@/types/api';
import { formatPropertyTitle } from '@/lib/formatPropertyTitle';
import { buildDynamicPropertyFaqs } from '@/lib/propertyContentEngine';

/** Same shape as `FaqItem` in schema (kept local to avoid circular imports). */
export interface PropertyPdpFaq {
    question: string;
    answer: string;
}

function fmtPrice(property: Property): string {
    const p = property.price?.trim();
    if (p && !/request|negotiable/i.test(p)) return p;
    return '';
}

/** Plain-text excerpt for hero (no markdown). */
export function extractHeroLeadFromNarrative(narrative: string, maxChars: number): string {
    if (!narrative) return '';
    const block = narrative.split(/\n\n+/)[0] ?? narrative;
    const plain = block
        .replace(/^\\?#{1,6}\s*/gm, '')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\s+/g, ' ')
        .trim();
    if (plain.length <= maxChars) return plain;
    const cut = plain.slice(0, maxChars);
    const lastSpace = cut.lastIndexOf(' ');
    return `${cut.slice(0, lastSpace > 40 ? lastSpace : maxChars).trim()}…`;
}

/**
 * Short factual copy for PDP / JSON-LD when `seo_about` is missing.
 */
export function buildClientSeoAbout(property: Property): string {
    const raw = (property.description || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (raw.length > 40) {
        return raw.slice(0, 5000).trim();
    }

    const name = formatPropertyTitle(property.title) || (property.title?.trim() ?? 'Property');
    const loc = property.location?.trim() || 'Bangalore';
    const pt = (property.type || 'Home').trim();
    const price = fmtPrice(property);
    const pl = pt.toLowerCase();

    if (pl === 'plot') {
        return `${name} is land for sale in ${loc}.${price ? ` Listed price: ${price}.` : ''} Confirm dimensions, title, and approvals before booking.`;
    }
    if (pl === 'pg' || pl === 'hostel') {
        const feats = Array.isArray(property.features) ? property.features.slice(0, 6).join(', ') : '';
        return `${name} is a ${pt} in ${loc}.${price ? ` Listed rent starts at ${price}/mo.` : ''}${feats ? ` Listed features: ${feats}.` : ''} Book a visit to confirm room availability and terms.`;
    }

    return `${name} is a ${pt} in ${loc}.${price ? ` Listed rent starts at ${price}/mo.` : ''} Confirm furnishing and terms during a visit.`;
}

/** Factual FAQ snippets for PDP based on available property fields. */
export function buildPropertyPdpFaqs(property: Property): PropertyPdpFaq[] {
    const name = formatPropertyTitle(property.title) || (property.title?.trim() ?? 'Property');
    const loc = property.location?.trim() || 'Bangalore';
    const price = fmtPrice(property);
    const type = property.type || 'property';
    const isMonthly =
        property.category === 'pg' ||
        property.category === 'rent' ||
        type.toLowerCase() === 'pg' ||
        type.toLowerCase() === 'hostel';

    const bookingText =
        property.is_available === false
            ? 'This listing is currently marked unavailable. Enquire to check upcoming openings or similar options.'
            : 'Use Book visit or WhatsApp on this page to schedule a walkthrough.';

    const amenityParts = [
        property.wifi ? 'WiFi' : '',
        property.food ? 'food' : '',
        property.housekeeping ? 'housekeeping' : '',
        property.power_backup ? 'power backup' : '',
        ...(Array.isArray(property.features) ? property.features.slice(0, 4) : []),
    ].filter(Boolean);
    const uniqueAmenities = Array.from(new Set(amenityParts));

    const items: PropertyPdpFaq[] = [
        {
            question: `What is the ${isMonthly ? 'rent' : 'price'} for ${name} in ${loc}?`,
            answer: price
                ? `The listed starting ${isMonthly ? 'rent is' : 'price is'} ${price}${isMonthly ? ' per month' : ''}. Final terms depend on unit or sharing configuration.`
                : `Pricing for this ${type} in ${loc} is available on enquiry.`,
        },
        {
            question: 'How do I book a visit on MakeMyStay?',
            answer: bookingText,
        },
        {
            question: `Where is ${name} located?`,
            answer: `${name} is located in ${loc}. Check the map and nearby landmarks section on this page for exact surroundings.`,
        },
    ];

    if (uniqueAmenities.length > 0) {
        items.push({
            question: `What amenities are listed at ${name}?`,
            answer: `Listed features include ${uniqueAmenities.slice(0, 6).join(', ')}.`,
        });
    }

    if (property.deposit_amount !== null && property.deposit_amount !== undefined && property.deposit_amount !== '') {
        const depLabel =
            typeof property.deposit_amount === 'number'
                ? `₹${property.deposit_amount.toLocaleString('en-IN')}`
                : String(property.deposit_amount);
        items.push({
            question: `What is the security deposit for ${name}?`,
            answer: `The listed security deposit is ${depLabel}.`,
        });
    }

    const seen = new Set<string>();
    return [...items, ...buildDynamicPropertyFaqs(property)]
        .filter((item) => {
            const key = item.question.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        })
        .slice(0, 10);
}

/**
 * Returns only real backend-authored narrative (`seo_about`) — never generates templated area/landmark blurbs.
 */
export function generatePropertyLongFormContent(property: Property): string {
    return property.seo_about?.trim() || '';
}
