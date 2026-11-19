import type { Property } from '@/types/api';
import { normalizeFeatureKey } from '@/lib/propertyFeatures';

/**
 * Derived, display-only facts for listing cards. Everything here comes from real API fields;
 * when a field is absent the helper returns null / [] so the UI can hide the element.
 */

/** A listing counts as "newly verified" when last_verified_at is within this many days. */
export const NEWLY_VERIFIED_DAYS = 14;

export function isNewlyVerified(property: Pick<Property, 'last_verified_at'>, now: number = Date.now()): boolean {
    const raw = property.last_verified_at;
    if (!raw) return false;
    const t = new Date(raw).getTime();
    if (Number.isNaN(t)) return false;
    const ageDays = (now - t) / 86_400_000;
    return ageDays >= 0 && ageDays <= NEWLY_VERIFIED_DAYS;
}

/** Real uploaded photos only (the API mapper may substitute stock placeholders in `property.image`). */
export function getRealImages(property: Pick<Property, 'images'>, max = 6): string[] {
    const list = Array.isArray(property.images) ? property.images : [];
    const out: string[] = [];
    for (const raw of list) {
        const url = typeof raw === 'string' ? raw.trim() : '';
        if (url && !out.includes(url)) out.push(url);
        if (out.length >= max) break;
    }
    return out;
}

const MEALS_RE = /\b(food|meals?|breakfast|lunch|dinner)\b/;

/** Meals are only claimed when a feature says so (never inferred from the property type). */
export function hasRealMeals(property: Pick<Property, 'features'>): boolean {
    return (property.features ?? []).some((f) => MEALS_RE.test(normalizeFeatureKey(f)));
}

const REAL_SHARING = ['Single', 'Double', 'Triple'];

/** Sharing label from real price tiers only; the mapper's generic "Shared" fallback is ignored. */
export function getSharingLabel(property: Pick<Property, 'sharing'>): string | null {
    const real = (property.sharing ?? []).filter((s) => REAL_SHARING.includes(s));
    if (real.length === 0) return null;
    if (real.length === 1 && real[0] === 'Single') return 'Single room';
    return `${real.join(' / ')} sharing`;
}

export type AmenityIconKey =
    | 'wifi'
    | 'ac'
    | 'laundry'
    | 'housekeeping'
    | 'security'
    | 'meals'
    | 'power'
    | 'fridge'
    | 'lift'
    | 'hotwater'
    | 'tv'
    | 'parking'
    | 'gym'
    | 'kitchen'
    | 'generic';

interface AmenityDef {
    id: Exclude<AmenityIconKey, 'generic'>;
    label: string;
    test: RegExp;
}

/** Order here is the display priority (matches the target: Wi-Fi, AC, Laundry, Housekeeping, Security ...). */
const AMENITY_CATALOG: AmenityDef[] = [
    { id: 'wifi', label: 'Wi-Fi', test: /\b(wi ?fi|internet|broadband)\b/ },
    { id: 'ac', label: 'AC', test: /\b(ac|a c|air condition\w*)\b/ },
    { id: 'laundry', label: 'Laundry', test: /\b(laundry|washing machine)\b/ },
    { id: 'housekeeping', label: 'Housekeeping', test: /\b(housekeeping|room service|cleaning)\b/ },
    { id: 'security', label: 'Security', test: /\b(security|cctv|fingerprint|biometric)\b/ },
    { id: 'meals', label: 'Meals', test: MEALS_RE },
    { id: 'power', label: 'Power backup', test: /\bpower backup\b/ },
    { id: 'fridge', label: 'Fridge', test: /\b(refrigerator|fridge)\b/ },
    { id: 'lift', label: 'Lift', test: /\b(lift|elevator)\b/ },
    { id: 'hotwater', label: 'Hot water', test: /\b(geyser|hot water)\b/ },
    { id: 'tv', label: 'TV', test: /\b(tv|television)\b/ },
    { id: 'parking', label: 'Parking', test: /\bparking\b/ },
    { id: 'gym', label: 'Gym', test: /\bgym\b/ },
    { id: 'kitchen', label: 'Kitchen', test: /\bkitchen\b/ },
];

export interface AmenityTile {
    key: string;
    label: string;
    icon: AmenityIconKey;
}

function titleCase(key: string): string {
    return key
        .split(' ')
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}

/**
 * Up to `maxTiles` amenity tiles from real `features`, plus how many further distinct features exist.
 * Synonyms (wifi / high_speed_wifi, washing machine / washing_machine, ...) count once.
 */
export function getAmenityTiles(
    property: Pick<Property, 'features'>,
    maxTiles = 5,
): { tiles: AmenityTile[]; moreCount: number } {
    const keys = Array.from(
        new Set((property.features ?? []).map((f) => normalizeFeatureKey(f)).filter(Boolean)),
    );
    if (keys.length === 0) return { tiles: [], moreCount: 0 };

    const matched = new Map<AmenityDef['id'], AmenityDef>();
    const unmatched: string[] = [];
    for (const key of keys) {
        const def = AMENITY_CATALOG.find((d) => d.test.test(key));
        if (def) matched.set(def.id, def);
        else unmatched.push(key);
    }

    const ordered: AmenityTile[] = AMENITY_CATALOG.filter((d) => matched.has(d.id)).map((d) => ({
        key: d.id,
        label: d.label,
        icon: d.id,
    }));
    // Unmatched features become generic tiles unless they look like codes (e.g. "water supply 247");
    // those still count towards "+N more".
    let hiddenOnly = 0;
    for (const key of unmatched) {
        if (/\d/.test(key) || key.length > 22) hiddenOnly += 1;
        else ordered.push({ key: `x-${key}`, label: titleCase(key), icon: 'generic' });
    }

    const tiles = ordered.slice(0, maxTiles);
    return { tiles, moreCount: ordered.length - tiles.length + hiddenOnly };
}
