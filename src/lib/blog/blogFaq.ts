/**
 * Programmatic Blog Engine: FAQ Generator
 * Generates 10–15 SEO-friendly FAQs for every programmatic blog article
 * targeting Google AI Overviews & Speakable voice search.
 */

import type { FaqItem } from '@/lib/schema';
import type { ProgrammaticBlogInput } from './blogTypes';

export function generateBlogFaqs(
    input: ProgrammaticBlogInput,
    hubName: string,
    averageRent: string
): FaqItem[] {
    const { blogType, secondarySlug } = input;
    const secondName = secondarySlug
        ? secondarySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
        : 'surrounding Bangalore corridors';

    const baseFaqs: FaqItem[] = [
        {
            question: `What is the average monthly PG rent in ${hubName} in 2026?`,
            answer: `The average monthly PG rent in ${hubName} in 2026 starts around ${averageRent}, which typically includes a furnished room, 3-time daily meals, high-speed Wi-Fi, power backup, and daily housekeeping. Private single sharing rooms range from ₹16,000 to ₹25,000, while double and triple sharing rooms range from ₹7,500 to ₹14,000 per month.`
        },
        {
            question: `What security deposit is standard for PG stays in ${hubName}?`,
            answer: `In 2026, reputable coliving operators and verified PGs in ${hubName} charge a standard security deposit of 1 to 2 months' rent. Always ensure that exit notice periods (usually 30 days) and refund terms are documented in writing before paying any advance token.`
        },
        {
            question: `Are there PGs within walking distance of IT parks in ${hubName}?`,
            answer: `Yes, ${hubName} features numerous residential pockets within a 5 to 12-minute walk from major IT park gates. Staying within walking distance eliminates daily peak-hour ORR traffic stress and saves ₹2,000–₹4,500 monthly on cab or auto-rickshaw fares.`
        },
        {
            question: `What meals are included in paying guest accommodations in ${hubName}?`,
            answer: `Most verified PGs in ${hubName} provide 3 meals a day (breakfast, packed lunch box option, and dinner) on weekdays, and full 4-meal spreads on weekends. Menu options typically include both North Indian and South Indian dietary preferences with vegetarian and non-vegetarian rotations.`
        },
        {
            question: `How does ${hubName} compare to ${secondName} for IT working professionals?`,
            answer: `${hubName} is highly preferred by professionals who want immediate proximity to local tech corridors and campus gates, reducing commute times to under 15 minutes. ${secondName} offers alternative lifestyle amenities and residential layouts, making both excellent depending on your primary workplace address.`
        },
        {
            question: `What safety and security amenities should I expect in ${hubName} ladies and gents PGs?`,
            answer: `Standard security protocols in verified MakeMyStay.ai PGs across ${hubName} include 24/7 CCTV surveillance in common areas, biometric or RFID card gate access, dedicated on-site resident wardens, and background-verified housekeeping staff.`
        },
        {
            question: `Is Namma Metro well connected to PG localities in ${hubName}?`,
            answer: `Yes, ${hubName} benefits from expanding Namma Metro Purple and Yellow line connectivity along with high-frequency BMTC Volvo AC bus routes, allowing seamless transit to MG Road, Indiranagar, and Electronic City.`
        },
        {
            question: `Can I find single sharing private rooms in ${hubName}?`,
            answer: `Yes, single sharing private rooms in ${hubName} are widely available for working professionals who prioritize privacy and dedicated work-from-home desk setups. Single rooms typically cost between ₹15,000 and ₹24,000 per month inclusive of utilities and food.`
        },
        {
            question: `Are there luxury coliving spaces with gyms and gaming zones in ${hubName}?`,
            answer: `Yes, modern coliving properties in ${hubName} feature premium lifestyle amenities including in-house fitness centers, rooftop lounges, PlayStation/gaming rooms, automated laundry machines, and community networking events.`
        },
        {
            question: `What is the notice period for vacating a PG in ${hubName}?`,
            answer: `The standard notice period across ${hubName} is 30 days. Residents must inform the property manager at least one month prior to their planned move-out date to ensure a smooth, deduction-free security deposit refund.`
        },
        {
            question: `Are electricity and maintenance charges extra in ${hubName} PGs?`,
            answer: `In most standard sharing PGs in ${hubName}, electricity for lights, fans, and common areas is included in the monthly rent. However, air conditioning (AC) usage is typically sub-metered and charged at actual commercial slab rates (₹10–₹14 per unit).`
        },
        {
            question: `How can I book a zero-brokerage verified PG in ${hubName}?`,
            answer: `You can browse 100% physically verified PG and coliving listings in ${hubName} on MakeMyStay.ai. All listings feature real photographs, transparent pricing tables, zero brokerage fees, and direct booking support.`
        }
    ];

    if (blogType === 'cost-of-living') {
        baseFaqs.unshift({
            question: `What is the total monthly cost of living for a bachelor in ${hubName}?`,
            answer: `For a bachelor or working professional living in a shared PG in ${hubName}, the total monthly cost of living ranges from ₹14,000 to ₹26,000. This includes ₹8,000–₹15,000 for rent and meals, ₹2,000 for weekend dining, ₹1,500 for commute, and ₹2,500 for personal essentials.`
        });
    }

    if (blogType === 'luxury-pg') {
        baseFaqs.unshift({
            question: `What defines a luxury PG in ${hubName}?`,
            answer: `A luxury PG in ${hubName} offers hotel-grade furnishings, ensuite washrooms with glass shower partitions, high-end ergonomic desk setups, chef-curated buffets, high-speed 200+ Mbps Wi-Fi, fitness centers, and daily room cleaning.`
        });
    }

    return baseFaqs;
}
