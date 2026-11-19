import type { HomeInventorySummary } from '@/lib/homeInventoryStats';
import type { FaqItem } from '@/lib/schema';
import { BRAND_FAQ_ITEMS } from '@/lib/brandEntity';

const BOOKING_FAQ: FaqItem = {
    question: 'How do I book a visit or pay a token?',
    answer:
        'Open any listing page, pick your preferred visit date and time to schedule a walkthrough, or chat with us on WhatsApp. Online booking tokens are available only on listings where token booking is enabled.',
};

/**
 * Builds up to 8 homepage FAQs backed strictly by factual copy and live API stats.
 * The visible accordion and FAQPage JSON-LD must both consume the exact same array returned here.
 */
export function buildHomeFaqs(summary?: HomeInventorySummary | null): FaqItem[] {
    const items: FaqItem[] = [...BRAND_FAQ_ITEMS];
    const pgStats = summary?.pgStats;

    if (
        pgStats &&
        pgStats.count >= 10 &&
        pgStats.minStartingPrice !== null &&
        pgStats.medianStartingPrice !== null
    ) {
        const minStr = `₹${pgStats.minStartingPrice.toLocaleString('en-IN')}`;
        const medianStr = `₹${pgStats.medianStartingPrice.toLocaleString('en-IN')}`;
        const updatedPart = pgStats.lastUpdatedLabel ? ` Last updated ${pgStats.lastUpdatedLabel}.` : '';
        items.push({
            question: 'What is the average PG rent in Bangalore?',
            answer: `Based on ${pgStats.count.toLocaleString('en-IN')} PG listings on MakeMyStay today, rents start at ${minStr}, with a median of ${medianStr}.${updatedPart}`,
        });
    }

    if (pgStats && pgStats.count > 0 && pgStats.wifiCount > 0) {
        items.push({
            question: 'Is WiFi included in PG rent?',
            answer: `${pgStats.wifiCount.toLocaleString('en-IN')} of ${pgStats.count.toLocaleString('en-IN')} PG listings on MakeMyStay.ai include WiFi in their listed amenities. Confirm speed and terms on each property page.`,
        });
    }

    if (pgStats && pgStats.count > 0 && pgStats.foodCount > 0) {
        items.push({
            question: 'Are food and meals included in PGs?',
            answer: `${pgStats.foodCount.toLocaleString('en-IN')} of ${pgStats.count.toLocaleString('en-IN')} PG listings on MakeMyStay.ai include food or meals. Meal plans and timings vary by property — check the listing details before visiting.`,
        });
    }

    if (items.length < 8) {
        items.push(BOOKING_FAQ);
    }

    return items.slice(0, 8);
}

/** Static fallback for non-homepage callers when live inventory summary is unavailable. */
export const HOME_PG_FAQS: FaqItem[] = buildHomeFaqs(null);
