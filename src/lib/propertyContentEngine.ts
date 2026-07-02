import { findPgLocationForArea } from '@/data/pgLocations';
import { formatPropertyTitle } from '@/lib/formatPropertyTitle';
import type { Property, Review } from '@/types/api';

export interface ContentSection {
    title: string;
    body: string;
    items?: string[];
}

export interface CommuteEstimate {
    destination: string;
    minutes: number;
    note: string;
}

export interface PropertyContentGuide {
    name: string;
    locality: string;
    areaSlug?: string;
    overview: ContentSection;
    suitability: ContentSection;
    pricing: ContentSection;
    roomTypes: ContentSection;
    amenities: ContentSection;
    foodWifiLaundry: ContentSection;
    safetyAndRules: ContentSection;
    moveInTerms: ContentSection;
    availabilityContact: ContentSection;
    localityGuide: ContentSection[];
    commute: CommuteEstimate[];
    internalLinks: { label: string; href: string; reason: string }[];
    reviewSummary: {
        overall?: number;
        count: number;
        cleanliness?: number;
        amenities?: number;
        location?: number;
        value?: number;
    };
}

const DESTINATIONS = [
    { destination: 'Embassy Tech Village', tokens: ['bellandur', 'kadubeesanahalli', 'marathahalli', 'orr'], base: 16 },
    { destination: 'Ecospace', tokens: ['bellandur', 'kadubeesanahalli', 'orr'], base: 14 },
    { destination: 'Manyata Tech Park', tokens: ['manyata', 'nagavara', 'hebbal'], base: 20 },
    { destination: 'RMZ Ecosystem', tokens: ['bellandur', 'kadubeesanahalli', 'orr'], base: 18 },
    { destination: 'Bagmane Tech Park', tokens: ['cv raman', 'indiranagar', 'mahadevapura'], base: 22 },
    { destination: 'Electronic City', tokens: ['electronic city', 'ecity', 'bommasandra'], base: 18 },
    { destination: 'Whitefield', tokens: ['whitefield', 'itpl', 'kadugodi'], base: 16 },
    { destination: 'Marathahalli', tokens: ['marathahalli', 'kundalahalli'], base: 10 },
    { destination: 'HSR Layout', tokens: ['hsr', 'silk board'], base: 12 },
    { destination: 'Koramangala', tokens: ['koramangala', 'ejipura'], base: 14 },
    { destination: 'Bellandur', tokens: ['bellandur'], base: 8 },
    { destination: 'Kadubeesanahalli', tokens: ['kadubeesanahalli'], base: 8 },
];

function clean(value: unknown): string {
    return String(value || '').replace(/\s+/g, ' ').trim();
}

function money(property: Property): string {
    const price = clean(property.price);
    return price && !/request|negotiable/i.test(price) ? price : '';
}

function unique(items: Array<string | undefined | null | false>): string[] {
    return [...new Set(items.map((item) => clean(item || '')).filter(Boolean))];
}

function yesNo(value: boolean | undefined, yes: string, unknown: string): string {
    return value === true ? yes : unknown;
}

function avg(values: Array<number | undefined>): number | undefined {
    const nums = values.filter((v): v is number => typeof v === 'number' && v > 0);
    if (!nums.length) return undefined;
    return Number((nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1));
}

function localityProfile(locality: string) {
    const lower = locality.toLowerCase();
    if (/(bellandur|kadubeesanahalli|marathahalli|outer ring road|orr)/.test(lower)) {
        return {
            offices: ['Embassy TechVillage', 'Ecospace', 'Prestige Tech Park', 'RMZ Ecosystem'],
            transport: ['Outer Ring Road bus corridor', 'cab access to Kadubeesanahalli and Bellandur', 'metro connectivity through nearby ORR/Whitefield corridors'],
            lifestyle: ['cafes and quick-service restaurants', 'grocery stores', 'sports centres', 'shopping around Marathahalli and Bellandur'],
            safety: 'The area is active through the evening because of office traffic, but late-night walking comfort varies by lane.',
        };
    }
    if (/(hsr|koramangala|btm)/.test(lower)) {
        return {
            offices: ['Koramangala startup offices', 'HSR coworking spaces', 'Silk Board commute corridor'],
            transport: ['BMTC routes', 'Silk Board access', 'cab and bike-taxi availability'],
            lifestyle: ['cafes', 'gyms', 'parks', 'restaurants', 'shopping streets'],
            safety: 'Residential pockets are generally active, with better walkability on main roads than inner lanes.',
        };
    }
    if (/(whitefield|itpl|kadugodi)/.test(lower)) {
        return {
            offices: ['ITPL', 'EPIP Zone', 'Brigade Tech Park', 'Whitefield offices'],
            transport: ['Whitefield metro corridor', 'ITPL bus routes', 'Old Airport Road and Varthur Road access'],
            lifestyle: ['Phoenix Marketcity access', 'cafes', 'hospitals', 'schools', 'grocery clusters'],
            safety: 'Whitefield has strong office and residential activity; commute time depends heavily on peak-hour traffic.',
        };
    }
    if (/electronic/.test(lower)) {
        return {
            offices: ['Electronic City Phase 1', 'Electronic City Phase 2', 'Infosys campus', 'Wipro campus'],
            transport: ['Hosur Road', 'elevated expressway', 'BMTC routes', 'upcoming metro corridor'],
            lifestyle: ['campus-side restaurants', 'gyms', 'clinics', 'daily convenience stores'],
            safety: 'Main corridors stay active around office hours; compare lane lighting before finalizing a stay.',
        };
    }
    return {
        offices: ['Bangalore office corridors', 'nearby coworking spaces', 'local commercial hubs'],
        transport: ['BMTC routes', 'cab access', 'main road connectivity'],
        lifestyle: ['restaurants', 'cafes', 'hospitals', 'schools', 'parks', 'shopping'],
        safety: 'Visit during your usual commute and evening hours to judge access, lighting, and noise.',
    };
}

function commuteMinutes(locality: string, base: number, tokens: string[]): number {
    const lower = locality.toLowerCase();
    if (tokens.some((token) => lower.includes(token))) return base;
    if (/(bellandur|kadubeesanahalli|marathahalli|whitefield)/.test(lower)) return base + 12;
    if (/(hsr|koramangala|btm)/.test(lower)) return base + 18;
    return base + 25;
}

function reviewSummary(property: Property): PropertyContentGuide['reviewSummary'] {
    const reviews = property.reviews_list || [];
    return {
        overall: property.average_rating ?? property.rating ?? avg(reviews.map((r) => r.rating)),
        count: property.review_count ?? property.reviews ?? reviews.length,
        cleanliness: avg(reviews.map((r) => r.cleanliness_rating)),
        amenities: avg(reviews.flatMap((r) => [r.wifi_rating, r.food_rating])),
        location: avg(reviews.map((r) => r.safety_rating)),
        value: avg(reviews.map((r) => r.rating)),
    };
}

export function buildPropertyContentGuide(property: Property): PropertyContentGuide {
    const name = formatPropertyTitle(property.title) || clean(property.title) || 'This property';
    const locality = clean(property.location) || 'Bangalore';
    const type = clean(property.type) || 'property';
    const price = money(property);
    const isPg = /pg|hostel|coliving/i.test(type) || property.category === 'pg';
    const area = findPgLocationForArea(locality);
    const profile = localityProfile(locality);
    const features = unique([
        ...(property.features || []),
        property.wifi && 'Wi-Fi',
        property.food && 'Food plan',
        property.housekeeping && 'Housekeeping',
        property.power_backup && 'Power backup',
        property.parking && 'Parking',
        property.lift && 'Lift',
        property.ac && 'AC',
        property.cctv && 'CCTV',
        property.washing_machine && 'Laundry / washing machine',
        property.attached_bathroom && 'Attached bathroom',
    ]);
    const roomTypes = unique([
        isPg && property.sharing?.length ? `Sharing options: ${property.sharing.join(', ')}` : undefined,
        isPg ? 'Single, double, or shared rooms may vary by live inventory' : `${type} configuration as shown in the listing`,
        property.sqft && property.sqft !== '0' ? `${property.sqft} sq ft listed area` : undefined,
        property.furnishing ? `${property.furnishing.replace(/_/g, ' ')} furnishing` : undefined,
    ]);
    const suitabilityItems = unique([
        isPg && 'working professionals who want managed services',
        isPg && 'students or first-time movers comparing food, Wi-Fi, and security',
        !isPg && 'families or professionals comparing independent rental homes',
        property.wifi && 'remote workers who need Wi-Fi availability',
        property.food && 'tenants who prefer meal support',
        property.parking && 'tenants with a two-wheeler or car',
        `people commuting around ${locality}`,
    ]);

    const commute = DESTINATIONS.map((item) => {
        const minutes = commuteMinutes(locality, item.base, item.tokens);
        return {
            destination: item.destination,
            minutes,
            note: `${minutes}-${minutes + 15} minutes by road in typical city traffic; verify during peak office hours.`,
        };
    });

    const internalLinks = [
        { label: 'Bangalore properties', href: '/properties', reason: 'city page' },
        { label: isPg ? 'PG in Bangalore' : 'Rentals in Bangalore', href: isPg ? '/pg/bangalore' : '/rent/bangalore', reason: 'property type hub' },
        ...(area ? [{ label: `PG in ${area.name}`, href: `/pg/${area.slug}`, reason: 'area page' }] : []),
        { label: 'Rental guides', href: '/blog', reason: 'blog hub' },
        { label: 'Budget PG Bangalore', href: '/pg/bangalore?price=low', reason: 'popular search' },
        { label: 'Single room PG', href: '/pg-single-room', reason: 'room type' },
        { label: 'PG near Ecospace', href: '/pg-near-ecospace', reason: 'IT park page' },
        { label: 'PG near Embassy TechVillage', href: '/pg-near-embassy-techvillage', reason: 'IT park page' },
    ];

    return {
        name,
        locality,
        areaSlug: area?.slug,
        overview: {
            title: 'Property overview',
            body: `${name} is a ${type} in ${locality}. ${price ? `The listed starting price is ${price}. ` : ''}${features.length ? `Key listed features include ${features.slice(0, 5).join(', ')}. ` : ''}Use this page to compare rent, inclusions, reviews, photos, locality fit, and commute before scheduling a visit.`,
        },
        suitability: {
            title: 'Who this property is suitable for',
            body: `${name} is best evaluated by matching your commute, budget, and service expectations.`,
            items: suitabilityItems,
        },
        pricing: {
            title: 'Pricing explanation',
            body: price
                ? `${price} is the visible starting price or quoted rent. Final monthly cost can change by room type, sharing, food plan, electricity, maintenance, parking, deposit, and move-in date. Ask for a written breakup before paying a token.`
                : 'Pricing is confirmed on enquiry because rent can vary by room type, availability, furnishing, deposit, and included services.',
        },
        roomTypes: {
            title: 'Room types',
            body: isPg ? 'PG inventory can change quickly by occupancy type. Confirm whether single, double, triple, or shared rooms are open for your move-in date.' : 'Confirm the exact unit configuration, furnishing, floor, balcony, parking, and maintenance terms before booking.',
            items: roomTypes,
        },
        amenities: {
            title: 'Amenities',
            body: features.length ? `${name} lists ${features.slice(0, 10).join(', ')}.` : 'Amenity details should be confirmed during enquiry and site visit.',
            items: features,
        },
        foodWifiLaundry: {
            title: 'Food, Wi-Fi, laundry and power backup',
            body: [
                yesNo(property.food, 'Food availability is marked on this listing.', 'Food availability varies; confirm meal plan, timings, and inclusions.'),
                yesNo(property.wifi, 'Wi-Fi is marked as available.', 'Wi-Fi status should be verified before move-in.'),
                property.washing_machine ? 'Laundry or washing machine access is listed.' : 'Confirm laundry or washing machine access with the property manager.',
                property.power_backup ? 'Power backup is listed.' : 'Power backup should be checked during the visit.',
            ].join(' '),
        },
        safetyAndRules: {
            title: 'Security, parking and house rules',
            body: [
                property.cctv ? 'CCTV is listed for security.' : 'Ask about CCTV, guard availability, entry rules, and visitor timing.',
                property.parking ? 'Parking is listed; confirm slot type and charges.' : 'Parking is not clearly confirmed; ask before visiting if you need it.',
                'Confirm visitor rules, couple policy, pet policy, quiet hours, and guest stay rules in writing.',
            ].join(' '),
        },
        moveInTerms: {
            title: 'Move-in process, deposit and rental terms',
            body: 'Shortlist the property, schedule a visit, verify room condition, confirm rent breakup, deposit, notice period, cancellation/refund policy, and collect written confirmation before paying any token.',
        },
        availabilityContact: {
            title: 'Availability and contact',
            body: property.is_available === false
                ? `${name} may be unavailable or fully booked. Contact MakeMyStay to confirm live inventory and nearby alternatives.`
                : `${name} is currently shown as available. Use the call, WhatsApp, or visit booking options to confirm live room availability.`,
        },
        localityGuide: [
            { title: `About ${locality}`, body: `${locality} is useful to compare by commute, daily services, and lane-level access rather than rent alone.` },
            { title: 'Connectivity and public transport', body: `Connectivity around ${locality} usually depends on ${profile.transport.join(', ')}.` },
            { title: 'Nearby IT parks and offices', body: `Common work hubs to compare from ${locality}: ${profile.offices.join(', ')}.` },
            { title: 'Shopping, restaurants, cafes and daily needs', body: `${locality} tenants should compare access to ${profile.lifestyle.join(', ')}.` },
            { title: 'Hospitals, schools, colleges, gyms and parks', body: `For longer stays, check nearby hospitals, schools, colleges, gyms, parks, and pharmacies around ${locality}.` },
            { title: 'Safety, walkability and nightlife', body: profile.safety },
        ],
        commute,
        internalLinks,
        reviewSummary: reviewSummary(property),
    };
}

export function buildDynamicPropertyFaqs(property: Property) {
    const guide = buildPropertyContentGuide(property);
    const name = guide.name;
    const locality = guide.locality;
    const price = money(property);
    const answers = [
        {
            question: `Is food included at ${name}?`,
            answer: property.food
                ? `Food is marked as available for ${name}. Confirm meal timings, weekly menu, and whether it is included in ${price || 'the rent'} before booking.`
                : `Food is not clearly confirmed for ${name}. Ask whether meals are available as an add-on before visiting.`,
        },
        {
            question: `Is parking available at ${name}?`,
            answer: property.parking
                ? `Parking is listed for ${name}. Confirm whether it is two-wheeler or car parking and whether extra charges apply.`
                : `Parking is not clearly confirmed for ${name}. If parking matters, ask before scheduling a visit.`,
        },
        {
            question: `Is Wi-Fi free at ${name}?`,
            answer: property.wifi
                ? `Wi-Fi is marked as available. Confirm speed, data limits, and whether it is included in the monthly rent.`
                : `Wi-Fi is not clearly confirmed. Ask the property manager about internet availability and charges.`,
        },
        {
            question: `Are visitors, couples, or pets allowed at ${name}?`,
            answer: 'Visitor, couple, and pet policies vary by operator and building rules. Confirm these rules in writing before paying a token.',
        },
        {
            question: `Is ${name} suitable for working professionals?`,
            answer: `${name} can suit working professionals if the commute from ${locality}, Wi-Fi, security, and quiet-hour rules match your routine.`,
        },
        {
            question: `Is housekeeping or laundry included at ${name}?`,
            answer: `${property.housekeeping ? 'Housekeeping is marked as available. ' : 'Housekeeping should be confirmed. '}${property.washing_machine ? 'Laundry or washing machine access is listed.' : 'Ask about laundry access and charges.'}`,
        },
        {
            question: `Can I schedule a visit or book ${name} online?`,
            answer: property.is_available === false
                ? `Check availability first because ${name} may be booked. MakeMyStay can suggest nearby alternatives in ${locality}.`
                : `Yes. Use the visit, call, or WhatsApp options on this page to confirm availability and schedule a walkthrough.`,
        },
        {
            question: `What is the deposit and cancellation policy for ${name}?`,
            answer: 'Deposit, notice period, token adjustment, and cancellation rules can vary. Ask for a written rent and refund breakup before paying.',
        },
    ];
    return answers;
}

export function categoryReviewAverages(reviews: Review[]) {
    return {
        cleanliness: avg(reviews.map((r) => r.cleanliness_rating)),
        amenities: avg(reviews.flatMap((r) => [r.wifi_rating, r.food_rating])),
        safety: avg(reviews.map((r) => r.safety_rating)),
        value: avg(reviews.map((r) => r.rating)),
    };
}
