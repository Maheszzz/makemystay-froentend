'use client';

import { useEffect, useMemo, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { propertyApi } from '@/lib/api/properties';
import { findLocalityGeo, getNearbyLocalities } from '@/lib/localityGeo';
import { PropertyCard } from '@/components/modules/listings/PropertyCard';
import type { Property } from '@/types/api';

interface NearbyLocalityListingsProps {
    /** Currently selected sub-locality name (e.g. "Marathahalli"). */
    selectedArea: string;
    /** Active category tab ("all" | "pg" | "rent" | "buy" | "plot"). */
    category: string;
    /** IDs already displayed in the primary selected-area results so we never duplicate. */
    excludeIds: Set<string>;
    /** Callback when user clicks a nearby area pill to switch to that area. */
    onSelectArea?: (areaName: string) => void;
}

interface NearbyItemWithDistance {
    property: Property;
    areaName: string;
    distanceKm: number;
}

export function NearbyLocalityListings({
    selectedArea,
    category,
    excludeIds,
    onSelectArea,
}: NearbyLocalityListingsProps) {
    const origin = useMemo(() => findLocalityGeo(selectedArea), [selectedArea]);
    const nearbyAreas = useMemo(
        () => getNearbyLocalities(selectedArea, 8, 4),
        [selectedArea],
    );

    const [items, setItems] = useState<NearbyItemWithDistance[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!origin || nearbyAreas.length === 0) {
            setItems([]);
            return;
        }

        let cancelled = false;
        setLoading(true);

        Promise.all(
            nearbyAreas.map(async (area) => {
                const res = await propertyApi.getAll({
                    category: category === 'all' ? undefined : category,
                    city: area.name,
                    is_available: true,
                    limit: 4,
                    sort_by: 'newest',
                });
                return { area, properties: res.items ?? [] };
            }),
        )
            .then((batches) => {
                if (cancelled) return;
                const seen = new Set<string>(excludeIds);
                const merged: NearbyItemWithDistance[] = [];
                for (const { area, properties } of batches) {
                    for (const prop of properties) {
                        const key = String(prop.id);
                        if (seen.has(key)) continue;
                        seen.add(key);
                        merged.push({
                            property: prop,
                            areaName: area.name,
                            distanceKm: area.distanceKm,
                        });
                    }
                }
                // Keep ordered by closest geo distance first
                merged.sort((a, b) => a.distanceKm - b.distanceKm);
                setItems(merged.slice(0, 12));
            })
            .catch(() => {
                if (!cancelled) setItems([]);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [origin, nearbyAreas, category, excludeIds]);

    if (!origin || nearbyAreas.length === 0) return null;
    if (!loading && items.length === 0) return null;

    return (
        <section
            aria-labelledby="nearby-geo-heading"
            className="mt-12 pt-10 border-t border-line"
        >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-red flex items-center gap-1.5 mb-1">
                        <Navigation className="w-3.5 h-3.5" aria-hidden="true" />
                        Nearby Locations by Distance
                    </p>
                    <h2
                        id="nearby-geo-heading"
                        className="text-xl sm:text-2xl font-semibold text-ink tracking-tight"
                    >
                        Nearby stays around {origin.name}
                    </h2>
                </div>

                <div className="flex flex-wrap gap-2">
                    {nearbyAreas.map((area) => (
                        <button
                            key={area.slug}
                            type="button"
                            onClick={() => onSelectArea?.(area.name)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-line bg-white text-xs font-medium text-ink hover:border-red hover:text-red transition-colors cursor-pointer"
                        >
                            <MapPin className="w-3 h-3 text-red shrink-0" aria-hidden="true" />
                            <span>{area.name}</span>
                            <span className="text-slate tabular-nums">({area.distanceKm} km)</span>
                        </button>
                    ))}
                </div>
            </div>

            {loading && items.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((n) => (
                        <div
                            key={n}
                            className="h-[380px] rounded-2xl border border-line bg-white animate-pulse"
                        />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map(({ property, areaName, distanceKm }) => (
                        <div key={property.id} className="flex flex-col">
                            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate">
                                <MapPin className="w-3.5 h-3.5 text-red shrink-0" aria-hidden="true" />
                                <span>{areaName}</span>
                                <span aria-hidden="true">·</span>
                                <span className="tabular-nums">~{distanceKm} km from {origin.name}</span>
                            </div>
                            <PropertyCard property={property} />
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
