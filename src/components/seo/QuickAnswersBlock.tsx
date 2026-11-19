interface QuickAnswersBlockProps {
    locationName: string;
    /** `dark` matches charcoal footer surfaces; default is light cards for hub pages. */
    variant?: 'light' | 'dark';
}

/**
 * AEO-oriented concise facts (voice + AI snippets).
 */
export function QuickAnswersBlock({ locationName, variant = 'light' }: QuickAnswersBlockProps) {
    const isDark = variant === 'dark';

    const shell = isDark
        ? 'rounded-[var(--radius-pdp)] border border-champagne/30 bg-red-900 p-6'
        : 'rounded-[var(--radius-pdp)] border border-line bg-white p-6';

    const titleCls = isDark ? 'text-lg font-bold text-white' : 'text-lg font-bold text-ink';
    const labelCls = isDark ? 'min-w-[5.5rem] font-semibold text-white' : 'min-w-[5.5rem] font-semibold text-ink';
    const valueCls = isDark ? 'text-sm text-red-subtitle' : 'text-sm text-slate';

    return (
        <section className={shell} aria-labelledby="quick-answers-heading">
            <h2 id="quick-answers-heading" className={titleCls}>
                Quick answers — PG in {locationName}
            </h2>
            <ul className={`mt-4 space-y-2.5 ${valueCls} list-none p-0`}>
                <li className="flex gap-2">
                    <strong className={labelCls}>Price</strong>
                    <span>₹6,000–₹15,000/mo (varies by sharing, AC, meals)</span>
                </li>
                <li className="flex gap-2">
                    <strong className={labelCls}>WiFi</strong>
                    <span>High-speed internet on most verified PGs in {locationName}</span>
                </li>
                <li className="flex gap-2">
                    <strong className={labelCls}>Food</strong>
                    <span>2–3 meals often included; veg/non-veg depends on operator</span>
                </li>
                <li className="flex gap-2">
                    <strong className={labelCls}>Security</strong>
                    <span>CCTV, biometric access &amp; warden support common in premium stays</span>
                </li>
                <li className="flex gap-2">
                    <strong className={labelCls}>Commute</strong>
                    <span>
                        {locationName} — check each listing for distance to offices, metro &amp; bus routes
                    </span>
                </li>
            </ul>
        </section>
    );
}
