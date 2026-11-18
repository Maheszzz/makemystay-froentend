import { api } from './client';
import type {
    ApiError,
    Property,
    PropertyImage,
    RealtyProperty,
    PropertyCreateRequest,
    PropertyUpdateRequest,
    Review,
} from '@/types/api';

export const REALTY_PATH = '/realty/properties';

/** HTTPS placeholders only — `data:` URIs are often blocked by CSP `img-src`, so cards looked blank while detail pages used real URLs. */
const PLACEHOLDER_GENERIC =
    'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80';
const PLACEHOLDER_PG =
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80';
const PLACEHOLDER_PLOT =
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80';
const PLACEHOLDER_VILLA =
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80';

/**
 * Unwrap list endpoints that may return a bare array, paginated `{ items, total }`,
 * or alternate keys — always coerce to an array so `.map` never runs on a non-array.
 */
export function normalizePropertyListResponse(response: unknown): { rows: unknown[]; total: number } {
    console.log('[normalize] response type:', typeof response);
    console.log('[normalize] keys:', response && typeof response === 'object' ? Object.keys(response as object) : []);
    // 1. Array-first handling: if it's already a bare array, return it directly.
    if (Array.isArray(response)) {
        return { rows: response, total: response.length };
    }

    // 2. Object handling: look for results in common keys or nested under .data
    if (response && typeof response === 'object') {
        const r = response as Record<string, unknown>;
        
        // Comprehensive list of keys used across different backend versions / middleware
        let raw: unknown =
            r.items ??
            r.properties ??
            r.results ??
            r.listings ??
            r.data;

        // If 'raw' is not an array yet, it might be nested (e.g., { success: true, data: { items: [...] } })
        let nested: Record<string, unknown> | undefined;
        if (!Array.isArray(raw) && r.data && typeof r.data === 'object' && r.data !== null) {
            nested = r.data as Record<string, unknown>;
            raw = nested.items ?? nested.properties ?? nested.results ?? nested.listings;
        }

        // Final coercion: if we found an array, use it; otherwise, default to empty.
        // This is the CRITICAL guard against ".map is not a function".
        const rows = Array.isArray(raw) ? raw : [];
        
        // Total count resolution from all possible keys
        const totalRaw = 
            (typeof r.total === 'number' ? r.total : undefined) ??
            (typeof r.count === 'number' ? r.count : undefined) ??
            (typeof r.total_count === 'number' ? r.total_count : undefined) ??
            (nested && typeof nested.total === 'number' ? nested.total : undefined) ??
            (nested && typeof nested.count === 'number' ? nested.count : undefined) ??
            (nested && typeof nested.total_count === 'number' ? nested.total_count : undefined);

        const total =
            typeof totalRaw === 'number' && Number.isFinite(totalRaw) ? totalRaw : rows.length;

        return { rows, total };
    }

    // 3. Fallback for non-object/non-array responses (e.g. string or null)
    return { rows: [], total: 0 };
}

/** Align with backend PropertyListItem.derive_category — never reduce pg/plot to rent/buy only. */
function deriveUiCategory(item: RealtyProperty): Property['category'] {
    const raw = item.category;
    if (typeof raw === 'string' && raw.trim()) {
        const c = raw.trim().toLowerCase();
        if (c === 'pg' || c === 'plot' || c === 'rent' || c === 'buy') {
            return c as Property['category'];
        }
    }
    const pt = (item.property_type || '').toLowerCase();
    if (pt === 'pg') return 'pg';
    if (pt === 'plot') return 'plot';
    const lt = (item.listing_type ?? 'rent').toString().toLowerCase();
    if (lt === 'buy' || lt === 'sale') return 'buy';
    return 'rent';
}

function propertyNotFoundError(detail?: string): ApiError {
    return {
        message: 'Property not found',
        status: 404,
        detail: detail ?? 'Listing is missing or was removed',
    };
}

/** True when mapped property matches the id requested on the PDP route. */
export function propertyIdsMatch(requested: string | number, property: Property | null | undefined): boolean {
    if (property?.id == null || property.id === '') return false;
    const a = String(requested).trim();
    const b = String(property.id).trim();
    if (!a || !b) return false;
    if (a === b) return true;
    const na = Number(a);
    const nb = Number(b);
    return Number.isFinite(na) && Number.isFinite(nb) && na === nb;
}

/**
 * Maps the backend RealtyProperty to the frontend Property interface
 */
export function mapRealtyToProperty(item: RealtyProperty): Property {
    if (item?.id == null) {
        throw propertyNotFoundError('Missing property id in API response');
    }
    const ptLower = (item.property_type || '').toLowerCase();
    const rawLt = (item.listing_type ?? 'rent').toString().toLowerCase();
    const isRentListing = rawLt === 'rent';
    const isBuyListing = rawLt === 'buy' || rawLt === 'sale';

    // Price: prefer starting_price; PG uses min(shared) prices even if listing_type casing differs.
    let priceDisplay = 'Price on Request';
    const sp = item.starting_price;
    if (typeof sp === 'number' && sp > 0) {
        priceDisplay = `₹${sp.toLocaleString('en-IN')}`;
    } else if (ptLower === 'pg') {
        const minPrice = Math.min(
            item.single_price ?? Infinity,
            item.double_price ?? Infinity,
            item.triple_price ?? Infinity
        );
        if (minPrice < Infinity) {
            priceDisplay = `₹${minPrice.toLocaleString('en-IN')}`;
        } else if (item.private_price != null && item.private_price > 0) {
            priceDisplay = `₹${item.private_price.toLocaleString('en-IN')}`;
        }
    } else if (isRentListing && item.private_price != null && item.private_price > 0) {
        priceDisplay = `₹${item.private_price.toLocaleString('en-IN')}`;
    } else if (isBuyListing && item.private_price != null && item.private_price > 0) {
        priceDisplay = `₹${(item.private_price / 10000000).toFixed(2)} Cr`;
    }

    // Determine default image based on type if none exists
    // Using some Unsplash placeholders
    const defaultImages: Record<string, string> = {
        PG: PLACEHOLDER_PG,
        '1RK': PLACEHOLDER_GENERIC,
        '1BHK': PLACEHOLDER_GENERIC,
        '2BHK': PLACEHOLDER_GENERIC,
        '3BHK': PLACEHOLDER_GENERIC,
        '4BHK': PLACEHOLDER_GENERIC,
        Villa: PLACEHOLDER_VILLA,
        Plot: PLACEHOLDER_PLOT,
    };

    // Heuristics for beds/baths based on type
    let beds = 1;
    let baths = 1;
    if (item.property_type === '2BHK') { beds = 2; baths = 2; }
    if (item.property_type === '3BHK') { beds = 3; baths = 3; }
    if (item.property_type === 'Villa') { beds = 4; baths = 4; }
    if (item.property_type?.toLowerCase() === 'plot') { beds = 0; baths = 0; }

    const isPlot = item.property_type?.toLowerCase() === 'plot';
    // Guard against malformed features
    const featuresList: string[] = [];
    if (Array.isArray(item.features)) {
        for (const f of item.features) {
            if (typeof f === 'string' && f.trim()) {
                featuresList.push(f.trim());
            } else if (f != null) {
                featuresList.push(String(f));
            }
        }
    }
    const has = (needle: string) => featuresList.some((f) => f.toLowerCase().includes(needle));

    const category = deriveUiCategory(item);

    // Extract images (support object rows + string URLs; copy before sort to avoid mutating response)
    const rawImages = Array.isArray(item.images) ? item.images : [];
    const sortedImages = [...rawImages].sort((a: any, b: any) => {
        const aPrimary = a && typeof a === 'object' && ('is_primary' in a || 'isPrimary' in a) && (a.is_primary === true || a.isPrimary === true) ? -1 : 0;
        const bPrimary = b && typeof b === 'object' && ('is_primary' in b || 'isPrimary' in b) && (b.is_primary === true || b.isPrimary === true) ? -1 : 0;
        if (aPrimary !== bPrimary) return aPrimary - bPrimary;
        const ao = a && typeof a === 'object' && 'sort_order' in a ? a.sort_order ?? 0 : 0;
        const bo = b && typeof b === 'object' && 'sort_order' in b ? b.sort_order ?? 0 : 0;
        return ao - bo;
    });

    const imageUrlFromEntry = (img: string | PropertyImage): string | undefined => {
        if (!img) return undefined;
        if (typeof img === 'string') return img.trim() || undefined;
        const u = img?.image_url;
        return typeof u === 'string' && u.trim() ? u : undefined;
    };

    let dbImages: string[] = [];
    try {
        dbImages = sortedImages.map(imageUrlFromEntry).filter((x): x is string => Boolean(x));
    } catch (err) {
        console.warn('[mapRealtyToProperty] Failed to map images array:', err, sortedImages);
    }
    
    // Explicit primary image lookup with fallback to first image in array
    const primaryEntry = sortedImages.find(
        (img): img is PropertyImage =>
            img && typeof img === 'object' && 'is_primary' in img && (img as PropertyImage).is_primary === true
    );
    const primaryImage = imageUrlFromEntry(primaryEntry ?? sortedImages[0]) ?? dbImages[0];

    // Determine sharing options
    const sharingOptions: string[] = [];
    if (item.single_price) sharingOptions.push('Single');
    if (item.double_price) sharingOptions.push('Double');
    if (item.triple_price) sharingOptions.push('Triple');

    // Fallback if no specific prices but type is PG
    if (sharingOptions.length === 0 && item.property_type === 'PG') {
        sharingOptions.push('Shared');
    }

    const listingBadge =
        typeof item.listing_badge === 'string' && item.listing_badge.trim()
            ? item.listing_badge.trim()
            : undefined;
    const unitsRemaining =
        typeof item.units_remaining === 'number' && Number.isFinite(item.units_remaining)
            ? item.units_remaining
            : null;

    const metaObj = (() => {
        const m = (item as any).metadata || (item as any).metadata_json;
        if (typeof m === 'string') {
            try { return JSON.parse(m); } catch { return {}; }
        }
        return m || {};
    })();

    const positivePrice = (val: unknown): number | undefined =>
        typeof val === 'number' && Number.isFinite(val) && val > 0 ? val : undefined;

    const rawGender = item.gender ?? metaObj.gender;
    const normalizedGender =
        typeof rawGender === 'string' && rawGender.trim() ? rawGender.trim() : undefined;

    const rawDeposit = item.deposit_amount ?? metaObj.deposit_amount ?? metaObj.deposit;
    const normalizedDeposit =
        typeof rawDeposit === 'number' && Number.isFinite(rawDeposit) && rawDeposit >= 0
            ? rawDeposit
            : typeof rawDeposit === 'string' && rawDeposit.trim()
              ? rawDeposit.trim()
              : null;

    const rawNotice = item.notice_period_days ?? metaObj.notice_period_days;
    const normalizedNotice =
        typeof rawNotice === 'number' && Number.isFinite(rawNotice) && rawNotice >= 0
            ? rawNotice
            : null;

    const rawRules = item.house_rules ?? metaObj.house_rules;
    const normalizedHouseRules = Array.isArray(rawRules)
        ? rawRules.map((r) => String(r).trim()).filter(Boolean)
        : typeof rawRules === 'string' && rawRules.trim()
          ? rawRules
                .split(/\r?\n|;/)
                .map((r) => r.trim())
                .filter(Boolean)
          : undefined;

    const rawFoodMenu = item.food_menu ?? metaObj.food_menu;
    const normalizedFoodMenu =
        rawFoodMenu && (typeof rawFoodMenu === 'string' ? rawFoodMenu.trim() : Object.keys(rawFoodMenu).length > 0)
            ? rawFoodMenu
            : undefined;

    return {
        id: item.id,
        slug: item.slug || '',
        title: item.property_name || 'Untitled Property',
        location: item.location || 'Unknown Location',
        city: typeof item.city === 'string' ? item.city : undefined,
        price: priceDisplay,
        type: item.property_type || 'Apartment',
        beds: beds,
        baths: baths,
        sqft: item.area_sqft ? `${item.area_sqft} sqft` : "On Request",
        parking: item.parking,
        lift: item.lift,
        area: item.area_sqft,
        wifi: !isPlot && (has('wifi') || has('wi-fi') || has('internet')),
        housekeeping: !isPlot && (has('housekeeping') || has('hk ') || has('cleaning')),
        power_backup: !isPlot && (has('power') || has('backup')),
        gym: !isPlot && (has('gym') || item.property_type === 'Villa' || item.property_type === '4BHK'),
        lounge: !isPlot && (has('lounge') || item.property_type === 'PG' || item.property_type === 'Villa'),
        cctv: !isPlot && (has('cctv') || has('camera') || has('security')),
        washing_machine: !isPlot && (has('washing') || has('laundry')),
        geyser: !isPlot && (has('geyser') || has('water heater')),
        image:
            primaryImage ||
            defaultImages[item.property_type] ||
            defaultImages['PG'] ||
            PLACEHOLDER_GENERIC,
        modern_kitchen: !isPlot && ((featuresList.some(f => f.toLowerCase().includes('kitchen'))) || item.property_type === '1BHK' || item.property_type === '2BHK' || item.property_type === '3BHK' || item.property_type === 'Villa'),
        balcony: !isPlot && ((featuresList.some(f => f.toLowerCase().includes('balcony'))) || item.property_type === '1BHK' || item.property_type === '2BHK' || item.property_type === '3BHK' || item.property_type === 'Villa'),
        attached_bathroom: !isPlot, // Standard for most listed properties
        images: dbImages,
        tag: item.is_available ? 'Available' : 'Fully booked',
        listing_badge: listingBadge,
        units_remaining: unitsRemaining,
        category: category,
        description: item.description?.trim() || '',
        seo_about: typeof item.seo_about === 'string' && item.seo_about.trim() ? item.seo_about.trim() : undefined,
        sharing: sharingOptions,
        single_price: positivePrice(item.single_price),
        double_price: positivePrice(item.double_price),
        triple_price: positivePrice(item.triple_price),
        private_price: positivePrice(item.private_price),
        starting_price: positivePrice(item.starting_price),
        food: item.property_type === 'PG' || featuresList.some(f => f.toLowerCase().includes('food') || f.toLowerCase().includes('meal') || f.toLowerCase().includes('breakfast') || f.toLowerCase().includes('lunch') || f.toLowerCase().includes('dinner')),
        gender: normalizedGender,
        deposit_amount: normalizedDeposit,
        notice_period_days: normalizedNotice,
        house_rules: normalizedHouseRules && normalizedHouseRules.length > 0 ? normalizedHouseRules : undefined,
        food_menu: normalizedFoodMenu,
        features: featuresList,
        rating: item.average_rating || 0,
        reviews: item.review_count || 0,
        average_rating: item.average_rating,
        review_count: item.review_count,
        reviews_list: Array.isArray(item.reviews)
            ? item.reviews.map((r: Review) => ({
                  ...r,
                  comment: r.comment ?? r.review_text,
              }))
            : [],
        last_verified_at: item.last_verified_at,
        last_booked_at: item.last_booked_at,
        last_review_at: item.last_review_at,
        created_at: item.created_at,
        updated_at: item.updated_at,
        map_link: item.map_link,
        furnishing: item.furnishing,
        contact_phone: item.phone,
        is_available: item.is_available ?? true,
        documents: (item as any).documents,
        videos: (() => {
            const rawVideos: any[] = Array.isArray((item as any).videos) ? [...(item as any).videos] : [];
            const pushYt = (title: string, url: string, isShort = false) => {
                if (url && typeof url === 'string' && !rawVideos.some((v: any) => (v.video_url === url || v.url === url))) {
                    rawVideos.push({
                        title: title || 'Property Video Tour',
                        video_url: url,
                        is_short: isShort,
                    });
                }
            };
            if (metaObj.youtube_url) pushYt('YouTube Video Tour', metaObj.youtube_url);
            if (metaObj.video_url) pushYt('Video Tour', metaObj.video_url);
            if (metaObj.property_walkthrough) pushYt('Walkthrough Video', metaObj.property_walkthrough);
            if (Array.isArray(metaObj.youtube_videos)) {
                for (const v of metaObj.youtube_videos) {
                    if (v?.url) pushYt(v.title || 'YouTube Video Tour', v.url, !!v.is_short);
                }
            }
            return rawVideos;
        })(),
        nearby_places: (item as any).nearby_places,
        seo: (item as any).seo,
        share: (item as any).share,
        metadata: metaObj,
    };
}

/**
 * Property API Service
 * Provides methods for CRUD operations on properties
 */
export const propertyApi = {
    /**
     * Get all properties
     * @param params - Optional pagination parameters
     * @returns Object containing array of properties and total count
     */
    getAll: async (params: {
        skip?: number;
        limit?: number;
        category?: string;
        property_type?: string;
        listing_type?: string;
        is_available?: boolean;
        search?: string;
        exclude_property_type?: string;
        min_price?: number;
        max_price?: number;
        city?: string;
        sort_by?: string;
    } = {}): Promise<{ items: Property[]; total: number }> => {
        try {
            const queryParams = new URLSearchParams();
            if (params.skip !== undefined) queryParams.append('skip', params.skip.toString());
            if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
            if (params.category) queryParams.append('category', params.category);
            if (params.property_type) queryParams.append('property_type', params.property_type);
            if (params.listing_type) queryParams.append('listing_type', params.listing_type);
            if (params.is_available !== undefined) queryParams.append('is_available', params.is_available.toString());
            if (params.search) queryParams.append('search', params.search);
            if (params.exclude_property_type) queryParams.append('exclude_property_type', params.exclude_property_type);
            if (params.min_price !== undefined) queryParams.append('min_price', params.min_price.toString());
            if (params.max_price !== undefined) queryParams.append('max_price', params.max_price.toString());
            if (params.city) queryParams.append('city', params.city);
            if (params.sort_by) queryParams.append('sort_by', params.sort_by);

            const response = await api.get<any>(REALTY_PATH, {
                params: queryParams,
                timeout: 45000,
            });

            // Use the actual JSON payload (response) for normalization
            const { rows, total } = normalizePropertyListResponse(response);
            console.log('[propertyApi.getAll] rows length after normalize:', rows?.length);
            const items: Property[] = [];
            for (const row of rows) {
                try {
                    items.push(mapRealtyToProperty(row as RealtyProperty));
                } catch (e) {
                    console.warn('[propertyApi.getAll] Skipping malformed property row:', e, row);
                }
            }
            console.log('[propertyApi.getAll] final items count:', items.length);
            return { items, total };
        } catch (e) {
            console.error('[propertyApi.getAll] Unexpected failure; returning empty list:', e);
            return { items: [], total: 0 };
        }
    },

    /**
     * PDP similar listings — server-ranked locality + fallback (see backend GET /properties/{id}/similar).
     */
    getSimilar: async (
        id: number | string,
        params: { limit?: number } = {}
    ): Promise<{ items: Property[]; total: number }> => {
        try {
            const queryParams = new URLSearchParams();
            if (params.limit !== undefined) queryParams.append('limit', String(params.limit));
            const qs = queryParams.toString();
            const url = `${REALTY_PATH}/${id}/similar${qs ? `?${qs}` : ''}`;
            const response = await api.get<unknown>(url, {
                timeout: 45000,
            });
            const { rows, total } = normalizePropertyListResponse(response);
            const items: Property[] = [];
            for (const row of rows) {
                try {
                    items.push(mapRealtyToProperty(row as RealtyProperty));
                } catch (e) {
                    console.warn('[propertyApi.getSimilar] Skipping malformed property row:', e, row);
                }
            }
            return { items, total };
        } catch (e) {
            console.warn('[propertyApi.getSimilar] Failed:', e);
            return { items: [], total: 0 };
        }
    },

    /**
     * Get a single property by ID
     * @param id - Property ID
     * @returns Property object
     */
    getById: async (id: number | string): Promise<Property> => {
        const response = await api.get<RealtyProperty>(`${REALTY_PATH}/${id}`);
        if (!response || typeof response !== 'object' || response.id == null) {
            throw propertyNotFoundError();
        }
        const mapped = mapRealtyToProperty(response);
        if (!propertyIdsMatch(id, mapped)) {
            throw propertyNotFoundError('Property id mismatch');
        }
        return mapped;
    },

    /**
     * Get a single property by type and slug
     * @param type - Property Type
     * @param slug - Property Slug
     * @returns Property object
     */
    getBySlug: async (type: string, slug: string): Promise<Property> => {
        const response = await api.get<RealtyProperty>(
            `${REALTY_PATH}/by-slug/${encodeURIComponent(type)}/${encodeURIComponent(slug)}`
        );
        if (!response || typeof response !== 'object' || response.id == null) {
            throw propertyNotFoundError();
        }
        return mapRealtyToProperty(response);
    },

    /**
     * Create a new property
     * @param data - Property data
     * @returns Created property
     */
    create: async (data: PropertyCreateRequest): Promise<Property> => {
        const response = await api.post<RealtyProperty>(REALTY_PATH, data);
        return mapRealtyToProperty(response);
    },

    /**
     * Update an existing property
     * @param id - Property ID
     * @param data - Updated property data
     * @returns Updated property
     */
    update: async (id: number | string, data: PropertyUpdateRequest): Promise<Property> => {
        const response = await api.put<RealtyProperty>(`${REALTY_PATH}/${id}`, data);
        return mapRealtyToProperty(response);
    },

    /**
     * Delete a property
     * @param id - Property ID
     * @returns Deletion confirmation
     */
    delete: async (id: number | string): Promise<void> => {
        await api.delete(`${REALTY_PATH}/${id}`);
    },

    /**
     * Get search suggestions based on a query
     * @param query - The search string
     * @returns Array of strings
     */
    getSuggestions: async (
        query: string
    ): Promise<{ properties: string[]; places: string[] }> => {
        if (!query || query.length < 1) return { properties: [], places: [] };
        try {
            const res = await api.get<{
                properties?: string[];
                places?: string[];
            }>(`${REALTY_PATH}/suggestions`, {
                params: { q: query },
            });
            if (Array.isArray(res)) {
                return { properties: [], places: res };
            }
            if (res && typeof res === 'object') {
                const properties = Array.isArray(res.properties) ? res.properties : [];
                const places = Array.isArray(res.places) ? res.places : [];
                if (properties.length || places.length) {
                    return { properties, places };
                }
                const legacy = (res as { items?: string[]; data?: string[]; suggestions?: string[] })
                    .items ??
                    (res as { data?: string[] }).data ??
                    (res as { suggestions?: string[] }).suggestions;
                if (Array.isArray(legacy)) {
                    return { properties: [], places: legacy };
                }
            }
            return { properties: [], places: [] };
        } catch (err) {
            console.warn('[propertyApi.getSuggestions] Failed:', err);
            return { properties: [], places: [] };
        }
    },
};

export default propertyApi;
