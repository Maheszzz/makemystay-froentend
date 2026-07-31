/**
 * SEO Data Layer: Metro Stations
 * Single source of truth for Namma Metro connectivity across Bangalore localities.
 * Powering commute calculators, locality landing pages, FAQ generation, and local schema.
 */

export type MetroLine = 'Purple' | 'Green' | 'Yellow' | 'Blue' | 'Pink';

export interface MetroStation {
    /** Unique internal identifier */
    id: string;
    /** URL-friendly slug */
    slug: string;
    /** Official or common station name */
    name: string;
    /** Metro corridor line name */
    line: MetroLine;
    /** Primary locality slug where station is located or closest */
    locality: string;
    /** WGS84 geographical coordinates for mapping and distance calculation */
    coordinates: {
        latitude: number;
        longitude: number;
    };
    /** Whether the station is currently operational or under construction/upcoming */
    isOperational: boolean;
    /** Detailed SEO description of the station and its connectivity benefits */
    description: string;
    /** Relevant SEO keywords for search engine matching */
    keywords: string[];
}

export const METRO_STATIONS: MetroStation[] = [
    {
        id: 'metro-kadugodi-tree-park',
        slug: 'kadugodi-tree-park-metro',
        name: 'Kadugodi Tree Park Metro Station',
        line: 'Purple',
        locality: 'whitefield',
        coordinates: { latitude: 12.9904, longitude: 77.7567 },
        isOperational: true,
        description: 'Eastern terminal station on the Namma Metro Purple Line serving Whitefield, Varthur Road, and Kadugodi residential clusters.',
        keywords: ['PG near Kadugodi metro station', 'Kadugodi Tree Park metro PG', 'PG near Whitefield metro']
    },
    {
        id: 'metro-hopefarm-channasandra',
        slug: 'hopefarm-channasandra-metro',
        name: 'Hopefarm Channasandra Metro Station',
        line: 'Purple',
        locality: 'whitefield',
        coordinates: { latitude: 12.9845, longitude: 77.7521 },
        isOperational: true,
        description: 'Major Purple Line station near Hope Farm junction connecting Whitefield and ITPL main roads.',
        keywords: ['PG near Hopefarm metro station', 'Channasandra metro PG', 'PG near Hope Farm Whitefield']
    },
    {
        id: 'metro-sri-sathya-sai-hospital',
        slug: 'sri-sathya-sai-hospital-metro',
        name: 'Sri Sathya Sai Hospital Metro Station',
        line: 'Purple',
        locality: 'whitefield',
        coordinates: { latitude: 12.9818, longitude: 77.7428 },
        isOperational: true,
        description: 'Operational Purple Line station located opposite Sri Sathya Sai Institute of Higher Medical Sciences in Whitefield.',
        keywords: ['PG near Sathya Sai hospital metro', 'PG near Sathya Sai Whitefield', 'Whitefield hospital metro PG']
    },
    {
        id: 'metro-pattandur-agrahara',
        slug: 'pattandur-agrahara-metro',
        name: 'Pattandur Agrahara Metro Station',
        line: 'Purple',
        locality: 'whitefield',
        coordinates: { latitude: 12.9862, longitude: 77.7345 },
        isOperational: true,
        description: 'Key Purple Line station directly serving International Tech Park Bangalore (ITPL) and surrounding tech hubs in Whitefield.',
        keywords: ['PG near Pattandur Agrahara metro', 'PG near ITPL metro station', 'walkable PG near ITPL metro']
    },
    {
        id: 'metro-kundalahalli',
        slug: 'kundalahalli-metro',
        name: 'Kundalahalli Metro Station',
        line: 'Purple',
        locality: 'brookefield',
        coordinates: { latitude: 12.9734, longitude: 77.7178 },
        isOperational: true,
        description: 'Purple Line station serving Kundalahalli gate, Brookefield, and ITPL main road tech corridor.',
        keywords: ['PG near Kundalahalli metro', 'PG near Brookefield metro station', 'Kundalahalli gate PG']
    },
    {
        id: 'metro-nallurhalli',
        slug: 'nallurhalli-metro',
        name: 'Nallurhalli Metro Station',
        line: 'Purple',
        locality: 'whitefield',
        coordinates: { latitude: 12.9732, longitude: 77.7289 },
        isOperational: true,
        description: 'Operational metro station on the Purple Line serving Nallurhalli, Siddapura, and Panathur road commuters.',
        keywords: ['PG near Nallurhalli metro', 'Nallurhalli metro station PG', 'PG near Panathur metro']
    },
    {
        id: 'metro-seetharamapalya',
        slug: 'seetharamapalya-metro',
        name: 'Seetharamapalya Metro Station',
        line: 'Purple',
        locality: 'hoodi',
        coordinates: { latitude: 12.9875, longitude: 77.7163 },
        isOperational: true,
        description: 'Purple Line station on Grafite India Road serving Hoodi circle and Seetharamapalya industrial/tech areas.',
        keywords: ['PG near Seetharamapalya metro', 'PG near Graphite India Bangalore', 'Hoodi circle metro PG']
    },
    {
        id: 'metro-hoodi',
        slug: 'hoodi-metro',
        name: 'Hoodi Metro Station',
        line: 'Purple',
        locality: 'hoodi',
        coordinates: { latitude: 12.9912, longitude: 77.7118 },
        isOperational: true,
        description: 'Operational Purple Line station serving Hoodi residential and tech corporate offices along Whitefield road.',
        keywords: ['PG near Hoodi metro station', 'Hoodi metro PG Bangalore', 'PG near Hoodi circle']
    },
    {
        id: 'metro-garudacharapalya',
        slug: 'garudacharapalya-metro',
        name: 'Garudacharapalya Metro Station',
        line: 'Purple',
        locality: 'mahadevapura',
        coordinates: { latitude: 12.9945, longitude: 77.6982 },
        isOperational: true,
        description: 'Purple Line station on Mahadevapura main road serving BTM layout commuters and tech parks like Brigade Metropolis.',
        keywords: ['PG near Garudacharapalya metro', 'Mahadevapura metro station PG', 'PG near Brigade Metropolis metro']
    },
    {
        id: 'metro-singayyanapalya',
        slug: 'singayyanapalya-metro',
        name: 'Singayyanapalya Metro Station',
        line: 'Purple',
        locality: 'mahadevapura',
        coordinates: { latitude: 12.9961, longitude: 77.6895 },
        isOperational: true,
        description: 'Purple Line station near Phoenix Marketcity and VR Bengaluru mall serving Mahadevapura and KR Puram borders.',
        keywords: ['PG near Singayyanapalya metro', 'PG near Phoenix Marketcity Bangalore', 'Mahadevapura mall metro PG']
    },
    {
        id: 'metro-kr-puram',
        slug: 'kr-puram-metro',
        name: 'KR Puram Metro Station',
        line: 'Purple',
        locality: 'kr-puram',
        coordinates: { latitude: 13.0012, longitude: 77.6775 },
        isOperational: true,
        description: 'Major interchange and operational Purple Line station at KR Puram Railway Station junction connecting East Bangalore.',
        keywords: ['PG near KR Puram metro station', 'KR Puram railway station PG', 'PG near KR Puram bridge']
    },
    {
        id: 'metro-baiyappanahalli',
        slug: 'baiyappanahalli-metro',
        name: 'Baiyappanahalli Metro Station',
        line: 'Purple',
        locality: 'kr-puram',
        coordinates: { latitude: 12.9908, longitude: 77.6525 },
        isOperational: true,
        description: 'Primary interchange station on the Purple Line connecting Old Madras Road, CV Raman Nagar, and central Bangalore.',
        keywords: ['PG near Baiyappanahalli metro', 'Baiyappanahalli metro PG Bangalore', 'PG near Old Madras road metro']
    },
    {
        id: 'metro-electronic-city',
        slug: 'electronic-city-metro',
        name: 'Electronic City Metro Station',
        line: 'Yellow',
        locality: 'electronic-city',
        coordinates: { latitude: 12.8465, longitude: 77.6754 },
        isOperational: false,
        description: 'Upcoming Yellow Line elevated metro station directly serving Electronic City Phase 1 tech campuses and Infosys HQ.',
        keywords: ['PG near Electronic City metro', 'Yellow line metro PG Electronic City', 'Infosys metro station PG']
    },
    {
        id: 'metro-hsr-layout',
        slug: 'hsr-layout-metro',
        name: 'HSR Layout Metro Station',
        line: 'Yellow',
        locality: 'hsr-layout',
        coordinates: { latitude: 12.9123, longitude: 77.6441 },
        isOperational: false,
        description: 'Upcoming Yellow Line metro station serving HSR Layout Sectors 1, 2, and 3 along Central Silk Board corridor.',
        keywords: ['PG near HSR Layout metro', 'HSR Layout metro station PG', 'Yellow line HSR PG']
    },
    {
        id: 'metro-ibbalur',
        slug: 'ibbalur-metro',
        name: 'Ibbalur Metro Station',
        line: 'Blue',
        locality: 'bellandur',
        coordinates: { latitude: 12.9234, longitude: 77.6698 },
        isOperational: false,
        description: 'Upcoming Blue Line ORR metro station at Ibbalur junction serving Sarjapur Road and Bellandur intersection.',
        keywords: ['PG near Ibbalur metro', 'Sarjapur road junction metro PG', 'Bellandur ORR metro PG']
    },
    {
        id: 'metro-bellandur',
        slug: 'bellandur-metro',
        name: 'Bellandur Metro Station',
        line: 'Blue',
        locality: 'bellandur',
        coordinates: { latitude: 12.9315, longitude: 77.6845 },
        isOperational: false,
        description: 'Upcoming Blue Line ORR metro station serving RMZ Ecospace, Intel, and Bellandur tech park corridor.',
        keywords: ['PG near Bellandur metro station', 'RMZ Ecospace metro PG', 'ORR Bellandur metro PG']
    },
    {
        id: 'metro-kadubeesanahalli',
        slug: 'kadubeesanahalli-metro',
        name: 'Kadubeesanahalli Metro Station',
        line: 'Blue',
        locality: 'kadubeesanahalli',
        coordinates: { latitude: 12.9385, longitude: 77.6954 },
        isOperational: false,
        description: 'Upcoming Blue Line ORR metro station serving Embassy TechVillage, JP Morgan, and Kadubeesanahalli IT corridor.',
        keywords: ['PG near Kadubeesanahalli metro', 'Embassy TechVillage metro PG', 'Kadubeesanahalli ORR metro PG']
    },
    {
        id: 'metro-marathahalli',
        slug: 'marathahalli-metro',
        name: 'Marathahalli Metro Station',
        line: 'Blue',
        locality: 'marathahalli',
        coordinates: { latitude: 12.9567, longitude: 77.7012 },
        isOperational: false,
        description: 'Upcoming Blue Line ORR metro station at Marathahalli Bridge junction connecting airport corridor and Outer Ring Road.',
        keywords: ['PG near Marathahalli metro station', 'Marathahalli bridge metro PG', 'ORR Marathahalli metro PG']
    }
];

/**
 * Get a metro station by its slug.
 */
export function getMetroStationBySlug(slug: string): MetroStation | undefined {
    return METRO_STATIONS.find((station) => station.slug === slug);
}

/**
 * Get a metro station by its ID.
 */
export function getMetroStationById(id: string): MetroStation | undefined {
    return METRO_STATIONS.find((station) => station.id === id);
}

/**
 * Get metro stations by locality slug.
 */
export function getMetroStationsByLocality(localitySlug: string): MetroStation[] {
    return METRO_STATIONS.filter((station) => station.locality === localitySlug);
}

/**
 * Get all metro stations in the SEO data layer.
 */
export function getAllMetroStations(): MetroStation[] {
    return METRO_STATIONS;
}
