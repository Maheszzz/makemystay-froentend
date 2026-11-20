import { haversineDistance } from '@/lib/geo';

export interface LocalityGeoPoint {
    name: string;
    slug: string;
    city: 'bangalore' | 'hyderabad' | 'pune';
    lat: number;
    lng: number;
}

/** Canonical lat/lng coordinates for supported PG & property localities. */
export const LOCALITY_GEO_POINTS: LocalityGeoPoint[] = [
    // Bangalore
    { name: 'Marathahalli', slug: 'marathahalli', city: 'bangalore', lat: 12.9591, lng: 77.6974 },
    { name: 'Kadubeesanahalli', slug: 'kadubeesanahalli', city: 'bangalore', lat: 12.9367, lng: 77.6994 },
    { name: 'AECS Layout', slug: 'aecs-layout', city: 'bangalore', lat: 12.9636, lng: 77.7136 },
    { name: 'Brookefield', slug: 'brookefield', city: 'bangalore', lat: 12.9660, lng: 77.7176 },
    { name: 'BEML Layout', slug: 'beml-layout', city: 'bangalore', lat: 12.9647, lng: 77.7102 },
    { name: 'Whitefield', slug: 'whitefield', city: 'bangalore', lat: 12.9698, lng: 77.7500 },
    { name: 'Mahadevapura', slug: 'mahadevapura', city: 'bangalore', lat: 12.9915, lng: 77.6878 },
    { name: 'Bellandur', slug: 'bellandur', city: 'bangalore', lat: 12.9260, lng: 77.6762 },
    { name: 'Sarjapur', slug: 'sarjapur-road', city: 'bangalore', lat: 12.9107, lng: 77.6870 },
    { name: 'HSR Layout', slug: 'hsr-layout', city: 'bangalore', lat: 12.9121, lng: 77.6446 },
    { name: 'Koramangala', slug: 'koramangala', city: 'bangalore', lat: 12.9352, lng: 77.6245 },
    { name: 'BTM Layout', slug: 'btm', city: 'bangalore', lat: 12.9166, lng: 77.6101 },
    { name: 'Bommanahalli', slug: 'bommanahalli', city: 'bangalore', lat: 12.9030, lng: 77.6240 },
    { name: 'Electronic City', slug: 'electronic-city', city: 'bangalore', lat: 12.8456, lng: 77.6603 },
    { name: 'Bannerghatta', slug: 'bannerghatta', city: 'bangalore', lat: 12.8897, lng: 77.5970 },
    { name: 'JP Nagar', slug: 'jp-nagar', city: 'bangalore', lat: 12.9063, lng: 77.5857 },
    { name: 'Jayanagar', slug: 'jayanagar', city: 'bangalore', lat: 12.9308, lng: 77.5838 },
    { name: 'Indiranagar', slug: 'indiranagar', city: 'bangalore', lat: 12.9784, lng: 77.6408 },
    { name: 'Halasuru', slug: 'halasuru', city: 'bangalore', lat: 12.9817, lng: 77.6285 },
    { name: 'Hebbal', slug: 'hebbal', city: 'bangalore', lat: 13.0358, lng: 77.5970 },
    { name: 'Nagavara', slug: 'nagawara', city: 'bangalore', lat: 13.0450, lng: 77.6200 },
    { name: 'Veerannapalya', slug: 'veerannapalya', city: 'bangalore', lat: 13.0382, lng: 77.6152 },
    { name: 'Hoodi', slug: 'hoodi', city: 'bangalore', lat: 12.9922, lng: 77.7159 },
    { name: 'KR Puram', slug: 'kr-puram', city: 'bangalore', lat: 13.0068, lng: 77.6956 },
    // Hyderabad
    { name: 'Hafeezpet', slug: 'hafeezpet', city: 'hyderabad', lat: 17.4847, lng: 78.3612 },
    { name: 'Gachibowli', slug: 'gachibowli', city: 'hyderabad', lat: 17.4401, lng: 78.3489 },
    { name: 'Nanakramguda', slug: 'nanakramguda', city: 'hyderabad', lat: 17.4191, lng: 78.3407 },
];

function normalizeAreaKey(raw: string): string {
    return raw.toLowerCase().replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
}

export function findLocalityGeo(areaRaw: string | undefined): LocalityGeoPoint | undefined {
    if (!areaRaw) return undefined;
    const key = normalizeAreaKey(areaRaw);
    if (!key) return undefined;
    return LOCALITY_GEO_POINTS.find((pt) => {
        const ptName = normalizeAreaKey(pt.name);
        const ptSlug = normalizeAreaKey(pt.slug);
        return key === ptName || key === ptSlug || key.includes(ptName) || ptName.includes(key);
    });
}

export interface NearbyLocalityMatch extends LocalityGeoPoint {
    distanceKm: number;
}

/**
 * Returns the closest neighboring localities in the same metro sorted by haversine distance.
 */
export function getNearbyLocalities(
    areaRaw: string | undefined,
    maxDistanceKm = 8,
    maxAreas = 4,
): NearbyLocalityMatch[] {
    const origin = findLocalityGeo(areaRaw);
    if (!origin) return [];

    return LOCALITY_GEO_POINTS
        .filter((pt) => pt.city === origin.city && pt.slug !== origin.slug)
        .map((pt) => ({
            ...pt,
            distanceKm: Math.round(haversineDistance(origin.lat, origin.lng, pt.lat, pt.lng) * 10) / 10,
        }))
        .filter((pt) => pt.distanceKm <= maxDistanceKm)
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, maxAreas);
}
