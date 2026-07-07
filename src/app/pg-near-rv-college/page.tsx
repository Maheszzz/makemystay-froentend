import type { Metadata } from 'next';
import { resolveLandmarkPathMetadata } from '@/lib/routeMetadata';

export const metadata: Metadata = resolveLandmarkPathMetadata('/pg-near-rv-college');

export const dynamic = 'force-dynamic';

export { default } from '@/views/PgNearLandmarkPage';
