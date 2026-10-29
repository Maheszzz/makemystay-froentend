import type { Metadata } from 'next';
import { resolvePgSlugMetadata } from '@/lib/routeMetadata';
import { getPropertyDetailPath } from '@/lib/propertyRouting';
import { getStaticPgPropertyRedirect } from '@/lib/seoPropertyRedirects';
import PropertyDetails from '@/views/PropertyDetails';
import { notFound, permanentRedirect } from 'next/navigation';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    return resolvePgSlugMetadata(slug);
}

import { getLocalitySlugs } from '@/lib/locality';

export async function generateStaticParams() {
    return getLocalitySlugs().map((slug) => ({ slug }));
}

export const dynamicParams = true;

import PgSlugRoute from '@/routes/PgSlugRoute';
import PGLocationPage from '@/views/PGLocationPage';

export default async function Page({ params }: PageProps) {
    const { slug } = await params;
    const param = (slug || '').toLowerCase();

    
    const staticTo = getStaticPgPropertyRedirect(param);
    if (staticTo) {
        permanentRedirect(staticTo);
    }

    if (['bangalore', 'hyderabad', 'pune'].includes(param) ||
        ['pg-with-wifi', 'pg-with-food', 'pg-with-ac'].includes(param) ||
        param === 'pg-vs-flat-bangalore') {
        return <PgSlugRoute />;
    }

    const { getPgLocationBySlug, resolveLegacyPgSlug } = await import('@/data/pgLocations');
    const legacy = resolveLegacyPgSlug(param);
    if (getPgLocationBySlug(param) || (legacy && getPgLocationBySlug(legacy))) {
        return <PGLocationPage slug={param} />;
    }

    const { fetchPropertyAnySlugServer } = await import('@/lib/server/fetchPropertyById');
    const property = await fetchPropertyAnySlugServer(param);
    if (!property) {
        const { resolveMissingPropertyRedirect } = await import('@/lib/seoPropertyRedirects');
        const target = resolveMissingPropertyRedirect('pg', param);
        if (target) {
            permanentRedirect(target);
        }
        notFound();
    }

    const canonicalPath = getPropertyDetailPath(property);
    if (`/pg/${param}` !== canonicalPath) {
        permanentRedirect(canonicalPath);
    }

    let initialSimilar;
    if (property.is_available === false) {
        try {
            const { fetchPropertiesServer } = await import('@/lib/server/fetchPropertiesServer');
            const { items } = await fetchPropertiesServer({
                city: 'bangalore',
                category: 'pg',
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
