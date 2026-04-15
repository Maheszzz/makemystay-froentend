interface PeopleAlsoAskProps {
    locationName: string;
}

/** Short, extractable Q&A lines for AEO (not FAQ schema — complements FAQ section). */
export function PeopleAlsoAsk({ locationName }: PeopleAlsoAskProps) {
    const items = [
        `Which PG is best in ${locationName}?`,
        `What is the typical PG rent in ${locationName}?`,
        `Is food included in PG rent in ${locationName}?`,
        `Are PGs in ${locationName} safe for women and working professionals?`,
        `How do I book a PG visit in ${locationName} online?`,
    ];

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm" aria-labelledby="paa-heading">
            <h2 id="paa-heading" className="text-lg font-bold text-slate-900">
                People also ask
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700 list-disc pl-5 marker:text-brand-red">
                {items.map((q) => (
                    <li key={q}>{q}</li>
                ))}
            </ul>
        </section>
    );
}
