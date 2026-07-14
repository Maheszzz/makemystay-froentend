import type { Metadata } from 'next';
import { resolveRentSlugMetadata } from '@/lib/routeMetadata';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    return resolveRentSlugMetadata(slug);
}

import { notFound, permanentRedirect } from 'next/navigation';
import RentSlugRoute from '@/routes/RentSlugRoute';
import { fetchPropertyByIdServer } from '@/lib/server/fetchPropertyById';
import { parsePropertySlugParam, getPropertyDetailPath } from '@/lib/propertyRouting';
import PropertyDetails from '@/views/PropertyDetails';

export const dynamic = 'force-dynamic';

export default async function RentSlugPage({ params }: PageProps) {
    const { slug } = await params;
    const param = (slug || '').toLowerCase();

    // Soft 404 fix: Pre-fetch property on the server and force 404 if missing/inactive
    if (/^(\d+)(-|$)/.test(param)) {
        const id = parsePropertySlugParam(param);
        if (!id) notFound();
        const property = await fetchPropertyByIdServer(id);
        if (!property || property.is_available === false) {
            notFound();
        }

        const canonicalPath = getPropertyDetailPath(property);
        if (`/rent/${param}` !== canonicalPath) {
            permanentRedirect(canonicalPath);
        }

        return <PropertyDetails initialProperty={property} slug={param} />;
    }

    return <RentSlugRoute />;
}
