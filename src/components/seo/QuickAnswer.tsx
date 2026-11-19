import type { ReactNode } from 'react';

interface QuickAnswerProps {
    children: ReactNode;
    locationName?: string;
}

/**
 * AEO lead block — concise answer for AI Overviews, voice, and featured snippets.
 */
export function QuickAnswer({ children, locationName }: QuickAnswerProps) {
    return (
        <section
            className="rounded-[var(--radius-pdp)] border border-line bg-white p-5 md:p-6 shadow-sm"
            aria-label={locationName ? `Quick answer: PG in ${locationName}` : 'Quick answer'}
            data-seo="locality-quick-answer"
        >
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-red">Quick answer</p>
            <p className="mt-2 text-[15px] md:text-base text-ink leading-relaxed font-medium">{children}</p>
        </section>
    );
}
