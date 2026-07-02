// src/data/offices.ts
// Thin wrapper that re-exports office metadata from JSON.
// This ensures a single source of truth.

import officesJson from './offices.json';

export interface Office {
  slug: string;
  name: string;
  lat: number;
  lng: number;
}

export const OFFICES: Office[] = officesJson as Office[];
