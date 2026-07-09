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
