export interface BlogPost {
    slug: string;
    title: string;
    description: string;
    publishedAt: string; // ISO date
    readTimeMin: number;
    body: string[];
}

export const BLOG_POSTS: BlogPost[] = [
    {
        slug: 'how-to-choose-pg-in-bangalore',
        title: 'How to Choose a PG in Bangalore (2026 checklist)',
        description:
            'Room types, food plans, deposits, and commute — a practical checklist before you book a paying guest in Bangalore.',
        publishedAt: '2026-01-10',
        readTimeMin: 8,
        body: [
            'Bangalore remains one of India’s busiest markets for PG (paying guest) accommodation, especially around tech corridors and metro-connected neighbourhoods.',
            'Start with non‑negotiables: daily commute time, meal preferences (veg/non‑veg), WiFi quality for WFH, and security (CCTV, biometric access, warden availability).',
            'Compare total monthly cost, not just rent: ask whether maintenance, electricity caps, laundry, and housekeeping are included.',
            'Visit during weekday evenings if possible — you’ll experience noise levels, water pressure, and crowding more realistically than a Sunday tour.',
            'On MakeMyStay.ai, shortlist verified listings, compare photos, and use filters for PG category and area before you pay a token.',
        ],
    },
    {
        slug: 'pg-rent-vs-flat-rent-bangalore',
        title: 'PG rent vs flat rent in Bangalore: what saves more?',
        description:
            'When a PG makes sense versus a 1BHK, and how to budget for deposits, maintenance, and commute.',
        publishedAt: '2026-02-02',
        readTimeMin: 6,
        body: [
            'Flats offer more independence; PGs bundle meals, cleaning, and sometimes utilities — your “effective rent” should include groceries and help if you rent a flat.',
            'If you work long hours or are new to the city, a managed PG often reduces daily friction even if headline rent looks similar to a small flat.',
            'Watch for deposit rules: PGs may charge 1–2 months; flats often need larger deposits plus brokerage in traditional markets.',
            'Use location pages on MakeMyStay.ai to compare PG options by micro‑area before deciding.',
        ],
    },
];

export function getBlogPost(slug: string | undefined): BlogPost | undefined {
    if (!slug) return undefined;
    return BLOG_POSTS.find((p) => p.slug === slug);
}
