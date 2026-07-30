import { mapRealtyToProperty } from '@/lib/api/properties';
import { resolveServerApiBase } from '@/lib/server/apiBase';
import type { Property, RealtyProperty } from '@/types/api';

function unwrapApiPayload<T>(payload: unknown): T | null {
    if (!payload || typeof payload !== 'object') return null;
    const o = payload as Record<string, unknown>;
    if (o.success === true && o.data && typeof o.data === 'object') {
        return o.data as T;
    }
    return o as T;
}

export async function fetchPropertyByIdServer(id: string): Promise<Property | null> {
    const trimmed = id.trim();
    if (!trimmed || !/^\d+$/.test(trimmed)) return null;
    const base = resolveServerApiBase();
    const url = `${base}/realty/properties/${encodeURIComponent(trimmed)}`;
    try {
        const res = await fetch(url, {
            headers: { Accept: 'application/json' },
            next: { revalidate: 3600 },
        });
        if (!res.ok) return null;
        const payload = await res.json();
        const row = unwrapApiPayload<RealtyProperty>(payload);
        if (!row?.id) return null;
        return mapRealtyToProperty(row);
    } catch {
        return null;
    }
}

/** Server-only property fetch by legacy slug for `generateMetadata` fallback. */
export async function fetchPropertyBySlugServer(type: string, slug: string): Promise<Property | null> {
    const trimmedType = type.trim();
    const trimmedSlug = slug.trim();
    if (!trimmedType || !trimmedSlug) return null;
    const base = resolveServerApiBase();
    const url = `${base}/realty/properties/by-slug/${encodeURIComponent(trimmedType)}/${encodeURIComponent(trimmedSlug)}`;
    try {
        const res = await fetch(url, {
            headers: { Accept: 'application/json' },
            next: { revalidate: 3600 },
        });
        if (!res.ok) return null;
        const payload = await res.json();
        const row = unwrapApiPayload<RealtyProperty>(payload);
        if (!row?.id) return null;
        return mapRealtyToProperty(row);
    } catch {
        return null;
    }
}

/** Server-only property fetch by public slug using Sprint 10 unified public endpoint. */
export async function fetchPublicPropertyBySlugServer(slug: string): Promise<Property | null> {
    const trimmedSlug = slug.trim();
    if (!trimmedSlug) return null;
    const base = resolveServerApiBase();
    const url = `${base}/public/properties/${encodeURIComponent(trimmedSlug)}`;
    try {
        const res = await fetch(url, {
            headers: { Accept: 'application/json' },
            next: { revalidate: 3600 },
        });
        if (!res.ok) return null;
        const payload = await res.json();
        const row = unwrapApiPayload<RealtyProperty>(payload);
        if (!row?.id) return null;
        return mapRealtyToProperty(row);
    } catch {
        return null;
    }
}

/** Server-only comprehensive property lookup: tries ID, unified public slug endpoint, and category fallback endpoints. */
export async function fetchPropertyAnySlugServer(param: string): Promise<Property | null> {
    const slug = param?.trim().toLowerCase() || '';
    if (!slug) return null;

    if (/^(\d+)(-|$)/.test(slug)) {
        const idMatch = slug.match(/^(\d+)/);
        if (idMatch?.[1]) {
            const pId = await fetchPropertyByIdServer(idMatch[1]);
            if (pId) return pId;
        }
    }

    const pPublic = await fetchPublicPropertyBySlugServer(slug);
    if (pPublic) return pPublic;

    for (const type of ['rent', 'pg', 'plot', 'commercial', 'flat']) {
        const pType = await fetchPropertyBySlugServer(type, slug);
        if (pType) return pType;
    }

    return null;
}
