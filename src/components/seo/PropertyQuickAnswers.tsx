import type { Property } from '@/types/api';
import { propertyLikelyHasAc } from '@/lib/propertySeoUtils';

interface PropertyQuickAnswersProps {
    property: Property;
}

/**
 * Visible structured facts for AEO (per listing), aligned with QuickAnswersBlock layout.
 */
export function PropertyQuickAnswers({ property }: PropertyQuickAnswersProps) {
    const food =
        property.food === true ? 'Included or optional — confirm with operator' : 'Varies by plan — check listing';
    const wifi = property.wifi ? 'Available' : 'See listing / enquire';
    const ac = propertyLikelyHasAc(property) ? 'Available (from features)' : 'Varies — check listing';
    const avail =
        property.is_available === false ? 'Limited — enquire for openings' : 'Enquire / book online where enabled';

    return (
        <section
            className="rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-50 to-white p-6 shadow-sm"
            aria-labelledby="property-quick-answers-heading"
        >
            <h2 id="property-quick-answers-heading" className="text-lg font-bold text-slate-900">
                Quick answers
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-700 list-none p-0">
                <li className="flex gap-2">
                    <span className="min-w-[5.5rem] font-semibold text-slate-900">Price</span>
                    <span>{property.price || 'On request'}</span>
                </li>
                <li className="flex gap-2">
                    <span className="min-w-[5.5rem] font-semibold text-slate-900">Location</span>
                    <span>{property.location}</span>
                </li>
                <li className="flex gap-2">
                    <span className="min-w-[5.5rem] font-semibold text-slate-900">Type</span>
                    <span>{property.type}</span>
                </li>
                <li className="flex gap-2">
                    <span className="min-w-[5.5rem] font-semibold text-slate-900">WiFi</span>
                    <span>{wifi}</span>
                </li>
                <li className="flex gap-2">
                    <span className="min-w-[5.5rem] font-semibold text-slate-900">Food</span>
                    <span>{food}</span>
                </li>
                <li className="flex gap-2">
                    <span className="min-w-[5.5rem] font-semibold text-slate-900">AC</span>
                    <span>{ac}</span>
                </li>
                <li className="flex gap-2">
                    <span className="min-w-[5.5rem] font-semibold text-slate-900">Availability</span>
                    <span>{avail}</span>
                </li>
            </ul>
        </section>
    );
}
