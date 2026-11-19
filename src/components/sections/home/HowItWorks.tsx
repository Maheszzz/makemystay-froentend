import {
    BadgeCheck,
    CalendarCheck,
    CheckCircle2,
    ClipboardCheck,
    KeyRound,
    Search,
    ShieldCheck,
} from 'lucide-react';

interface HowItWorksProps {
    tokenEnabledCount?: number;
}

const PROMISES = [
    {
        icon: CheckCircle2,
        label: 'Zero brokerage for tenants on supported listings',
    },
    {
        icon: ShieldCheck,
        label: 'Baseline photo and operator checks',
    },
    {
        icon: BadgeCheck,
        label: 'Real property photos',
    },
    {
        icon: ClipboardCheck,
        label: 'Direct visit scheduling',
    },
] as const;

export function HowItWorks({ tokenEnabledCount = 0 }: HowItWorksProps) {
    const steps = [
        {
            number: 1,
            icon: Search,
            title: 'Search and filter',
            description:
                'Filter live Bangalore PGs and flats by area, budget, gender, meals, or BHK.',
        },
        {
            number: 2,
            icon: CalendarCheck,
            title: 'Book a visit',
            description:
                'Request a walkthrough on any listing page or message our team on WhatsApp.',
        },
        {
            number: 3,
            icon: KeyRound,
            title: 'Reserve your room',
            description:
                tokenEnabledCount > 0
                    ? 'Pay a booking token online where enabled on a listing, or confirm after your visit.'
                    : 'Confirm terms after your visit, or use online booking tokens where enabled.',
        },
    ] as const;

    return (
        <section className="bg-white border-t border-line py-12 md:py-20">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mb-10 md:mb-12">
                    <h2 className="font-heading font-bold text-[28px] sm:text-[32px] leading-[1.2] tracking-[-0.01em] text-ink">
                        How MakeMyStay works
                    </h2>
                    <p className="mt-2.5 text-base text-slate leading-relaxed">
                        Three simple steps from filtering verified listings to moving in.
                    </p>
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                    <div
                        aria-hidden="true"
                        className="hidden md:block absolute top-6 left-[24px] right-[32%] h-px bg-line pointer-events-none"
                    />
                    {steps.map((step) => {
                        const Icon = step.icon;
                        return (
                            <div key={step.number} className="relative flex flex-col items-start">
                                <div className="relative z-10 w-12 h-12 rounded-full bg-blush-100 text-red flex items-center justify-center ring-4 ring-white mb-4">
                                    <Icon className="w-5 h-5" aria-hidden="true" />
                                </div>
                                <h3 className="font-heading font-bold text-lg text-ink">
                                    {step.number}. {step.title}
                                </h3>
                                <p className="mt-1.5 text-sm md:text-base text-slate leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <ul className="mt-10 md:mt-12 pt-8 border-t border-line flex flex-wrap items-center gap-x-8 gap-y-3">
                    {PROMISES.map((item) => {
                        const Icon = item.icon;
                        return (
                            <li
                                key={item.label}
                                className="inline-flex items-center gap-2 text-sm font-medium text-ink"
                            >
                                <Icon className="w-4 h-4 text-red shrink-0" aria-hidden="true" />
                                <span>{item.label}</span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
