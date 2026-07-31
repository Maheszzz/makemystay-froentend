/**
 * Tech Park Landing Page Generator: Content Generators
 * Generates Hero, Quick Answer, About narrative, Rental Guide, Commute Information,
 * Who Should Stay, Amenities, Nearby Localities, Metro, Companies, and Related Tech Parks.
 */

import type { TechParkEntry, CommuteRow } from '@/data/techParks';
import { getHydratedLocality } from '@/data/localities';
import { METRO_STATIONS } from '@/data/metroStations';
import { getAmenitiesByCategory, type Amenity } from '@/data/amenities';

export interface TechParkHeroContent {
    heading: string;
    subHeading: string;
    seoIntro: string;
}

export interface TechParkRentalTier {
    category: string;
    priceRange: string;
    description: string;
}

export interface TechParkRentalGuide {
    walkingDistancePg: TechParkRentalTier;
    budgetPg: TechParkRentalTier;
    luxuryColiving: TechParkRentalTier;
    singleSharing: TechParkRentalTier;
    doubleSharing: TechParkRentalTier;
    tripleSharing: TechParkRentalTier;
    averageRent: string;
    note: string;
}

export interface TechParkCommuteInfo {
    walkingTime: string;
    metroConnectivity: string;
    busConnectivity: string;
    roadAccess: string;
    commuteTable: CommuteRow[];
}

export interface TechParkWhoShouldStay {
    workingProfessionals: string;
    students?: string;
    newcomers: string;
}

export interface NearbyLocalityItem {
    name: string;
    slug: string;
    distance: string;
    note?: string;
}

export interface NearbyMetroItem {
    name: string;
    line: string;
    distance: string;
    status: string;
}

export interface NearbyCompanyItem {
    name: string;
    industry: string;
    note?: string;
}

export interface RelatedTechParkItem {
    name: string;
    slug: string;
    path: string;
    description: string;
}

export function generateTechParkHero(park: TechParkEntry): TechParkHeroContent {
    return {
        heading: `PG near ${park.name}, Bangalore — Verified Coliving & Rooms`,
        subHeading: `Find verified PGs near ${park.name} with WiFi, food, housekeeping, AC, and walking-distance accommodation for working professionals.`,
        seoIntro: `Zero brokerage coliving spaces and paying guest rooms near ${park.name} in ${park.locality}.`
    };
}

export function generateTechParkQuickAnswer(park: TechParkEntry): string {
    if (park.quickAnswer && park.quickAnswer.length > 50) {
        return park.quickAnswer;
    }
    const companiesStr = (park.companies && park.companies.length > 0)
        ? park.companies.slice(0, 3).join(', ')
        : 'major IT corporations';
    const locNames = park.localitySlugs.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ');
    return `${park.name} is located in ${park.locality}, housing top employers like ${companiesStr}. The best nearby PG localities include ${locNames || park.locality}. Monthly PG rent near ${park.name} typically ranges between ₹7,000 and ₹18,000 with meals, high-speed WiFi, AC, and daily housekeeping included.`;
}

export function generateTechParkAbout(park: TechParkEntry): string {
    const desc = park.description || `${park.name} is a premier IT and business campus located in ${park.locality}, Bangalore.`;
    const tenants = park.tenantProfile || `Working professionals and tech employees across leading global enterprises.`;
    const compStr = (park.companies && park.companies.length > 0)
        ? `Leading corporations inside the campus include ${park.companies.join(', ')}.`
        : '';
    return `${desc}\n\n${compStr}\n\nStaying in a verified PG near ${park.name} helps residents save 1 to 2 hours of daily Bangalore traffic. The area features excellent civic infrastructure, supermarkets, gyms, restaurants, and medical centers catered to ${tenants}`;
}

export function generateTechParkRentalGuide(park: TechParkEntry): TechParkRentalGuide {
    const avgRent = park.avgPgCost || '₹7,500 – ₹17,000/mo';
    return {
        walkingDistancePg: {
            category: 'Walking Distance PG',
            priceRange: '₹8,500 – ₹16,000/mo',
            description: `Stays within 5–15 minutes walk to ${park.name} entrance gates, saving daily travel time.`
        },
        budgetPg: {
            category: 'Budget PG',
            priceRange: '₹6,500 – ₹9,000/mo',
            description: 'Pocket-friendly paying guest rooms with nutritious daily meals, WiFi, and laundry.'
        },
        luxuryColiving: {
            category: 'Luxury Managed Coliving',
            priceRange: '₹16,000 – ₹28,000/mo',
            description: 'Premium private studios and managed suites with gym, lounge, and power backup.'
        },
        singleSharing: {
            category: 'Single Sharing Room',
            priceRange: '₹14,000 – ₹24,000/mo',
            description: 'Private single room with attached washroom, work desk, and AC.'
        },
        doubleSharing: {
            category: 'Double Sharing Room',
            priceRange: '₹8,500 – ₹13,500/mo',
            description: 'Twin sharing room ideal for colleagues and working professionals.'
        },
        tripleSharing: {
            category: 'Triple Sharing Room',
            priceRange: '₹6,500 – ₹8,500/mo',
            description: 'Economical shared accommodation with all utilities included.'
        },
        averageRent: avgRent,
        note: `Rental rates near ${park.name} depend on proximity to the park gates, room sharing type, and amenities like AC and balcony.`
    };
}

export function generateTechParkCommuteInfo(park: TechParkEntry): TechParkCommuteInfo {
    const commuteTable: CommuteRow[] = (park.commuteTable && park.commuteTable.length > 0)
        ? park.commuteTable
        : [
            { from: 'Nearest PG Area', to: park.name, mode: 'Walk', peakTime: '10 mins', offPeakTime: '10 mins' },
            { from: 'Main Road Bus Stop', to: park.name, mode: 'BMTC / Feeder', peakTime: '15 mins', offPeakTime: '10 mins' },
            { from: 'Nearest Metro Station', to: park.name, mode: 'Metro + Auto', peakTime: '20 mins', offPeakTime: '15 mins' }
        ];

    return {
        walkingTime: '5–15 minutes walk from adjacent residential layouts and PG clusters.',
        metroConnectivity: 'Connected via Namma Metro feeder routes and auto-rickshaw stands.',
        busConnectivity: 'Frequent BMTC Volvo AC and city buses connecting major IT corridors.',
        roadAccess: `Direct road connectivity via ${park.locality} and arterial roads.`,
        commuteTable
    };
}

export function generateTechParkWhoShouldStay(park: TechParkEntry): TechParkWhoShouldStay {
    const compText = (park.companies && park.companies.length > 0)
        ? park.companies.slice(0, 3).join(', ')
        : 'major tech corporations';
    return {
        workingProfessionals: `Ideal for software engineers, product managers, and consultants working at ${compText} who want zero daily traffic stress.`,
        students: `Suitable for interns and trainees working on campus projects or attending nearby institutes.`,
        newcomers: `Perfect for professionals moving to Bangalore for the first time, offering move-in-ready rooms without heavy deposit burdens.`
    };
}

export function generateTechParkAmenities(): Amenity[] {
    const rooms = getAmenitiesByCategory('room');
    const property = getAmenitiesByCategory('property');
    const safety = getAmenitiesByCategory('safety');
    return [...rooms.slice(0, 4), ...property.slice(0, 3), ...safety.slice(0, 2)];
}

export function generateNearbyLocalitiesForTechPark(park: TechParkEntry): NearbyLocalityItem[] {
    const results: NearbyLocalityItem[] = [];
    const slugs = park.localitySlugs.length > 0 ? park.localitySlugs : [park.hubSlug, 'whitefield', 'bellandur', 'hsr-layout', 'koramangala'];
    
    for (const slug of slugs) {
        if (!slug) continue;
        const hyd = getHydratedLocality(slug);
        if (hyd) {
            results.push({
                name: hyd.name,
                slug: hyd.slug,
                distance: '2–5 km away',
                note: `Primary residential cluster for ${park.name} employees.`
            });
        }
    }
    return results;
}

export function generateNearbyMetroForTechPark(park: TechParkEntry): NearbyMetroItem[] {
    const results: NearbyMetroItem[] = [];
    if (park.metroStations && park.metroStations.length > 0) {
        for (const ms of park.metroStations) {
            results.push({
                name: ms.name,
                line: 'Purple / Yellow',
                distance: ms.distance || '2 km',
                status: 'Operational'
            });
        }
    } else {
        const primaryHub = park.hubSlug || 'whitefield';
        const matching = METRO_STATIONS.filter(s => s.locality === primaryHub).slice(0, 3);
        for (const ms of matching) {
            results.push({
                name: ms.name,
                line: `${ms.line} Line`,
                distance: '2.5 km',
                status: ms.isOperational ? 'Operational' : 'Upcoming'
            });
        }
    }
    return results;
}

export function generateNearbyCompaniesForTechPark(park: TechParkEntry): NearbyCompanyItem[] {
    return (park.companies || []).map((comp) => ({
        name: comp,
        industry: 'Information Technology & Engineering',
        note: `Located inside ${park.name}`
    }));
}
