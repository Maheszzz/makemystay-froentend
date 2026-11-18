'use client';

import { useMemo, useState } from 'react';
import { getAmenityIcon } from '@/lib/amenityIcons';
import { normalizeFeatureKey } from '@/lib/propertyFeatures';

const INITIAL_VISIBLE_COUNT = 8;

type AmenityGroupName =
    | 'Comfort & living'
    | 'Kitchen & laundry'
    | 'Security & building'
    | 'Services & extras';

const GROUP_ORDER: AmenityGroupName[] = [
    'Comfort & living',
    'Kitchen & laundry',
    'Security & building',
    'Services & extras',
];

function classifyAmenity(normalizedKey: string): AmenityGroupName {
    if (
        /(food|meal|cafeteria|kitchen|fridge|refrigerator|ro water|water purifier|aqua|washing|laundry|kettle|microwave|induction|stove|bucket|mug|dustbin)/.test(
            normalizedKey,
        )
    ) {
        return 'Kitchen & laundry';
    }
    if (
        /(security|cctv|biometric|fingerprint|lock|privacy|power|backup|lift|elevator|parking|bike|car|housekeeping|maintenance|cleaning|water supply|24\/7|24x7|gated|boundary|compound)/.test(
            normalizedKey,
        )
    ) {
        return 'Security & building';
    }
    if (
        /(wifi|wi fi|internet|broadband|ac|air cond|furniture|furnished|cot|bed|pillow|wardrobe|cupboard|sofa|teapoy|study|desk|laptop|geyser|hot water|tv|television|balcony|room|bath|washroom|gym|lounge|terrace|rooftop|garden|pool)/.test(
            normalizedKey,
        )
    ) {
        return 'Comfort & living';
    }
    return 'Services & extras';
}

interface PropertyAmenitiesSectionProps {
    features: string[];
}

export function PropertyAmenitiesSection({ features }: PropertyAmenitiesSectionProps) {
    const [expanded, setExpanded] = useState(false);

    const groupedEntries = useMemo(() => {
        const buckets = new Map<
            AmenityGroupName,
            { label: string; lookupKey: string }[]
        >();
        for (const group of GROUP_ORDER) {
            buckets.set(group, []);
        }

        for (const feature of features) {
            const lookupKey = normalizeFeatureKey(feature);
            const group = classifyAmenity(lookupKey);
            buckets.get(group)!.push({ label: feature, lookupKey });
        }

        // Flatten in display order so collapsing to first 8 stays deterministic.
        const ordered: {
            group: AmenityGroupName;
            label: string;
            lookupKey: string;
        }[] = [];
        for (const group of GROUP_ORDER) {
            const items = buckets.get(group)!;
            for (const item of items) {
                ordered.push({ group, ...item });
            }
        }
        return ordered;
    }, [features]);

    const total = groupedEntries.length;
    if (total === 0) return null;

    const visibleEntries =
        expanded || total <= INITIAL_VISIBLE_COUNT
            ? groupedEntries
            : groupedEntries.slice(0, INITIAL_VISIBLE_COUNT);

    const visibleGroups = GROUP_ORDER.map((groupName) => ({
        groupName,
        items: visibleEntries.filter((e) => e.group === groupName),
    })).filter((g) => g.items.length > 0);

    return (
        <section
            id="pdp-amenities"
            className="py-10 lg:py-16 border-b border-pdp-border scroll-mt-28"
            aria-labelledby="pdp-amenities-heading"
        >
            <div className="flex items-baseline justify-between gap-4 mb-6">
                <h2 id="pdp-amenities-heading" className="pdp-type-heading text-pdp-ink">
                    Amenities
                </h2>
                <span className="pdp-type-caption text-pdp-muted tabular-nums">
                    {total} {total === 1 ? 'feature' : 'features'}
                </span>
            </div>

            <div className="space-y-8">
                {visibleGroups.map(({ groupName, items }) => (
                    <div key={groupName}>
                        <h3 className="pdp-type-caption font-medium text-pdp-muted mb-4">
                            {groupName}
                        </h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                            {items.map((item) => (
                                <li
                                    key={item.lookupKey}
                                    className="flex items-center gap-3 pdp-type-body text-pdp-ink"
                                >
                                    <span className="text-pdp-muted shrink-0" aria-hidden>
                                        {getAmenityIcon(item.lookupKey)}
                                    </span>
                                    <span className="min-w-0 truncate">{item.label}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {total > INITIAL_VISIBLE_COUNT && (
                <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setExpanded((v) => !v)}
                    className="mt-6 min-h-[44px] px-4 py-2 rounded-[10px] border border-pdp-border bg-pdp-surface hover:bg-pdp-bg pdp-type-caption font-medium text-pdp-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pdp-ink cursor-pointer transition-colors"
                >
                    {expanded ? 'Show fewer amenities' : `Show all ${total} amenities`}
                </button>
            )}
        </section>
    );
}
