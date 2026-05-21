import { SITE_URL } from '@/lib/siteConfig';

/** Logo served from `public/logo.svg` (works in Next.js dev + production). */
export const BRAND_LOGO_PATH = '/logo.svg';

export function brandLogoUrl(origin?: string): string {
    const base = origin ?? (typeof window !== 'undefined' ? window.location.origin : SITE_URL);
    return `${base}${BRAND_LOGO_PATH}`;
}
