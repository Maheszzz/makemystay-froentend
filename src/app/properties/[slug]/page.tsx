import type { Metadata } from 'next';
import { resolvePropertyPageMetadata } from '@/lib/propertyMetadata';
import { getPropertyDetailPath } from '@/lib/propertyRouting';
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
    
    const { fetchPropertyAnySlugServer } = await import('@/lib/server/fetchPropertyById');
    const property = await fetchPropertyAnySlugServer(param);

    if (!property) {
        const { resolveMissingPropertyRedirect } = await import('@/lib/seoPropertyRedirects');
        const target = resolveMissingPropertyRedirect('properties', param);
        if (target) {
            permanentRedirect(target);
        }
        notFound();
    }

    const canonicalPath = getPropertyDetailPath(property);
    if (`/properties/${param}` !== canonicalPath) {
        permanentRedirect(canonicalPath);
    }

    return <PropertyDetails initialProperty={property} slug={param} />;
}
