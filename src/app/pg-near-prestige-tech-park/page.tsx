import type { Metadata } from 'next';
import { resolveTechParkMetadata } from '@/lib/routeMetadata';
import TechParkPillarPage from '@/views/TechParkPillarPage';

export const metadata: Metadata = resolveTechParkMetadata('/pg-near-prestige-tech-park');

export const revalidate = 3600;

export default function Page() {
    return <TechParkPillarPage parkPath="pg-near-prestige-tech-park" />;
}
