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
    return applyQueryNoindex(resolveCityListingsMetadata(city, 'buy'), sp);
}

export const dynamic = 'force-dynamic';

import Properties from '@/views/Properties';
export default async function Page({ params }: PageProps) {
  const { city } = await params;
  if (!VALID_CITIES.has((city || '').toLowerCase())) notFound();
  const t = city ? city.charAt(0).toUpperCase() + city.slice(1) : '';
  return <Properties key={`buy-${city}`} initialCategory="buy" initialCity={city} pageTitle={`Buy in ${t}`} pageSubtitle={`Explore verified properties for sale in ${t}`} />;
}
