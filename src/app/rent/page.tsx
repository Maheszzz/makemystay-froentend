export const dynamic = 'force-dynamic';

import Properties from '@/views/Properties';
export default function Page() {
  return <Properties key="rent" initialCategory="rent" initialCity="Bangalore" pageTitle="Properties for Rent" pageSubtitle="Find your perfect rental home in Bangalore" />;
}
