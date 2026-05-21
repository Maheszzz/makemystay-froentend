export const dynamic = 'force-dynamic';

import Properties from '@/views/Properties';
import { useParams } from '@/lib/navigation';
export default function Page() {
  const { city } = useParams();
  const t = city ? city.charAt(0).toUpperCase() + city.slice(1) : '';
  return <Properties key={`all-${city}`} initialCategory="all" initialCity={city} pageTitle={`Properties in ${t}`} pageSubtitle={`Explore verified homes in ${t}`} />;
}
