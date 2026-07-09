import type { Metadata } from 'next';
import { resolveCityListingsMetadata } from '@/lib/routeMetadata';

type PageProps = { params: Promise<{ city: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { city } = await params;
    return resolveCityListingsMetadata(city, 'rent');
}

export const dynamic = 'force-dynamic';

import Properties from '@/views/Properties';
export default async function Page({ params }: PageProps) {
  const { city } = await params;
  const t = city ? city.charAt(0).toUpperCase() + city.slice(1) : '';
  return <Properties key={`rent-${city}`} initialCategory="rent" initialCity={city} pageTitle={`Rent in ${t}`} pageSubtitle={`Explore verified rentals in ${t}`} />;
}
