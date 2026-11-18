import { JsonLd } from '@/components/seo/JsonLd';
import { buildPlaceSchema } from '@/lib/schema';

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
  const data = buildPlaceSchema({ name, description, address, geo });
  return <JsonLd data={data} id="place-ld" />;
}

