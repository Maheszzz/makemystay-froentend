import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLocalityComparison } from '@/data/localityComparisons';
import { resolveComparisonMetadata } from '@/lib/routeMetadata';
import LocalityComparePage from '@/views/LocalityComparePage';

type PageProps = { params: Promise<{ pair: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { pair } = await params;
    return resolveComparisonMetadata(pair);
}

export default async function ComparePairPage({ params }: PageProps) {
    const { pair } = await params;
    if (!getLocalityComparison((pair || '').toLowerCase())) {
        notFound();
    }
    return <LocalityComparePage />;
}
