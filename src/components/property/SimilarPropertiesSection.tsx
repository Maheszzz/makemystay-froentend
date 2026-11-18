import { useMemo } from 'react';
import { Link } from '@/lib/navigation';
import { useProperties, useSimilarProperties } from '@/hooks';
import { PropertyCard } from '@/components/modules/listings/PropertyCard';
import type { Property } from '@/types/api';
import { findPgLocationForArea } from '@/data/pgLocations';

interface SimilarPropertiesSectionProps {
    current: Property;
    initialSimilar?: Property[];
}

const GENERIC_AREA_WORDS = new Set([
    'layout',
    'road',
    'phase',
    'stage',
    'sector',
    'cross',
    'main',
    'near',
    'bangalore',
    'bengaluru',
    'nagar',
    'block',
]);

function extractAreaTokens(location?: string): string[] {
    if (!location) return [];
    const cleaned = location.trim().toLowerCase();
    if (!cleaned || cleaned.includes('unknown')) return [];
    const parts = cleaned
        .split(/[,/|]+/)
        .map((s) => s.trim())
        .filter(Boolean);
    const tokens = new Set<string>(parts);
    for (const part of parts) {
        for (const word of part.split(/\s+/)) {
            if (word.length >= 3 && !GENERIC_AREA_WORDS.has(word)) {
                tokens.add(word);
            }
        }
    }
    return Array.from(tokens);
}

function matchesAreaAndType(candidate: Property, current: Property): boolean {
    if (String(candidate.id) === String(current.id)) return false;

    const currentType = (current.type || '').trim().toLowerCase();
    const candType = (candidate.type || '').trim().toLowerCase();
    if (!currentType || candType !== currentType) return false;

    const currentPgLoc = findPgLocationForArea(current.location);
    const candPgLoc = findPgLocationForArea(candidate.location);
    if (currentPgLoc && candPgLoc && currentPgLoc.slug === candPgLoc.slug) {
        return true;
    }

    const curLoc = (current.location || '').trim().toLowerCase();
    const canLoc = (candidate.location || '').trim().toLowerCase();
    if (!curLoc || !canLoc || curLoc.includes('unknown') || canLoc.includes('unknown')) {
        return false;
    }
    if (curLoc === canLoc) return true;

    const curTokens = extractAreaTokens(current.location);
    const canTokens = new Set(extractAreaTokens(candidate.location));
    return curTokens.some((t) => canTokens.has(t));
}

export function SimilarPropertiesSection({
    current,
    initialSimilar,
}: SimilarPropertiesSectionProps) {
    const city = current.location?.trim() || undefined;
    const pgLoc = findPgLocationForArea(current.location);
    const isPg = current.type?.toLowerCase() === 'pg';

    const {
        properties: similar,
        loading: similarLoading,
    } = useSimilarProperties(current.id, {
        limit: 12,
        initialProperties: initialSimilar,
    });

    const {
        properties: sameTypePool,
        loading: poolLoading,
    } = useProperties(
        {
            property_type: current.type || undefined,
            category: current.category,
        },
        { pageSize: 100 },
    );

    const filtered = useMemo(() => {
        const seen = new Set<string>();
        const combined: Property[] = [];
        for (const p of [...similar, ...sameTypePool]) {
            const key = String(p.id);
            if (seen.has(key)) continue;
            seen.add(key);
            if (matchesAreaAndType(p, current)) {
                combined.push(p);
            }
        }
        return combined.slice(0, 3);
    }, [similar, sameTypePool, current]);

    if ((similarLoading && poolLoading && filtered.length === 0) || filtered.length < 2) {
        return null;
    }

    const heading = isPg
        ? pgLoc
            ? `Similar PGs in ${pgLoc.name}`
            : `Similar PGs${city ? ` in ${city}` : ''}`
        : pgLoc
          ? `Similar ${current.type} in ${pgLoc.name}`
          : `Similar ${current.type}${city ? ` in ${city}` : ''}`;

    return (
        <section
            className="py-10 lg:py-16 border-t border-pdp-border"
            aria-labelledby="similar-pg-heading"
        >
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h2 id="similar-pg-heading" className="pdp-type-heading text-pdp-ink">
                        {heading}
                    </h2>
                    <p className="pdp-type-caption text-pdp-muted mt-1">
                        Same neighbourhood and home type
                    </p>
                </div>
                {pgLoc && (
                    <Link
                        to={`/pg/${pgLoc.slug}`}
                        className="min-h-[44px] inline-flex items-center pdp-type-caption font-medium text-pdp-ink underline underline-offset-4 hover:text-pdp-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink rounded"
                    >
                        View all in {pgLoc.name}
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((p) => (
                    <PropertyCard key={p.id} property={p} />
                ))}
            </div>
        </section>
    );
}
