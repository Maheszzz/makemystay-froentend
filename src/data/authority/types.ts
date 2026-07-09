export interface AuthorityCommuteTableRow {
    destination: string;
    mode: string;
    peakTime: string;
    offPeakTime: string;
    distance: string;
}

export interface AuthorityRentTableRow {
    roomType: string;
    priceRange: string;
    description: string;
}

export interface AuthorityPriceTrendRow {
    year: string;
    averagePrice: string;
    percentageChange: string;
}

export interface AuthorityPlaceItem {
    name: string;
    distance: string;
    note: string;
}

export interface AuthorityFaqItem {
    question: string;
    answer: string;
}

export interface AuthorityTechParkRef {
    name: string;
    path: string;
    distance: string;
    commuteTime: string;
}

export interface AuthorityCompanyRef {
    name: string;
    parkName: string;
}

export interface AuthorityPersonaGuide {
    persona: 'Student' | 'Bachelor' | 'Family' | 'Working Professional';
    description: string;
    idealAreas: string[];
    tips: string[];
}

export interface AuthorityMarketDashboardData {
    activeListingsCount: number;
    averageRentMale: number;
    averageRentFemale: number;
    averageRentUnisex: number;
    occupancyRate: string;
    demandTrend: 'High' | 'Moderate' | 'Low';
    dataDate: string;
}

export interface AuthorityLocalInsights {
    costOfLiving: {
        category: string;
        estimatedCost: string;
    }[];
    crimeAwareness: string;
    weekendPlaces: AuthorityPlaceItem[];
    moveInChecklist: string[];
    rentalAgreementGuide: string;
}

export interface LocalityAuthorityProfile {
    slug: string;
    name: string;
    
    // Core SEO Metadata
    metaTitle: string;
    metaDescription: string;
    
    // Section 1: Intro & Why Live Here
    introduction: string;
    whyLiveHere: string[];
    
    // Section 2: Tech Parks & Companies
    nearbyTechParks: AuthorityTechParkRef[];
    nearbyCompanies: AuthorityCompanyRef[];
    
    // Section 3: Connectivity
    nearbyMetro: AuthorityPlaceItem[];
    nearbyBmtcStops: AuthorityPlaceItem[];
    commuteTable: AuthorityCommuteTableRow[];
    
    // Section 4: Rent & Price Trends
    averageRentTable: AuthorityRentTableRow[];
    pgPriceTrends: AuthorityPriceTrendRow[];
    rkPriceTrends: AuthorityPriceTrendRow[];
    bhkPriceTrends: AuthorityPriceTrendRow[];
    
    // Section 5: Safety & Pros/Cons
    safety: string;
    pros: string[];
    cons: string[];
    
    // Section 6: Local Amenities
    hospitals: AuthorityPlaceItem[];
    schools: AuthorityPlaceItem[];
    restaurants: AuthorityPlaceItem[];
    cafes: AuthorityPlaceItem[];
    gyms: AuthorityPlaceItem[];
    groceryStores: AuthorityPlaceItem[];
    shopping: AuthorityPlaceItem[];
    nightlife: AuthorityPlaceItem[];
    
    // Section 7: Micro-Markets
    bestPgAreas: string[];
    bestApartments: string[];
    
    // Section 8: Insights & Guides (NEW)
    marketDashboard: AuthorityMarketDashboardData;
    personaGuides: AuthorityPersonaGuide[];
    localInsights: AuthorityLocalInsights;
    
    // Section 9: FAQs & Internal Links
    faqs: AuthorityFaqItem[];
    nearbyLocalities: { name: string; slug: string }[];
    
    // Geo for Schema
    geo: {
        lat: number;
        lng: number;
    };
    
    // Rating Schema
    aggregateRating?: {
        ratingValue: number;
        reviewCount: number;
    };
    
    lastUpdated: string;
}
