/**
 * SEO Data Layer: Companies & Corporate Employers
 * Single source of truth for major IT, finance, and product companies in Bangalore.
 * Powering company-specific stay landing pages (e.g. PG near Google), commuter tables, and SEO metadata.
 */

export interface Company {
    /** Unique internal identifier */
    id: string;
    /** URL-friendly slug used in SEO URLs and query filters */
    slug: string;
    /** Official or brand name of the company */
    name: string;
    /** Primary industry sector (e.g., Information Technology, Finance, E-commerce) */
    industry: string;
    /** Major locality slugs where the company maintains office campuses in Bangalore */
    localities: string[];
    /** Tech park slugs/paths where their offices are situated */
    techParks: string[];
    /** Approximate employee scale in Bangalore */
    employeeCountRange?: string;
    /** Detailed SEO description of the company and employee accommodation preferences */
    description: string;
    /** Target search keywords for employees looking for PG accommodation */
    keywords: string[];
}

export const COMPANIES: Company[] = [
    {
        id: 'comp-infosys',
        slug: 'infosys',
        name: 'Infosys Limited',
        industry: 'Information Technology',
        localities: ['electronic-city', 'whitefield'],
        techParks: ['pg-near-infosys-electronic-city', 'pg-near-itpl'],
        employeeCountRange: '50,000+ employees',
        description: 'Global IT services giant with its sprawling flagship 81-acre campus in Electronic City Phase 1 and offices in Whitefield.',
        keywords: ['PG near Infosys Bangalore', 'PG near Infosys Electronic City', 'PG near Infosys campus', 'coliving near Infosys']
    },
    {
        id: 'comp-wipro',
        slug: 'wipro',
        name: 'Wipro Limited',
        industry: 'Information Technology',
        localities: ['sarjapur-road', 'electronic-city', 'whitefield'],
        techParks: ['pg-near-wipro-sarjapur', 'pg-near-electronic-city-phase-1'],
        employeeCountRange: '40,000+ employees',
        description: 'Multinational IT consulting leader headquartered on Sarjapur Road with major delivery centers in Electronic City and Whitefield.',
        keywords: ['PG near Wipro Sarjapur Road', 'PG near Wipro Kodathi', 'PG near Wipro Electronic City', 'PG for Wipro employees']
    },
    {
        id: 'comp-tcs',
        slug: 'tcs',
        name: 'Tata Consultancy Services (TCS)',
        industry: 'Information Technology',
        localities: ['whitefield', 'electronic-city'],
        techParks: ['pg-near-itpl', 'pg-near-electronic-city-phase-1'],
        employeeCountRange: '45,000+ employees',
        description: 'India largest IT services company with major delivery hubs inside International Tech Park Bangalore (ITPL) and Electronic City.',
        keywords: ['PG near TCS Whitefield', 'PG near TCS ITPL Bangalore', 'PG near TCS Electronic City', 'stay near TCS office']
    },
    {
        id: 'comp-accenture',
        slug: 'accenture',
        name: 'Accenture India',
        industry: 'Information Technology & Consulting',
        localities: ['whitefield', 'bellandur', 'marathahalli', 'kadubeesanahalli'],
        techParks: ['pg-near-ecospace', 'pg-near-embassy-techvillage', 'pg-near-itpl'],
        employeeCountRange: '60,000+ employees',
        description: 'Global professional services and consulting firm with multiple large corporate offices across Bellandur ORR and Whitefield.',
        keywords: ['PG near Accenture Bangalore', 'PG near Accenture Bellandur', 'PG near Accenture Ecospace', 'PG near Accenture Whitefield']
    },
    {
        id: 'comp-google',
        slug: 'google-bangalore',
        name: 'Google India',
        industry: 'Technology & Internet',
        localities: ['bellandur', 'kr-puram', 'mahadevapura'],
        techParks: ['pg-near-bagmane-tech-park', 'pg-near-rmz-ecoworld'],
        employeeCountRange: '10,000+ employees',
        description: 'Global tech titan operating significant engineering and product hubs in Bagmane Constellation Business Park and RMZ Ecoworld.',
        keywords: ['PG near Google Bangalore', 'PG near Google office Bagmane', 'PG near Google RMZ Ecoworld', 'luxury PG near Google']
    },
    {
        id: 'comp-microsoft',
        slug: 'microsoft-bangalore',
        name: 'Microsoft India R&D',
        industry: 'Technology & Software',
        localities: ['bellandur', 'kadubeesanahalli'],
        techParks: ['pg-near-embassy-techvillage', 'pg-near-rmz-ecoworld'],
        employeeCountRange: '15,000+ employees',
        description: 'Major development and research center of Microsoft located in Embassy TechVillage and RMZ Ecoworld along Outer Ring Road.',
        keywords: ['PG near Microsoft Bangalore', 'PG near Microsoft Embassy TechVillage', 'stay near Microsoft ORR']
    },
    {
        id: 'comp-amazon',
        slug: 'amazon-bangalore',
        name: 'Amazon Development Centre India',
        industry: 'E-commerce & Cloud Computing',
        localities: ['mahadevapura', 'bellandur', 'brookefield'],
        techParks: ['pg-near-bagmane-tech-park', 'pg-near-rmz-ecoworld'],
        employeeCountRange: '25,000+ employees',
        description: 'E-commerce and AWS cloud engineering headquarters located across Bagmane World Technology Center and ORR tech parks.',
        keywords: ['PG near Amazon Bangalore', 'PG near Amazon Bagmane', 'PG near Amazon office Mahadevapura', 'coliving near Amazon']
    },
    {
        id: 'comp-flipkart',
        slug: 'flipkart',
        name: 'Flipkart Internet HQ',
        industry: 'E-commerce',
        localities: ['bellandur', 'kadubeesanahalli'],
        techParks: ['pg-near-embassy-techvillage'],
        employeeCountRange: '15,000+ employees',
        description: 'India flagship e-commerce headquarters situated in Embassy TechVillage on Outer Ring Road.',
        keywords: ['PG near Flipkart Bangalore', 'PG near Flipkart HQ Embassy TechVillage', 'stay near Flipkart office']
    },
    {
        id: 'comp-goldman-sachs',
        slug: 'goldman-sachs',
        name: 'Goldman Sachs Services',
        industry: 'Investment Banking & Finance',
        localities: ['kadubeesanahalli', 'bellandur'],
        techParks: ['pg-near-helios-business-park', 'pg-near-embassy-techvillage'],
        employeeCountRange: '8,000+ employees',
        description: 'Global investment banking technology and operations hub situated in Helios Business Park on Outer Ring Road.',
        keywords: ['PG near Goldman Sachs Bangalore', 'PG near Goldman Sachs Kadubeesanahalli', 'luxury PG near Helios Business Park']
    },
    {
        id: 'comp-intel',
        slug: 'intel-bangalore',
        name: 'Intel Technology India',
        industry: 'Semiconductors & Hardware',
        localities: ['bellandur'],
        techParks: ['pg-near-ecospace', 'pg-near-rmz-ecoworld'],
        employeeCountRange: '12,000+ employees',
        description: 'Largest non-US chip design and hardware R&D campus of Intel located on Outer Ring Road in Bellandur.',
        keywords: ['PG near Intel Bangalore', 'PG near Intel ORR Bellandur', 'coliving near Intel Ecospace']
    },
    {
        id: 'comp-cisco',
        slug: 'cisco-systems',
        name: 'Cisco Systems India',
        industry: 'Networking & Telecommunications',
        localities: ['kadubeesanahalli', 'bellandur'],
        techParks: ['pg-near-cessna-business-park', 'pg-near-embassy-techvillage'],
        employeeCountRange: '12,000+ employees',
        description: 'Massive networking engineering and R&D campus occupying Cessna Business Park on Outer Ring Road.',
        keywords: ['PG near Cisco Bangalore', 'PG near Cisco Cessna Business Park', 'stay near Cisco Kadubeesanahalli']
    },
    {
        id: 'comp-sap-labs',
        slug: 'sap-labs',
        name: 'SAP Labs India',
        industry: 'Enterprise Software',
        localities: ['whitefield', 'brookefield'],
        techParks: ['pg-near-itpl', 'pg-near-kalyani-tech-park'],
        employeeCountRange: '14,000+ employees',
        description: 'Enterprise ERP software research and development campus situated in Whitefield.',
        keywords: ['PG near SAP Labs Whitefield', 'PG near SAP Labs Bangalore', 'coliving near SAP Whitefield']
    },
    {
        id: 'comp-oracle',
        slug: 'oracle-india',
        name: 'Oracle India',
        industry: 'Database & Cloud Enterprise',
        localities: ['whitefield', 'marathahalli', 'bellandur'],
        techParks: ['pg-near-kalyani-tech-park', 'pg-near-rmz-ecoworld'],
        employeeCountRange: '15,000+ employees',
        description: 'Database and enterprise cloud systems leader with offices in Kalyani Tech Park and Marathahalli ORR.',
        keywords: ['PG near Oracle Bangalore', 'PG near Oracle Whitefield', 'PG near Oracle Kalyani Tech Park']
    },
    {
        id: 'comp-dell',
        slug: 'dell-technologies',
        name: 'Dell Technologies India',
        industry: 'Hardware & IT Infrastructure',
        localities: ['brookefield', 'kr-puram', 'mahadevapura'],
        techParks: ['pg-near-rmz-infinity', 'pg-near-divyasree-technopark'],
        employeeCountRange: '14,000+ employees',
        description: 'Major technology engineering and customer support centers in RMZ Infinity (Old Madras Rd) and Brookefield.',
        keywords: ['PG near Dell Bangalore', 'PG near Dell RMZ Infinity', 'PG near Dell Brookefield']
    },
    {
        id: 'comp-jpmorgan',
        slug: 'jp-morgan',
        name: 'JPMorgan Chase & Co.',
        industry: 'Banking & Financial Services',
        localities: ['kadubeesanahalli', 'marathahalli', 'bellandur'],
        techParks: ['pg-near-embassy-techvillage', 'pg-near-prestige-tech-park'],
        employeeCountRange: '15,000+ employees',
        description: 'Global financial services and banking technology hub located in Embassy TechVillage and Prestige Tech Park.',
        keywords: ['PG near JP Morgan Bangalore', 'PG near JP Morgan Kadubeesanahalli', 'stay near JP Morgan ORR']
    },
    {
        id: 'comp-kpmg',
        slug: 'kpmg-bangalore',
        name: 'KPMG India',
        industry: 'Professional Services & Audit',
        localities: ['bellandur', 'marathahalli'],
        techParks: ['pg-near-rmz-ecoworld'],
        employeeCountRange: '10,000+ employees',
        description: 'Big Four accounting and advisory services hub located in RMZ Ecoworld on Outer Ring Road.',
        keywords: ['PG near KPMG Bangalore', 'PG near KPMG RMZ Ecoworld', 'coliving near KPMG Bellandur']
    },
    {
        id: 'comp-deloitte',
        slug: 'deloitte-bangalore',
        name: 'Deloitte India USI',
        industry: 'Professional Services & Consulting',
        localities: ['whitefield', 'bellandur'],
        techParks: ['pg-near-divyasree-technopolis', 'pg-near-itpl'],
        employeeCountRange: '15,000+ employees',
        description: 'Big Four consulting and audit firm with offices in Divyasree Technopolis (Yemalur) and Whitefield.',
        keywords: ['PG near Deloitte Bangalore', 'PG near Deloitte Yemalur', 'stay near Deloitte office']
    },
    {
        id: 'comp-samsung',
        slug: 'samsung-r-d',
        name: 'Samsung R&D Institute India - Bangalore (SRI-B)',
        industry: 'Consumer Electronics & Telecommunications',
        localities: ['mahadevapura', 'kr-puram'],
        techParks: ['pg-near-bagmane-tech-park'],
        employeeCountRange: '8,000+ employees',
        description: 'Samsung largest R&D center outside Korea located on Outer Ring Road near Phoenix Marketcity in Mahadevapura.',
        keywords: ['PG near Samsung Bangalore', 'PG near Samsung R&D Mahadevapura', 'stay near SRI-B Bangalore']
    },
    {
        id: 'comp-capgemini',
        slug: 'capgemini-india',
        name: 'Capgemini India',
        industry: 'IT Services & Consulting',
        localities: ['whitefield', 'brookefield', 'bellandur'],
        techParks: ['pg-near-itpl', 'pg-near-rmz-ecospace'],
        employeeCountRange: '25,000+ employees',
        description: 'French IT consulting giant with large campuses in Whitefield (ITPL) and Outer Ring Road.',
        keywords: ['PG near Capgemini Bangalore', 'PG near Capgemini Whitefield', 'PG near Capgemini Brookefield']
    },
    {
        id: 'comp-ibm',
        slug: 'ibm-india',
        name: 'IBM India',
        industry: 'Enterprise IT & Cloud Services',
        localities: ['whitefield', 'koramangala'],
        techParks: ['pg-near-itpl', 'pg-near-manyata-tech-park'],
        employeeCountRange: '25,000+ employees',
        description: 'Global technology leader with key engineering offices in Whitefield and Embassy GolfLinks.',
        keywords: ['PG near IBM Bangalore', 'PG near IBM Whitefield', 'coliving near IBM office']
    },
    {
        id: 'comp-qualcomm',
        slug: 'qualcomm-india',
        name: 'Qualcomm India',
        industry: 'Semiconductors & Wireless Tech',
        localities: ['whitefield', 'kr-puram'],
        techParks: ['pg-near-bagmane-tech-park', 'pg-near-itpl'],
        employeeCountRange: '6,000+ employees',
        description: 'Wireless technology and chip design hub situated in Bagmane Tech Park and Whitefield.',
        keywords: ['PG near Qualcomm Bangalore', 'PG near Qualcomm Whitefield', 'stay near Qualcomm Bagmane']
    },
    {
        id: 'comp-bosch',
        slug: 'bosch-india',
        name: 'Bosch Global Software Technologies (BGSW)',
        industry: 'Automotive Software & Engineering',
        localities: ['koramangala', 'electronic-city'],
        techParks: ['pg-near-electronic-city-phase-1'],
        employeeCountRange: '18,000+ employees',
        description: 'German engineering and automotive software flagship campus located in Adugodi / Koramangala and Electronic City.',
        keywords: ['PG near Bosch Bangalore', 'PG near Bosch Koramangala', 'PG near Bosch Electronic City', 'stay near Bosch Adugodi']
    },
    {
        id: 'comp-swiggy',
        slug: 'swiggy',
        name: 'Swiggy HQ',
        industry: 'Food Delivery & Consumer Tech',
        localities: ['kadubeesanahalli', 'bellandur'],
        techParks: ['pg-near-embassy-techvillage'],
        employeeCountRange: '5,000+ employees',
        description: 'Food and grocery delivery platform headquarters located in Embassy TechVillage on Outer Ring Road.',
        keywords: ['PG near Swiggy HQ Bangalore', 'PG near Swiggy office Kadubeesanahalli', 'stay near Swiggy ORR']
    },
    {
        id: 'comp-phonepe',
        slug: 'phonepe',
        name: 'PhonePe HQ',
        industry: 'Fintech & Digital Payments',
        localities: ['bellandur', 'kadubeesanahalli'],
        techParks: ['pg-near-embassy-techvillage'],
        employeeCountRange: '4,000+ employees',
        description: 'India leading fintech payments platform headquarters in Embassy TechVillage, Bellandur ORR.',
        keywords: ['PG near PhonePe HQ Bangalore', 'PG near PhonePe office Bellandur', 'stay near PhonePe ORR']
    }
];

/**
 * Get a company by its slug.
 */
export function getCompanyBySlug(slug: string): Company | undefined {
    return COMPANIES.find((comp) => comp.slug === slug);
}

/**
 * Get a company by its ID.
 */
export function getCompanyById(id: string): Company | undefined {
    return COMPANIES.find((comp) => comp.id === id);
}

/**
 * Get companies by locality slug.
 */
export function getCompaniesByLocality(localitySlug: string): Company[] {
    return COMPANIES.filter((comp) => comp.localities.includes(localitySlug));
}

/**
 * Get companies located within or near a specific tech park path/slug.
 */
export function getCompaniesByTechPark(techParkSlug: string): Company[] {
    return COMPANIES.filter((comp) => comp.techParks.includes(techParkSlug));
}

/**
 * Get all companies in the SEO data layer.
 */
export function getAllCompanies(): Company[] {
    return COMPANIES;
}
