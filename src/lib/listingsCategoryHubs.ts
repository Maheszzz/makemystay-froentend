/**
 * Category-tab targets from `/properties` (no `?cat=`).
 * PG uses `/pg` (listings) so tab + cards stay on inventory; marketing hub stays at `/pg/bangalore`.
 */
export const LISTINGS_CATEGORY_HUB = {
    pg: '/pg',
    rent: '/rent/bangalore',
    buy: '/buy/in/bangalore',
    plot: '/plots/in/bangalore',
} as const satisfies Record<'pg' | 'rent' | 'buy' | 'plot', string>;

export type ListingsCategoryKey = 'all' | 'pg' | 'rent' | 'buy' | 'plot';

export function listingsLegacyCatRedirectPath(cat: string | null): string | null {
    if (!cat) return null;
    const c = cat.toLowerCase();
    if (c === 'pg') return LISTINGS_CATEGORY_HUB.pg;
    if (c === 'rent') return LISTINGS_CATEGORY_HUB.rent;
    if (c === 'buy') return LISTINGS_CATEGORY_HUB.buy;
    if (c === 'plot') return LISTINGS_CATEGORY_HUB.plot;
    return null;
}
