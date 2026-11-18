import { findPgLocationForArea } from '@/data/pgLocations';
import { formatPropertyTitle } from '@/lib/formatPropertyTitle';
import { dedupePropertyFeatures } from '@/lib/propertyFeatures';
import { getQualifiedRatingSummary } from '@/lib/ratings';
import type { Property, Review } from '@/types/api';

export interface ContentSection {
    title: string;
    body: string;
    items?: string[];
}

export interface PropertyContentGuide {
    name: string;
    locality: string;
    areaSlug?: string;
    overview: ContentSection;
    pricing: ContentSection;
    roomTypes: ContentSection | null;
    amenities: ContentSection | null;
    availabilityContact: ContentSection;
    nearbyPlaces: NonNullable<Property['nearby_places']>;
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

function avg(values: Array<number | undefined>): number | undefined {
    const nums = values.filter((v): v is number => typeof v === 'number' && v > 0);
    if (!nums.length) return undefined;
    return Number((nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1));
}

function reviewSummary(property: Property): PropertyContentGuide['reviewSummary'] {
    const summary = getQualifiedRatingSummary(property, { requireReviewsList: true });
    const reviews = summary.approvedReviews;
    return {
        overall: summary.showRating ? summary.rating : undefined,
        count: summary.reviewCount,
        cleanliness: avg(reviews.map((r) => r.cleanliness_rating)),
        amenities: avg(reviews.flatMap((r) => [r.wifi_rating, r.food_rating])),
        location: avg(reviews.map((r) => r.safety_rating)),
        value: summary.showRating ? summary.rating : undefined,
    };
}

export function buildPropertyContentGuide(property: Property): PropertyContentGuide {
    const name = formatPropertyTitle(property.title) || clean(property.title) || 'This property';
    const locality = clean(property.location) || 'Bangalore';
    const type = clean(property.type) || 'property';
    const price = money(property);
    const isPg = /pg|hostel|coliving/i.test(type) || property.category === 'pg';
    const area = findPgLocationForArea(locality);

    const rawFeatures = unique([
        ...(property.features || []),
        property.wifi && 'High-speed WiFi',
        property.food && 'Food available',
        property.housekeeping && 'Housekeeping',
        property.power_backup && 'Power backup',
        property.parking && 'Parking',
        property.lift && 'Lift',
        property.ac && 'AC',
        property.cctv && 'CCTV',
        property.washing_machine && 'Washing machine',
    ]);
    const features = dedupePropertyFeatures(rawFeatures);

    const sharingPrices = unique([
        property.single_price ? `Single sharing: ₹${property.single_price.toLocaleString('en-IN')}/mo` : undefined,
        property.double_price ? `Double sharing: ₹${property.double_price.toLocaleString('en-IN')}/mo` : undefined,
        property.triple_price ? `Triple sharing: ₹${property.triple_price.toLocaleString('en-IN')}/mo` : undefined,
        property.private_price ? `Private room: ₹${property.private_price.toLocaleString('en-IN')}/mo` : undefined,
    ]);

    const roomTypesItems = unique([
        ...sharingPrices,
        !sharingPrices.length && property.sharing?.length ? `Sharing options: ${property.sharing.join(', ')}` : undefined,
        property.sqft && !/request|0/i.test(property.sqft) ? `Area: ${property.sqft}` : undefined,
        property.furnishing ? `Furnishing: ${property.furnishing.replace(/_/g, ' ')}` : undefined,
        property.gender ? `Suitable for: ${property.gender}` : undefined,
    ]);

    const depositText =
        property.deposit_amount !== null && property.deposit_amount !== undefined && property.deposit_amount !== ''
            ? typeof property.deposit_amount === 'number'
                ? `Security deposit: ₹${property.deposit_amount.toLocaleString('en-IN')}.`
                : `Security deposit: ${property.deposit_amount}.`
            : 'Ask for deposit details before booking.';

    const internalLinks = [
        { label: 'Bangalore properties', href: '/properties', reason: 'city page' },
        {
            label: isPg ? 'PG in Bangalore' : 'Rentals in Bangalore',
            href: isPg ? '/pg/bangalore' : '/rent/bangalore',
            reason: 'property type hub',
        },
        ...(area ? [{ label: `PG in ${area.name}`, href: `/pg/${area.slug}`, reason: 'area page' }] : []),
        { label: 'Rental guides', href: '/blog', reason: 'blog hub' },
    ];

    return {
        name,
        locality,
        areaSlug: area?.slug,
        overview: {
            title: 'Property overview',
            body:
                property.description?.trim() ||
                `${name} is a ${type} in ${locality}.${price ? ` Listed starting price: ${price}.` : ''}`,
        },
        pricing: {
            title: 'Pricing & deposit',
            body: `${price ? `Listed starting price is ${price}. ` : 'Pricing is confirmed on enquiry. '}${depositText}`,
        },
        roomTypes:
            roomTypesItems.length > 0
                ? {
                      title: 'Configuration & room options',
                      body: `Listed configuration details for ${name}:`,
                      items: roomTypesItems,
                  }
                : null,
        amenities:
            features.length > 0
                ? {
                      title: 'Amenities',
                      body: `${name} lists ${features.join(', ')}.`,
                      items: features,
                  }
                : null,
        availabilityContact: {
            title: 'Availability & enquiry',
            body:
                property.is_available === false
                    ? `${name} is currently marked fully booked. Enquire to check upcoming openings.`
                    : `${name} is listed as available. Use Call or WhatsApp to schedule a visit.`,
        },
        nearbyPlaces: Array.isArray(property.nearby_places) ? property.nearby_places : [],
        internalLinks,
        reviewSummary: reviewSummary(property),
    };
}

export function buildDynamicPropertyFaqs(property: Property) {
    const answers: { question: string; answer: string }[] = [];
    const name = formatPropertyTitle(property.title) || clean(property.title) || 'this property';

    if (property.food === true) {
        answers.push({
            question: `Is food included at ${name}?`,
            answer: `Food is marked available on this listing. Confirm meal timings and menu details during enquiry.`,
        });
    }
    if (property.wifi === true) {
        answers.push({
            question: `Is Wi-Fi available at ${name}?`,
            answer: `Wi-Fi is listed as available on this property.`,
        });
    }
    if (property.parking === true) {
        answers.push({
            question: `Is parking available at ${name}?`,
            answer: `Parking is listed as available. Confirm two-wheeler or four-wheeler slot availability on visit.`,
        });
    }
    if (property.notice_period_days !== null && property.notice_period_days !== undefined) {
        answers.push({
            question: `What is the notice period at ${name}?`,
            answer: `The listed notice period is ${property.notice_period_days} days.`,
        });
    }
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
