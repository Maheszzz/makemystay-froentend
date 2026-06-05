export type PgMarketIndexRow = {
    locality: string;
    slug: string;
    averageRent: string;
    rentRange: string;
    demandSignal: 'High' | 'Medium' | 'Emerging';
    primaryAudience: string;
    nearbyDemandDrivers: string[];
};

export const PG_MARKET_INDEX_MONTH = 'June 2026';

export const PG_MARKET_INDEX_ROWS: PgMarketIndexRow[] = [
    {
        locality: 'HSR Layout',
        slug: 'hsr-layout',
        averageRent: '₹13,500',
        rentRange: '₹8,000-₹22,000',
        demandSignal: 'High',
        primaryAudience: 'startup employees, students, and first-job professionals',
        nearbyDemandDrivers: ['Koramangala', 'Electronic City commute', 'Outer Ring Road access'],
    },
    {
        locality: 'Whitefield',
        slug: 'whitefield',
        averageRent: '₹14,000',
        rentRange: '₹8,500-₹24,000',
        demandSignal: 'High',
        primaryAudience: 'IT park employees and hybrid workers',
        nearbyDemandDrivers: ['ITPL', 'Kadugodi metro', 'Brookefield'],
    },
    {
        locality: 'Bellandur',
        slug: 'bellandur',
        averageRent: '₹14,500',
        rentRange: '₹9,000-₹25,000',
        demandSignal: 'High',
        primaryAudience: 'Outer Ring Road tech employees',
        nearbyDemandDrivers: ['Ecospace', 'Ecoworld', 'Sarjapur Road'],
    },
    {
        locality: 'Marathahalli',
        slug: 'marathahalli',
        averageRent: '₹12,500',
        rentRange: '₹7,500-₹20,000',
        demandSignal: 'High',
        primaryAudience: 'early-career IT professionals',
        nearbyDemandDrivers: ['Whitefield', 'HAL', 'Outer Ring Road'],
    },
    {
        locality: 'Koramangala',
        slug: 'koramangala',
        averageRent: '₹15,000',
        rentRange: '₹9,000-₹26,000',
        demandSignal: 'High',
        primaryAudience: 'startup teams, students, and founders',
        nearbyDemandDrivers: ['Christ University', 'Indiranagar', 'HSR Layout'],
    },
    {
        locality: 'Electronic City',
        slug: 'electronic-city',
        averageRent: '₹10,500',
        rentRange: '₹6,500-₹18,000',
        demandSignal: 'Medium',
        primaryAudience: 'campus employees and budget PG seekers',
        nearbyDemandDrivers: ['Wipro', 'Infosys', 'PES University commute'],
    },
    {
        locality: 'Indiranagar',
        slug: 'indiranagar',
        averageRent: '₹16,000',
        rentRange: '₹10,000-₹28,000',
        demandSignal: 'Medium',
        primaryAudience: 'premium coliving seekers and central Bangalore commuters',
        nearbyDemandDrivers: ['MG Road', 'Domlur', 'metro access'],
    },
];

export const PG_MARKET_INDEX_SUMMARY =
    'Bangalore PG rents in major job corridors typically range from ₹6,500 to ₹28,000 per month, with HSR Layout, Whitefield, Bellandur, Marathahalli, Koramangala, Electronic City, and Indiranagar showing the strongest recurring search demand.';
