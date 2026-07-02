/**
 * Fallback listing copy when API `seo_about` is absent.
 * Keep copy factual and short — avoid internal/SEO scaffolding phrases in user-facing text.
 */

import type { Property } from '@/types/api';
import { formatPropertyTitle } from '@/lib/formatPropertyTitle';
import { buildDynamicPropertyFaqs } from '@/lib/propertyContentEngine';

/** Same shape as `FaqItem` in schema (kept local to avoid circular imports). */
export interface PropertyPdpFaq {
    question: string;
    answer: string;
}

function fmtPrice(property: Property): string {
    const p = property.price?.trim();
    if (p && !/request|negotiable/i.test(p)) return p;
    return '';
}

/** Plain-text excerpt for hero (no markdown). */
export function extractHeroLeadFromNarrative(narrative: string, maxChars: number): string {
    const block = narrative.split(/\n\n+/)[0] ?? narrative;
    const plain = block.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\s+/g, ' ').trim();
    if (plain.length <= maxChars) return plain;
    const cut = plain.slice(0, maxChars);
    const lastSpace = cut.lastIndexOf(' ');
    return `${cut.slice(0, lastSpace > 40 ? lastSpace : maxChars).trim()}…`;
}

/**
 * Short factual copy for PDP / JSON-LD when `seo_about` is missing.
 * Prefer API `description` when it has substance; never prefix with internal labels.
 */
export function buildClientSeoAbout(property: Property): string {
    const raw = (property.description || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (raw.length > 80) {
        return raw.slice(0, 5000).trim();
    }

    const name = formatPropertyTitle(property.title) || (property.title?.trim() ?? 'Property');
    const loc = property.location?.trim() || 'Bangalore';
    const pt = (property.type || 'Home').trim();
    const price = fmtPrice(property);
    const pl = pt.toLowerCase();

    if (pl === 'plot') {
        return `${name} is land for sale in ${loc}. ${price ? `Indicative price ${price}. ` : ''}Confirm dimensions, title, and approvals with qualified advisors before you pay a token.`;
    }
    if (pl === 'pg' || pl === 'hostel') {
        const feats = Array.isArray(property.features) ? property.features.slice(0, 6).join(', ') : '';
        return `${name} is a ${pt} in ${loc}. ${price ? `Monthly rent is typically discussed around ${price}; confirm room type and meal plan. ` : ''}${feats ? `Amenities and tags include ${feats}. ` : ''}Book a visit to verify Wi‑Fi, security, and deposit terms.`;
    }

    return `${name} is a ${pt} listed for rent in ${loc}. ${price ? `Rent from ${price} per month where shown. ` : ''}Confirm furnishing, maintenance, and what is included before you book.`;
}

/** FAQ snippets for PDP (concise, no meta-commentary). */
export function buildPropertyPdpFaqs(property: Property): PropertyPdpFaq[] {
    const name = formatPropertyTitle(property.title) || (property.title?.trim() ?? 'Property');
    const loc = property.location?.trim() || 'Bangalore';
    const price = fmtPrice(property);
    const type = property.type || 'property';
    const bookingText =
        property.is_available === false
            ? 'Use the enquiry options on this page to check whether this unit is still available before you visit.'
            : 'Use Book visit, Call, or WhatsApp on this page to schedule a walkthrough.';

    const amenityParts = [
        property.wifi ? 'WiFi' : '',
        property.food ? 'food' : '',
        property.housekeeping ? 'housekeeping' : '',
        property.power_backup ? 'power backup' : '',
    ].filter(Boolean);
    const amenitySummary =
        amenityParts.length > 0
            ? amenityParts.slice(0, 3).join(', ')
            : 'the amenities listed on this page';

    const items: PropertyPdpFaq[] = [
        {
            question: `What is the rent for ${name} in ${loc}?`,
            answer: price
                ? `The listing shows rent around ${price} per month. Final amount depends on room type and inclusions — confirm on enquiry or visit.`
                : `Rent for this ${type} in ${loc} is confirmed on enquiry so you can compare total monthly cost.`,
        },
        {
            question: `Is ${name} in ${loc} furnished?`,
            answer: `This ${type} in ${loc} is described on this page. Furnishing and society rules should be confirmed during a call or site visit.`,
        },
        {
            question: 'How do I book a visit on MakeMyStay?',
            answer: bookingText,
        },
        {
            question: `What amenities are available at ${name}?`,
            answer: `${name} includes ${amenitySummary}. Confirm what is included in the monthly price.`,
        },
        {
            question: `Where is ${name} located?`,
            answer: `${name} is in ${loc}, Bangalore. Plan a visit near your usual commute hours.`,
        },
    ];

    if (property.type === 'PG' || property.type === 'Hostel') {
        items.splice(
            2,
            0,
            {
                question: `Does ${name} include WiFi, food, or housekeeping?`,
                answer: `Check the tags on this listing and confirm meal frequency, Wi‑Fi, and housekeeping on enquiry.`,
            },
            {
                question: `Is there a security deposit for this PG in ${loc}?`,
                answer: `Most PGs in ${loc} ask for 1–2 months deposit and notice. Confirm amounts in writing before you pay a token.`,
            }
        );
    }
    const seen = new Set<string>();
    return [...items, ...buildDynamicPropertyFaqs(property)]
        .filter((item) => {
            const key = item.question.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        })
        .slice(0, 12);
}

export function generatePropertyLongFormContent(property: Property): string {
    const name = formatPropertyTitle(property.title) || property.title || 'Property';
    const loc = property.location?.split(',')[0].trim() || 'Bangalore';
    const locLower = loc.toLowerCase();
    const type = property.type || 'Property';
    const category = property.category || 'rent';
    const price = property.price || 'affordable rates';
    
    // Locality specific landmarks data
    let itParks = ['RMZ Ecoworld', 'Embassy Tech Village', 'Bagmane Tech Park', 'Manyata Tech Park'];
    let metro = 'the nearest Purple Line station and upcoming Blue Line network';
    let schools = ['Orchids The International School', 'Ryan International School', 'Neev Academy'];
    let hospitals = ['Sakra World Hospital', 'Manipal Hospital', 'Apollo Clinic'];
    let restaurants = ['Social', 'The Black Pearl', 'Glen\'s Bakehouse', 'Barbeque Nation'];
    let busStops = ['Central Bus Stop', 'Local Junction Stop', 'Main Road Terminal'];

    if (locLower.includes('bellandur')) {
        itParks = ['RMZ Ecoworld', 'Ecospace', 'Embassy Tech Village', 'Prestige Tech Park'];
        metro = 'Koramangala Metro Station and upcoming Outer Ring Road line';
        schools = ['Neev Academy', 'New Horizon Gurukul', 'Orchids International'];
        hospitals = ['Sakra World Hospital', 'Cloudnine Hospital', 'RxDx Healthcare'];
        restaurants = ['Sarjapur Social', 'The Irish House', 'Nando\'s', 'Chili\'s'];
        busStops = ['Bellandur Bus Stop', 'Ecospace Bus Stop', 'Devarabeesanahalli Bus Stop'];
    } else if (locLower.includes('marathahalli')) {
        itParks = ['Prestige Tech Park', 'RMZ Ecoworld', 'Cessna Business Park', 'Bagmane Constellation'];
        metro = 'Baiyappanahalli Metro Station and upcoming Marathahalli station';
        schools = ['Ryan International', 'Vibgyor High School', 'Shyamala School'];
        hospitals = ['Sakra World Hospital', 'Apollo Clinic', 'Hope Hospital'];
        restaurants = ['The Black Pearl', 'Absolute Barbecues', 'Nagarjuna Restaurant', 'Biryani Zone'];
        busStops = ['Marathahalli Bridge Bus Stop', 'Multiplex Bus Stop', 'Innovative Multiplex Terminal'];
    } else if (locLower.includes('whitefield')) {
        itParks = ['ITPL (International Tech Park)', 'Sigma Tech Park', 'GR Tech Park', 'Brigade Tech Gardens'];
        metro = 'Whitefield (Kadugodi) Metro Station and Hope Farm metro';
        schools = ['The Deens Academy', 'Vydehi School of Excellence', 'Whitefield Global School'];
        hospitals = ['Manipal Hospital Whitefield', 'Vydehi Hospital', 'Columbia Asia Hospital'];
        restaurants = ['Windmills Craftworks', 'Whitefield Social', 'The Biere Club', 'MTR'];
        busStops = ['ITPL Bus Stop', 'Hope Farm Junction Stop', 'Kadugodi Terminal'];
    } else if (locLower.includes('hsr')) {
        itParks = ['RMZ Ecoworld', 'Embassy Tech Village', 'HSR Startups Corridor', 'Ecospace'];
        metro = 'HSR Layout Sector 4 and Silk Board Metro stations';
        schools = ['National Public School (NPS)', 'JSS Public School', 'Cambridge Public School'];
        hospitals = ['Narayana Multispeciality Hospital', 'Greenview Medical Center', 'Lotus Clinic'];
        restaurants = ['HSR Social', 'Brother Barley Brewing Co', 'The Punjabi Rasoi', 'Sector 7 Cafe'];
        busStops = ['HSR Layout 14th Main Stop', 'Silk Board Junction Stop', 'Agara Bus Stop'];
    } else if (locLower.includes('koramangala')) {
        itParks = ['Embassy GolfLinks', 'Koramangala Startup Hub', 'RMZ Ecoworld', 'Bagmane Tech Park'];
        metro = 'Koramangala 3rd Block Station and Silk Board Junction';
        schools = ['Bethany High School', 'St. Francis School', 'Lawrence High School'];
        hospitals = ['St. John\'s Medical College Hospital', 'Apollo Spectra', 'Narayana Health'];
        restaurants = ['The Black Pearl', 'Koramangala Social', 'Truffles', 'Toit', 'Empire Restaurant'];
        busStops = ['Koramangala Water Tank Stop', 'Sony World Junction Stop', 'St. John\'s Bus Stop'];
    }

    const amenitiesList = [
        property.wifi ? 'High-Speed Wi-Fi connectivity' : 'Reliable Wi-Fi connection',
        property.food ? 'Nutritious veg and non-veg meals' : 'Optional daily meals service',
        property.housekeeping ? 'Professional daily housekeeping' : 'Regular cleaning support',
        property.power_backup ? '24/7 Power backup' : 'Continuous power support',
        'CCTV Surveillance and security access control',
        'Washing machine and laundry zones',
        'Spacious wardrobes and storage',
        'Attached bathrooms with hot water geysers',
        'Comfortable study table and executive chair',
        'Common lounge area and TV space'
    ];

    return `## Property Overview of ${name}
${name} is a state-of-the-art ${type} situated in the high-demand micro-market of ${loc}, Bangalore. Designed specifically to meet the high standards of modern software professionals, corporate employees, and students, this property offers a premium co-living experience. Boasting spacious, well-ventilated rooms with private balconies, high-quality wooden furnishings, and clean modern fittings, it serves as the perfect sanctuary after a busy day at work. As part of our verified inventory on makemystay.ai, this property guarantees a transparent booking process, zero brokerage, and direct developer communication, ensuring that you get the best possible stay at the right price point.

## Amenities at ${name}
At ${name}, we prioritize your comfort and convenience. The property comes fully equipped with a comprehensive suite of premium amenities designed to make your daily routine completely hassle-free.
Among the top amenities provided, you will find:
${amenitiesList.map(a => `- ${a}`).join('\n')}
Each amenity is meticulously managed by on-site hospitality staff who ensure regular upkeep and maintenance. The daily housekeeping services keep the premises clean, while the high-speed internet ensures that you are always connected, making it ideal for work-from-home schedules.

## Nearby IT Parks
One of the primary benefits of staying at ${name} is its immediate proximity to the major IT corridors of Bangalore. Commuting to work is simple, as the property sits within a short radius of key corporate hubs:
${itParks.map(p => `- **${p}**: Located just a few minutes away, offering easy commutes for employees working within this business corridor.`).join('\n')}
Staying near these key employment sectors ensures that you save hours on daily commutes, allowing you to maintain an excellent work-life balance while living in one of Bangalore's most active regions.

## Nearby Metro Stations
Accessibility is further enhanced by Namma Metro connectivity. The nearest metro stations include:
- **Primary Metro Access**: ${metro}, providing swift connection to Indiranagar, MG Road, CBD sectors, and Majestic station.
- **Last-Mile Feeder Access**: Regular auto-rickshaws and feeder buses operate directly from the metro terminal to the lanes of ${loc}, ensuring seamless daily transit.

## Nearby Schools
Families and postgraduate students staying in the area have access to top educational institutions:
${schools.map(s => `- **${s}**: Offering excellent academic curricula and comprehensive developmental activities close to home.`).join('\n')}

## Nearby Hospitals
Medical care is always within reach at ${name}, with super-specialty hospitals located nearby:
${hospitals.map(h => `- **${h}**: Equipped with state-of-the-art emergency services, specialty consulting departments, and 24/7 pharmacies.`).join('\n')}

## Nearby Restaurants & Nightlife
For food lovers, ${loc} offers an incredible array of choices ranging from cozy breakfast spots to active nightlife corridors:
${restaurants.map(r => `- **${r}**: A popular destination offering multi-cuisine dining, excellent ambiance, and perfect weekend dining slots.`).join('\n')}
From local South Indian darshinis to premium microbreweries, the locality has something to satisfy every culinary preference.

## Nearby Bus Stops
Public transit is highly accessible with multiple BMTC bus stops in close proximity:
${busStops.map(b => `- **${b}**: Regular routes connecting to Outer Ring Road, Majestic, and other major Bangalore zones.`).join('\n')}

## Connectivity Guide
The connectivity network surrounding ${name} is highly robust. Major arterial roads, including Outer Ring Road and local expressways, enable swift travel. Ride-hailing apps like Uber, Ola, and Rapido operate extensively in this sector, ensuring that you can book rides in seconds at any time of day or night.

## Why Choose ${name}?
Choosing ${name} means opting for a premium lifestyle that blends security, luxury, and social community. The property is designed with open common areas that encourage interaction among co-residents, creating a friendly neighborhood vibe. The secure premises, managed by 24/7 guards and biometrics, provide peace of mind, making it one of the safest co-living choices for boys and girls in Bangalore.

## Rental Information
The rental structure at ${name} is transparent and value-driven:
- **Typical Pricing**: Rent starts from **${price}** per month, depending on the room configuration selected (private single room vs. double sharing).
- **Security Deposit**: Requires a budget-friendly deposit (usually 1-2 months' rent) with standard notice terms.
- **Zero Brokerage**: Listed directly on MakeMyStay to ensure zero brokerage costs and clear lease documents.

## Booking Process
Booking a room at ${name} is simple:
1. **Explore & Enquire**: View photos, read amenities, and send your query.
2. **Schedule a Visit**: Choose a convenient time slot for a physical or video walkthrough.
3. **Reserve Online**: Pay a secure token payment to lock in your room configuration.
4. **Onboarding**: Complete your digital KYC and sign the lease agreement to move in.

## Similar Properties in ${loc}
If you wish to explore alternative properties in the same neighborhood, MakeMyStay lists several premium PGs and flat rentals nearby. Browse the listing catalog to compare prices, reviews, food options, and proximity to major tech parks before making your final selection.

## Frequently Asked Questions
1. **What is the security deposit for ${name}?**
The security deposit is typically equivalent to 1 or 2 months' rent. It is fully refundable upon vacating the premises as per lease terms.
2. **Are meals included in the monthly rent?**
Yes, most packages at ${name} include daily breakfast and dinner plans. Custom dietary preferences can be coordinated with the kitchen team.
3. **Is parking space available for residents?**
Yes, the property features dedicated two-wheeler parking with 24/7 CCTV monitoring. Four-wheeler parking is subject to slot availability.
4. **What is the notice period for vacating the property?**
A standard notice period of 30 days is required prior to vacating the room to ensure a smooth checkout process.`;
}
