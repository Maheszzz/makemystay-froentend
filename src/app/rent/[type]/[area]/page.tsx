import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import Properties from '@/views/Properties';
import { getPgLocationBySlug } from '@/data/pgLocations';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { SITE_URL } from '@/lib/siteConfig';
import { fetchPropertiesServer } from '@/lib/server/fetchPropertiesServer';

export const revalidate = 3600;

// Allowed BHK/flat types → display label + API property_type value
// apiType: null means "no property_type filter" — shows all rent listings (used for flat/apartment/service-apartment
// which don't have a dedicated DB type; they map to the full rent inventory)
const BHK_TYPES: Record<string, { label: string; apiType: string | null; searchLabel: string }> = {
    '1bhk': { label: '1BHK', apiType: '1BHK', searchLabel: '1BHK Flats' },
    '2bhk': { label: '2BHK', apiType: '2BHK', searchLabel: '2BHK Flats' },
    '3bhk': { label: '3BHK', apiType: '3BHK', searchLabel: '3BHK Flats' },
    furnished: { label: 'Furnished', apiType: 'furnished', searchLabel: 'Furnished Flats' },
    '1rk': { label: '1RK', apiType: '1RK', searchLabel: '1RK Rooms' },
    // "flat", "apartment", "service-apartment" have no dedicated DB type — show full rent inventory
    flat: { label: 'Flat', apiType: null, searchLabel: 'Flats' },
    apartment: { label: 'Apartment', apiType: null, searchLabel: 'Apartments' },
    'service-apartment': { label: 'Service Apartment', apiType: null, searchLabel: 'Service Apartments' },
};

type PageProps = { params: Promise<{ type: string; area: string }> };

function resolveArea(areaSlug: string): { slug: string; name: string } | null {
    if (areaSlug === 'bangalore') return { slug: 'bangalore', name: 'Bangalore' };
    const loc = getPgLocationBySlug(areaSlug);
    if (loc) return { slug: loc.slug, name: loc.name };
    return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { type, area } = await params;
    const bhk = BHK_TYPES[type.toLowerCase()];
    const areaInfo = resolveArea(area.toLowerCase());
    if (!bhk || !areaInfo) {
        return pageSeoToMetadata({
            title: 'Page not found',
            description: '',
            path: '/rent/bangalore',
            noindex: true,
        });
    }

    const { label, searchLabel } = bhk;
    const { name: areaName, slug: areaSlug } = areaInfo;
    const isCity = areaSlug === 'bangalore';
    const locationLabel = isCity ? 'Bangalore' : `${areaName}, Bangalore`;
    const path = `/rent/${type}/${areaSlug}`;

    return pageSeoToMetadata({
        title: `${label} for Rent in ${locationLabel} — Verified | MakeMyStay`,
        description: `Browse verified ${searchLabel.toLowerCase()} for rent in ${locationLabel}. Real photos, transparent pricing, zero brokerage. Book a site visit on MakeMyStay.ai.`,
        path,
        canonicalUrl: `${SITE_URL}${path}`,
    });
}

export default async function RentTypePage({ params }: PageProps): Promise<ReactNode> {
    const { type, area } = await params;
    const typeLower = type.toLowerCase();
    const areaLower = area.toLowerCase();

    // Redirect invalid type to city hub
    const bhk = BHK_TYPES[typeLower];
    if (!bhk) {
        redirect('/rent/bangalore');
    }

    // Redirect unknown area → bangalore variant
    const areaInfo = resolveArea(areaLower);
    if (!areaInfo) {
        redirect(`/rent/${typeLower}/bangalore`);
    }

    const { label, apiType, searchLabel } = bhk;
    // areaInfo is guaranteed non-null here (we redirected above if null)
    const areaSlug = areaInfo!.slug;
    const areaName = areaInfo!.name;
    const isCity = areaSlug === 'bangalore';
    const locationLabel = isCity ? 'Bangalore' : `${areaName}, Bangalore`;
    const cityParam = isCity ? 'bangalore' : areaName;

    // Check inventory — noindex if empty
    // For null apiType (flat/apartment/service-apartment), no type filter = show all rent listings
    let hasInventory = true;
    try {
        const query: Parameters<typeof fetchPropertiesServer>[0] = {
            category: 'rent',
            city: cityParam,
            is_available: true,
            limit: 1,
        };
        if (apiType) query.property_type = apiType;
        const { total } = await fetchPropertiesServer(query);
        hasInventory = total > 0;
    } catch {
        // Non-blocking — render the page anyway
    }

    if (!hasInventory) {
        // Return a noindexed empty page rather than 404 (inventory may appear later)
        return (
            <Properties
                key={`rent-${typeLower}-${areaSlug}`}
                initialCategory="rent"
                initialCity={cityParam}
                {...(apiType ? { initialTypeFilter: apiType } : {})}
                pageTitle={`${label} for Rent in ${locationLabel}`}
                pageSubtitle={`Verified ${searchLabel.toLowerCase()} — checking back for new listings`}
            />
        );
    }

    return (
        <Properties
            key={`rent-${typeLower}-${areaSlug}`}
            initialCategory="rent"
            initialCity={cityParam}
            {...(apiType ? { initialTypeFilter: apiType } : {})}
            pageTitle={`${label} for Rent in ${locationLabel}`}
            pageSubtitle={`Verified ${searchLabel.toLowerCase()} with real photos and transparent pricing`}
        />
    );
}
