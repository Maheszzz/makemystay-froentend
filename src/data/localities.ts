/**
 * SEO Data Layer: Localities
 * Single source of truth for Bangalore locality hubs across MakeMyStay.ai.
 * Powering locality SEO pages, internal linking clusters, FAQ generation,
 * metadata, schema org markup, and AI content generation.
 */

import { getSeoTechParkBySlug, type TechPark } from '@/data/techParks';
import { getMetroStationBySlug, type MetroStation } from '@/data/metroStations';
import { getHospitalBySlug, type Hospital } from '@/data/hospitals';
import { getCollegeBySlug, type College } from '@/data/colleges';
import { getCompanyBySlug, type Company } from '@/data/companies';

export interface LocalityKeywords {
    /** Main target keyword for primary page ranking (e.g. "PG in Whitefield") */
    primary: string;
    /** Supporting secondary keywords for heading tags and semantic expansion */
    secondary: string[];
    /** Long-tail conversational queries targeting AI Overviews and AEO answers */
    longTail: string[];
    /** High-intent transactional keywords for CTA blocks and metadata */
    commercial: string[];
}

export interface Locality {
    /** Unique internal identifier */
    id: string;
    /** URL-friendly slug used in routing and programmatic SEO */
    slug: string;
    /** Official display name of the locality */
    name: string;
    /** City name (default: Bangalore) */
    city: string;
    /** State name (default: Karnataka) */
    state: string;
    /** WGS84 geographical latitude */
    latitude: number;
    /** WGS84 geographical longitude */
    longitude: number;
    /** Slugs of adjacent or closely connected localities for internal linking clusters */
    nearbyLocalities: string[];
    /** Slugs of nearby tech parks referencing SEO_TECH_PARKS */
    nearbyTechParks: string[];
    /** Slugs of nearby metro stations referencing METRO_STATIONS */
    nearbyMetroStations: string[];
    /** Slugs of nearby hospitals referencing HOSPITALS */
    nearbyHospitals: string[];
    /** Slugs of nearby colleges referencing COLLEGES */
    nearbyColleges: string[];
    /** Slugs of nearby corporate employers referencing COMPANIES */
    nearbyCompanies: string[];
    /** Categorized SEO keyword clusters */
    keywords: LocalityKeywords;
    /** Comprehensive SEO description of the locality and its stay advantages */
    description: string;
}

export interface HydratedLocality extends Omit<
    Locality,
    'nearbyLocalities' | 'nearbyTechParks' | 'nearbyMetroStations' | 'nearbyHospitals' | 'nearbyColleges' | 'nearbyCompanies'
> {
    nearbyLocalities: Locality[];
    nearbyTechParks: TechPark[];
    nearbyMetroStations: MetroStation[];
    nearbyHospitals: Hospital[];
    nearbyColleges: College[];
    nearbyCompanies: Company[];
}

export const SEO_LOCALITIES: Locality[] = [
    {
        id: 'loc-whitefield',
        slug: 'whitefield',
        name: 'Whitefield',
        city: 'Bangalore',
        state: 'Karnataka',
        latitude: 12.9698,
        longitude: 77.7499,
        nearbyLocalities: ['brookefield', 'hoodi', 'varthur', 'panathur', 'kr-puram'],
        nearbyTechParks: ['itpl', 'kalyani-tech-park', 'bagmane-tech-park'],
        nearbyMetroStations: [
            'kadugodi-tree-park-metro',
            'hopefarm-channasandra-metro',
            'sri-sathya-sai-hospital-metro',
            'pattandur-agrahara-metro',
            'nallurhalli-metro'
        ],
        nearbyHospitals: [
            'manipal-hospital-whitefield',
            'vydehi-hospital-whitefield',
            'sri-sathya-sai-hospital-whitefield',
            'rxdx-healthcare-whitefield'
        ],
        nearbyColleges: ['cmrit-whitefield', 'mvjce-whitefield', 'gepce-kr-puram'],
        nearbyCompanies: [
            'tcs',
            'infosys',
            'accenture',
            'sap-labs',
            'oracle-india',
            'deloitte-bangalore',
            'capgemini-india',
            'ibm-india',
            'qualcomm-india'
        ],
        keywords: {
            primary: 'PG in Whitefield',
            secondary: [
                'Best PG in Whitefield',
                'PG in Whitefield Bangalore',
                'coliving in Whitefield',
                'PG rooms in Whitefield'
            ],
            longTail: [
                'PG in Whitefield with food and wifi',
                'luxury ladies PG in Whitefield near ITPL',
                'single room PG in Whitefield for working professionals',
                'best coliving space in Whitefield Bangalore'
            ],
            commercial: [
                'Luxury PG Whitefield',
                'PG near ITPL',
                'Coliving Whitefield',
                'Affordable PG Whitefield',
                'Managed stay Whitefield'
            ]
        },
        description:
            'Whitefield is Bangalore premier eastern IT and residential hub, home to International Tech Park Bangalore (ITPL) and numerous multinational tech campuses. Offering excellent Purple Line metro connectivity and vibrant social infrastructure, it is one of the most sought-after localities for IT professionals and corporate employees.'
    },
    {
        id: 'loc-brookefield',
        slug: 'brookefield',
        name: 'Brookefield',
        city: 'Bangalore',
        state: 'Karnataka',
        latitude: 12.9667,
        longitude: 77.7167,
        nearbyLocalities: ['whitefield', 'marathahalli', 'hoodi', 'panathur', 'kadubeesanahalli'],
        nearbyTechParks: ['kalyani-tech-park', 'itpl', 'prestige-tech-park'],
        nearbyMetroStations: ['kundalahalli-metro', 'nallurhalli-metro', 'pattandur-agrahara-metro'],
        nearbyHospitals: [
            'rxdx-healthcare-whitefield',
            'brookefield-hospital',
            'vydehi-hospital-whitefield',
            'manipal-hospital-whitefield'
        ],
        nearbyColleges: ['cmrit-whitefield', 'mvjce-whitefield'],
        nearbyCompanies: ['oracle-india', 'sap-labs', 'dell-technologies', 'capgemini-india', 'amazon-bangalore'],
        keywords: {
            primary: 'PG in Brookefield',
            secondary: [
                'Best PG in Brookefield',
                'PG in Brookefield Bangalore',
                'coliving in Brookefield',
                'PG near Kundalahalli Gate'
            ],
            longTail: [
                'PG in Brookefield near CMRIT college',
                'best ladies PG in Brookefield with food',
                'single room PG in Brookefield Whitefield road',
                'luxury coliving near Kundalahalli metro'
            ],
            commercial: [
                'Luxury PG Brookefield',
                'PG near Kalyani Tech Park',
                'Coliving Brookefield',
                'PG near CMRIT',
                'Executive stay Brookefield'
            ]
        },
        description:
            'Brookefield is a bustling residential and tech locality situated between Whitefield and Marathahalli along ITPL Main Road. Known for its proximity to Kundalahalli Metro Station, CMRIT college, and Kalyani Tech Park, it provides a well-connected and student-friendly stay environment.'
    },
    {
        id: 'loc-marathahalli',
        slug: 'marathahalli',
        name: 'Marathahalli',
        city: 'Bangalore',
        state: 'Karnataka',
        latitude: 12.9562,
        longitude: 77.7019,
        nearbyLocalities: ['brookefield', 'kadubeesanahalli', 'bellandur', 'panathur', 'varthur'],
        nearbyTechParks: ['prestige-tech-park', 'embassy-techvillage', 'cessna-business-park'],
        nearbyMetroStations: ['marathahalli-metro', 'kundalahalli-metro', 'kadubeesanahalli-metro'],
        nearbyHospitals: [
            'rainbow-childrens-hospital-marathahalli',
            'sakra-world-hospital-bellandur',
            'brookefield-hospital'
        ],
        nearbyColleges: ['new-horizon-college-marathahalli', 'new-horizon-college-engineering', 'cmrit-whitefield'],
        nearbyCompanies: ['jp-morgan', 'oracle-india', 'accenture', 'kpmg-bangalore', 'cisco-systems'],
        keywords: {
            primary: 'PG in Marathahalli',
            secondary: [
                'Best PG in Marathahalli',
                'PG in Marathahalli Bangalore',
                'coliving in Marathahalli',
                'PG near Marathahalli Bridge'
            ],
            longTail: [
                'PG in Marathahalli near Outer Ring Road with food',
                'best ladies PG near Marathahalli bridge',
                'single occupancy PG in Marathahalli for IT professionals',
                'affordable boys PG in Marathahalli Bangalore'
            ],
            commercial: [
                'Luxury PG Marathahalli',
                'PG near Prestige Tech Park',
                'Coliving Marathahalli',
                'PG near Marathahalli ORR',
                'Budget PG Marathahalli'
            ]
        },
        description:
            'Marathahalli is a high-energy commercial and residential junction on Bangalore Outer Ring Road (ORR), connecting Whitefield, Bellandur, and East Bangalore. Its strategic bridge junction and surrounding tech parks make it one of the most popular PG and coliving destinations.'
    },
    {
        id: 'loc-bellandur',
        slug: 'bellandur',
        name: 'Bellandur',
        city: 'Bangalore',
        state: 'Karnataka',
        latitude: 12.9279,
        longitude: 77.6775,
        nearbyLocalities: ['kadubeesanahalli', 'hsr-layout', 'sarjapur-road', 'marathahalli', 'panathur'],
        nearbyTechParks: ['ecospace', 'rmz-ecoworld', 'embassy-techvillage'],
        nearbyMetroStations: ['bellandur-metro', 'ibbalur-metro', 'kadubeesanahalli-metro'],
        nearbyHospitals: [
            'sakra-world-hospital-bellandur',
            'cloudnine-hospital-bellandur',
            'manipal-hospital-sarjapur-road'
        ],
        nearbyColleges: [
            'new-horizon-college-engineering',
            'amrita-school-engineering-kasavanahalli',
            'nift-bangalore'
        ],
        nearbyCompanies: [
            'google-bangalore',
            'intel-bangalore',
            'accenture',
            'microsoft-bangalore',
            'flipkart',
            'kpmg-bangalore',
            'cisco-systems',
            'swiggy',
            'phonepe'
        ],
        keywords: {
            primary: 'PG in Bellandur',
            secondary: [
                'Best PG in Bellandur',
                'PG in Bellandur Bangalore',
                'coliving in Bellandur',
                'PG near Ecospace'
            ],
            longTail: [
                'PG in Bellandur near RMZ Ecospace with food',
                'luxury PG in Bellandur for working professionals',
                'best coliving space in Bellandur ORR',
                'ladies PG in Bellandur near Ecoworld'
            ],
            commercial: [
                'Luxury PG Bellandur',
                'PG near RMZ Ecospace',
                'Coliving Bellandur',
                'PG near Ecoworld',
                'PG near Intel Bellandur'
            ]
        },
        description:
            'Bellandur is the powerhouse of Bangalore Outer Ring Road IT corridor, hosting RMZ Ecospace, RMZ Ecoworld, and Embassy TechVillage. It is the top residential choice for engineers at Google, Intel, Flipkart, and Accenture seeking walking-distance commute options.'
    },
    {
        id: 'loc-hsr-layout',
        slug: 'hsr-layout',
        name: 'HSR Layout',
        city: 'Bangalore',
        state: 'Karnataka',
        latitude: 12.9121,
        longitude: 77.6446,
        nearbyLocalities: ['koramangala', 'bellandur', 'sarjapur-road', 'electronic-city'],
        nearbyTechParks: ['ecospace', 'rmz-ecoworld', 'embassy-techvillage'],
        nearbyMetroStations: ['hsr-layout-metro', 'central-silk-board-metro', 'ibbalur-metro'],
        nearbyHospitals: [
            'narayana-multispeciality-hsr',
            'st-johns-medical-college-hospital',
            'cloudnine-hospital-bellandur'
        ],
        nearbyColleges: ['nift-bangalore', 'oxford-college-hsr', 'st-johns-medical-college'],
        nearbyCompanies: ['flipkart', 'swiggy', 'phonepe', 'bosch-india', 'google-bangalore'],
        keywords: {
            primary: 'PG in HSR Layout',
            secondary: [
                'Best PG in HSR Layout',
                'PG in HSR Layout Bangalore',
                'coliving in HSR Layout',
                'PG in HSR Layout Sector 3'
            ],
            longTail: [
                'PG in HSR Layout for startup founders and professionals',
                'luxury coliving HSR Layout Sector 2 with food',
                'best ladies PG in HSR Layout Bangalore',
                'single room PG HSR Layout near Silk Board'
            ],
            commercial: [
                'Luxury PG HSR Layout',
                'Coliving HSR Layout',
                'Startup stay HSR Layout',
                'PG near NIFT Bangalore',
                'Premium PG HSR Layout'
            ]
        },
        description:
            'HSR Layout is widely celebrated as India startup capital and one of Bangalore most planned residential neighborhoods. With leafy avenues, vibrant cafes, and direct access to Koramangala and Bellandur ORR, HSR Layout offers a premium urban living experience.'
    },
    {
        id: 'loc-koramangala',
        slug: 'koramangala',
        name: 'Koramangala',
        city: 'Bangalore',
        state: 'Karnataka',
        latitude: 12.9352,
        longitude: 77.6245,
        nearbyLocalities: ['hsr-layout', 'bellandur', 'electronic-city'],
        nearbyTechParks: ['embassy-techvillage', 'ecospace'],
        nearbyMetroStations: ['koramangala-metro', 'central-silk-board-metro'],
        nearbyHospitals: ['st-johns-medical-college-hospital', 'narayana-multispeciality-hsr'],
        nearbyColleges: ['st-johns-medical-college', 'christ-university-central', 'jyoti-nivas-college', 'nift-bangalore'],
        nearbyCompanies: ['bosch-india', 'flipkart', 'swiggy', 'ibm-india'],
        keywords: {
            primary: 'PG in Koramangala',
            secondary: [
                'Best PG in Koramangala',
                'PG in Koramangala Bangalore',
                'coliving in Koramangala',
                'PG in Koramangala 4th Block'
            ],
            longTail: [
                'PG in Koramangala near Christ University with food',
                'luxury ladies PG in Koramangala 5th block',
                'best coliving space in Koramangala for professionals',
                'single room PG Koramangala near Sony World signal'
            ],
            commercial: [
                'Luxury PG Koramangala',
                'PG near Christ University',
                'Coliving Koramangala',
                'Premium PG Koramangala',
                'PG near St Johns'
            ]
        },
        description:
            'Koramangala is the cultural and nightlife heart of Bangalore, renowned for its cosmopolitan lifestyle, culinary scene, and top educational institutions like Christ University and St. Johns Medical College. It remains a top choice for students and young executives.'
    },
    {
        id: 'loc-sarjapur-road',
        slug: 'sarjapur-road',
        name: 'Sarjapur Road',
        city: 'Bangalore',
        state: 'Karnataka',
        latitude: 12.9116,
        longitude: 77.6741,
        nearbyLocalities: ['bellandur', 'hsr-layout', 'varthur', 'kadubeesanahalli', 'electronic-city'],
        nearbyTechParks: ['rga-tech-park', 'wipro-sarjapur-campus', 'ecospace', 'embassy-techvillage'],
        nearbyMetroStations: ['ibbalur-metro', 'bellandur-metro', 'hsr-layout-metro'],
        nearbyHospitals: [
            'manipal-hospital-sarjapur-road',
            'motherhood-hospital-sarjapur-road',
            'sakra-world-hospital-bellandur'
        ],
        nearbyColleges: ['krupanidhi-college-group', 'amrita-school-engineering-kasavanahalli', 'nift-bangalore'],
        nearbyCompanies: ['wipro', 'cisco-systems', 'amazon-bangalore', 'accenture', 'infosys'],
        keywords: {
            primary: 'PG in Sarjapur Road',
            secondary: [
                'Best PG in Sarjapur Road',
                'PG in Sarjapur Road Bangalore',
                'coliving in Sarjapur Road',
                'PG near Wipro Sarjapur'
            ],
            longTail: [
                'PG in Sarjapur Road near Wipro corporate office',
                'luxury coliving Sarjapur Road near RGA Tech Park',
                'ladies PG in Sarjapur Road with food and gym',
                'best working professional PG Sarjapur Road'
            ],
            commercial: [
                'Luxury PG Sarjapur Road',
                'PG near Wipro Sarjapur',
                'Coliving Sarjapur Road',
                'PG near RGA Tech Park',
                'Executive stay Sarjapur'
            ]
        },
        description:
            'Sarjapur Road is a fast-expanding IT and residential corridor connecting Outer Ring Road, Bellandur, and Electronic City. Home to Wipro flagship corporate headquarters and RGA Tech Park, it offers excellent stay options for tech workers.'
    },
    {
        id: 'loc-kadubeesanahalli',
        slug: 'kadubeesanahalli',
        name: 'Kadubeesanahalli',
        city: 'Bangalore',
        state: 'Karnataka',
        latitude: 12.9362,
        longitude: 77.6934,
        nearbyLocalities: ['bellandur', 'marathahalli', 'brookefield', 'panathur', 'sarjapur-road'],
        nearbyTechParks: ['embassy-techvillage', 'helios-business-park', 'cessna-business-park', 'prestige-tech-park'],
        nearbyMetroStations: ['kadubeesanahalli-metro', 'bellandur-metro', 'marathahalli-metro'],
        nearbyHospitals: [
            'sakra-world-hospital-bellandur',
            'rainbow-childrens-hospital-marathahalli',
            'cloudnine-hospital-bellandur'
        ],
        nearbyColleges: ['new-horizon-college-engineering', 'new-horizon-college-marathahalli'],
        nearbyCompanies: [
            'jp-morgan',
            'goldman-sachs',
            'cisco-systems',
            'flipkart',
            'swiggy',
            'phonepe',
            'microsoft-bangalore'
        ],
        keywords: {
            primary: 'PG in Kadubeesanahalli',
            secondary: [
                'Best PG in Kadubeesanahalli',
                'PG in Kadubeesanahalli Bangalore',
                'coliving in Kadubeesanahalli',
                'PG near New Horizon College'
            ],
            longTail: [
                'PG in Kadubeesanahalli near JP Morgan and Goldman Sachs',
                'best ladies PG in Kadubeesanahalli with food',
                'walkable PG near Embassy TechVillage Kadubeesanahalli',
                'single occupancy coliving Kadubeesanahalli'
            ],
            commercial: [
                'Luxury PG Kadubeesanahalli',
                'PG near Embassy TechVillage',
                'PG near JP Morgan',
                'Coliving Kadubeesanahalli',
                'PG near NHCE'
            ]
        },
        description:
            'Kadubeesanahalli is a high-demand IT hub on Outer Ring Road, hosting Embassy TechVillage, Cessna Business Park, and Helios Business Park. It is the preferred stay zone for employees at JP Morgan, Goldman Sachs, Cisco, and Flipkart.'
    },
    {
        id: 'loc-electronic-city',
        slug: 'electronic-city',
        name: 'Electronic City',
        city: 'Bangalore',
        state: 'Karnataka',
        latitude: 12.8452,
        longitude: 77.6602,
        nearbyLocalities: ['hsr-layout', 'koramangala', 'sarjapur-road'],
        nearbyTechParks: ['electronic-city-phase-1'],
        nearbyMetroStations: ['electronic-city-metro', 'hsr-layout-metro'],
        nearbyHospitals: ['kauvery-hospital-electronic-city', 'narayana-health-city-electronic-city'],
        nearbyColleges: ['pes-university-ecity', 'iiit-bangalore', 'ifim-business-school-ecity'],
        nearbyCompanies: ['infosys', 'wipro', 'tcs', 'bosch-india'],
        keywords: {
            primary: 'PG in Electronic City',
            secondary: [
                'Best PG in Electronic City',
                'PG in Electronic City Bangalore',
                'coliving in Electronic City',
                'PG in Electronic City Phase 1'
            ],
            longTail: [
                'PG in Electronic City Phase 1 near Infosys gate',
                'best ladies PG in Electronic City with food and wifi',
                'single room coliving Electronic City Phase 2',
                'affordable PG near IIIT Bangalore and PES University'
            ],
            commercial: [
                'Luxury PG Electronic City',
                'PG near Infosys Electronic City',
                'Coliving Electronic City',
                'PG near Wipro ECity',
                'PG near IIITB'
            ]
        },
        description:
            'Electronic City is Bangalore pioneering tech township in South Bangalore, housing the global headquarters of Infosys, Wipro, and over 200 electronics and IT corporations. With upcoming Yellow Line metro connectivity, it offers high-value residential stay options.'
    },
    {
        id: 'loc-mahadevapura',
        slug: 'mahadevapura',
        name: 'Mahadevapura',
        city: 'Bangalore',
        state: 'Karnataka',
        latitude: 12.9915,
        longitude: 77.6869,
        nearbyLocalities: ['kr-puram', 'hoodi', 'whitefield', 'brookefield', 'marathahalli'],
        nearbyTechParks: ['bagmane-tech-park', 'rmz-infinity', 'itpl'],
        nearbyMetroStations: ['garudacharapalya-metro', 'singayyanapalya-metro', 'kr-puram-metro', 'hoodi-metro'],
        nearbyHospitals: ['hoodi-hospital', 'manipal-hospital-kr-puram', 'manipal-hospital-whitefield'],
        nearbyColleges: ['gepce-kr-puram', 'cmrit-whitefield'],
        nearbyCompanies: ['samsung-r-d', 'amazon-bangalore', 'google-bangalore', 'dell-technologies', 'qualcomm-india'],
        keywords: {
            primary: 'PG in Mahadevapura',
            secondary: [
                'Best PG in Mahadevapura',
                'PG in Mahadevapura Bangalore',
                'coliving in Mahadevapura',
                'PG near Phoenix Marketcity'
            ],
            longTail: [
                'PG in Mahadevapura near Samsung R&D Bangalore',
                'best ladies PG in Mahadevapura near Garudacharapalya metro',
                'single room PG near Phoenix Marketcity and VR mall',
                'luxury coliving Mahadevapura Whitefield road'
            ],
            commercial: [
                'Luxury PG Mahadevapura',
                'PG near Samsung Bangalore',
                'Coliving Mahadevapura',
                'PG near Garudacharapalya metro',
                'PG near Phoenix mall'
            ]
        },
        description:
            'Mahadevapura is a vibrant East Bangalore IT and shopping hub situated along Whitefield Main Road and Outer Ring Road. Known for Phoenix Marketcity mall, Samsung R&D Institute (SRI-B), and Purple Line metro stations, it is a prime residential area.'
    },
    {
        id: 'loc-kr-puram',
        slug: 'kr-puram',
        name: 'KR Puram',
        city: 'Bangalore',
        state: 'Karnataka',
        latitude: 13.0075,
        longitude: 77.6958,
        nearbyLocalities: ['mahadevapura', 'hoodi', 'whitefield', 'brookefield'],
        nearbyTechParks: ['bagmane-tech-park', 'rmz-infinity', 'manyata-tech-park'],
        nearbyMetroStations: ['kr-puram-metro', 'baiyappanahalli-metro', 'singayyanapalya-metro'],
        nearbyHospitals: ['manipal-hospital-kr-puram', 'hoodi-hospital'],
        nearbyColleges: ['sea-college-engineering-kr-puram', 'gepce-kr-puram'],
        nearbyCompanies: ['google-bangalore', 'dell-technologies', 'amazon-bangalore', 'qualcomm-india'],
        keywords: {
            primary: 'PG in KR Puram',
            secondary: [
                'Best PG in KR Puram',
                'PG in KR Puram Bangalore',
                'coliving in KR Puram',
                'PG near KR Puram Railway Station'
            ],
            longTail: [
                'PG in KR Puram near metro station with food',
                'best ladies PG in KR Puram Bangalore',
                'single occupancy PG near Old Madras Road KR Puram',
                'affordable coliving space KR Puram'
            ],
            commercial: [
                'Luxury PG KR Puram',
                'PG near KR Puram Metro',
                'Coliving KR Puram',
                'PG near Bagmane Tech Park',
                'Budget PG KR Puram'
            ]
        },
        description:
            'KR Puram (Krishnarajapura) is a vital East Bangalore transit and residential hub featuring the KR Puram Railway Station and Purple Line Metro interchange. Offering seamless connectivity to Old Madras Road, Whitefield, and Manyata Tech Park, it combines affordability with accessibility.'
    },
    {
        id: 'loc-varthur',
        slug: 'varthur',
        name: 'Varthur',
        city: 'Bangalore',
        state: 'Karnataka',
        latitude: 12.9389,
        longitude: 77.7499,
        nearbyLocalities: ['whitefield', 'panathur', 'sarjapur-road', 'marathahalli', 'brookefield'],
        nearbyTechParks: ['itpl', 'rga-tech-park', 'wipro-sarjapur-campus', 'embassy-techvillage'],
        nearbyMetroStations: ['kadugodi-tree-park-metro', 'hopefarm-channasandra-metro', 'kundalahalli-metro'],
        nearbyHospitals: [
            'manipal-hospital-whitefield',
            'manipal-hospital-sarjapur-road',
            'vydehi-hospital-whitefield'
        ],
        nearbyColleges: ['krupanidhi-college-group', 'mvjce-whitefield', 'cmrit-whitefield'],
        nearbyCompanies: ['wipro', 'infosys', 'cisco-systems', 'tcs', 'amazon-bangalore'],
        keywords: {
            primary: 'PG in Varthur',
            secondary: [
                'Best PG in Varthur',
                'PG in Varthur Bangalore',
                'coliving in Varthur',
                'PG in Varthur Kodi'
            ],
            longTail: [
                'PG in Varthur near Whitefield with food and wifi',
                'best coliving space in Varthur Kodi Bangalore',
                'ladies PG in Varthur near ITPL and Wipro',
                'affordable working professional PG Varthur'
            ],
            commercial: [
                'Luxury PG Varthur',
                'PG near Varthur Kodi',
                'Coliving Varthur',
                'Affordable stay Varthur',
                'PG near Whitefield Varthur'
            ]
        },
        description:
            'Varthur is a scenic and rapidly developing eastern residential locality connecting Whitefield, Panathur, and Sarjapur Road. Surrounded by green spaces and Varthur Lake, it provides serene and affordable stay options close to major tech corridors.'
    },
    {
        id: 'loc-panathur',
        slug: 'panathur',
        name: 'Panathur',
        city: 'Bangalore',
        state: 'Karnataka',
        latitude: 12.9431,
        longitude: 77.7128,
        nearbyLocalities: ['kadubeesanahalli', 'marathahalli', 'varthur', 'brookefield', 'whitefield'],
        nearbyTechParks: ['embassy-techvillage', 'prestige-tech-park', 'cessna-business-park', 'kalyani-tech-park'],
        nearbyMetroStations: ['nallurhalli-metro', 'kadubeesanahalli-metro', 'kundalahalli-metro'],
        nearbyHospitals: [
            'sakra-world-hospital-bellandur',
            'vydehi-hospital-whitefield',
            'rainbow-childrens-hospital-marathahalli'
        ],
        nearbyColleges: ['new-horizon-college-engineering', 'cmrit-whitefield'],
        nearbyCompanies: ['jp-morgan', 'cisco-systems', 'goldman-sachs', 'flipkart', 'oracle-india'],
        keywords: {
            primary: 'PG in Panathur',
            secondary: [
                'Best PG in Panathur',
                'PG in Panathur Bangalore',
                'coliving in Panathur',
                'PG in Panathur Road'
            ],
            longTail: [
                'PG in Panathur Road near Embassy TechVillage with food',
                'luxury ladies PG in Panathur near Outer Ring Road',
                'best coliving space in Panathur for IT professionals',
                'single occupancy PG Panathur Bangalore'
            ],
            commercial: [
                'Luxury PG Panathur',
                'PG near Panathur Road',
                'Coliving Panathur',
                'PG near Embassy TechVillage Panathur',
                'Executive stay Panathur'
            ]
        },
        description:
            'Panathur is a strategic residential connector road linking Outer Ring Road (Kadubeesanahalli/Marathahalli) directly to Varthur and Whitefield. Highly sought after by professionals working in Embassy TechVillage, Prestige Tech Park, and Cessna Business Park.'
    },
    {
        id: 'loc-hoodi',
        slug: 'hoodi',
        name: 'Hoodi',
        city: 'Bangalore',
        state: 'Karnataka',
        latitude: 12.9918,
        longitude: 77.7169,
        nearbyLocalities: ['whitefield', 'mahadevapura', 'kr-puram', 'brookefield'],
        nearbyTechParks: ['itpl', 'bagmane-tech-park', 'rmz-infinity'],
        nearbyMetroStations: ['hoodi-metro', 'seetharamapalya-metro', 'garudacharapalya-metro'],
        nearbyHospitals: ['hoodi-hospital', 'manipal-hospital-whitefield', 'manipal-hospital-kr-puram'],
        nearbyColleges: ['gepce-kr-puram', 'mvjce-whitefield', 'cmrit-whitefield'],
        nearbyCompanies: ['tcs', 'sap-labs', 'samsung-r-d', 'amazon-bangalore', 'qualcomm-india'],
        keywords: {
            primary: 'PG in Hoodi',
            secondary: [
                'Best PG in Hoodi',
                'PG in Hoodi Bangalore',
                'coliving in Hoodi',
                'PG near Hoodi Circle'
            ],
            longTail: [
                'PG in Hoodi near Hoodi metro station with food',
                'best ladies PG in Hoodi Circle Bangalore',
                'single room PG near Graphite India Hoodi',
                'affordable coliving space Hoodi Whitefield road'
            ],
            commercial: [
                'Luxury PG Hoodi',
                'PG near Hoodi Metro',
                'Coliving Hoodi',
                'PG near Hoodi Circle',
                'Managed stay Hoodi'
            ]
        },
        description:
            'Hoodi is a thriving residential and industrial hub on Whitefield Main Road, home to Hoodi Metro Station and several corporate office parks. It offers seamless connectivity between KR Puram, Mahadevapura, and ITPL.'
    }
];

/**
 * Retrieve a locality from the SEO data layer by slug.
 */
export function getLocalityBySlug(slug: string): Locality | undefined {
    return SEO_LOCALITIES.find((loc) => loc.slug === slug);
}

/**
 * Retrieve a locality from the SEO data layer by ID.
 */
export function getLocalityById(id: string): Locality | undefined {
    return SEO_LOCALITIES.find((loc) => loc.id === id);
}

/**
 * Get all SEO localities in the central data layer.
 */
export function getAllLocalities(): Locality[] {
    return SEO_LOCALITIES;
}

/**
 * Retrieve SEO keywords for a specific locality slug.
 */
export function getLocalityKeywords(slug: string): LocalityKeywords | undefined {
    return getLocalityBySlug(slug)?.keywords;
}

/**
 * Get a fully hydrated locality where all relational string slugs are
 * resolved to their actual strongly typed data objects.
 */
export function getHydratedLocality(slug: string): HydratedLocality | undefined {
    const loc = getLocalityBySlug(slug);
    if (!loc) return undefined;

    const nearbyLocalities = loc.nearbyLocalities
        .map((s) => getLocalityBySlug(s))
        .filter((item): item is Locality => Boolean(item));

    const nearbyTechParks = loc.nearbyTechParks
        .map((s) => getSeoTechParkBySlug(s))
        .filter((item): item is TechPark => Boolean(item));

    const nearbyMetroStations = loc.nearbyMetroStations
        .map((s) => getMetroStationBySlug(s))
        .filter((item): item is MetroStation => Boolean(item));

    const nearbyHospitals = loc.nearbyHospitals
        .map((s) => getHospitalBySlug(s))
        .filter((item): item is Hospital => Boolean(item));

    const nearbyColleges = loc.nearbyColleges
        .map((s) => getCollegeBySlug(s))
        .filter((item): item is College => Boolean(item));

    const nearbyCompanies = loc.nearbyCompanies
        .map((s) => getCompanyBySlug(s))
        .filter((item): item is Company => Boolean(item));

    return {
        ...loc,
        nearbyLocalities,
        nearbyTechParks,
        nearbyMetroStations,
        nearbyHospitals,
        nearbyColleges,
        nearbyCompanies
    };
}
