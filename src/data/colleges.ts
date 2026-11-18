/**
 * SEO Data Layer: Colleges & Educational Institutions
 * Single source of truth for universities, engineering colleges, and institutes in Bangalore.
 * Powering student PG guides, locality student scores, FAQ generation, and schema.
 */

export interface College {
    /** Unique internal identifier */
    id: string;
    /** URL-friendly slug */
    slug: string;
    /** Full official name of the university/college */
    name: string;
    /** Popular short abbreviation (e.g., CMRIT, NHCE, IIITB) */
    shortName?: string;
    /** Primary locality slug where the campus is located */
    locality: string;
    /** WGS84 geographical coordinates */
    coordinates: {
        latitude: number;
        longitude: number;
    };
    /** Main academic disciplines and degree programs offered */
    coursesOffered: string[];
    /** Official institution web URL */
    website?: string;
    /** Detailed SEO description of the institution and student stay needs */
    description: string;
    /** Student housing search keywords */
    keywords: string[];
}

export const COLLEGES: College[] = [
    {
        id: 'coll-cmrit',
        slug: 'cmrit-whitefield',
        name: 'CMR Institute of Technology (CMRIT)',
        shortName: 'CMRIT',
        locality: 'brookefield',
        coordinates: { latitude: 12.9698, longitude: 77.7163 },
        coursesOffered: ['B.E.', 'M.Tech', 'MBA', 'MCA', 'Ph.D.'],
        website: 'https://www.cmrit.ac.in',
        description: 'Premier autonomous engineering college located on AECS Layout Main Road in Brookefield / Whitefield with over 5,000 active students.',
        keywords: ['PG near CMRIT Bangalore', 'PG near CMRIT college Brookefield', 'student PG near CMRIT Whitefield', 'girls PG near CMRIT']
    },
    {
        id: 'coll-mvjce',
        slug: 'mvjce-whitefield',
        name: 'MVJ College of Engineering',
        shortName: 'MVJCE',
        locality: 'whitefield',
        coordinates: { latitude: 12.9982, longitude: 77.7612 },
        coursesOffered: ['B.E.', 'M.Tech', 'MBA'],
        website: 'https://www.mvjce.edu.in',
        description: 'Established engineering college in Channasandra near Whitefield Railway Station known for aeronautical and computer science engineering.',
        keywords: ['PG near MVJ College of Engineering', 'PG near MVJCE Whitefield', 'student stay near MVJ college']
    },
    {
        id: 'coll-nhce',
        slug: 'new-horizon-college-engineering',
        name: 'New Horizon College of Engineering (NHCE)',
        shortName: 'NHCE',
        locality: 'kadubeesanahalli',
        coordinates: { latitude: 12.9348, longitude: 77.6912 },
        coursesOffered: ['B.E.', 'M.Tech', 'MBA', 'MCA'],
        website: 'https://newhorizonindia.edu/ncesg',
        description: 'Top-ranking autonomous engineering college situated on Outer Ring Road in Kadubeesanahalli / Marathahalli IT corridor.',
        keywords: ['PG near NHCE Bangalore', 'PG near New Horizon College Kadubeesanahalli', 'student PG near NHCE ORR', 'boys PG near New Horizon']
    },
    {
        id: 'coll-nhcm',
        slug: 'new-horizon-college-marathahalli',
        name: 'New Horizon College Marathahalli',
        shortName: 'NHCM',
        locality: 'marathahalli',
        coordinates: { latitude: 12.9355, longitude: 77.6925 },
        coursesOffered: ['BBA', 'BCA', 'B.Com'],
        website: 'https://newhorizonindia.edu/nhcm',
        description: 'Affiliated degree college offering management and commerce undergraduate courses on the New Horizon Marathahalli ORR campus.',
        keywords: ['PG near New Horizon Marathahalli', 'student PG in Marathahalli for college', 'BBA BCA stay Marathahalli']
    },
    {
        id: 'coll-krupanidhi',
        slug: 'krupanidhi-college-group',
        name: 'Krupanidhi Group of Institutions',
        shortName: 'Krupanidhi',
        locality: 'sarjapur-road',
        coordinates: { latitude: 12.9089, longitude: 77.7123 },
        coursesOffered: ['Pharmacy', 'Physiotherapy', 'Nursing', 'Management', 'Degree'],
        website: 'https://www.krupanidhi.edu.in',
        description: '11-acre green campus located in Carmelaram off Sarjapur Road offering pharmacy, physiotherapy, nursing, and business management courses.',
        keywords: ['PG near Krupanidhi College', 'PG near Krupanidhi Carmelaram', 'student PG near Sarjapur Road colleges']
    },
    {
        id: 'coll-st-johns-medical',
        slug: 'st-johns-medical-college',
        name: "St. John's Medical College",
        shortName: 'SJMC',
        locality: 'koramangala',
        coordinates: { latitude: 12.9302, longitude: 77.6215 },
        coursesOffered: ['MBBS', 'MD', 'MS', 'B.Sc Nursing'],
        website: 'https://www.stjohns.in',
        description: 'One of India premier medical colleges located in Koramangala / John Nagar with thousands of medical students, interns, and residents.',
        keywords: ['PG near St Johns Medical College', 'PG near SJMC Koramangala', 'medical student PG Koramangala']
    },
    {
        id: 'coll-christ-university',
        slug: 'christ-university-central',
        name: 'Christ University (Central Campus)',
        shortName: 'Christ',
        locality: 'koramangala',
        coordinates: { latitude: 12.9342, longitude: 77.6065 },
        coursesOffered: ['BBA', 'B.Com', 'BA', 'B.Sc', 'MBA', 'Law'],
        website: 'https://christuniversity.in',
        description: 'Iconic multidisciplinary deemed university campus on Hosur Road near Koramangala attracting students from across India and abroad.',
        keywords: ['PG near Christ University Bangalore', 'PG near Christ University Koramangala', 'student coliving near Christ Hosur Road', 'girls PG near Christ University']
    },
    {
        id: 'coll-jyoti-nivas',
        slug: 'jyoti-nivas-college',
        name: 'Jyoti Nivas College Autonomous',
        shortName: 'JNC',
        locality: 'koramangala',
        coordinates: { latitude: 12.9351, longitude: 77.6189 },
        coursesOffered: ['BA', 'B.Sc', 'B.Com', 'BBA', 'MCA', 'MBA'],
        website: 'https://jyotinivas.org',
        description: 'Prestigious women autonomous college in Koramangala 5th Block offering undergraduate and postgraduate education in arts and sciences.',
        keywords: ['PG near Jyoti Nivas College', 'girls PG near JNC Koramangala', 'ladies PG near Jyoti Nivas Bangalore']
    },
    {
        id: 'coll-nift',
        slug: 'nift-bangalore',
        name: 'National Institute of Fashion Technology (NIFT)',
        shortName: 'NIFT',
        locality: 'hsr-layout',
        coordinates: { latitude: 12.9125, longitude: 77.6418 },
        coursesOffered: ['B.F.Tech', 'B.Des', 'M.Des', 'M.F.M'],
        website: 'https://www.nift.ac.in/bengaluru',
        description: 'Premier national fashion and design institute campus located in HSR Layout Sector 1.',
        keywords: ['PG near NIFT Bangalore', 'PG near NIFT HSR Layout', 'design student PG HSR Layout', 'girls PG near NIFT Bangalore']
    },
    {
        id: 'coll-oxford-hsr',
        slug: 'oxford-college-hsr',
        name: 'The Oxford College of Engineering & Science',
        shortName: 'Oxford College',
        locality: 'hsr-layout',
        coordinates: { latitude: 12.9045, longitude: 77.6321 },
        coursesOffered: ['B.E.', 'MBA', 'MCA', 'B.Sc', 'M.Sc'],
        website: 'http://www.theoxford.edu',
        description: 'Massive multidisciplinary campus in Bommanahalli / HSR Layout Sector 4 offering engineering, science, and management degrees.',
        keywords: ['PG near Oxford College HSR Layout', 'PG near Oxford College Bommanahalli', 'student PG near Oxford Engineering']
    },
    {
        id: 'coll-pes-ecity',
        slug: 'pes-university-ecity',
        name: 'PES University (Electronic City Campus)',
        shortName: 'PESU EC Campus',
        locality: 'electronic-city',
        coordinates: { latitude: 12.8623, longitude: 77.6654 },
        coursesOffered: ['B.Tech', 'M.Tech', 'MBA'],
        website: 'https://www.pes.edu',
        description: 'Modern engineering campus of PES University located on Hosur Road in Electronic City with strong computer science and electronics programs.',
        keywords: ['PG near PES University Electronic City', 'PG near PES EC campus', 'student PG near PESU Electronic City']
    },
    {
        id: 'coll-iiitb',
        slug: 'iiit-bangalore',
        name: 'International Institute of Information Technology Bangalore (IIIT-B)',
        shortName: 'IIIT-B',
        locality: 'electronic-city',
        coordinates: { latitude: 12.8448, longitude: 77.6632 },
        coursesOffered: ['Integrated M.Tech', 'M.Tech', 'M.Sc', 'Ph.D.'],
        website: 'https://www.iiitb.ac.in',
        description: 'Premier graduate school and research institute in Electronic City Phase 1 specializing in computer science and data sciences.',
        keywords: ['PG near IIIT Bangalore', 'PG near IIITB Electronic City', 'research scholar PG Electronic City']
    },
    {
        id: 'coll-ifim',
        slug: 'ifim-business-school-ecity',
        name: 'JAGSoM / IFIM College',
        shortName: 'IFIM',
        locality: 'electronic-city',
        coordinates: { latitude: 12.8461, longitude: 77.6689 },
        coursesOffered: ['PGDM', 'MBA', 'BBA', 'B.Com', 'Law'],
        website: 'https://ifim.edu.in',
        description: 'AACSB-accredited business school and degree college located in Electronic City Phase 1.',
        keywords: ['PG near IFIM College Electronic City', 'PG near JAGSoM Bangalore', 'management student PG Electronic City']
    },
    {
        id: 'coll-amrita',
        slug: 'amrita-school-engineering-kasavanahalli',
        name: 'Amrita School of Engineering Bangalore',
        shortName: 'Amrita',
        locality: 'sarjapur-road',
        coordinates: { latitude: 12.9012, longitude: 77.6745 },
        coursesOffered: ['B.Tech', 'M.Tech', 'MBA', 'Ph.D.'],
        website: 'https://www.amrita.edu/campus/bengaluru',
        description: 'Green engineering campus of Amrita Vishwa Vidyapeetham situated in Kasavanahalli off Sarjapur Road.',
        keywords: ['PG near Amrita College Bangalore', 'PG near Amrita School of Engineering Kasavanahalli', 'student stay near Sarjapur Road Amrita']
    },
    {
        id: 'coll-gopalan',
        slug: 'gepce-kr-puram',
        name: 'Gopalan College of Engineering and Management',
        shortName: 'GCEM',
        locality: 'hoodi',
        coordinates: { latitude: 12.9898, longitude: 77.7089 },
        coursesOffered: ['B.E.', 'MBA'],
        website: 'https://www.gopalancolleges.com/gcem',
        description: 'Engineering and management institute located in Whitefield / Hoodi near Gopalan Global Axis.',
        keywords: ['PG near Gopalan College of Engineering', 'PG near GCEM Hoodi', 'student stay near Hoodi college']
    },
    {
        id: 'coll-sea-kr-puram',
        slug: 'sea-college-engineering-kr-puram',
        name: 'SEA College of Engineering & Technology',
        shortName: 'SEACET',
        locality: 'kr-puram',
        coordinates: { latitude: 13.0112, longitude: 77.7123 },
        coursesOffered: ['B.E.', 'MBA', 'M.Tech'],
        website: 'https://www.seaedu.ac.in',
        description: 'Established technical institution in Ekta Nagar / Virgonagar near KR Puram.',
        keywords: ['PG near SEA College KR Puram', 'student PG near SEA College of Engineering', 'stay near KR Puram engineering college']
    }
];

/**
 * Get a college by its slug.
 */
export function getCollegeBySlug(slug: string): College | undefined {
    return COLLEGES.find((coll) => coll.slug === slug);
}

/**
 * Get a college by its ID.
 */
export function getCollegeById(id: string): College | undefined {
    return COLLEGES.find((coll) => coll.id === id);
}

/**
 * Get colleges by locality slug.
 */
export function getCollegesByLocality(localitySlug: string): College[] {
    return COLLEGES.filter((coll) => coll.locality === localitySlug);
}

/**
 * Get all colleges in the SEO data layer.
 */
export function getAllColleges(): College[] {
    return COLLEGES;
}
