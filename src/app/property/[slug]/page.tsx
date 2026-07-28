import type { Metadata } from 'next';
import { resolvePropertyPageMetadata } from '@/lib/propertyMetadata';
import { parsePropertySlugParam, getPropertyDetailPath } from '@/lib/propertyRouting';
import { notFound, permanentRedirect } from 'next/navigation';
import PropertyDetails from '@/views/PropertyDetails';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    return resolvePropertyPageMetadata(slug);
}

export const dynamic = 'force-dynamic';

export default async function PropertyPage({ params }: PageProps) {
    const { slug } = await params;
    const param = (slug || '').toLowerCase();
    const id = parsePropertySlugParam(param);
    
    const { fetchPublicPropertyBySlugServer, fetchPropertyByIdServer, fetchPropertyBySlugServer } = await import('@/lib/server/fetchPropertyById');
    let property = await fetchPublicPropertyBySlugServer(param);
    if (!property && id) {
        property = await fetchPropertyByIdServer(id);
    }
    if (!property) {
        property = await fetchPropertyBySlugServer('plot', param);
    }

    if (!property || property.is_available === false) notFound();

    const canonicalPath = getPropertyDetailPath(property);
    if (`/property/${param}` !== canonicalPath) {
        permanentRedirect(canonicalPath);
    }

    return <PropertyDetails initialProperty={property} slug={param} />;
}
