import { Check } from 'lucide-react';

interface PgLocationDeepContentProps {
    name: string;
}

/**
 * Long-form, location-specific copy for SEO depth (unique via {name}).
 */
export function PgLocationDeepContent({ name }: PgLocationDeepContentProps) {
    return (
        <article className="prose prose-slate max-w-none text-slate-700">
            <p className="text-base md:text-[17px] leading-relaxed">
                Looking for the best <strong>PG in {name}</strong>? MakeMyStay.ai lists fully furnished paying guest and
                coliving options with transparent pricing — whether you are a student, fresher, or working professional
                near Bangalore&apos;s tech corridors. Compare room types (single, double, or multi-sharing), meal plans,
                and maintenance inclusions before you shortlist or pay a booking token.
            </p>
            <p className="mt-4 text-base md:text-[17px] leading-relaxed">
                {name} continues to attract renters who want shorter commutes and reliable daily routines. Most
                professionally managed PGs here bundle <strong>high-speed WiFi</strong>, power backup, housekeeping, and
                security features such as CCTV and controlled access. Food may be included as 2–3 meals per day or
                offered as an add-on — always confirm veg/non-veg availability and timings on the listing you like.
            </p>
            <p className="mt-4 text-base md:text-[17px] leading-relaxed">
                Budget expectations in {name} typically fall between <strong>₹6,000 and ₹18,000 per month</strong>{' '}
                depending on occupancy, floor space, AC/non-AC, and how premium the property is. Use the filters on this
                page to narrow by price, sort by rating, and read real photos before you visit. If you are new to the
                city, prioritise walkable access to metro or bus routes and clarify deposit and notice-period rules with
                the operator.
            </p>
            <p className="mt-4 text-base md:text-[17px] leading-relaxed">
                MakeMyStay.ai focuses on <strong>verified listings</strong> and clear information so you spend less
                time on broker calls and more time choosing the right room. Scroll down to browse live PG inventory in{' '}
                {name}, explore quick answers for typical rent and amenities, and read FAQs tailored to this locality.
            </p>

            <h2 className="mt-10 text-xl font-bold text-slate-900 not-prose">Why choose MakeMyStay.ai in {name}?</h2>
            <ul className="mt-4 space-y-2.5 not-prose text-sm md:text-base text-slate-700">
                {[
                    'Verified PG listings with real photos and structured details',
                    'Transparent pricing — compare rent and inclusions side by side',
                    'Prime Bangalore micro-areas including ' + name,
                    'Support for visits and online booking where enabled',
                    'Less brokerage friction — digital-first discovery',
                ].map((line) => (
                    <li key={line} className="flex gap-2">
                        <Check className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" aria-hidden />
                        <span>{line}</span>
                    </li>
                ))}
            </ul>
        </article>
    );
}
