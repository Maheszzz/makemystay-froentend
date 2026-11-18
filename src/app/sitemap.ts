import type { MetadataRoute } from 'next';
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
}
