import type { Metadata } from 'next';
import { resolvePropertyPageMetadata } from '@/lib/propertyMetadata';
import { applyQueryNoindex } from '@/lib/nextMetadata';
import { getPropertyDetailPath } from '@/lib/propertyRouting';
import { notFound, permanentRedirect } from 'next/navigation';
import PropertyDetails from '@/views/PropertyDetails';

type PageProps = {
    params: Promise<{ slug: string }>;
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const sp = searchParams ? await searchParams : undefined;
    const meta = await resolvePropertyPageMetadata(slug);
    return applyQueryNoindex(meta, sp);
}

export const revalidate = 3600;

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
