import type { Metadata } from 'next';
import { resolvePgGenderLocalityMetadata } from '@/lib/routeMetadata';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    return resolvePgGenderLocalityMetadata(slug, 'girls');
}

export const dynamic = 'force-dynamic';

export { default } from '@/views/PgGenderLocalityPage';
