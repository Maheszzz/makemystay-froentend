import { bellandurProfile } from './bellandur';
import type { LocalityAuthorityProfile } from './types';

export const AUTHORITY_PROFILES: Record<string, LocalityAuthorityProfile> = {
    'bellandur': bellandurProfile
};

export function getAuthorityProfile(slug: string): LocalityAuthorityProfile | undefined {
    return AUTHORITY_PROFILES[slug];
}
