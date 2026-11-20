export interface RentBhkTypeConfig {
    label: string;
    apiType: string;
    searchLabel: string;
}

/** Supported BHK / flat / furnishing category slugs for `/rent/[slug]/[area]`. */
export const RENT_BHK_TYPES: Record<string, RentBhkTypeConfig> = {
    '1bhk': { label: '1BHK', apiType: '1BHK', searchLabel: '1BHK Flats' },
    '2bhk': { label: '2BHK', apiType: '2BHK', searchLabel: '2BHK Flats' },
    '3bhk': { label: '3BHK', apiType: '3BHK', searchLabel: '3BHK Flats' },
    furnished: { label: 'Furnished', apiType: 'furnished', searchLabel: 'Furnished Flats' },
    '1rk': { label: '1RK', apiType: '1RK', searchLabel: '1RK Rooms' },
    flat: { label: 'Flat', apiType: 'flat', searchLabel: 'Flats' },
    apartment: { label: 'Apartment', apiType: 'apartment', searchLabel: 'Apartments' },
    'service-apartment': {
        label: 'Service Apartment',
        apiType: 'service_apartment',
        searchLabel: 'Service Apartments',
    },
};
