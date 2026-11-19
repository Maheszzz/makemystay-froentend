import { problemCards } from '@/data/content';

export function Problem() {
    return (
        <section id="problem" className="py-12 md:py-20 lg:py-24 bg-blush-100 border-y border-line">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-10 md:mb-16">
                    <h2 className="font-serif-display text-2xl sm:text-4xl font-normal text-ink mb-4">
                        The problem in India&apos;s rental market
                    </h2>
                    <p className="text-base md:text-lg text-slate mb-3">A ₹5,000+ Cr market growing 25% YoY, yet plagued by inefficiencies.</p>
                    <p className="text-base md:text-lg font-semibold text-ink italic">
                        &ldquo;Operators lose profits not because of demand — but because of inefficiency.&rdquo;
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {problemCards.map((card, idx) => (
                        <div key={idx} className="bg-white rounded-[var(--radius-pdp)] p-6 md:p-8 border border-line border-t-4 border-t-red">
                            <div className="bg-blush-100 text-red w-12 h-12 rounded-full flex items-center justify-center mb-6">
                                {card.val ? <span className="font-bold text-xl">{card.val}</span> : card.icon && <card.icon className="w-6 h-6" />}
                            </div>
                            <h3 className="text-xl font-bold text-ink mb-2">{card.title}</h3>
                            <p className="text-slate mb-4" dangerouslySetInnerHTML={{ __html: card.desc.replace(/(₹\d+-\d+K|\d+%)/g, '<span class="font-semibold text-ink">$1</span>') }}></p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
