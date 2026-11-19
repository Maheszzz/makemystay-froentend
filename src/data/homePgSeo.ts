import type { FaqItem } from '@/lib/schema';
import { BRAND_FAQ_ITEMS } from '@/lib/brandEntity';
import type { HomePgStats } from '@/lib/homePageData';

const BOOKING_TOKEN_FAQ: FaqItem = {
    question: 'How do I book a visit or reserve a room?',
    answer:
        'Browse listings, shortlist properties, and schedule a visit directly on the property page. Where booking tokens are enabled on a listing, you can reserve your room online with transparent pricing.',
};

/**
 * Generates visible homepage FAQs and FAQPage JSON-LD from the exact same array.
 * Rent, WiFi, and meals answers are computed strictly from live API data and hidden when < 10 PG listings.
 */
export function buildHomeFaqs(pgStats: HomePgStats | null): FaqItem[] {
    const items: FaqItem[] = [...BRAND_FAQ_ITEMS];

    if (
        pgStats &&
        pgStats.count >= 10 &&
        pgStats.minRentInr !== null &&
        pgStats.medianRentInr !== null
    ) {
        items.push({
            question: 'What is the average PG rent in Bangalore?',
            answer: `Based on ${pgStats.count.toLocaleString('en-IN')} PG listings on MakeMyStay today, rents start at ₹${pgStats.minRentInr.toLocaleString('en-IN')}/month, with a median of ₹${pgStats.medianRentInr.toLocaleString('en-IN')}/month. Last updated ${pgStats.lastUpdatedLabel}.`,
        });
    }

    if (pgStats && pgStats.totalActivePgs >= 10 && pgStats.wifiCount > 0) {
        items.push({
            question: 'Is WiFi included in PG rent?',
            answer: `${pgStats.wifiCount.toLocaleString('en-IN')} of ${pgStats.totalActivePgs.toLocaleString('en-IN')} active PG listings on MakeMyStay today list WiFi as an included amenity. Confirm speed and usage terms on each listing.`,
        });
    }

    if (pgStats && pgStats.totalActivePgs >= 10 && pgStats.foodCount > 0) {
        items.push({
            question: 'Are food and meals included in PG stays?',
            answer: `${pgStats.foodCount.toLocaleString('en-IN')} of ${pgStats.totalActivePgs.toLocaleString('en-IN')} active PG listings on MakeMyStay today list meals as available. Check individual property pages for meal schedules and options.`,
        });
    }

    if (items.length < 8) {
        items.push(BOOKING_TOKEN_FAQ);
    }

    return items.slice(0, 8);
}

/** Static fallback when server-computed stats are unavailable. */
export const HOME_PG_FAQS: FaqItem[] = [...BRAND_FAQ_ITEMS, BOOKING_TOKEN_FAQ];
