/**
 * Locality SEO Engine: FAQ Generator
 * Dynamically generates 15+ high-intent SEO and AEO FAQs for any locality
 * covering location, rent, commute, companies, metro, safety, food, wifi,
 * parking, students, and working professionals.
 */

import type { HydratedLocality } from '@/data/localities';
import type { FaqItem } from '@/lib/schema';
import { SITE_NAME } from '@/lib/siteConfig';
import type { PgLocalityStats } from '@/lib/listingInventoryStats';

/**
 * Generate 15 SEO-friendly FAQs dynamically from the SEO data layer.
 */
export function generateLocalityFaqs(locality: HydratedLocality, stats?: PgLocalityStats | null): FaqItem[] {
    const locName = locality.name;
    const topTechPark = locality.nearbyTechParks[0]?.name || 'nearby IT parks';
    const topMetro = locality.nearbyMetroStations[0]?.name || 'the nearest Namma Metro station';
    const topHospital = locality.nearbyHospitals[0]?.name || 'multispecialty hospitals';
    const topCollege = locality.nearbyColleges[0]?.name || 'reputed colleges in East Bangalore';
    const companyNames = locality.nearbyCompanies.map((c) => c.name).slice(0, 3).join(', ') || 'major MNCs';

    return [
        {
            question: `What is the average rent for a PG in ${locName}, Bangalore?`,
            answer: liveRentAnswer(locName, stats) ?? `The average monthly rent for a PG in ${locName} starts from ₹7,000 for triple sharing, ₹9,500–₹14,500 for double sharing, and ₹15,000–₹22,000 for private single sharing rooms, including meals, Wi-Fi, and daily housekeeping.`
        },
        {
            question: `Which is the nearest metro station to PGs in ${locName}?`,
            answer: `The primary metro connectivity for ${locName} is provided by ${topMetro}. Feeder buses, autos, and walkable routes connect most managed PGs in the area directly to the station.`
        },
        {
            question: `Are there good PGs in ${locName} near ${topTechPark}?`,
            answer: `Yes, ${SITE_NAME} lists numerous verified paying guest accommodations and coliving spaces within 5 to 15 minutes walking distance or a short drive from ${topTechPark}.`
        },
        {
            question: `Which companies are located near ${locName} PGs?`,
            answer: `Residents staying in ${locName} enjoy rapid commutes to corporate offices and tech campuses of ${companyNames}, making it a preferred location for working engineers and consultants.`
        },
        {
            question: `Do PGs in ${locName} provide 3-time meals and food options?`,
            answer: `Yes, most verified PGs in ${locName} offer nutritious North Indian and South Indian meals (breakfast, lunch, and dinner) prepared in hygienic kitchens, along with self-cooking pantry options.`
        },
        {
            question: `Is high-speed Wi-Fi and power backup available in ${locName} coliving spaces?`,
            answer: `All verified ${SITE_NAME} properties in ${locName} are equipped with enterprise-grade Wi-Fi (100+ Mbps) and 24/7 commercial generator backup to support work-from-home professionals.`
        },
        {
            question: `How safe are ladies PGs in ${locName}, Bangalore?`,
            answer: `Safety is prioritized across all recommended ladies PGs in ${locName} through 24/7 CCTV surveillance, biometric access control, professional security guards, and mandatory visitor registers.`
        },
        {
            question: `Are there single rooms or private studio PGs available in ${locName}?`,
            answer: `Yes, senior IT executives and founders can find premium single sharing rooms and private studio coliving units in ${locName} with attached washrooms, work desks, and air conditioning.`
        },
        {
            question: `What is the commute time from ${locName} to major Bangalore IT corridors?`,
            answer: `Commute from ${locName} to adjacent tech parks on Outer Ring Road and East Bangalore typically takes between 10 and 25 minutes depending on peak traffic hours and metro access.`
        },
        {
            question: `Is two-wheeler and car parking available in ${locName} PGs?`,
            answer: `Most managed coliving properties in ${locName} provide dedicated, secure covered two-wheeler parking and limited four-wheeler parking spaces for residents.`
        },
        {
            question: `Can students studying at ${topCollege} find budget stay options in ${locName}?`,
            answer: `Absolutely. Students attending ${topCollege} can opt for affordable twin or triple sharing rooms in ${locName} starting at ₹6,500–₹8,500/month with food and laundry included.`
        },
        {
            question: `What are the nearby emergency hospitals around ${locName}?`,
            answer: `In case of medical emergencies, residents in ${locName} have immediate access to leading healthcare centers such as ${topHospital} and 24/7 neighborhood clinics.`
        },
        {
            question: `Is there any brokerage fee to book a PG in ${locName} on MakeMyStay?`,
            answer: `No. ${SITE_NAME} operates on a strict zero-brokerage model. You can inspect verified property photos, compare prices, and schedule visits without paying any broker commission.`
        },
        {
            question: `What is the notice period and lock-in duration for PGs in ${locName}?`,
            answer: `Standard notice periods in ${locName} PGs range from 15 to 30 days, with flexible lock-in terms starting from just 1 month for working professionals and interns.`
        },
        {
            question: `Why is ${locName} considered a top choice for working professionals in Bangalore?`,
            answer: `${locName} combines proximity to major corporate campuses like ${topTechPark}, excellent metro connectivity, vibrant cafes, and modern managed coliving infrastructure.`
        }
    ];
}

function liveRentAnswer(locName: string, stats?: PgLocalityStats | null): string | null {
    if (!stats || stats.count === 0 || stats.minPrice == null) return null;
    const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;
    const rng = (r: { min: number; max: number }) => (r.min === r.max ? fmt(r.min) : `${fmt(r.min)}–${fmt(r.max)}`);
    const parts = [
        stats.triple && `${rng(stats.triple)} for triple sharing`,
        stats.double && `${rng(stats.double)} for double sharing`,
        stats.single && `${rng(stats.single)} for single rooms`,
    ].filter(Boolean);
    const detail = parts.length ? ` Current rents are ${parts.join(', ')} per month.` : '';
    return `PGs in ${locName} on MakeMyStay start from ${fmt(stats.minPrice)} per month across ${stats.count} verified ${stats.count === 1 ? 'listing' : 'listings'}.${detail} Inclusions such as meals and housekeeping vary by property.`;
}
