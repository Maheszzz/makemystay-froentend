import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { resolveCityListingsMetadata } from '@/lib/routeMetadata';
import { applyQueryNoindex } from '@/lib/nextMetadata';

const VALID_CITIES = new Set(['bangalore', 'bengaluru', 'hyderabad', 'pune']);

type PageProps = {
    params: Promise<{ city: string }>;
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
    const { city } = await params;
    if (!VALID_CITIES.has((city || '').toLowerCase())) notFound();
    const sp = searchParams ? await searchParams : undefined;
    return applyQueryNoindex(resolveCityListingsMetadata(city, 'all'), sp);
}

export const dynamic = 'force-dynamic';

import Properties from '@/views/Properties';
export default async function Page({ params }: PageProps) {
  const { city } = await params;
  if (!VALID_CITIES.has((city || '').toLowerCase())) notFound();
  const t = city ? city.charAt(0).toUpperCase() + city.slice(1) : '';
  return <Properties key={`all-${city}`} initialCategory="all" initialCity={city} pageTitle={`Properties in ${t}`} pageSubtitle={`Explore verified homes in ${t}`} />;
}
