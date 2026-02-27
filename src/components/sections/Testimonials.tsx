import { Star } from 'lucide-react';

const testimonials = [
    {
        name: 'Priya Sharma',
        role: 'Software Engineer, Bangalore',
        text: 'Found my PG in HSR Layout within 2 days! No broker, no hidden charges. MakeMyStay made the entire process transparent and fast.',
        rating: 5,
        avatar: 'PS',
    },
    {
        name: 'Rahul Mehta',
        role: 'MBA Student, Koramangala',
        text: 'The AI recommendations were spot-on. Got exactly what I was looking for — furnished 1BHK near my college with great amenities.',
        rating: 5,
        avatar: 'RM',
    },
    {
        name: 'Anjali Verma',
        role: 'Marketing Manager, Whitefield',
        text: 'Used to waste weekends on property visits. MakeMyStay showed me verified listings upfront — booked my flat in one visit!',
        rating: 5,
        avatar: 'AV',
    },
    {
        name: 'Karthik Iyer',
        role: 'Startup Founder, Indiranagar',
        text: 'Exceptional service. The team at MakeMyStay helped me find a villa for my family within my budget without any broker interference.',
        rating: 4,
        avatar: 'KI',
    },
];

export function Testimonials() {
    // Duplicate testimonials for seamless loop
    const loopedTestimonials = [...testimonials, ...testimonials, ...testimonials];

    return (
        <section id="testimonials" className="py-16 md:py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 animate-on-scroll">
                    <span className="inline-block px-4 py-1.5 bg-red-50 text-brand-red font-semibold tracking-wide uppercase text-xs rounded-full mb-3">
                        Reviews
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                        What Our <span className="text-brand-red">Tenants Say</span>
                    </h2>
                </div>

                {/* Marquee Track */}
                <div className="testimonials-track-outer">
                    <div className="testimonials-track">
                        {loopedTestimonials.map((t, idx) => (
                            <div key={idx} className="w-[300px] sm:w-[350px] md:w-[500px] flex-shrink-0">
                                <div className="h-full bg-white border border-slate-100 rounded-3xl p-8 shadow-card relative hover:border-brand-red/20 hover:shadow-lg transition-all duration-300">
                                    {/* Stars */}
                                    <div className="flex gap-1 mb-4">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < t.rating ? 'text-brand-red fill-brand-red' : 'text-slate-200 fill-slate-200'}`}
                                            />
                                        ))}
                                    </div>

                                    <p className="text-slate-700 text-base leading-relaxed mb-6">
                                        "{t.text}"
                                    </p>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                                            {t.avatar}
                                        </div>
                                        <div className="text-left">
                                            <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                                            <div className="text-xs text-slate-500">{t.role}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
