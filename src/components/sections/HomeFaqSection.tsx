import { ChevronDown, MessageCircle } from 'lucide-react';
import type { FaqItem } from '@/lib/schema';
import { getWhatsappDigits } from '@/lib/whatsapp';

interface HomeFaqSectionProps {
    items: FaqItem[];
}

const FOCUS_RING =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2';

export function HomeFaqSection({ items }: HomeFaqSectionProps) {
    if (items.length === 0) return null;

    const visibleItems = items.slice(0, 8);
    const whatsappHref = `https://wa.me/${getWhatsappDigits()}?text=${encodeURIComponent(
        'Hi MakeMyStay team, I have a question about finding a PG or flat in Bangalore.',
    )}`;

    return (
        <section
            id="faq"
            aria-labelledby="home-faq-heading"
            className="py-12 md:py-20 bg-page border-t border-line"
        >
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
                    {/* Left sticky intro + WhatsApp CTA */}
                    <div className="lg:col-span-5 lg:sticky lg:top-24">
                        <h2
                            id="home-faq-heading"
                            className="font-heading font-bold text-ink text-3xl md:text-[40px] leading-[1.15] tracking-[-0.015em]"
                        >
                            Frequently asked questions
                        </h2>
                        <p className="mt-3 text-base text-slate leading-relaxed max-w-[42ch]">
                            Answers on rents, amenities, verification checks, and booking visits in Bangalore.
                        </p>
                        <div className="mt-6">
                            <a
                                href={whatsappHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`min-h-[44px] px-5 py-2.5 rounded-[10px] border border-red bg-white text-red hover:bg-red hover:text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors ${FOCUS_RING}`}
                            >
                                <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                                <span>Chat on WhatsApp</span>
                            </a>
                        </div>
                    </div>

                    {/* Right accessible accordion (first item open, max 8 items) */}
                    <div className="lg:col-span-7 space-y-3">
                        {visibleItems.map((item, idx) => (
                            <details
                                key={item.question}
                                open={idx === 0}
                                className="group rounded-[14px] border border-line bg-white overflow-hidden"
                            >
                                <summary className="cursor-pointer list-none min-h-[56px] px-5 py-4 flex items-center justify-between gap-4 text-left text-base font-semibold text-ink hover:text-red transition-colors [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red">
                                    <span>{item.question}</span>
                                    <ChevronDown
                                        className="w-5 h-5 text-slate shrink-0 transition-transform group-open:rotate-180"
                                        aria-hidden="true"
                                    />
                                </summary>
                                <div className="px-5 pb-5 pt-3 text-sm md:text-[15px] leading-relaxed text-slate border-t border-line/60">
                                    {item.answer}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
