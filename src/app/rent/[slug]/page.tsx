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

export const dynamic = 'force-dynamic';

export default async function RentSlugPage({ params }: PageProps) {
    const { slug } = await params;
    const param = (slug || '').toLowerCase();

    if (['bangalore', 'hyderabad', 'pune'].includes(param)) {
        return <RentSlugRoute />;
    }

    const { getPgLocationBySlug } = await import('@/data/pgLocations');
    if (getPgLocationBySlug(param)) {
        return <RentSlugRoute />;
    }

    const { fetchPropertyAnySlugServer } = await import('@/lib/server/fetchPropertyById');
    const property = await fetchPropertyAnySlugServer(param);
    if (!property || property.is_available === false) {
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

    return <PropertyDetails initialProperty={property} slug={param} />;
}
