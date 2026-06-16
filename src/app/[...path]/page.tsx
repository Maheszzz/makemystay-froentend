import type { Metadata } from 'next';
import { resolveCatchAllPathMetadata } from '@/lib/routeMetadata';
import { notFound } from 'next/navigation';
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
  const meta = await resolveCatchAllPathMetadata(pathKey);
  // If the fallback metadata indicates a not‑found page, trigger Next.js 404
  if (meta.title?.toLowerCase().includes('page not found')) {
    notFound();
  }
  return <SeoCatchAllClient />;
}
