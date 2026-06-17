import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchPropertyByIdServer } from '@/lib/server/fetchPropertyById';
import { getPropertyDetailPath, parsePropertySlugParam } from '@/lib/propertyRouting';
import {
    propertyDetailPageSeo,
    propertyUnavailableSeo,
} from '@/lib/seo';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { inferPgLocalityHubFromPropertySlug } from '@/lib/seoPropertyRedirects';
import { getPgLocationBySlug } from '@/data/pgLocations';

export async function resolvePropertyPageMetadata(slug: string): Promise<Metadata> {
    const param = (slug || '').toLowerCase();
    const id = parsePropertySlugParam(param);
    if (!id) {
        // Invalid slug, trigger 404
        notFound();
    }

    const property = await fetchPropertyByIdServer(id!);
    if (!property) {
        notFound();
    }

    if (property!.is_available === false) {
        const hub = inferPgLocalityHubFromPropertySlug(param);
        const locName = hub ? getPgLocationBySlug(hub.replace('/pg/', ''))?.name : undefined;
        const detailPath = getPropertyDetailPath(property!);
        return pageSeoToMetadata(propertyUnavailableSeo(detailPath, locName));
    }

    const detailPath = getPropertyDetailPath(property!);
    return pageSeoToMetadata(propertyDetailPageSeo(property!, detailPath));
}

export function isPropertySlugParam(slug: string): boolean {
    // Previously required a numeric prefix, which caused valid property slugs without IDs to be treated as non‑properties.
    // Treat any non‑empty slug as a potential property slug. The server‑side resolver will perform the actual existence check.
    return !!(slug && slug.trim().length > 0);
}
