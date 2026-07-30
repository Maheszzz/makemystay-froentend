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

export const dynamic = 'force-dynamic';

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
    if (!property || property.is_available === false) {
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

    return <PropertyDetails initialProperty={property} slug={param} />;
}
