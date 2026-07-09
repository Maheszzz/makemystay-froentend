import type { Metadata } from 'next';
import { resolvePgSlugMetadata } from '@/lib/routeMetadata';
import { fetchPropertyByIdServer } from '@/lib/server/fetchPropertyById';
import { parsePropertySlugParam } from '@/lib/propertyRouting';
import { getStaticPgPropertyRedirect } from '@/lib/seoPropertyRedirects';
import PropertyDetails from '@/views/PropertyDetails';
import { notFound } from 'next/navigation';

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

    if (/^(\d+)(-|$)/.test(param)) {
        const staticTo = getStaticPgPropertyRedirect(param);
        if (staticTo) {
            const { permanentRedirect } = await import('next/navigation');
            permanentRedirect(staticTo);
        }

        const id = parsePropertySlugParam(param);
        if (!id) notFound();
        const property = await fetchPropertyByIdServer(id);
        if (!property || property.is_available === false) notFound();
        return <PropertyDetails initialProperty={property} slug={param} />;
    }

    // Map hubs and features to the client-side PgSlugRoute
    if (['bangalore', 'hyderabad', 'pune'].includes(param) ||
        ['pg-with-wifi', 'pg-with-food', 'pg-with-ac'].includes(param) ||
        param === 'pg-vs-flat-bangalore') {
        return <PgSlugRoute />;
    }

    // Map locality pages to the server-side PGLocationPage
    return <PGLocationPage slug={param} />;
}
