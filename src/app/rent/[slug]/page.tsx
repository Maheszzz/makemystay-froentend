import type { Metadata } from 'next';
import { resolveRentSlugMetadata } from '@/lib/routeMetadata';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    return resolveRentSlugMetadata(slug);
}

export const dynamic = 'force-dynamic';

export { default } from '@/routes/RentSlugRoute';
