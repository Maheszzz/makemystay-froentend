import type { Metadata } from 'next';
import { resolveCatchAllPathMetadata } from '@/lib/routeMetadata';
import SeoCatchAllClient from './SeoCatchAllClient';

type PageProps = { params: Promise<{ path: string[] }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { path } = await params;
  const pathKey = '/' + (path ?? []).join('/');
  return resolveCatchAllPathMetadata(pathKey);
}

export const dynamic = 'force-dynamic';

export default async function SeoCatchAllPage({ params }: PageProps) {
  const { path } = await params;
  const pathKey = '/' + (path ?? []).join('/');
  
  // Call metadata resolver to trigger notFound() if the route is invalid
  resolveCatchAllPathMetadata(pathKey);

  return <SeoCatchAllClient />;
}
