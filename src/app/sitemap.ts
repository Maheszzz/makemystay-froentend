import type { MetadataRoute } from 'next';
<<<<<<< HEAD
import { getAppRouterSitemap } from '@/lib/sitemap';

/**
 * Next.js App Router Dynamic Sitemap
 * Automatically emits canonical XML sitemap entries from the centralized Sitemap Engine.
 * Serves /sitemap.xml natively via Next.js.
 */
export default function sitemap(): MetadataRoute.Sitemap {
    const items = getAppRouterSitemap();

    return items.map((item) => ({
        url: item.url,
        lastModified: item.lastModified,
        changeFrequency: item.changeFrequency as MetadataRoute.Sitemap[number]['changeFrequency'],
        priority: item.priority
    }));
=======
import { getPropertyDetailPath } from '@/lib/propertyRouting';
import { fetchPropertiesServer } from '@/lib/server/fetchPropertiesServer';
import {
    extractSitemapLocalityTarget,
    resolveActiveLocalityKeys,
    type SitemapLocalityTarget,
} from '@/lib/server/localityInventory';
import { SITE_URL } from '@/lib/siteConfig';
import { getAppRouterSitemap } from '@/lib/sitemap';
import type { Property } from '@/types/api';

export const revalidate = 3600;

/**
 * Next.js App Router Dynamic Sitemap (single source of truth for /sitemap.xml).
 * Throws on API error so ISR preserves the last valid cached sitemap instead of caching an incomplete one.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const limit = 100;
    let skip = 0;
    let total = Infinity;
    const availableProperties: Property[] = [];

    while (skip < total) {
        const { items: pageItems, total: apiTotal } = await fetchPropertiesServer({
            skip,
            limit,
            is_available: true,
            sort_by: 'review_count_desc',
        });
        total = apiTotal;
        for (const prop of pageItems) {
            if (!prop || !prop.id || prop.is_available === false) continue;
            availableProperties.push(prop);
        }
        if (pageItems.length === 0) break;
        skip += pageItems.length;
    }

    const candidateItems = getAppRouterSitemap();
    const localityTargets: SitemapLocalityTarget[] = [];
    for (const item of candidateItems) {
        const target = extractSitemapLocalityTarget(item.url);
        if (target) localityTargets.push(target);
    }

    const activeLocalityKeys = await resolveActiveLocalityKeys(localityTargets);
    const baseItems = candidateItems.filter((item) => {
        const target = extractSitemapLocalityTarget(item.url);
        if (!target) return true;
        return activeLocalityKeys.has(`${target.category}:${target.slug}`);
    });

    const seen = new Set<string>(baseItems.map((item) => item.url));
    const entries: MetadataRoute.Sitemap = baseItems.map((item) => ({
        url: item.url,
        ...(item.lastModified ? { lastModified: item.lastModified } : {}),
        changeFrequency: item.changeFrequency as MetadataRoute.Sitemap[number]['changeFrequency'],
        priority: item.priority,
    }));

    for (const prop of availableProperties) {
        const detailPath = getPropertyDetailPath(prop);
        const loc = `${SITE_URL}${detailPath}`;
        if (seen.has(loc)) continue;
        seen.add(loc);

        const parsedDate = prop.updated_at ? new Date(prop.updated_at) : null;
        const lastModified =
            parsedDate && !Number.isNaN(parsedDate.getTime())
                ? parsedDate.toISOString().split('T')[0]
                : undefined;

        entries.push({
            url: loc,
            ...(lastModified ? { lastModified } : {}),
            changeFrequency: 'daily',
            priority: 0.88,
        });
    }

    return entries;
>>>>>>> 30c0a7d5dcc26f2969e7389fc64a888ad3bd2f14
}
