import type { Metadata } from 'next';
import { resolveRentSlugMetadata } from '@/lib/routeMetadata';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    return resolveRentSlugMetadata(slug);
}

import { notFound, permanentRedirect } from 'next/navigation';
import RentSlugRoute from '@/routes/RentSlugRoute';
import { getPropertyDetailPath } from '@/lib/propertyRouting';
import PropertyDetails from '@/views/PropertyDetails';

export const revalidate = 3600;

export default async function RentSlugPage({ params }: PageProps) {
    const { slug } = await params;
    const param = (slug || '').toLowerCase();

    if (['bangalore', 'hyderabad', 'pune'].includes(param)) {
        return <RentSlugRoute />;
    }

    const { getPgLocationBySlug } = await import('@/data/pgLocations');
    const { getLocalitySeoProfile } = await import('@/lib/locality');
    if (getPgLocationBySlug(param) || getLocalitySeoProfile(param)) {
        return <RentSlugRoute />;
    }

    const { fetchPropertyAnySlugServer } = await import('@/lib/server/fetchPropertyById');
    const property = await fetchPropertyAnySlugServer(param);
    if (!property) {
        const { resolveMissingPropertyRedirect } = await import('@/lib/seoPropertyRedirects');
        const target = resolveMissingPropertyRedirect('rent', param);
        if (target) {
            permanentRedirect(target);
        }
        notFound();
    }

    const canonicalPath = getPropertyDetailPath(property);
    if (`/rent/${param}` !== canonicalPath) {
        permanentRedirect(canonicalPath);
    }

    let initialSimilar;
    if (property.is_available === false) {
        try {
            const { fetchPropertiesServer } = await import('@/lib/server/fetchPropertiesServer');
            const { items } = await fetchPropertiesServer({
                city: 'bangalore',
                is_available: true,
                limit: 6,
                sort_by: 'review_count_desc',
            });
            initialSimilar = items.filter((p) => String(p.id) !== String(property.id)).slice(0, 6);
        } catch {
            // Non-blocking fallback for similar properties
        }
    }

    return <PropertyDetails initialProperty={property} initialSimilar={initialSimilar} slug={param} />;
}
