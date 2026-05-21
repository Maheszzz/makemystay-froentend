export const dynamic = 'force-dynamic';

import Properties from '@/views/Properties';
import { useParams } from '@/lib/navigation';
export default function Page() {
  const { city } = useParams();
  const t = city ? city.charAt(0).toUpperCase() + city.slice(1) : '';
  return <Properties key={`buy-${city}`} initialCategory="buy" initialCity={city} pageTitle={`Buy in ${t}`} pageSubtitle={`Explore verified homes for sale in ${t}`} />;
}
