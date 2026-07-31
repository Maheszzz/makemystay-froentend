/**
 * EEAT & Search Console Optimization Engine: Trust Signals
 * Provides reusable trust blocks and verification badges across all pages
 * (Verified Properties, Physical Verification, Zero Brokerage, 24/7 Support,
 * Resident Reviews, Safety Standards, Transparent Pricing, Professional Photography).
 */

export interface TrustSignalBlock {
    id: string;
    title: string;
    badge: string;
    description: string;
    verificationMethod: string;
    iconName: string;
}

const TRUST_SIGNALS: TrustSignalBlock[] = [
    {
        id: 'verified_properties',
        title: 'Verified Properties',
        badge: '100% Legally Checked',
        description: 'Every property on MakeMyStay undergoes ownership check and RERA compliance audit.',
        verificationMethod: 'Legal title deed inspection by our legal team.',
        iconName: 'ShieldCheckIcon'
    },
    {
        id: 'physical_verification',
        title: 'Physical Verification',
        badge: '50-Point Audit',
        description: 'Our ground team inspects every room, bathroom, kitchen, and security feature in person.',
        verificationMethod: 'On-site 50-point checklist inspection prior to listing.',
        iconName: 'CheckBadgeIcon'
    },
    {
        id: 'zero_brokerage',
        title: 'Zero Brokerage',
        badge: 'Direct Booking',
        description: 'Book your coliving stay directly with verified property managers with 0 broker commission.',
        verificationMethod: 'Direct agreement between resident and verified operator.',
        iconName: 'CurrencyRupeeIcon'
    },
    {
        id: 'support_24_7',
        title: '24/7 Support',
        badge: 'Dedicated Helpdesk',
        description: 'Our customer support team is available round the clock for maintenance or emergency help.',
        verificationMethod: '24/7 ticket SLA monitoring and escalation protocols.',
        iconName: 'PhoneIcon'
    },
    {
        id: 'resident_reviews',
        title: 'Resident Reviews',
        badge: 'Verified Tenants Only',
        description: 'All reviews are submitted by authenticated residents who have stayed at the property.',
        verificationMethod: 'Booking ID verification required for rating submission.',
        iconName: 'StarIcon'
    },
    {
        id: 'safety_standards',
        title: 'Safety Standards',
        badge: 'Bio-metric & CCTV',
        description: 'Mandatory 24x7 CCTV surveillance, biometric entry, and background-verified staff.',
        verificationMethod: 'Security audit during quarterly ground inspections.',
        iconName: 'LockClosedIcon'
    },
    {
        id: 'transparent_pricing',
        title: 'Transparent Pricing',
        badge: 'No Hidden Charges',
        description: 'Clear breakdown of monthly rent, security deposit, electricity meters, and food plans.',
        verificationMethod: 'Standardized digital rental agreement terms.',
        iconName: 'DocumentTextIcon'
    },
    {
        id: 'professional_photography',
        title: 'Professional Photography',
        badge: '100% Real Photos',
        description: 'What you see is what you get. Every photo is taken by our team without misleading filters.',
        verificationMethod: 'Timestamped and geotagged visual verification.',
        iconName: 'CameraIcon'
    }
];

/**
 * Returns all 8 standardized trust signals.
 */
export function getAllTrustSignals(): TrustSignalBlock[] {
    return TRUST_SIGNALS;
}

/**
 * Returns tailored trust blocks for specific page archetypes.
 */
export function getTrustSignalsByPageType(pageType: 'locality' | 'property' | 'blog' | 'landing'): TrustSignalBlock[] {
    switch (pageType) {
        case 'property':
            return TRUST_SIGNALS.filter(t => [
                'physical_verification',
                'zero_brokerage',
                'safety_standards',
                'transparent_pricing'
            ].includes(t.id));
        case 'locality':
        case 'landing':
            return TRUST_SIGNALS.filter(t => [
                'verified_properties',
                'zero_brokerage',
                'resident_reviews',
                'safety_standards'
            ].includes(t.id));
        case 'blog':
        default:
            return TRUST_SIGNALS.filter(t => [
                'verified_properties',
                'physical_verification',
                'zero_brokerage',
                'support_24_7'
            ].includes(t.id));
    }
}

/**
 * Generates an ItemList schema object representing verified trust signals for search engines.
 */
export function generateTrustSchema(): Record<string, any> {
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'MakeMyStay Trust & Verification Standards',
        description: 'Our verified 50-point inspection and tenant safety commitments.',
        numberOfItems: TRUST_SIGNALS.length,
        itemListElement: TRUST_SIGNALS.map((signal, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: signal.title,
            description: `${signal.badge}: ${signal.description}`
        }))
    };
}
