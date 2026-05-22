import type { Metadata } from 'next';
import { resolvePropertyPageMetadata } from '@/lib/propertyMetadata';
import PropertyDetails from '@/views/PropertyDetails';


type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    return resolvePropertyPageMetadata(slug, `/property/${slug}`);
}

export default function PropertySlugPage() {
    return <PropertyDetails />;
}
