import type { Metadata } from 'next';
import { findPgLocationForArea } from '@/data/pgLocations';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { getPropertyDetailPath } from '@/lib/propertyRouting';
import { buildAboutPageSEO } from '@/lib/seo';
import { fetchPropertiesServer } from '@/lib/server/fetchPropertiesServer';
import type { Property } from '@/types/api';
import About, { type AboutHeroPhoto, type AboutLocalityItem } from '@/views/About';

export const metadata: Metadata = pageSeoToMetadata(buildAboutPageSEO());

export const dynamic = 'force-dynamic';

function isRealListingPhoto(url: string | undefined): url is string {
    if (!url || !url.trim()) return false;
    const lower = url.toLowerCase();
    return (
        !lower.includes('images.unsplash.com') &&
        !lower.includes('default-property') &&
        !lower.includes('placeholder')
    );
}

async function getAboutPageInventory(): Promise<{
    heroPhotos: AboutHeroPhoto[];
    topLocalities: AboutLocalityItem[];
}> {
    try {
        const firstBatch = await fetchPropertiesServer({
            city: 'bangalore',
            is_available: true,
            limit: 200,
            sort_by: 'review_count_desc',
        });

        let allItems: Property[] = [...firstBatch.items];
        if (firstBatch.total > 200 && firstBatch.items.length === 200) {
            try {
                const secondBatch = await fetchPropertiesServer({
                    city: 'bangalore',
                    is_available: true,
                    skip: 200,
                    limit: 200,
                    sort_by: 'review_count_desc',
                });
                allItems = [...allItems, ...secondBatch.items];
            } catch {
                // Keep first 200 items if second batch fails
            }
        }

        // Up to 4 real listing photos from distinct properties
        const heroPhotos: AboutHeroPhoto[] = [];
        const usedUrls = new Set<string>();
        for (const prop of allItems) {
            if (heroPhotos.length >= 4) break;
            const candidates = [
                ...(Array.isArray(prop.images) ? prop.images : []),
                prop.image,
            ];
            const validUrl = candidates.find(
                (u): u is string => isRealListingPhoto(u) && !usedUrls.has(u),
            );
            if (!validUrl) continue;
            usedUrls.add(validUrl);
            heroPhotos.push({
                url: validUrl,
                alt: `${prop.title} in ${prop.location || 'Bangalore'}`,
                href: getPropertyDetailPath(prop),
            });
        }

        // Group live Bangalore listings by canonical hub page, sorted descending by count
        const countsBySlug = new Map<string, AboutLocalityItem>();
        for (const prop of allItems) {
            const loc = findPgLocationForArea(prop.location);
            if (!loc) continue;
            const existing = countsBySlug.get(loc.slug);
            if (existing) {
                existing.count += 1;
            } else {
                countsBySlug.set(loc.slug, {
                    name: loc.name,
                    slug: loc.slug,
                    count: 1,
                });
            }
        }

        const topLocalities = Array.from(countsBySlug.values())
            .sort((a, b) => b.count - a.count)
            .slice(0, 12);

        return { heroPhotos, topLocalities };
    } catch {
        return { heroPhotos: [], topLocalities: [] };
    }
}

export default async function AboutPage() {
    const { heroPhotos, topLocalities } = await getAboutPageInventory();
    return <About heroPhotos={heroPhotos} topLocalities={topLocalities} />;
}
