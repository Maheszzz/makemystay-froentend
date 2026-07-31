/**
 * SEO Data Layer: Amenities
 * Single source of truth for PG and coliving amenities across MakeMyStay.ai.
 * Powering property filtering, schema markup, feature comparisons, and locality pages.
 */

export type AmenityCategory = 'room' | 'property' | 'safety' | 'food' | 'community';

export interface Amenity {
    /** Unique internal identifier */
    id: string;
    /** URL-friendly slug used in programmatic SEO and query params */
    slug: string;
    /** Display name of the amenity */
    name: string;
    /** Functional category of the amenity */
    category: AmenityCategory;
    /** Detailed SEO description explaining the value of the amenity to residents */
    description: string;
    /** Name of the Lucide or UI icon representing this amenity */
    icon?: string;
    /** Commercial keywords associated with searching for this amenity */
    keywords: string[];
}

export const AMENITIES: Amenity[] = [
    {
        id: 'amenity-wifi',
        slug: 'high-speed-wifi',
        name: 'High-Speed Enterprise Wi-Fi',
        category: 'room',
        description: 'Dedicated enterprise-grade optic fiber Wi-Fi connection with individual router points or mesh networking ensuring uninterrupted remote work and video conferencing.',
        icon: 'Wifi',
        keywords: ['PG with high speed wifi', 'PG with office grade internet', 'wifi PG Bangalore']
    },
    {
        id: 'amenity-ac',
        slug: 'air-conditioning',
        name: 'Air Conditioning (AC)',
        category: 'room',
        description: 'Energy-efficient split air conditioning units with individual room temperature control for year-round comfort during Bangalore warm summers.',
        icon: 'Snowflake',
        keywords: ['AC PG in Bangalore', 'air conditioned PG', 'luxury AC rooms']
    },
    {
        id: 'amenity-bathroom',
        slug: 'attached-bathroom',
        name: 'Attached Bathroom & Geyser',
        category: 'room',
        description: 'Private western-style attached washrooms equipped with 24x7 hot water geysers, modern sanitary fittings, and daily hygienic sanitation.',
        icon: 'Bath',
        keywords: ['PG with attached bathroom', 'private washroom PG', 'PG with geyser']
    },
    {
        id: 'amenity-housekeeping',
        slug: 'daily-housekeeping',
        name: 'Daily Housekeeping',
        category: 'room',
        description: 'Professional daily room cleaning, floor mopping, dusting, and regular bed linen changes by trained housekeeping staff.',
        icon: 'Sparkles',
        keywords: ['PG with daily room cleaning', 'hygienic PG Bangalore', 'housekeeping service PG']
    },
    {
        id: 'amenity-power-backup',
        slug: 'power-backup',
        name: '24/7 Power Backup',
        category: 'property',
        description: 'Heavy-duty diesel generator and inverter backup covering lighting, fans, power sockets, and common area elevators without interruption.',
        icon: 'Zap',
        keywords: ['PG with 100% power backup', 'generator backup PG', 'uninterrupted power PG']
    },
    {
        id: 'amenity-meals',
        slug: 'homely-meals',
        name: 'Nutritious Homely Meals',
        category: 'food',
        description: 'Hygienically prepared North and South Indian meals served breakfast, lunch, and dinner with rotating weekly menus and vegetarian/egg options.',
        icon: 'Utensils',
        keywords: ['PG with food Bangalore', 'PG including meals', 'North Indian food PG Bangalore', 'South Indian food PG']
    },
    {
        id: 'amenity-kitchen',
        slug: 'self-cooking-kitchen',
        name: 'Self-Cooking Community Kitchen',
        category: 'food',
        description: 'Fully equipped shared pantry and kitchen with induction cooktops, microwave ovens, refrigerators, and water purifiers for quick meals.',
        icon: 'ChefHat',
        keywords: ['PG with self cooking kitchen', 'PG with pantry', 'coliving kitchen facility']
    },
    {
        id: 'amenity-biometric',
        slug: 'biometric-access',
        name: 'Biometric & Smart Access',
        category: 'safety',
        description: 'Secure biometric fingerprint scan or RFID keycard entry preventing unauthorized visitor access and ensuring resident safety.',
        icon: 'Lock',
        keywords: ['biometric entry PG', 'smart card PG Bangalore', 'secure PG for girls']
    },
    {
        id: 'amenity-cctv',
        slug: 'cctv-surveillance',
        name: '24/7 CCTV & Security Guard',
        category: 'safety',
        description: 'Round-the-clock security guard presence and HD CCTV surveillance covering entryways, corridors, and exterior perimeters.',
        icon: 'ShieldCheck',
        keywords: ['safe PG in Bangalore', 'CCTV monitored PG', 'gated security PG']
    },
    {
        id: 'amenity-laundry',
        slug: 'laundry-service',
        name: 'Automatic Laundry Facility',
        category: 'property',
        description: 'On-site automatic washing machines and drying areas available for hassle-free clothing care without external laundry expenses.',
        icon: 'Shirt',
        keywords: ['PG with washing machine', 'laundry facility PG Bangalore', 'automatic washer PG']
    },
    {
        id: 'amenity-gym',
        slug: 'gym-fitness-center',
        name: 'On-Site Fitness Center & Gym',
        category: 'community',
        description: 'Well-equipped gym facility with cardio machines and free weights encouraging an active, healthy lifestyle within the residency.',
        icon: 'Dumbbell',
        keywords: ['PG with gym facility', 'coliving with fitness center Bangalore', 'PG with workout room']
    },
    {
        id: 'amenity-parking',
        slug: 'two-wheeler-parking',
        name: 'Covered 2-Wheeler Parking',
        category: 'property',
        description: 'Dedicated covered and gated parking spaces for motorbikes and scooters inside the building premises.',
        icon: 'Bike',
        keywords: ['PG with bike parking', 'two wheeler parking PG Bangalore', 'covered parking PG']
    }
];

/**
 * Get an amenity by its unique slug.
 */
export function getAmenityBySlug(slug: string): Amenity | undefined {
    return AMENITIES.find((item) => item.slug === slug);
}

/**
 * Get an amenity by its ID.
 */
export function getAmenityById(id: string): Amenity | undefined {
    return AMENITIES.find((item) => item.id === id);
}

/**
 * Filter amenities by category.
 */
export function getAmenitiesByCategory(category: AmenityCategory): Amenity[] {
    return AMENITIES.filter((item) => item.category === category);
}

/**
 * Retrieve all amenities in the SEO data layer.
 */
export function getAllAmenities(): Amenity[] {
    return AMENITIES;
}
