import type { Metadata } from 'next';
import { resolveServiceMetadata } from '@/lib/routeMetadata';

type PageProps = { params: Promise<{ serviceId: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { serviceId } = await params;
    return resolveServiceMetadata(serviceId);
}

export const dynamic = 'force-dynamic';

export { default } from '@/views/ServiceDetail';
