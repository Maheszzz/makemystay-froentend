import { normalizeDisplayName } from '@/lib/displayName';

/**
 * Title-case each whitespace-delimited word for on-screen property names and fix
 * acronym casing (PG, BHK, AC, RO) via the shared `normalizeDisplayName` helper.
 * Does not change API payloads or URL slug generation — use raw title for routing.
 */
export function formatPropertyTitle(raw: string | undefined | null): string {
    return normalizeDisplayName(raw);
}

/** "1 Review" vs "N Reviews" for UI copy */
export function reviewsLabel(count: number): string {
    const n = Math.max(0, Math.floor(Number(count) || 0));
    return n === 1 ? '1 Review' : `${n} Reviews`;
}
