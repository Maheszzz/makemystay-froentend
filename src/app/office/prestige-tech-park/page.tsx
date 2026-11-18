import type { Metadata } from 'next';
import { resolveOfficeMetadata } from '@/lib/routeMetadata';

export function generateMetadata(): Metadata {
    return resolveOfficeMetadata('prestige-tech-park');
}

export const dynamic = 'force-dynamic';

import OfficeLandingPage from '@/views/OfficeLandingPage';

export default function Page() {
    return <OfficeLandingPage slug="prestige-tech-park" />;
}
