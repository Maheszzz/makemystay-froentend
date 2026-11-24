/**
 * EEAT & Search Console Optimization Engine: Author System
 * Provides reusable author, reviewer, and publisher profiles with credentials,
 * experience, and schema-ready JSON-LD to establish Experience, Expertise,
 * Authoritativeness, and Trust across all guides and articles.
 */

import { SITE_URL, LEGAL_ENTITY_NAME } from '@/lib/siteConfig';

export interface AuthorProfile {
    id: string;
    name: string;
    role: string;
    experienceYears: number;
    credentials: string[];
    bio: string;
    avatarUrl: string;
    organization: string;
    socialLinks?: {
        linkedin?: string;
        twitter?: string;
    };
}

export interface EeatAuthorMetadata {
    author: AuthorProfile;
    reviewer: AuthorProfile;
    lastReviewedDate: string;
    organization: string;
    publisher: {
        name: string;
        url: string;
        logoUrl: string;
    };
    schemaJsonLd: Record<string, any>;
}

const AUTHORS: Record<string, AuthorProfile> = {
    'arjun-rao': {
        id: 'arjun-rao',
        name: 'Arjun Rao',
        role: 'Real Estate & Coliving Research Lead',
        experienceYears: 8,
        credentials: [
            'RERA Certified Real Estate Advisor',
            'Bangalore Rental Market Specialist',
            'Senior Urban Housing Analyst'
        ],
        bio: 'Arjun Rao leads rental market intelligence at MakeMyStay, analyzing Bangalore coliving pricing trends, commute times, and locality safety ratings.',
        avatarUrl: `${SITE_URL}/images/authors/arjun-rao.jpg`,
        organization: LEGAL_ENTITY_NAME,
        socialLinks: {
            linkedin: 'https://www.linkedin.com/company/makemystay-realty/',
            twitter: 'https://twitter.com/Makemystay16268'
        }
    },
    'priya-sharma': {
        id: 'priya-sharma',
        name: 'Priya Sharma',
        role: 'Legal & Property Verification Head',
        experienceYears: 10,
        credentials: [
            'LL.B Real Estate Property Law',
            '50-Point Physical Verification Specialist',
            'Tenant Safety & Rights Consultant'
        ],
        bio: 'Priya Sharma oversees property compliance and physical verification protocols for MakeMyStay across Bangalore, Pune, and Hyderabad.',
        avatarUrl: `${SITE_URL}/images/authors/priya-sharma.jpg`,
        organization: LEGAL_ENTITY_NAME,
        socialLinks: {
            linkedin: 'https://www.linkedin.com/company/makemystay-realty/'
        }
    }
};

/**
 * Returns an author profile by ID or falls back to the primary research lead.
 */
export function getAuthorProfile(id = 'arjun-rao'): AuthorProfile {
    return AUTHORS[id] || AUTHORS['arjun-rao'];
}

/**
 * Returns an expert reviewer profile by ID or falls back to the verification head.
 */
export function getReviewerProfile(id = 'priya-sharma'): AuthorProfile {
    return AUTHORS[id] || AUTHORS['priya-sharma'];
}

/**
 * Generates complete EEAT author, reviewer, and publisher metadata with Article Schema JSON-LD.
 */
export function generateEeatAuthorMetadata(
    customAuthorId = 'arjun-rao',
    customReviewerId = 'priya-sharma',
    lastReviewedDate = '2026-07-31'
): EeatAuthorMetadata {
    const author = getAuthorProfile(customAuthorId);
    const reviewer = getReviewerProfile(customReviewerId);

    const publisher = {
        name: LEGAL_ENTITY_NAME,
        url: SITE_URL,
        logoUrl: `${SITE_URL}/logo.png`
    };

    const schemaJsonLd: Record<string, any> = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        author: {
            '@type': 'Person',
            name: author.name,
            jobTitle: author.role,
            worksFor: {
                '@type': 'Organization',
                name: author.organization
            },
            description: author.bio
        },
        reviewedBy: {
            '@type': 'Person',
            name: reviewer.name,
            jobTitle: reviewer.role,
            worksFor: {
                '@type': 'Organization',
                name: reviewer.organization
            }
        },
        publisher: {
            '@type': 'Organization',
            name: publisher.name,
            url: publisher.url,
            logo: {
                '@type': 'ImageObject',
                url: publisher.logoUrl
            }
        },
        dateModified: lastReviewedDate
    };

    return {
        author,
        reviewer,
        lastReviewedDate,
        organization: LEGAL_ENTITY_NAME,
        publisher,
        schemaJsonLd
    };
}
