interface QuickAnswersBlockProps {
    locationName: string;
}

/**
 * AEO-oriented concise facts (voice + AI snippets).
 */
export function QuickAnswersBlock({ locationName }: QuickAnswersBlockProps) {
    return (
        <section className="rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-50 to-white p-6 shadow-sm" aria-labelledby="quick-answers-heading">
            <h2 id="quick-answers-heading" className="text-lg font-bold text-slate-900">
                Quick answers — PG in {locationName}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-700 list-none p-0">
                <li className="flex gap-2">
                    <span className="min-w-[5.5rem] font-semibold text-slate-900">Price</span>
                    <span>₹6,000–₹18,000/mo (varies by sharing, AC, meals)</span>
                </li>
                <li className="flex gap-2">
                    <span className="min-w-[5.5rem] font-semibold text-slate-900">WiFi</span>
                    <span>High-speed internet on most verified PGs in {locationName}</span>
                </li>
                <li className="flex gap-2">
                    <span className="min-w-[5.5rem] font-semibold text-slate-900">Food</span>
                    <span>2–3 meals often included; veg/non-veg depends on operator</span>
                </li>
                <li className="flex gap-2">
                    <span className="min-w-[5.5rem] font-semibold text-slate-900">Security</span>
                    <span>CCTV, biometric access &amp; warden support common in premium stays</span>
                </li>
                <li className="flex gap-2">
                    <span className="min-w-[5.5rem] font-semibold text-slate-900">Commute</span>
                    <span>
                        {locationName} — check each listing for distance to offices, metro &amp; bus routes
                    </span>
                </li>
            </ul>
        </section>
    );
}
