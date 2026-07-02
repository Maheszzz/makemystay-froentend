// src/lib/officeSeoGenerator.ts
// Extends the generic SEO builder to support Office landing pages.
// Reuses buildPageSEO from src/lib/seo.ts for title/description handling.

import { buildPageSEO, PageSEOInput } from '@/lib/seo';
import { OFFICES } from '@/data/offices';
import type { Property } from '@/types/api';

interface OfficeStats {
  total: number;
  pgCount: number;
  colivingCount: number;
  rentCount: number;
  avgRent: number;
}

function computeOfficeStats(properties: Property[]): OfficeStats {
  const total = properties.length;
  let pgCount = 0,
    colivingCount = 0,
    rentCount = 0,
    rentSum = 0,
    rentCountForAvg = 0;
  for (const p of properties) {
    const cat = p.category?.toLowerCase();
    if (cat === 'pg' || cat === 'hostel' || cat === 'coliving') pgCount++;
    if (cat === 'coliving') colivingCount++;
    if (cat === 'rent' || cat === 'pg') rentCount++;
    const price = Number(p.price?.replace(/[^0-9]/g, ''));
    if (!isNaN(price) && price > 0) {
      rentSum += price;
      rentCountForAvg++;
    }
  }
  const avgRent = rentCountForAvg ? Math.round(rentSum / rentCountForAvg) : 0;
  return { total, pgCount, colivingCount, rentCount, avgRent };
}

export function generateOfficeSeoInput(
  officeSlug: string,
  nearbyProperties: Property[]
): PageSEOInput {
  const office = OFFICES.find((o) => o.slug === officeSlug);
  const name = office?.name ?? officeSlug.replace(/-/g, ' ');
  const stats = computeOfficeStats(nearbyProperties);

  const title = `${name} Office Hub – Best PGs, Coliving & Rentals in Bangalore`;
  const description = `Explore ${stats.pgCount} verified PGs, ${stats.colivingCount} coliving spaces and ${stats.rentCount} rentals near ${name}. Average rent ₹${stats.avgRent}/month. Find your ideal stay close to work.`;

  const base: PageSEOInput = {
    title,
    description,
    path: `/office/${officeSlug}`,
  };
  return buildPageSEO(base);
}
