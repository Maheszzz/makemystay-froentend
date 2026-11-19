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
    visitNote?: string,
): string {
    const phone = getWhatsappDigits();
    const cleanProductionBase = SITE_URL.replace(/\/$/, '');
    const listingUrl = propertyPath
        ? propertyPath.startsWith('http')
            ? propertyPath
            : `${cleanProductionBase}${propertyPath.startsWith('/') ? '' : '/'}${propertyPath}`
        : '';
    const linkPart = listingUrl ? ` — ${listingUrl}` : '';
    const visitPart = visitNote ? ` Preferred visit: ${visitNote}.` : '';
    const text = `Hi, I'm interested in ${propertyTitle} in ${location}${linkPart}.${visitPart} Please share availability and visit details.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export function buildDepositWhatsappUrl(
    propertyTitle: string,
    location: string,
    propertyPath?: string,
): string {
    const phone = getWhatsappDigits();
    const cleanProductionBase = SITE_URL.replace(/\/$/, '');
    const listingUrl = propertyPath
        ? propertyPath.startsWith('http')
            ? propertyPath
            : `${cleanProductionBase}${propertyPath.startsWith('/') ? '' : '/'}${propertyPath}`
        : '';
    const linkPart = listingUrl ? ` (${listingUrl})` : '';
    const text = `Hi, could you share the security deposit details for ${propertyTitle} in ${location}${linkPart}?`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
