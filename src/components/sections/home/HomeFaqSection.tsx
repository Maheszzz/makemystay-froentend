import { ChevronDown, MessageCircle } from 'lucide-react';
import type { FaqItem } from '@/lib/schema';
import { getWhatsappDigits } from '@/lib/whatsapp';

interface HomeFaqSectionProps {
    items: FaqItem[];
}

export function HomeFaqSection({ items }: HomeFaqSectionProps) {
    const visibleItems = items.slice(0, 8);
    if (visibleItems.length === 0) return null;

    const whatsappHref = `https://wa.me/${getWhatsappDigits()}?text=${encodeURIComponent(
        'Hi MakeMyStay team, I have a question about PGs or flats in Bangalore.',
    )}`;

    return (
        <section
            aria-labelledby="home-faq-heading"
            className="bg-white border-t border-line py-12 md:py-20"
        >
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    <div className="lg:col-span-5 lg:sticky lg:top-24">
                        <h2
                            id="home-faq-heading"
                            className="font-heading font-bold text-[28px] sm:text-[32px] leading-[1.2] tracking-[-0.01em] text-ink"
                        >
                            Frequently asked questions
                        </h2>
                        <p className="mt-3 text-base text-slate leading-relaxed">
                            Live rent figures, amenity coverage, and booking details for Bangalore listings.
                        </p>
                        <div className="mt-6">
                            <a
                                href={whatsappHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="min-h-[44px] px-5 py-2.5 rounded-[10px] border border-red text-red hover:bg-blush-100 font-semibold text-sm inline-flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2"
                            >
                                <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                                <span>Chat on WhatsApp</span>
                            </a>
                        </div>
                    </div>

                    <div className="lg:col-span-7 space-y-3">
                        {visibleItems.map((item, idx) => (
                            <details
                                key={item.question}
                                open={idx === 0}
                                className="group rounded-[14px] border border-line bg-white transition-colors open:border-ink/25"
                            >
                                <summary className="min-h-[44px] cursor-pointer list-none px-5 py-4 flex items-center justify-between gap-4 text-left text-sm sm:text-base font-semibold text-ink rounded-[14px] [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2">
                                    <span>{item.question}</span>
                                    <ChevronDown
                                        className="w-4 h-4 text-slate shrink-0 transition-transform group-open:rotate-180"
                                        aria-hidden="true"
                                    />
                                </summary>
                                <div className="border-t border-line px-5 pb-4 pt-3 text-sm sm:text-[15px] text-slate leading-relaxed">
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
