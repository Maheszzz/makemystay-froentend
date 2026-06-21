import PropertyDetails from '@/views/PropertyDetails';
import { PropertyPdpSeoHtml } from '@/components/property/PropertyPdpSeoHtml';
import { notFound } from 'next/navigation';
import {
    applyPropertyPdpRoute,
    resolvePropertyPdpRoute,
} from '@/lib/server/propertyPdpRoute';

type Props = {
    slug: string;
    currentPath: string;
};

// export const revalidate = 3600; // disabled to prevent ISR caching of 404 fallback

export default async function PropertyDetailsPage({ slug, currentPath }: Props) {
    const route = await resolvePropertyPdpRoute(slug, currentPath);
    applyPropertyPdpRoute(route);

    if (route.kind !== 'render') {
        return null;
    }
    if (!route.property) {
        notFound();
    }

    return (
        <>
            {/* SEO content for crawlers only — visually hidden, not removed from DOM */}
            {route.property && (
                <div className="sr-only" aria-hidden="true">
                    <PropertyPdpSeoHtml property={route.property} />
                </div>
            )}
            <PropertyDetails initialProperty={route.property ?? undefined} slug={route.slug} />
        </>
    );
}
