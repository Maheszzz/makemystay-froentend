import type { Metadata } from 'next';
import { resolvePgGenderLocalityMetadata } from '@/lib/routeMetadata';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    return resolvePgGenderLocalityMetadata(slug, 'girls');
}

export const dynamic = 'force-dynamic';

import PgGenderLocalityPage from '@/views/PgGenderLocalityPage';

export default async function Page({ params }: PageProps) {
    const { slug } = await params;
    return <PgGenderLocalityPage overrideSlug={slug} />;
}
