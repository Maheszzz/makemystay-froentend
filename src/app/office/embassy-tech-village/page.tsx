import type { Metadata } from 'next';
import { resolveOfficeMetadata } from '@/lib/routeMetadata';

export function generateMetadata(): Metadata {
    return resolveOfficeMetadata('embassy-tech-village');
}

export const dynamic = 'force-dynamic';

export { default } from '@/views/OfficeLandingPage';
