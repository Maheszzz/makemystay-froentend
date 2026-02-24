import { api } from './client';
import type {
    Property,
    RealtyProperty,
    PropertyCreateRequest,
    PropertyUpdateRequest,
    PaginationParams
} from '@/types/api';

const REALTY_PATH = '/realty/properties';

/**
 * Maps the backend RealtyProperty to the frontend Property interface
 */
function mapRealtyToProperty(item: RealtyProperty): Property {
    // Determine price display — prefer starting_price from backend
    let priceDisplay = 'Price on Request';
    if (item.starting_price) {
        priceDisplay = `₹${item.starting_price.toLocaleString('en-IN')}`;
    } else if (item.listing_type === 'rent') {
        if (item.property_type === 'PG') {
            const minPrice = Math.min(item.single_price || Infinity, item.double_price || Infinity, item.triple_price || Infinity);
            priceDisplay = minPrice < Infinity ? `₹${minPrice.toLocaleString('en-IN')}` : 'Price on Request';
        } else if (item.private_price) {
            priceDisplay = `₹${item.private_price.toLocaleString('en-IN')}`;
        }
    } else if (item.listing_type === 'buy') {
        if (item.private_price) {
            priceDisplay = `₹${(item.private_price / 10000000).toFixed(2)} Cr`;
        }
    }

    // Determine default image based on type if none exists
    // Using some Unsplash placeholders
    const defaultImages: Record<string, string> = {
        // 'PG': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000',
        // '1RK': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1000',
        // '1BHK': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1000',
        // '2BHK': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000',
        // 'Villa': 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=1000'
    };

    // Heuristics for beds/baths based on type
    let beds = 1;
    let baths = 1;
    if (item.property_type === '2BHK') { beds = 2; baths = 2; }
    if (item.property_type === '3BHK') { beds = 3; baths = 3; }
    if (item.property_type === 'Villa') { beds = 4; baths = 4; }
    if (item.property_type?.toLowerCase() === 'plot') { beds = 0; baths = 0; }

    const isPlot = item.property_type?.toLowerCase() === 'plot';

    // Safely map listing_type (handle missing or case mismatch)
    const rawListingType = (item.listing_type || 'rent').toLowerCase();
    const category = (rawListingType === 'sale' || rawListingType === 'buy') ? 'buy' : 'rent';

    // Extract images from DB response
    const dbImages = item.images?.sort((a, b) => a.sort_order - b.sort_order).map(img => img.image_url) || [];
    const primaryImage = item.images?.find(img => img.is_primary)?.image_url || dbImages[0];

    // Determine sharing options
    const sharingOptions: string[] = [];
    if (item.single_price) sharingOptions.push('Single');
    if (item.double_price) sharingOptions.push('Double');
    if (item.triple_price) sharingOptions.push('Triple');

    // Fallback if no specific prices but type is PG
    if (sharingOptions.length === 0 && item.property_type === 'PG') {
        sharingOptions.push('Shared');
    }

    return {
        id: item.id || Math.random().toString(), // Fallback ID
        slug: item.slug || '',
        title: item.property_name || 'Untitled Property',
        location: item.location || 'Unknown Location',
        price: priceDisplay,
        type: item.property_type || 'Apartment',
        beds: beds,
        baths: baths,
        sqft: item.area_sqft ? `${item.area_sqft} sqft` : "On Request",
        parking: item.parking,
        lift: item.lift,
        area: item.area_sqft,
        wifi: !isPlot, // Mocking these as they are new feature requests
        housekeeping: !isPlot,
        power_backup: !isPlot,
        gym: !isPlot && ((item.features && item.features.some(f => f.toLowerCase().includes('gym'))) || item.property_type === 'Villa' || item.property_type === '4BHK'),
        lounge: !isPlot && ((item.features && item.features.some(f => f.toLowerCase().includes('lounge'))) || item.property_type === 'PG' || item.property_type === 'Villa'),
        cctv: true,
        washing_machine: !isPlot && ((item.features && item.features.some(f => f.toLowerCase().includes('washing'))) || item.property_type === 'PG'),
        geyser: !isPlot,
        image: primaryImage || defaultImages[item.property_type] || defaultImages['PG'],
        modern_kitchen: !isPlot && ((item.features && item.features.some(f => f.toLowerCase().includes('kitchen'))) || item.property_type === '1BHK' || item.property_type === '2BHK' || item.property_type === '3BHK' || item.property_type === 'Villa'),
        balcony: !isPlot && ((item.features && item.features.some(f => f.toLowerCase().includes('balcony'))) || item.property_type === '1BHK' || item.property_type === '2BHK' || item.property_type === '3BHK' || item.property_type === 'Villa'),
        attached_bathroom: !isPlot, // Standard for most listed properties
        images: dbImages,
        tag: item.is_available ? 'Available' : 'Sold Out',
        category: category,
        description: item.description || `A premium ${item.property_type} property in ${item.location}.`,
        sharing: sharingOptions,
        food: item.property_type === 'PG' || item.features?.some(f => f.toLowerCase().includes('food') || f.toLowerCase().includes('meal') || f.toLowerCase().includes('breakfast') || f.toLowerCase().includes('lunch') || f.toLowerCase().includes('dinner')),
        features: (item.features && item.features.length > 0) ? item.features : [item.furnishing?.replace('_', ' ') || '', item.property_type].filter(Boolean),
        rating: item.average_rating || 0,
        reviews: item.review_count || 0,
        average_rating: item.average_rating,
        review_count: item.review_count,
        reviews_list: item.reviews,
        map_link: item.map_link,
        furnishing: item.furnishing,
        contact_phone: item.phone,
        is_available: item.is_available ?? true
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
     * @returns Array of properties
     */
    getAll: async (params?: PaginationParams): Promise<Property[]> => {
        // Fetch from new realty endpoint
        const response = await api.get<RealtyProperty[]>(REALTY_PATH, { params });
        // Map to frontend Property model
        return response.map(mapRealtyToProperty);
    },

    /**
     * Get a single property by ID
     * @param id - Property ID
     * @returns Property object
     */
    getById: async (id: number | string): Promise<Property> => {
        // Use generic get for now (or specific if implemented)
        // Usually backends implement /api/v1/realty/properties/{id}
        const response = await api.get<RealtyProperty>(`${REALTY_PATH}/${id}`);
        return mapRealtyToProperty(response);
    },

    /**
     * Get a single property by type and slug
     * @param type - Property Type
     * @param slug - Property Slug
     * @returns Property object
     */
    getBySlug: async (type: string, slug: string): Promise<Property> => {
        const response = await api.get<RealtyProperty>(`${REALTY_PATH}/by-slug/${encodeURIComponent(type)}/${encodeURIComponent(slug)}`);
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
    getSuggestions: async (query: string): Promise<string[]> => {
        if (!query || query.length < 1) return [];
        return await api.get<string[]>(`${REALTY_PATH}/suggestions`, {
            params: { q: query }
        });
    }
};

export default propertyApi;
