import type { ReactNode } from 'react';
import type { FaqItem } from '@/lib/schema';

interface FaqSectionProps {
    id?: string;
    title: string;
    items: FaqItem[];
    /** Optional icon shown before title (e.g. MapPin). */
    titleAdornment?: ReactNode;
    className?: string;
}

export function FaqSection({ id = 'faq-heading', title, items, titleAdornment, className = '' }: FaqSectionProps) {
    return (
        <section
            className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}
            aria-labelledby={id}
        >
            <h2 id={id} className="text-lg font-bold text-slate-900 flex items-center gap-2">
                {titleAdornment}
                {title}
            </h2>
            <dl className="mt-5 space-y-5">
                {items.map((f) => (
                    <div key={f.question}>
                        <dt className="font-semibold text-slate-900">{f.question}</dt>
                        <dd className="mt-1.5 text-sm text-slate-600 leading-relaxed">{f.answer}</dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}
