import type { Metadata } from 'next';
import { resolveOfficeMetadata } from '@/lib/routeMetadata';

export function generateMetadata(): Metadata {
    return resolveOfficeMetadata('manyata-tech-park');
}

export const dynamic = 'force-dynamic';

export { default } from '@/views/OfficeLandingPage';
