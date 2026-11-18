import type { Metadata } from 'next';
import { resolveOfficeMetadata } from '@/lib/routeMetadata';

export function generateMetadata(): Metadata {
    return resolveOfficeMetadata('manyata-tech-park');
}

export const dynamic = 'force-dynamic';

import OfficeLandingPage from '@/views/OfficeLandingPage';

export default function Page() {
    return <OfficeLandingPage slug="manyata-tech-park" />;
}
