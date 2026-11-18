import type { Property } from '@/types/api';
import { formatPropertyTitle } from '@/lib/formatPropertyTitle';

function locationMentionsBangalore(location: string): boolean {
    return /bangalore/i.test(location);
}

/**
 * Single SEO-oriented heading: locality + type + price when available.
 */
export function buildPropertySeoHeading(property: Property): string {
    const title = formatPropertyTitle(property.title) || (property.title?.trim() ?? 'Property');
    const type = (property.type || 'Property').trim();
    const loc = (property.location || '').trim() || 'Bangalore';
    const bangaloreSuffix = locationMentionsBangalore(loc) ? '' : ' Bangalore';
    const locPhrase = `${loc}${bangaloreSuffix}`.replace(/\s+/g, ' ').trim();

    const priceOk = Boolean(property.price && !/request|negotiable/i.test(property.price));
    const isRent = property.category === 'rent';

    if (isRent && priceOk) {
        const price = property.price?.trim() ?? '';
        return `${title} ${type} in ${locPhrase} (${price}/month)`.replace(/\s+/g, ' ').trim();
    }
    if (isRent) {
        return `${title} ${type} in ${locPhrase}`.replace(/\s+/g, ' ').trim();
    }
    return `${title} — ${type} in ${locPhrase}`.replace(/\s+/g, ' ').trim();
}

/** Browser tab / OG title: keep readable if the SEO heading is very long. */
export function trimMetaTitle(heading: string, max = 62): string {
    const t = heading.trim();
    if (t.length <= max) return t;
    return `${t.slice(0, max - 1).trim()}…`;
}

/** Shared product name for JSON-LD (match visible listing name, cap length for schema). */
export function buildPropertyProductName(property: Property): string {
    const h = buildPropertySeoHeading(property);
    return h.length > 150 ? `${h.slice(0, 147)}…` : h;
}
