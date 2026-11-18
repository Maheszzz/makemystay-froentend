import { getWhatsAppPhone } from '@/lib/env';
import { SITE_URL } from '@/lib/siteConfig';

/** WhatsApp Business number for pre-filled chat links (digits only, country code included). */
export function getWhatsappDigits(): string {
    const env = getWhatsAppPhone();
    const raw = env?.replace(/\D/g, '');
    if (raw && raw.length >= 10) return raw;
    return '918150099911';
}

export function buildPropertyWhatsappUrl(
    propertyTitle: string,
    location: string,
    propertyPath?: string,
): string {
    const phone = getWhatsappDigits();
    const listingUrl = propertyPath
        ? propertyPath.startsWith('http')
            ? propertyPath
            : `${SITE_URL}${propertyPath.startsWith('/') ? '' : '/'}${propertyPath}`
        : '';
    const linkPart = listingUrl ? ` (${listingUrl})` : '';
    const text = `Hi! I'm interested in ${propertyTitle} at ${location}${linkPart}. Please share availability and visit slots.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
