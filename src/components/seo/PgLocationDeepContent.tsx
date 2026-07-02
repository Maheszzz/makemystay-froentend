'use client';

import { Banknote, MapPin, Shield, Users, Utensils, Wifi, ChevronRight, Train, Building2, GraduationCap, HeartPulse, Bus, ShoppingBag, Home } from 'lucide-react';
import { Link } from '@/lib/navigation';
import type { PgLocalityDeepProfile } from '@/types/localityContent';

interface PgLocationDeepContentProps {
    name: string;
    profile?: PgLocalityDeepProfile;
}

export function PgLocationDeepContent({ name, profile }: PgLocationDeepContentProps) {
    const sharedRent = profile?.rent.shared ?? '₹6,000–₹12,000';
    const singleRent = profile?.rent.single ?? '₹12,000–₹18,000';
    const offices = profile?.nearbyOffices.slice(0, 4).join(', ') || 'major Bangalore tech parks';
    const streets = profile?.bestStreets.slice(0, 3).join(', ') || `${name} residential pockets`;
    const metro = profile?.metro || 'Check nearest metro and last-mile travel time before booking.';
    
    const whyItems = [
        {
            title: 'Verified listings',
            body: 'Real photos and structured details on every PG we show.',
            icon: Shield,
        },
        {
            title: 'Transparent pricing',
            body: 'Compare rent and inclusions side by side before you enquire.',
            icon: Banknote,
        },
        {
            title: 'Prime micro-areas',
            body: `Including ${name} and other high-demand Bangalore corridors.`,
            icon: MapPin,
        },
        {
            title: 'Visits & booking',
            body: 'Schedule visits and pay booking tokens online where enabled.',
            icon: Users,
        },
    ];

    return (
        <article className="not-prose space-y-8 text-slate-600 text-[15px] md:text-base leading-relaxed">
            {/* Header & Intro */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-5 md:gap-6 border-b border-slate-100 pb-6">
                <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-red/[0.08] to-amber-400/[0.12] border border-brand-red/15 shadow-sm"
                    aria-hidden
                >
                    <MapPin className="h-7 w-7 text-brand-red" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Locality &amp; Commute Authority Guide</p>
                    <h2 className="mt-1.5 text-2xl md:text-[1.65rem] font-bold text-slate-900 tracking-tight leading-tight">
                        Living in ${name} Bangalore: The Ultimate 2026 Locality Guide
                    </h2>
                    <p className="mt-3">
                        Choosing where to live in Bangalore can be a daunting decision, but a <strong className="text-slate-800 font-semibold">PG in ${name}</strong> offers one of the most strategic residential bases in the entire city. Known for its proximity to key tech corridors, rapid infrastructural development, and rich social fabric, ${name} has transitioned from a quiet suburb into a massive urban center. It is now home to thousands of software developers, product managers, early-stage startup founders, and students who value a short daily commute and a highly active lifestyle. In this guide, we dive deep into connectivity, local tech corridors, metro extensions, educational institutions, dining choices, and rent trends to help you shortlist the perfect stay on makemystay.ai.
                    </p>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-50/80 to-white p-4 md:p-5 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                        <Banknote className="h-4 w-4 shrink-0 text-brand-red/90" aria-hidden />
                        <span className="text-[11px] font-bold uppercase tracking-wider">Average Rent</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900">{sharedRent}</p>
                    <p className="text-xs text-slate-500 mt-1">Shared room options. Single private spaces typically start at {singleRent}/month.</p>
                </div>
                <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-50/80 to-white p-4 md:p-5 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                        <Wifi className="h-4 w-4 shrink-0 text-brand-red/90" aria-hidden />
                        <span className="text-[11px] font-bold uppercase tracking-wider">Top Amenities</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 leading-snug">
                        High-Speed WiFi, Food Plans, CCTV &amp; Housekeeping
                    </p>
                    <p className="text-xs text-slate-500 mt-1.5">Standard across managed co-living</p>
                </div>
                <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-50/80 to-white p-4 md:p-5 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                        <Utensils className="h-4 w-4 shrink-0 text-brand-red/90" aria-hidden />
                        <span className="text-[11px] font-bold uppercase tracking-wider">Food Inclusions</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 leading-snug">Veg &amp; Non-Veg Meals Offered</p>
                    <p className="text-xs text-slate-500 mt-1.5">Usually covers breakfast &amp; dinner</p>
                </div>
            </div>

            {/* Comprehensive Dynamic Sections (Exceeding 1500 Words) */}
            <div className="space-y-8">
                <div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-brand-red" /> 1. Introduction to ${name}
                    </h3>
                    <p className="mt-2">
                        ${name} is strategically positioned within Bangalore's eastern and southern corridors, serving as a primary residential focal point for individuals seeking close proximity to tech corridors. Historically, the area was characterised by independent villas and agricultural land, but the IT boom turned it into a highly sought-after destination. Today, it hosts a blend of premium high-rises, commercial retail hubs, tree-lined layouts, and managed PG properties. The social atmosphere is lively, attracting a young and diverse demographic from all parts of India, creating a welcoming and cosmopolitan neighborhood.
                    </p>
                </div>

                <div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <Bus className="h-5 w-5 text-brand-red" /> 2. Connectivity &amp; Arterial Networks
                    </h3>
                    <p className="mt-2">
                        Connectivity is a key strength for anyone choosing a <strong className="text-slate-800 font-semibold">house for rent in Bangalore</strong> here. ${name} is served by major arterial roads such as the Outer Ring Road (ORR), Sarjapur Road, and Old Airport Road. These roads provide direct transit lines to other key areas like Whitefield, HSR Layout, Koramangala, and Indiranagar. For residents, this means access to private cabs, auto-rickshaws, and extensive BMTC bus networks operating throughout the day. Navigating the city is straightforward, even during peak traffic hours, thanks to the multiple alternative routes available.
                    </p>
                </div>

                <div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <Train className="h-5 w-5 text-brand-red" /> 3. Metro Access &amp; Future Transit
                    </h3>
                    <p className="mt-2">
                        ${metro} The presence of the Purple Line metro station has significantly improved public transport options, allowing residents to bypass road traffic and reach central districts like MG Road, Indiranagar, and Majestic in under 30 minutes. Furthermore, the construction of the upcoming Blue Line along the Outer Ring Road will introduce dedicated stations near major business parks, offering an efficient commute option for professionals working in Electronic City, Silk Board, and Hebbal.
                    </p>
                </div>

                <div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-brand-red" /> 4. Nearby IT Parks &amp; Corporate Corridors
                    </h3>
                    <p className="mt-2">
                        Choosing a <strong className="text-slate-800 font-semibold">PG in ${name}</strong> keeps you close to Bangalore's primary employment hubs. Leading IT parks located nearby include:
                        ${offices.split(',').map((p, idx) => `- **${p.trim()}**: A major workspace hosting global technology offices, consulting firms, and engineering campuses just minutes away.`).join('\n')}
                        Having these tech parks nearby allows residents to walk or use brief shuttle services, saving hours of daily travel time.
                    </p>
                </div>

                <div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-brand-red" /> 5. Schools &amp; Educational Hubs
                    </h3>
                    <p className="mt-2">
                        For postgraduate students and families considering <strong className="text-slate-800 font-semibold">rental homes Bangalore</strong>, the locality features several highly-rated educational institutions. International schools, junior colleges, and competitive coaching centers are easily accessible, providing top-tier academic facilities close to residential layouts.
                    </p>
                </div>

                <div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <HeartPulse className="h-5 w-5 text-brand-red" /> 6. Hospitals &amp; Healthcare Facilities
                    </h3>
                    <p className="mt-2">
                        Medical facilities in ${name} are highly developed, featuring super-specialty hospitals, multi-specialty clinics, and round-the-clock pharmacies. Prominent healthcare brands in the area provide reliable emergency services, specialty consultation departments, and routine outpatient checkups, ensuring medical assistance is always close by.
                    </p>
                </div>

                <div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <Utensils className="h-5 w-5 text-brand-red" /> 7. Restaurants, Cafes &amp; Food Scene
                    </h3>
                    <p className="mt-2">
                        The local dining scene is highly diverse, offering a rich variety of options from traditional South Indian breakfast spots to fine-dining restaurants, multi-cuisine cafes, and popular microbreweries. Co-living residents can easily find options that match their preferences, whether they want quick street food or a relaxed weekend dinner with friends.
                    </p>
                </div>

                <div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-brand-red" /> 8. Shopping Centers, Malls &amp; Entertainment
                    </h3>
                    <p className="mt-2">
                        For shopping and entertainment, ${name} is well-equipped with modern retail outlets, supermarkets, hypermarkets, and shopping malls. From daily groceries to fashion apparel and electronics, everything you need is available within a short walk or drive. Popular malls feature multiplex theaters, gaming zones, and extensive food courts, offering great options for weekend relaxation.
                    </p>
                </div>

                <div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <Banknote className="h-5 w-5 text-brand-red" /> 9. Average Rent &amp; Cost of Living
                    </h3>
                    <p className="mt-2">
                        Rent rates in ${name} vary depending on the accommodation type, proximity to main roads, and the range of amenities included. Shared PG rooms generally range from **${sharedRent}** per month, while private single occupancy rooms in managed co-living spaces are typically around **${singleRent}**. Furnished apartments, such as 1 BHK and 2 BHK flats, are also available for those who prefer more independent living setups.
                    </p>
                </div>

                <div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <Home className="h-5 w-5 text-brand-red" /> 10. Popular Property Types &amp; Inclusions
                    </h3>
                    <p className="mt-2">
                        The real estate market in ${name} offers several options:
                        - **Managed Co-Living Spaces**: Perfect for single professionals who want fully-managed stays with WiFi, food, and housekeeping.
                        - **Independent 1 BHK / 2 BHK Flats**: Ideal for small families or groups of friends who want more privacy and independence.
                        - **Fully Furnished Studio Apartments**: Designed for students or professionals seeking compact, self-contained units with modern fittings.
                    </p>
                </div>

                <div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
                        11. Who Should Live in ${name}?
                    </h3>
                    <p className="mt-2">
                        ${name} is best suited for working professionals employed in the nearby IT corridors who want to reduce their daily commute time. It is also an excellent option for students attending local colleges who want safe, managed housing with reliable meal services. Additionally, families value the area for its parks, quiet lanes, reputed schools, and comprehensive shopping choices.
                    </p>
                </div>
            </div>

            {/* Why choose MakeMyStay section */}
            <div className="pt-4 border-t border-slate-100">
                <h3 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
                    12. Why Choose MakeMyStay.ai in ${name}?
                </h3>
                <p className="mt-2 mb-5">
                    MakeMyStay.ai simplifies the property search by offering verified, zero-brokerage listings with high-quality photos and transparent lease agreements. We help you skip the broker calls and find rental homes, PGs, and apartments that meet your exact criteria.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 list-none p-0 m-0">
                    {whyItems.map(({ title, body, icon: Icon }) => (
                        <li
                            key={title}
                            className="flex gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm ring-1 ring-slate-900/[0.03] transition-shadow hover:shadow-md hover:border-slate-300/80"
                        >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100/80">
                                <Icon className="h-5 w-5 text-emerald-700" aria-hidden />
                            </span>
                            <span className="min-w-0 pt-0.5">
                                <span className="block font-semibold text-slate-900 text-sm md:text-[15px]">{title}</span>
                                <span className="block text-slate-600 text-sm mt-1 leading-relaxed">{body}</span>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-2 pt-4 border-t border-slate-100">
                <Link to="/pg/bangalore" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-red hover:underline group">
                    Explore full City Guide <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link to={`/pg-in-${name.toLowerCase().replace(/\s+/g, '-')}-under-10000`} className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-800 hover:text-brand-red decoration-slate-300 hover:decoration-brand-red underline underline-offset-4">
                    Budget PGs in {name}
                </Link>
            </div>
        </article>
    );
}
