import type { Metadata } from 'next';
import { resolveCatchAllPathMetadata } from '@/lib/routeMetadata';
import ProgrammaticSeoCatchAll from '@/routes/ProgrammaticSeoCatchAll';

type PageProps = { params: Promise<{ path: string[] }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { path } = await params;
  const pathKey = '/' + (path ?? []).join('/');
  return resolveCatchAllPathMetadata(pathKey);
}

export const revalidate = 3600;

export default async function SeoCatchAllPage({ params }: PageProps) {
  const { path } = await params;
  const pathKey = '/' + (path ?? []).join('/');
  
  // Call metadata resolver to trigger notFound() if the route is invalid
  await resolveCatchAllPathMetadata(pathKey);

  return <ProgrammaticSeoCatchAll pathKey={pathKey} />;
}
