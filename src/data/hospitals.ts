/**
 * SEO Data Layer: Hospitals
 * Single source of truth for major hospitals and emergency medical infrastructure in Bangalore.
 * Powering locality guides, local area trust signals, structured schema, and FAQs.
 */

export interface Hospital {
    /** Unique internal identifier */
    id: string;
    /** URL-friendly slug */
    slug: string;
    /** Official hospital name */
    name: string;
    /** Primary locality slug where the hospital is situated */
    locality: string;
    /** WGS84 geographical coordinates */
    coordinates: {
        latitude: number;
        longitude: number;
    };
    /** Major medical specialties and departments */
    specialties: string[];
    /** Whether 24/7 emergency and trauma care is available */
    emergency24x7: boolean;
    /** Detailed SEO description of the medical facility */
    description: string;
    /** Search keywords associated with this hospital and nearby accommodation */
    keywords: string[];
}

export const HOSPITALS: Hospital[] = [
    {
        id: 'hosp-manipal-whitefield',
        slug: 'manipal-hospital-whitefield',
        name: 'Manipal Hospital Whitefield',
        locality: 'whitefield',
        coordinates: { latitude: 12.9865, longitude: 77.7321 },
        specialties: ['Cardiology', 'Neurology', 'Orthopedics', 'Emergency Medicine', 'Oncology'],
        emergency24x7: true,
        description: 'Leading multispeciality tertiary care hospital located on ITPL Main Road in Whitefield with comprehensive 24/7 emergency services.',
        keywords: ['PG near Manipal Hospital Whitefield', 'PG near ITPL hospital Bangalore', 'medical stay Whitefield']
    },
    {
        id: 'hosp-vydehi-whitefield',
        slug: 'vydehi-hospital-whitefield',
        name: 'Vydehi Institute of Medical Sciences & RC',
        locality: 'whitefield',
        coordinates: { latitude: 12.9754, longitude: 77.7281 },
        specialties: ['General Medicine', 'Surgery', 'Cardiology', 'Oncology', 'Pediatrics'],
        emergency24x7: true,
        description: '1600-bed multispeciality hospital and medical college in Nallurhalli / Whitefield offering advanced medical care and trauma services.',
        keywords: ['PG near Vydehi Hospital', 'PG near Vydehi Medical College Whitefield', 'stay near Vydehi hospital']
    },
    {
        id: 'hosp-sathya-sai-whitefield',
        slug: 'sri-sathya-sai-hospital-whitefield',
        name: 'Sri Sathya Sai Institute of Higher Medical Sciences',
        locality: 'whitefield',
        coordinates: { latitude: 12.9812, longitude: 77.7423 },
        specialties: ['Cardiology', 'Cardiac Surgery', 'Neurology', 'Neurosurgery'],
        emergency24x7: true,
        description: 'World-renowned super-speciality hospital in Whitefield providing free tertiary medical care in cardiology and neurosciences.',
        keywords: ['PG near Sathya Sai Hospital Whitefield', 'PG near Sathya Sai ashram Bangalore', 'stay near Sai hospital Whitefield']
    },
    {
        id: 'hosp-rxdx-whitefield',
        slug: 'rxdx-healthcare-whitefield',
        name: 'RXDx Healthcare Whitefield',
        locality: 'brookefield',
        coordinates: { latitude: 12.9685, longitude: 77.7145 },
        specialties: ['Primary Care', 'Diagnostics', 'Pediatrics', 'Physiotherapy'],
        emergency24x7: false,
        description: 'Multi-speciality diagnostic and primary healthcare clinic located in Brookefield along the Whitefield IT corridor.',
        keywords: ['PG near RXDx Brookefield', 'clinic near Brookefield PG', 'healthcare Brookefield Bangalore']
    },
    {
        id: 'hosp-sakra-bellandur',
        slug: 'sakra-world-hospital-bellandur',
        name: 'Sakra World Hospital',
        locality: 'bellandur',
        coordinates: { latitude: 12.9321, longitude: 77.6854 },
        specialties: ['Orthopedics', 'Neurosciences', 'Cardiac Sciences', 'Gastroenterology', 'Renal Sciences'],
        emergency24x7: true,
        description: 'Indo-Japanese premier multispeciality hospital on Outer Ring Road (ORR) opposite RMZ Ecospace in Bellandur / Kadubeesanahalli.',
        keywords: ['PG near Sakra World Hospital', 'PG near Sakra Hospital Bellandur', 'PG near ORR hospital Bangalore']
    },
    {
        id: 'hosp-cloudnine-bellandur',
        slug: 'cloudnine-hospital-bellandur',
        name: 'Cloudnine Hospital Bellandur',
        locality: 'bellandur',
        coordinates: { latitude: 12.9285, longitude: 77.6782 },
        specialties: ['Maternity', 'Gynecology', 'Pediatrics', 'Neonatal Care'],
        emergency24x7: true,
        description: 'Specialty mother and childcare healthcare center located on Outer Ring Road in Bellandur.',
        keywords: ['PG near Cloudnine Bellandur', 'maternity hospital Bellandur PG', 'stay near Cloudnine ORR']
    },
    {
        id: 'hosp-manipal-sarjapur',
        slug: 'manipal-hospital-sarjapur-road',
        name: 'Manipal Hospital Sarjapur Road',
        locality: 'sarjapur-road',
        coordinates: { latitude: 12.9145, longitude: 77.6754 },
        specialties: ['Emergency Medicine', 'Orthopedics', 'Cardiology', 'Internal Medicine'],
        emergency24x7: true,
        description: 'Advanced tertiary care hospital serving residents and IT professionals along the Sarjapur Road and Doddakannelli corridor.',
        keywords: ['PG near Manipal Hospital Sarjapur Road', 'hospital near Sarjapur road PG', 'emergency care Sarjapur']
    },
    {
        id: 'hosp-motherhood-sarjapur',
        slug: 'motherhood-hospital-sarjapur-road',
        name: 'Motherhood Hospital Sarjapur Road',
        locality: 'sarjapur-road',
        coordinates: { latitude: 12.9189, longitude: 77.6698 },
        specialties: ['Obstetrics', 'Gynecology', 'Pediatrics', 'Neonatology'],
        emergency24x7: true,
        description: 'Comprehensive women and childcare speciality hospital on Sarjapur Road near Kaikondrahalli.',
        keywords: ['PG near Motherhood Sarjapur', 'women healthcare Sarjapur Road PG', 'stay near Motherhood hospital']
    },
    {
        id: 'hosp-narayana-hsr',
        slug: 'narayana-multispeciality-hsr',
        name: 'Narayana Multispeciality Hospital HSR Layout',
        locality: 'hsr-layout',
        coordinates: { latitude: 12.9102, longitude: 77.6415 },
        specialties: ['Cardiology', 'Orthopedics', 'General Surgery', 'Gastroenterology'],
        emergency24x7: true,
        description: 'Prominent multispeciality hospital in HSR Layout Sector 3 offering comprehensive diagnosis, treatment, and emergency care.',
        keywords: ['PG near Narayana Hospital HSR Layout', 'hospital in HSR Layout PG', 'medical care HSR Sector 3']
    },
    {
        id: 'hosp-st-johns-koramangala',
        slug: 'st-johns-medical-college-hospital',
        name: "St. John's Medical College Hospital",
        locality: 'koramangala',
        coordinates: { latitude: 12.9298, longitude: 77.6201 },
        specialties: ['Oncology', 'Nephrology', 'Cardiology', 'Trauma & Emergency', 'Pediatrics'],
        emergency24x7: true,
        description: 'Historic 1350-bed teaching hospital in Koramangala / John Nagar providing affordable, world-class medical treatment across specialties.',
        keywords: ['PG near St Johns Hospital Koramangala', 'PG near St Johns Medical College', 'stay near St Johns Bangalore']
    },
    {
        id: 'hosp-rainbow-marathahalli',
        slug: 'rainbow-childrens-hospital-marathahalli',
        name: "Rainbow Children's Hospital Marathahalli",
        locality: 'marathahalli',
        coordinates: { latitude: 12.9542, longitude: 77.7018 },
        specialties: ['Pediatrics', 'Neonatology', 'Pediatric Surgery', 'Obstetrics'],
        emergency24x7: true,
        description: 'Dedicated children and maternity hospital located near Marathahalli bridge along Outer Ring Road.',
        keywords: ['PG near Rainbow Hospital Marathahalli', 'pediatric hospital Marathahalli PG', 'stay near Rainbow ORR']
    },
    {
        id: 'hosp-kauvery-electronic-city',
        slug: 'kauvery-hospital-electronic-city',
        name: 'Kauvery Hospital Electronic City',
        locality: 'electronic-city',
        coordinates: { latitude: 12.8432, longitude: 77.6715 },
        specialties: ['Emergency & Trauma', 'Cardiology', 'Orthopedics', 'Neurology'],
        emergency24x7: true,
        description: 'Modern multispeciality hospital in Electronic City Phase 1 serving IT campus employees and South Bangalore residents.',
        keywords: ['PG near Kauvery Hospital Electronic City', 'hospital Electronic City Phase 1 PG', 'emergency hospital E-City']
    },
    {
        id: 'hosp-narayana-health-city',
        slug: 'narayana-health-city-electronic-city',
        name: 'Narayana Health City (Mazumdar Shaw Medical Center)',
        locality: 'electronic-city',
        coordinates: { latitude: 12.8123, longitude: 77.6912 },
        specialties: ['Cardiac Surgery', 'Oncology', 'Organ Transplant', 'Neurosurgery'],
        emergency24x7: true,
        description: 'Massive medical city in Bommasandra / Electronic City comprising Narayana Institute of Cardiac Sciences and Mazumdar Shaw Medical Center.',
        keywords: ['PG near Narayana Health City Bangalore', 'PG near Bommasandra hospital', 'stay near Mazumdar Shaw hospital']
    },
    {
        id: 'hosp-manipal-kr-puram',
        slug: 'manipal-hospital-kr-puram',
        name: 'Manipal Hospital KR Puram',
        locality: 'kr-puram',
        coordinates: { latitude: 13.0045, longitude: 77.6821 },
        specialties: ['Internal Medicine', 'General Surgery', 'Orthopedics', 'Emergency Care'],
        emergency24x7: true,
        description: 'Multispeciality hospital serving KR Puram, Old Madras Road, and Hoodi residential communities.',
        keywords: ['PG near Manipal Hospital KR Puram', 'hospital near KR Puram PG', 'emergency hospital KR Puram']
    },
    {
        id: 'hosp-brookefield',
        slug: 'brookefield-hospital',
        name: 'Brookefield Hospital',
        locality: 'brookefield',
        coordinates: { latitude: 12.9667, longitude: 77.7189 },
        specialties: ['General Medicine', 'Orthopedics', 'Gynecology', 'Pediatrics'],
        emergency24x7: true,
        description: 'Reliable neighborhood multispeciality hospital in Brookefield serving IT professionals and residents along ITPL road.',
        keywords: ['PG near Brookefield Hospital', 'hospital in Brookefield Bangalore PG', 'medical care Brookefield']
    },
    {
        id: 'hosp-aaxis-hoodi',
        slug: 'hoodi-hospital',
        name: 'Aaxis Hospitals Hoodi',
        locality: 'hoodi',
        coordinates: { latitude: 12.9918, longitude: 77.7142 },
        specialties: ['Emergency Care', 'Orthopedics', 'General Surgery', 'Internal Medicine'],
        emergency24x7: true,
        description: '24/7 multispeciality emergency and surgical hospital located near Hoodi circle on Whitefield main road.',
        keywords: ['PG near Aaxis Hospital Hoodi', 'hospital near Hoodi circle PG', 'medical center Hoodi Bangalore']
    }
];

/**
 * Get a hospital by its slug.
 */
export function getHospitalBySlug(slug: string): Hospital | undefined {
    return HOSPITALS.find((hosp) => hosp.slug === slug);
}

/**
 * Get a hospital by its ID.
 */
export function getHospitalById(id: string): Hospital | undefined {
    return HOSPITALS.find((hosp) => hosp.id === id);
}

/**
 * Get hospitals by locality slug.
 */
export function getHospitalsByLocality(localitySlug: string): Hospital[] {
    return HOSPITALS.filter((hosp) => hosp.locality === localitySlug);
}

/**
 * Get all hospitals in the SEO data layer.
 */
export function getAllHospitals(): Hospital[] {
    return HOSPITALS;
}
