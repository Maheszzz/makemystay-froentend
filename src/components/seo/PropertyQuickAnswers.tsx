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
            className="rounded-3xl border border-slate-200/90 bg-white p-6 md:p-8 shadow-sm"
            aria-labelledby="property-quick-answers-heading"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-brand-red rounded-full" />
                <h2 id="property-quick-answers-heading" className="text-xl font-extrabold text-slate-900">
                    Quick answers
                </h2>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm text-slate-700 list-none p-0">
                <li className="flex gap-2">
                    <strong className="min-w-[5.5rem] text-slate-900">Price</strong>
                    <span className="text-slate-700">{property.price || 'On request'}</span>
                </li>
                <li className="flex gap-2">
                    <strong className="min-w-[5.5rem] text-slate-900">Location</strong>
                    <span className="text-slate-700">{property.location}</span>
                </li>
                <li className="flex gap-2">
                    <strong className="min-w-[5.5rem] text-slate-900">Type</strong>
                    <span className="text-slate-700">{property.type}</span>
                </li>
                <li className="flex gap-2">
                    <strong className="min-w-[5.5rem] text-slate-900">WiFi</strong>
                    <span className="text-slate-700">{wifi}</span>
                </li>
                <li className="flex gap-2">
                    <strong className="min-w-[5.5rem] text-slate-900">Food</strong>
                    <span className="text-slate-700">{food}</span>
                </li>
                <li className="flex gap-2">
                    <strong className="min-w-[5.5rem] text-slate-900">AC</strong>
                    <span className="text-slate-700">{ac}</span>
                </li>
                <li className="flex gap-2">
                    <strong className="min-w-[5.5rem] text-slate-900">Availability</strong>
                    <span className="text-slate-700 font-medium">{avail}</span>
                </li>
            </ul>
        </section>
    );
}
