import type { Metadata } from 'next';
import { resolvePgSlugMetadata } from '@/lib/routeMetadata';
import PgSlugRoute from '@/routes/PgSlugRoute';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    return resolvePgSlugMetadata(slug);
}

export default function PgSlugPage() {
    return <PgSlugRoute />;
}
