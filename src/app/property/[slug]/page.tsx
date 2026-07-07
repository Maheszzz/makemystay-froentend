import type { Metadata } from 'next';
import { resolvePropertyPageMetadata } from '@/lib/propertyMetadata';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    return resolvePropertyPageMetadata(slug);
}

export const dynamic = 'force-dynamic';

export { default } from '@/views/PropertyDetails';
