import type { Metadata } from 'next';
import { resolveCityListingsMetadata } from '@/lib/routeMetadata';

type PageProps = { params: Promise<{ city: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { city } = await params;
    return resolveCityListingsMetadata(city, 'plot');
}

export const dynamic = 'force-dynamic';

import Properties from '@/views/Properties';
import { useParams } from '@/lib/navigation';
export default function Page() {
  const { city } = useParams();
  const t = city ? city.charAt(0).toUpperCase() + city.slice(1) : '';
  return <Properties key={`plot-${city}`} initialCategory="plot" initialCity={city} pageTitle={`Plots in ${t}`} pageSubtitle={`Explore verified plots in ${t}`} />;
}
