import type { Metadata } from 'next';
import { getPgLocationBySlug, resolveLegacyPgSlug } from '@/data/pgLocations';
import {
    interimPropertyDetailSeo,
    pgBangaloreHubSeo,
    pgFeatureLandingSeo,
    pgGenderLocalitySeo,
    pgLocationSeo,
    pgVsFlatBangaloreSeo,
    rentBangaloreHubSeo,
    rentLocationHubSeo,
} from '@/lib/seo';
import { pageSeoToMetadata } from '@/lib/nextMetadata';

function pgHyderabadHubSeo() {
    return {
        title: 'Best PG in Hyderabad — Verified, Zero Brokerage',
        description:
            'Browse verified PGs in Hyderabad near HiTech City, Gachibowli & Madhapur. Zero brokerage, real photos, transparent pricing on MakeMyStay.ai.',
        path: '/pg/hyderabad',
    };
}

function pgPuneHubSeo() {
    return {
        title: 'Best PG in Pune — Verified, Zero Brokerage',
        description:
            'Find verified PGs in Pune — Hinjewadi, Wakad, Kothrud & more. Real photos, zero brokerage on select stays on MakeMyStay.ai.',
        path: '/pg/pune',
    };
}

function rentHyderabadHubSeo() {
    return {
        title: 'Flats & Houses for Rent in Hyderabad — Zero Brokerage',
        description:
            'Browse verified rentals in Hyderabad — HiTech City, Gachibowli, Kondapur. Real photos, transparent rent on MakeMyStay.ai.',
        path: '/rent/hyderabad',
    };
}

function rentPuneHubSeo() {
    return {
        title: 'Flats & Houses for Rent in Pune — Zero Brokerage',
        description:
            'Verified flats and homes for rent in Pune — compare rent across Hinjewadi, Wakad & Kothrud on MakeMyStay.ai.',
        path: '/rent/pune',
    };
}

const PG_FEATURE_SLUGS: Record<string, 'wifi' | 'food' | 'ac'> = {
    'pg-with-wifi': 'wifi',
    'pg-with-food': 'food',
    'pg-with-ac': 'ac',
};

/** `/pg/:slug` — mirrors `PgSlugRoute` + `PGLocationPage` SEO. */
export function resolvePgSlugMetadata(slug: string): Metadata {
    const param = (slug || '').toLowerCase();

    if (/^(\d+)(-|$)/.test(param)) {
        return pageSeoToMetadata(interimPropertyDetailSeo(param, `/properties/${param}`));
    }

    if (param === 'bangalore') return pageSeoToMetadata(pgBangaloreHubSeo());
    if (param === 'hyderabad') return pageSeoToMetadata(pgHyderabadHubSeo());
    if (param === 'pune') return pageSeoToMetadata(pgPuneHubSeo());

    const feature = PG_FEATURE_SLUGS[param];
    if (feature) return pageSeoToMetadata(pgFeatureLandingSeo(feature));

    if (param === 'pg-vs-flat-bangalore') return pageSeoToMetadata(pgVsFlatBangaloreSeo());

    const legacy = resolveLegacyPgSlug(param);
    if (legacy) {
        const loc = getPgLocationBySlug(legacy);
        if (loc) return pageSeoToMetadata(pgLocationSeo(loc.name, loc.slug));
    }

    const loc = getPgLocationBySlug(param);
    if (loc) return pageSeoToMetadata(pgLocationSeo(loc.name, loc.slug));

    return pageSeoToMetadata({
        title: 'Area not found',
        description: 'This PG locality page does not exist. Browse verified PG hubs in Bangalore on MakeMyStay.ai.',
        path: `/pg/${param}`,
        noindex: true,
    });
}

/** `/rent/:slug` — mirrors `RentSlugRoute` + `RentLocationPage`. */
export function resolveRentSlugMetadata(slug: string): Metadata {
    const param = (slug || '').toLowerCase();

    if (/^(\d+)(-|$)/.test(param)) {
        return pageSeoToMetadata(interimPropertyDetailSeo(param, `/properties/${param}`));
    }

    if (param === 'bangalore') return pageSeoToMetadata(rentBangaloreHubSeo());
    if (param === 'hyderabad') return pageSeoToMetadata(rentHyderabadHubSeo());
    if (param === 'pune') return pageSeoToMetadata(rentPuneHubSeo());

    const loc = getPgLocationBySlug(param);
    if (loc) return pageSeoToMetadata(rentLocationHubSeo(loc.name, loc.slug));

    return pageSeoToMetadata({
        title: 'Rent in Bangalore',
        description: 'Browse verified flats and houses for rent in Bangalore on MakeMyStay.ai.',
        path: `/rent/${param}`,
    });
}

/** `/pg-for-boys-in/:slug`, `/pg-for-girls-in/:slug`, etc. */
export function resolvePropertySlugMetadata(slug: string, pathname: string): Metadata {
    return pageSeoToMetadata(interimPropertyDetailSeo(slug, pathname));
}

export function resolvePgGenderLocalityMetadata(
    slug: string,
    variant: 'boys' | 'girls' | 'men' | 'women'
): Metadata {
    const param = (slug || '').toLowerCase();
    const loc = getPgLocationBySlug(param);
    const name = loc?.name ?? param.replace(/-/g, ' ');
    const gender = variant === 'men' ? 'men' : variant === 'women' ? 'women' : variant === 'boys' ? 'male' : 'female';
    return pageSeoToMetadata(pgGenderLocalitySeo(name, param, gender));
}
