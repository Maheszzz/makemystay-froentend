/**
 * Single source of truth for team / founder metadata.
 * Leave optional fields null until approved assets/URLs/quotes are supplied.
 */
export interface FounderProfile {
    name: string;
    role: string;
    bio: string;
    /** Path under /public/images/team/ when a real photo file is supplied. */
    photoSrc: string | null;
    /** Public LinkedIn URL when supplied. */
    linkedinUrl: string | null;
    /** Approved founder quote when supplied. */
    quote: string | null;
}

export const FOUNDER_PROFILE: FounderProfile = {
    name: 'Madhava R',
    role: 'Founder, MakeMyStay',
    bio: 'Madhava founded MakeMyStay with a mission to bring transparency, efficiency, and technology-driven solutions to the real estate ecosystem — making property discovery faster, simpler, and more reliable for modern customers.',
    photoSrc: null,
    linkedinUrl: null,
    quote: null,
};
