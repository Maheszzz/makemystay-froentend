'use client';

import { useParams } from '@/lib/navigation';
import PropertyDetails from '@/views/PropertyDetails';
import RentBangaloreHub from '@/views/RentBangaloreHub';
import RentHyderabadHub from '@/views/RentHyderabadHub';
import RentPuneHub from '@/views/RentPuneHub';
import RentLocationPage from '@/views/RentLocationPage';

import type { Property } from '@/types/api';

interface RentSlugRouteProps {
    overrideSlug?: string;
    initialProperties?: Property[];
    initialTotalCount?: number;
    initialPropertyCounts?: Record<string, number>;
}

export default function RentSlugRoute({
    overrideSlug,
    initialProperties,
    initialTotalCount,
    initialPropertyCounts,
}: RentSlugRouteProps = {}) {
    const { slug } = useParams<{ slug: string }>();
    const param = (overrideSlug || slug || '').toLowerCase();

    if (/^(\d+)(-|$)/.test(param)) {
        return <PropertyDetails />;
    }

    if (param === 'bangalore') return <RentBangaloreHub key="rent-bangalore-hub" />;
    if (param === 'hyderabad') return <RentHyderabadHub key="rent-hyderabad-hub" />;
    if (param === 'pune') return <RentPuneHub key="rent-pune-hub" />;

    return (
        <RentLocationPage
            overrideSlug={param}
            initialProperties={initialProperties}
            initialTotalCount={initialTotalCount}
            initialPropertyCounts={initialPropertyCounts}
        />
    );
}
