import { JsonLd } from '@/components/seo/JsonLd';

export interface PlaceSchemaProps {
  name: string;
  description?: string;
  address?: string;
  geo?: {
    latitude: string;
    longitude: string;
  };
}

/** Render JSON‑LD Place schema */
export function PlaceSchema({ name, description, address, geo }: PlaceSchemaProps) {
  const data: any = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name,
  };
  if (description) data.description = description;
  if (address) data.address = address;
  if (geo) data.geo = { '@type': 'GeoCoordinates', latitude: geo.latitude, longitude: geo.longitude };
  return <JsonLd data={data} id="place-ld" />;
}
