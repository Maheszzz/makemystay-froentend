import type { Metadata } from 'next';
import { getPropertyDetailPath } from '@/lib/propertyRouting';
import {
    propertyDetailPageSeo,
} from '@/lib/seo';
import { pageSeoToMetadata } from '@/lib/nextMetadata';

export async function resolvePropertyPageMetadata(slug: string): Promise<Metadata> {
    const param = (slug || '').toLowerCase();
    
    const { fetchPropertyAnySlugServer } = await import('@/lib/server/fetchPropertyById');
    const property = await fetchPropertyAnySlugServer(param);

    if (!property || property.is_available === false) {
        return {
            title: 'Not Found | MakeMyStay',
            robots: { index: false, follow: false },
        };
    }

    const detailPath = getPropertyDetailPath(property);
    return pageSeoToMetadata(propertyDetailPageSeo(property, detailPath));
}

export function isPropertySlugParam(slug: string): boolean {
    // Previously required a numeric prefix, which caused valid property slugs without IDs to be treated as non‑properties.
    // Treat any non‑empty slug as a potential property slug. The server‑side resolver will perform the actual existence check.
    return !!(slug && slug.trim().length > 0);
}
