import { Link } from '@/lib/navigation';
import { getPgLocationBySlug } from '@/data/pgLocations';
import type { PgLocalityDeepProfile } from '@/types/localityContent';
import type { FaqItem } from '@/lib/schema';
import { Building2, MapPin, ShieldCheck, Train, Utensils, Wallet } from 'lucide-react';

export interface PgGenderLocalityContentProps {
    name: string;
    slug: string;
    gender: 'male' | 'female';
    rentRange?: string;
    landmarks?: string[];
    profile?: PgLocalityDeepProfile;
    content?: {
        overview?: string;
        rentTrends?: string;
        metroConnectivity?: string;
        nearbyITParks?: string;
        nearbyColleges?: string;
        foodAndLifestyle?: string;
        safety?: string;
    };
    liveListingCount: number;
    liveMinPrice?: number | null;
    liveMaxPrice?: number | null;
    nearbySlugs?: string[];
}

export function buildGenderLocalityFaqs(
    name: string,
    gender: 'male' | 'female',
    rentRange?: string,
    nearbyOffices?: string[],
    metro?: string,
): FaqItem[] {
    const isFemale = gender === 'female';
    const label = isFemale ? 'girls PG' : 'boys PG';
    const priceText = rentRange || '₹6,000–₹18,000/month';
    const officeText =
        nearbyOffices && nearbyOffices.length > 0
            ? nearbyOffices.slice(0, 4).join(', ')
            : `nearby Bangalore IT corridors and offices around ${name}`;

    if (isFemale) {
        return [
            {
                question: `What safety features should I check in a girls PG in ${name}?`,
                answer: `When shortlisting a ladies PG in ${name}, verify 24/7 CCTV coverage at entrances and corridors, biometric or keycard entry, an on-site female warden, well-lit approach roads, and clear visitor/curfew policies before paying a booking token.`,
            },
            {
                question: `What is the typical monthly rent for a girls PG in ${name}?`,
                answer: `Typical PG rent in ${name} ranges around ${priceText}, depending on single, double, or triple sharing, AC availability, and whether daily meals are included.`,
            },
            {
                question: `Which offices and tech parks are accessible from girls PGs in ${name}?`,
                answer: `Residents staying in ${name} commonly commute to ${officeText}. Checking peak-hour travel time and bus/metro connectivity helps pick the right pocket.`,
            },
            {
                question: `How is metro and public transport access for working women in ${name}?`,
                answer: metro
                    ? `${metro} Auto-rickshaws, BMTC feeder buses, and cab services also operate along the main roads of ${name}.`
                    : `${name} is connected via BMTC bus routes, autos, and cab networks across Bangalore. Confirm the walk distance to the nearest main-road stop during your visit.`,
            },
            {
                question: `Do girls PGs in ${name} include food and WiFi?`,
                answer: `Most verified women's PGs and coliving stays in ${name} include high-speed WiFi, housekeeping, and optional or bundled breakfast and dinner (veg and non-veg options vary by property).`,
            },
        ];
    }

    return [
        {
            question: `What is the average rent for a boys PG in ${name}?`,
            answer: `Boys PG and men's coliving stays in ${name} typically fall in the ${priceText} band depending on sharing type (single, twin, or triple), AC, and meal inclusions.`,
        },
        {
            question: `Which tech parks and offices are close to boys PGs in ${name}?`,
            answer: `Working professionals choosing a boys PG in ${name} typically commute to ${officeText}. Choosing a street near arterial junctions reduces daily peak-hour travel.`,
        },
        {
            question: `How is metro and bus connectivity from ${name}?`,
            answer: metro
                ? `${metro} Regular BMTC buses and shared autos also connect ${name} to nearby IT hubs and residential areas.`
                : `${name} has regular BMTC bus connectivity and cab/auto access to surrounding Bangalore employment hubs.`,
        },
        {
            question: `Are meals, laundry, and WiFi included in boys PGs in ${name}?`,
            answer: `Most managed boys PGs in ${name} provide high-speed WiFi, washing machine access, regular housekeeping, and 2–3 meals per day. Exact inclusions and electricity charges are listed on each property page.`,
        },
        {
            question: `Is there any brokerage for booking a boys PG in ${name} on MakeMyStay?`,
            answer: `No. Verified listings on MakeMyStay.ai are zero-brokerage—you pay rent and refundable security deposit transparently without broker commissions.`,
        },
    ];
}

export function PgGenderLocalityContent({
    name,
    slug,
    gender,
    rentRange,
    landmarks,
    profile,
    content,
    liveListingCount,
    liveMinPrice,
    liveMaxPrice,
    nearbySlugs = [],
}: PgGenderLocalityContentProps) {
    const isFemale = gender === 'female';
    const genderSlugPrefix = isFemale ? 'pg-for-girls-in' : 'pg-for-boys-in';
    const audienceTitle = isFemale ? 'Girls PG' : 'Boys PG';
    const audienceNoun = isFemale ? 'working women and female students' : 'working men and male students';

    const livePriceBand =
        liveMinPrice && liveMaxPrice
            ? liveMinPrice === liveMaxPrice
                ? `₹${liveMinPrice.toLocaleString('en-IN')}/month`
                : `₹${liveMinPrice.toLocaleString('en-IN')}–₹${liveMaxPrice.toLocaleString('en-IN')}/month`
            : null;
    const displayRentBand = livePriceBand || rentRange || profile?.rent.shared || '₹6,000–₹18,000/month';

    const nearbyOffices = profile?.nearbyOffices?.filter(Boolean) ?? [];
    const bestStreets = profile?.bestStreets?.filter(Boolean) ?? [];
    const safeLandmarks = landmarks?.filter(Boolean) ?? [];
    const metroNote = content?.metroConnectivity || profile?.metro;

    const neighborLinks = nearbySlugs
        .filter((s) => s && s !== slug)
        .map((s) => getPgLocationBySlug(s))
        .filter((l): l is NonNullable<typeof l> => Boolean(l))
        .slice(0, 5);

    return (
        <section
            aria-labelledby={`gender-guide-${slug}`}
            className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm space-y-6 text-slate-700"
        >
            <div>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-red">
                    {isFemale ? 'Women’s Accommodation Guide' : 'Men’s Accommodation Guide'} · {name}
                </p>
                <h2 id={`gender-guide-${slug}`} className="mt-1 text-2xl font-bold text-slate-900">
                    {audienceTitle} in {name}, Bangalore — Area, Rent &amp; Commute Guide
                </h2>
                <p className="mt-3 text-sm md:text-base leading-relaxed">
                    {isFemale ? (
                        <>
                            Finding a safe, well-managed <strong>girls PG in {name}</strong> matters most for{' '}
                            {audienceNoun} balancing daily commutes with reliable security and hygiene. On MakeMyStay.ai,
                            every stay is listed with transparent monthly rent, real photographs, and clear amenity
                            checklists—helping you compare single, double, and triple sharing rooms without broker fees.
                        </>
                    ) : (
                        <>
                            Choosing a verified <strong>boys PG in {name}</strong> gives {audienceNoun} a practical
                            base close to Bangalore&apos;s employment hubs with predictable monthly costs. Compare
                            single and shared rooms with WiFi, daily meals, laundry, and power backup on MakeMyStay.ai
                            with zero brokerage.
                        </>
                    )}{' '}
                    {liveListingCount > 0 ? (
                        <>
                            Currently, <strong>{liveListingCount} verified PG {liveListingCount === 1 ? 'listing is' : 'listings are'}</strong>{' '}
                            available in {name} starting around <strong>{displayRentBand}</strong>.
                        </>
                    ) : (
                        <>
                            Typical PG pricing in {name} is around <strong>{displayRentBand}</strong> depending on
                            sharing occupancy, AC, and meal inclusions.
                        </>
                    )}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-brand-red shrink-0" aria-hidden />
                        Typical Rent Range in {name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed">
                        {livePriceBand ? (
                            <>Live verified listings in {name} range from <strong>{livePriceBand}</strong>.</>
                        ) : (
                            <>Expected monthly rent in {name} is <strong>{displayRentBand}</strong>.</>
                        )}{' '}
                        {profile?.rent.shared && profile?.rent.single ? (
                            <>
                                Shared rooms generally fall in <strong>{profile.rent.shared}</strong> while private
                                single rooms typically run <strong>{profile.rent.single}</strong>.
                            </>
                        ) : (
                            <>
                                Triple and twin sharing rooms sit at the lower end of the range, while single AC rooms
                                with attached washrooms sit toward the upper end.
                            </>
                        )}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Train className="w-4 h-4 text-brand-red shrink-0" aria-hidden />
                        Metro &amp; Bus Access
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed">
                        {metroNote ? (
                            metroNote
                        ) : (
                            <>
                                {name} connects to surrounding Bangalore work hubs via BMTC buses, autos, and cab
                                services. Check peak-hour commute time from the exact street before booking.
                            </>
                        )}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-brand-red shrink-0" aria-hidden />
                        Nearby Offices, Colleges &amp; Landmarks
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed">
                        {nearbyOffices.length > 0 && (
                            <>Key nearby workplaces include <strong>{nearbyOffices.slice(0, 5).join(', ')}</strong>. </>
                        )}
                        {content?.nearbyColleges && <>{content.nearbyColleges} </>}
                        {safeLandmarks.length > 0 && (
                            <>Well-known local landmarks in {name} include <strong>{safeLandmarks.join(', ')}</strong>. </>
                        )}
                        {bestStreets.length > 0 && (
                            <>Popular residential pockets for PGs include {bestStreets.slice(0, 3).join(', ')}.</>
                        )}
                        {nearbyOffices.length === 0 && !content?.nearbyColleges && safeLandmarks.length === 0 && (
                            <>
                                {name} serves commuters working across nearby Bangalore tech parks and commercial
                                corridors. Compare map distance on each listing card before scheduling a visit.
                            </>
                        )}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        {isFemale ? (
                            <ShieldCheck className="w-4 h-4 text-brand-red shrink-0" aria-hidden />
                        ) : (
                            <Utensils className="w-4 h-4 text-brand-red shrink-0" aria-hidden />
                        )}
                        {isFemale ? `Safety, Security & Food in ${name}` : `Food, Amenities & Daily Living in ${name}`}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed">
                        {isFemale ? (
                            <>
                                {content?.safety ? `${content.safety} ` : ''}
                                Prioritize ladies PGs in {name} with 24/7 CCTV, biometric or keycard entry, on-site
                                warden support, well-lit streets, and transparent guest/timing rules. Most properties
                                also provide freshly cooked weekday and weekend meals, WiFi, and housekeeping.
                            </>
                        ) : (
                            <>
                                {content?.foodAndLifestyle ? `${content.foodAndLifestyle} ` : ''}
                                Most boys PGs in {name} include high-speed WiFi for hybrid work, daily meals (North
                                and South Indian menus), washing machine access, two-wheeler parking, and power backup.
                                Always confirm electricity billing and notice-period terms before move-in.
                            </>
                        )}
                    </p>
                </div>
            </div>

            {neighborLinks.length > 0 && (
                <div className="pt-4 border-t border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-brand-red shrink-0" aria-hidden />
                        Nearby Areas for {audienceTitle}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {neighborLinks.map((nb) => (
                            <Link
                                key={nb.slug}
                                to={`/${genderSlugPrefix}-${nb.slug}`}
                                className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-brand-red/40 hover:text-brand-red transition-colors"
                            >
                                {audienceTitle} in {nb.name}
                            </Link>
                        ))}
                        <Link
                            to={`/pg/${slug}`}
                            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-brand-red hover:bg-red-50 transition-colors"
                        >
                            All PGs in {name}
                        </Link>
                        <Link
                            to={`/rent/${slug}`}
                            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-brand-red/40 hover:text-brand-red transition-colors"
                        >
                            Flats for Rent in {name}
                        </Link>
                    </div>
                </div>
            )}
        </section>
    );
}
