import type { FaqItem } from '@/lib/schema';

/** Generates rich, keyword-dense FAQs for 1BHK locality pages. */
export function build1BhkLocalityFaqs(name: string, rentRange?: string): FaqItem[] {
    const range = rentRange ?? '₹8,000 - ₹25,000';
    return [
        {
            question: `What is the rent for 1 BHK flat in ${name}?`,
            answer: `1 BHK flats for rent in ${name} typically range from ${range} per month depending on furnishing, floor, and amenities. Furnished 1 BHKs with AC cost more, while semi-furnished options are more budget-friendly. MakeMyStay lists verified 1 BHK flats in ${name} with transparent pricing and no hidden charges.`,
        },
        {
            question: `Are there furnished 1 BHK flats for rent in ${name}?`,
            answer: `Yes, MakeMyStay has fully furnished and semi-furnished 1 BHK flats for rent in ${name}. Furnished flats include bed, wardrobe, sofa, fridge, washing machine, and WiFi-ready setup — ideal for working professionals who want a move-in ready home without buying furniture.`,
        },
        {
            question: `Is ${name} a good area for renting a 1 BHK?`,
            answer: `${name} is one of Bangalore's well-connected areas, making it a popular choice for singles and couples renting 1 BHK flats. Good access to metro, supermarkets, restaurants, and IT parks makes it convenient for working professionals. MakeMyStay verifies every property with real photos so you see exactly what you are renting.`,
        },
        {
            question: `What is included in a 1 BHK flat?`,
            answer: `A 1 BHK flat includes one bedroom, one hall (living room), and one kitchen. Many 1 BHK flats in ${name} also have a bathroom, a balcony, and sometimes a separate study or storage area. MakeMyStay listings specify exact furnishing details so you know what is included before visiting.`,
        },
        {
            question: `How do I book a site visit for 1 BHK in ${name} on MakeMyStay?`,
            answer: `You can book an instant site visit directly through MakeMyStay. Browse verified 1 BHK listings in ${name}, select a flat you like, and click "Book Visit." A MakeMyStay agent will confirm the visit time and accompany you — zero brokerage, zero pressure.`,
        },
        {
            question: `What is the difference between a 1 BHK and 1 RK flat?`,
            answer: `A 1 BHK (1 Bedroom Hall Kitchen) has a separate bedroom with a closed wall, while a 1 RK (1 Room Kitchen) is a single open room with a small kitchen area and no separate bedroom. 1 BHKs offer more privacy and space. If you are a couple or need dedicated sleeping space, a 1 BHK is the better choice.`,
        },
        {
            question: `Is zero brokerage available for 1 BHK flats in ${name}?`,
            answer: `Yes. MakeMyStay charges zero brokerage to tenants. You pay no agent fee or commission. The only cost is the monthly rent and security deposit agreed directly with the owner. All 1 BHK listings in ${name} on MakeMyStay follow this no-brokerage policy.`,
        },
        {
            question: `What is the security deposit for 1 BHK flats in ${name}?`,
            answer: `Security deposits for 1 BHK flats in ${name} are typically 2 to 3 months of rent. Some premium furnished flats may ask for up to 5 months. MakeMyStay listings clearly mention the deposit amount upfront so there are no surprises.`,
        },
    ];
}

/** Generates rich FAQs for 2BHK locality pages. */
export function build2BhkLocalityFaqs(name: string, rentRange?: string): FaqItem[] {
    const range = rentRange ?? '₹14,000 - ₹40,000';
    return [
        {
            question: `What is the rent for 2 BHK flat in ${name}?`,
            answer: `2 BHK flats for rent in ${name} typically range from ${range} per month. Rent varies based on furnishing (fully furnished, semi-furnished, or unfurnished), floor level, society amenities, and proximity to metro or IT parks. MakeMyStay shows verified 2 BHK listings in ${name} with real photos and transparent pricing.`,
        },
        {
            question: `Are there family-friendly 2 BHK flats in ${name}?`,
            answer: `Yes. ${name} has several gated societies and apartment complexes with family-friendly 2 BHK flats. MakeMyStay verifies properties with real photos and amenity details — including children's play area, parking, and security — so families can choose confidently.`,
        },
        {
            question: `Is ${name} good for families renting a 2 BHK?`,
            answer: `${name} offers good infrastructure for families with schools, hospitals, supermarkets, and parks nearby. 2 BHK flats here offer enough space for a small family. MakeMyStay helps families find verified 2 BHK flats in ${name} with transparent rent and instant site visits.`,
        },
        {
            question: `What amenities do 2 BHK flats in ${name} typically have?`,
            answer: `Most 2 BHK flats in ${name} in gated societies include covered parking, 24-hour security, power backup, and a lift. Premium flats also offer a gym, swimming pool, and clubhouse. MakeMyStay listings detail all amenities so you can compare and choose the right 2 BHK for your needs.`,
        },
        {
            question: `How much is the security deposit for a 2 BHK in ${name}?`,
            answer: `Security deposits for 2 BHK flats in ${name} are typically 2 to 3 months of rent for most apartments. Some premium or fully furnished 2 BHKs may require up to 5 months. MakeMyStay listings always state the deposit clearly before you book a site visit.`,
        },
        {
            question: `Is zero brokerage available for 2 BHK flats in ${name}?`,
            answer: `Yes. MakeMyStay charges zero brokerage to tenants looking for 2 BHK flats in ${name}. No agent commission is charged. You negotiate directly with the owner and pay only the rent and deposit agreed in the rental agreement.`,
        },
    ];
}
