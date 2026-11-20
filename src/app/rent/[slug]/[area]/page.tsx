import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import Properties from '@/views/Properties';
import { getPgLocationBySlug } from '@/data/pgLocations';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { RENT_BHK_TYPES } from '@/lib/rentBhkTypes';
import { SITE_URL } from '@/lib/siteConfig';
import { fetchPropertiesServer } from '@/lib/server/fetchPropertiesServer';

export const revalidate = 3600;

type PageProps = { params: Promise<{ slug: string; area: string }> };

function resolveArea(areaSlug: string): { slug: string; name: string } | null {
    if (areaSlug === 'bangalore') return { slug: 'bangalore', name: 'Bangalore' };
    const loc = getPgLocationBySlug(areaSlug);
    if (loc) return { slug: loc.slug, name: loc.name };
    return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug, area } = await params;
    const typeLower = slug.toLowerCase();
    const bhk = RENT_BHK_TYPES[typeLower];
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
    const path = `/rent/${typeLower}/${areaSlug}`;

    return pageSeoToMetadata({
        title: `${label} for Rent in ${locationLabel} — Verified | MakeMyStay`,
        description: `Browse verified ${searchLabel.toLowerCase()} for rent in ${locationLabel}. Real photos, transparent pricing, zero brokerage. Book a site visit on MakeMyStay.ai.`,
        path,
        canonicalUrl: `${SITE_URL}${path}`,
    });
}

export default async function RentTypeAreaPage({ params }: PageProps): Promise<ReactNode> {
    const { slug, area } = await params;
    const typeLower = slug.toLowerCase();
    const areaLower = area.toLowerCase();

    // Redirect invalid type to city hub
    const bhk = RENT_BHK_TYPES[typeLower];
    if (!bhk) {
        redirect('/rent/bangalore');
    }

    // Redirect unknown area → bangalore variant
    const areaInfo = resolveArea(areaLower);
    if (!areaInfo) {
        redirect(`/rent/${typeLower}/bangalore`);
    }

    const { label, apiType, searchLabel } = bhk;
    const { slug: areaSlug, name: areaName } = areaInfo;
    const isCity = areaSlug === 'bangalore';
    const locationLabel = isCity ? 'Bangalore' : `${areaName}, Bangalore`;
    const cityParam = isCity ? 'bangalore' : areaName;

    // Check inventory — show fallback subtitle if empty
    let hasInventory = true;
    try {
        const { total } = await fetchPropertiesServer({
            category: 'rent',
            city: cityParam,
            property_type: apiType,
            is_available: true,
            limit: 1,
        });
        hasInventory = total > 0;
    } catch {
        // Non-blocking — render the page anyway
    }

    return (
        <Properties
            key={`rent-${typeLower}-${areaSlug}`}
            initialCategory="rent"
            initialCity={cityParam}
            initialTypeFilter={apiType}
            pageTitle={`${label} for Rent in ${locationLabel}`}
            pageSubtitle={
                hasInventory
                    ? `Verified ${searchLabel.toLowerCase()} with real photos and transparent pricing`
                    : `Verified ${searchLabel.toLowerCase()} — checking back for new listings`
            }
        />
    );
}

