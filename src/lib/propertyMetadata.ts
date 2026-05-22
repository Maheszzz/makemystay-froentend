import type { Metadata } from 'next';
import { fetchPropertyByIdServer } from '@/lib/server/fetchPropertyById';
import { getPropertyDetailPath, parsePropertySlugParam } from '@/lib/propertyRouting';
import {
    interimPropertyDetailSeo,
    propertyDetailPageSeo,
    propertyErrorSeo,
    propertyUnavailableSeo,
} from '@/lib/seo';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { inferPgLocalityHubFromPropertySlug } from '@/lib/seoPropertyRedirects';
import { getPgLocationBySlug } from '@/data/pgLocations';

export async function resolvePropertyPageMetadata(
    slug: string,
    pathname: string,
): Promise<Metadata> {
    const pathOnly = pathname.split('?')[0];
    const id = parsePropertySlugParam(slug);
    if (!id) {
        return pageSeoToMetadata(propertyErrorSeo(pathOnly));
    }

    const property = await fetchPropertyByIdServer(id);
    if (!property) {
        return pageSeoToMetadata(interimPropertyDetailSeo(slug, pathOnly));
    }

    if (property.is_available === false) {
        const hub = inferPgLocalityHubFromPropertySlug(slug);
        const locName = hub ? getPgLocationBySlug(hub.replace('/pg/', ''))?.name : undefined;
        return pageSeoToMetadata(propertyUnavailableSeo(pathOnly, locName));
    }

    const detailPath = getPropertyDetailPath(property);
    return pageSeoToMetadata(propertyDetailPageSeo(property, detailPath));
}

export function isPropertySlugParam(slug: string): boolean {
    return /^(\d+)(-|$)/.test((slug || '').toLowerCase());
}
