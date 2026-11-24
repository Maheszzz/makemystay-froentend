import type { Metadata } from 'next';
import { resolveCatchAllPathMetadata } from '@/lib/routeMetadata';
import { applyQueryNoindex } from '@/lib/nextMetadata';
import ProgrammaticSeoCatchAll from '@/routes/ProgrammaticSeoCatchAll';

type PageProps = {
  params: Promise<{ path: string[] }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { path } = await params;
  const sp = searchParams ? await searchParams : undefined;
  const pathKey = '/' + (path ?? []).join('/');
  const meta = await resolveCatchAllPathMetadata(pathKey);
  return applyQueryNoindex(meta, sp);
}

export const revalidate = 3600;

export default async function SeoCatchAllPage({ params }: PageProps) {
  const { path } = await params;
  const pathKey = '/' + (path ?? []).join('/');
  
  // Call metadata resolver to trigger notFound() if the route is invalid
  await resolveCatchAllPathMetadata(pathKey);

  return <ProgrammaticSeoCatchAll pathKey={pathKey} />;
}
