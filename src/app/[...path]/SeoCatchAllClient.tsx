'use client';

import { useParams } from '@/lib/navigation';
import ProgrammaticSeoCatchAll from '@/routes/ProgrammaticSeoCatchAll';

/** Required catch-all for flat SEO URLs (`/pg-in-*`, `/rent-in-*`, etc.) — does not match `/`. */
export default function SeoCatchAllClient() {
    const params = useParams();
    const segments = (params as { path?: string[] }).path ?? [];
    const pathKey = '/' + segments.join('/');
    return <ProgrammaticSeoCatchAll pathKey={pathKey} />;
}
