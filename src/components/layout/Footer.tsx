import { Facebook, Instagram, Linkedin, Phone } from 'lucide-react';
import { BRAND_CONTACT, BRAND_SOCIAL_URLS } from '@/lib/brandEntity';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Link } from '@/lib/navigation';

const BANGALORE_PG_ZONES = [
    {
        heading: 'PG in Whitefield',
        links: [
            { label: 'PG in Whitefield', to: '/pg/whitefield' },
            { label: 'PG in AECS Layout', to: '/pg/aecs-layout' },
            { label: 'PG in Brookefield', to: '/pg/brookefield' },
            { label: 'PG in BEML Layout', to: '/pg/beml-layout' },
        ],
    },
    {
        heading: 'PG in Marathahalli',
        links: [
            { label: 'PG in Marathahalli', to: '/pg/marathahalli' },
            { label: 'PG in Kadubeesanahalli', to: '/pg/kadubeesanahalli' },
            { label: 'PG in Mahadevapura', to: '/pg/mahadevapura' },
        ],
    },
    {
        heading: 'PG in Silk Board',
        links: [
            { label: 'PG in Electronic City', to: '/pg/electronic-city' },
            { label: 'PG in Bommanahalli', to: '/pg/bommanahalli' },
            { label: 'PG in BTM Layout', to: '/pg/btm' },
        ],
    },
    {
        heading: 'PG in Sarjapur',
        links: [
            { label: 'PG in Sarjapur', to: '/pg/sarjapur-road' },
            { label: 'PG in Bellandur', to: '/pg/bellandur' },
            { label: 'PG in HSR Layout', to: '/pg/hsr-layout' },
        ],
    },
    {
        heading: 'PG in South',
        links: [
            { label: 'PG in Koramangala', to: '/pg/koramangala' },
            { label: 'PG in Bannerghatta', to: '/pg/bannerghatta' },
            { label: 'PG in JP Nagar', to: '/pg/jp-nagar' },
            { label: 'PG in Jayanagar', to: '/pg/jayanagar' },
        ],
    },
    {
        heading: 'PG in Central & North',
        links: [
            { label: 'PG in Indiranagar', to: '/pg/indiranagar' },
            { label: 'PG in Halasuru', to: '/pg/halasuru' },
            { label: 'PG in Hebbal', to: '/pg/hebbal' },
            { label: 'PG in Nagavara', to: '/pg/nagawara' },
            { label: 'PG in Veerannapalya', to: '/pg/veerannapalya' },
        ],
    },
] as const;

const HYDERABAD_PG_LINKS = [
    { label: 'PG in Hafeezpet', to: '/pg/hafeezpet' },
    { label: 'PG in Gachibowli', to: '/pg/gachibowli' },
    { label: 'PG in Nanakramguda', to: '/pg/nanakramguda' },
] as const;

const FOOTER_EXPLORE = [
    { label: 'PGs', to: '/pg' },
    { label: 'Flats', to: '/rent' },
    { label: 'Buy', to: '/buy' },
    { label: 'Plots', to: '/plots' },
    { label: 'Popular Areas', to: '/pg/bangalore' },
] as const;

const FOOTER_COMPANY = [
    { label: 'About Us', to: '/about' },
    { label: 'How we verify', to: '/how-we-verify' },
    { label: 'Blog', to: '/blog' },
    { label: 'Quick Pay', to: '/quick-pay' },
    { label: 'For Owners', to: '/for-owners' },
    { label: 'Contact Us', to: '/contact-us' },
] as const;

const FOOTER_LEGAL = [
    { label: 'Terms & conditions', to: '/terms', external: false },
    { label: 'Privacy Policy', to: '/privacy', external: false },
    { label: 'Refund Policy', to: '/refund-policy', external: false },
    { label: 'Sitemap', to: '/sitemap.xml', external: true },
] as const;

const FOOTER_FOCUS =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#3B0A0A]';

const DIR_LINK_CLS = `inline-block py-0.5 text-[13px] leading-snug text-[#D7B9B9] hover:text-white hover:underline underline-offset-4 transition-colors rounded ${FOOTER_FOCUS}`;

const UNDERLINE_LINK_CLS = `inline-block py-0.5 text-sm text-[#E5CECE] underline decoration-[#C9A0A0]/60 underline-offset-4 hover:text-white hover:decoration-white transition-colors rounded ${FOOTER_FOCUS}`;

const SOCIAL_BTN_CLS = `w-9 h-9 rounded-full border border-[#D7B9B9]/45 bg-transparent text-[#F3E5E5] hover:text-white hover:bg-white/10 hover:border-white flex items-center justify-center transition-colors ${FOOTER_FOCUS}`;

export function Footer() {
    return (
        <footer
            className="bg-[#3B0A0A] text-[#D7B9B9] border-t border-white/10"
            aria-label="Site Footer"
        >
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
                {/* ── 1. TOP DIRECTORY SECTION — PG in Bangalore ── */}
                <nav aria-label="PG in Bangalore by locality">
                    <h2 className="text-lg font-bold text-white tracking-tight mb-5">
                        <Link
                            to="/pg/bangalore"
                            className={`hover:underline underline-offset-4 rounded ${FOOTER_FOCUS}`}
                        >
                            PG in Bangalore
                        </Link>
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-7">
                        {BANGALORE_PG_ZONES.map((zone) => (
                            <div key={zone.heading}>
                                <h3 className="text-sm font-semibold text-white mb-2.5">
                                    {zone.heading}
                                </h3>
                                <ul className="list-none m-0 p-0 space-y-1.5">
                                    {zone.links.map((item) => (
                                        <li key={item.to}>
                                            <Link to={item.to} className={DIR_LINK_CLS}>
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </nav>

                {/* ── 2. SECOND DIRECTORY ROW — PG in Hyderabad & PG in Pune ── */}
                <div className="mt-8 pt-7 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <nav aria-label="PG in Hyderabad by locality">
                        <h2 className="text-base font-bold text-white tracking-tight mb-3">
                            <Link
                                to="/pg/hyderabad"
                                className={`hover:underline underline-offset-4 rounded ${FOOTER_FOCUS}`}
                            >
                                PG in Hyderabad
                            </Link>
                        </h2>
                        <ul className="list-none m-0 p-0 flex flex-wrap gap-x-6 gap-y-1.5">
                            {HYDERABAD_PG_LINKS.map((item) => (
                                <li key={item.to}>
                                    <Link to={item.to} className={DIR_LINK_CLS}>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div>
                        <h2 className="text-base font-bold text-white tracking-tight mb-3">
                            <Link
                                to="/pg/pune"
                                className={`hover:underline underline-offset-4 rounded ${FOOTER_FOCUS}`}
                            >
                                PG in Pune
                            </Link>
                        </h2>
                        <p className="text-[13px] text-[#C9A8A8]">
                            Pune list is not available at this moment.
                        </p>
                    </div>
                </div>

                {/* ── 3. MIDDLE / BOTTOM SECTION — Symmetrical 3-Column Company Block ── */}
                <div className="mt-8 pt-8 border-t border-white/15 grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
                    {/* Left Column: Explore & Areas */}
                    <nav aria-label="Explore and Areas">
                        <h2 className="text-[15px] font-bold text-white mb-3.5">
                            Explore &amp; Areas
                        </h2>
                        <ul className="list-none m-0 p-0 space-y-2">
                            {FOOTER_EXPLORE.map((item) => (
                                <li key={item.to}>
                                    <Link to={item.to} className={UNDERLINE_LINK_CLS}>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Center Column: Brand Hub */}
                    <div className="flex flex-col items-start md:items-center text-left md:text-center">
                        <Link
                            to="/"
                            aria-label="MakeMyStay.ai Home"
                            className={`inline-flex items-center rounded-xl bg-[#6B1D1D] border border-white/15 px-4 py-2 shadow-sm hover:bg-[#7A2222] transition-colors ${FOOTER_FOCUS}`}
                        >
                            <BrandLogo variant="light" />
                        </Link>

                        <a
                            href={`tel:${BRAND_CONTACT.telephone}`}
                            className={`mt-4 inline-flex items-center gap-2 text-base font-semibold text-white tabular-nums hover:underline underline-offset-4 rounded ${FOOTER_FOCUS}`}
                        >
                            <span className="w-6 h-6 rounded-full border border-[#D7B9B9]/60 inline-flex items-center justify-center">
                                <Phone className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                            </span>
                            +91 81500 99911
                        </a>

                        <a
                            href={`mailto:${BRAND_CONTACT.email}`}
                            className={`mt-1.5 text-sm text-[#E5CECE] hover:text-white hover:underline underline-offset-4 rounded ${FOOTER_FOCUS}`}
                        >
                            {BRAND_CONTACT.email}
                        </a>

                        {/* Social icons */}
                        <div className="mt-4 flex items-center gap-3">
                            <a
                                href={BRAND_SOCIAL_URLS.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="MakeMyStay.ai on Facebook"
                                className={SOCIAL_BTN_CLS}
                            >
                                <Facebook size={16} aria-hidden="true" />
                            </a>
                            <a
                                href={BRAND_SOCIAL_URLS.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="MakeMyStay.ai on Instagram"
                                className={SOCIAL_BTN_CLS}
                            >
                                <Instagram size={16} aria-hidden="true" />
                            </a>
                            <a
                                href={BRAND_SOCIAL_URLS.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="MakeMyStay.ai on LinkedIn"
                                className={SOCIAL_BTN_CLS}
                            >
                                <Linkedin size={16} aria-hidden="true" />
                            </a>
                            <a
                                href={BRAND_SOCIAL_URLS.x}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="MakeMyStay.ai on X"
                                className={SOCIAL_BTN_CLS}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    width="14"
                                    height="14"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                        </div>

                        {/* Horizontal legal & sitemap links */}
                        <nav
                            aria-label="Legal and Sitemap"
                            className="mt-4 flex flex-wrap items-center justify-start md:justify-center gap-y-1 text-xs text-[#E5CECE]"
                        >
                            {FOOTER_LEGAL.map((item, idx) => (
                                <span key={item.to} className="inline-flex items-center">
                                    {idx > 0 && (
                                        <span
                                            aria-hidden="true"
                                            className="mx-2 text-[#B89292]/60 select-none"
                                        >
                                            |
                                        </span>
                                    )}
                                    {item.external ? (
                                        <a
                                            href={item.to}
                                            className={`underline decoration-[#C9A0A0]/60 underline-offset-4 hover:text-white hover:decoration-white transition-colors rounded ${FOOTER_FOCUS}`}
                                        >
                                            {item.label}
                                        </a>
                                    ) : (
                                        <Link
                                            to={item.to}
                                            className={`underline decoration-[#C9A0A0]/60 underline-offset-4 hover:text-white hover:decoration-white transition-colors rounded ${FOOTER_FOCUS}`}
                                        >
                                            {item.label}
                                        </Link>
                                    )}
                                </span>
                            ))}
                        </nav>

                        <p className="mt-3 text-xs text-[#B89292]">
                            &copy; 2026 MakeMyStay.ai. All rights reserved.
                        </p>
                    </div>

                    {/* Right Column: Company */}
                    <nav aria-label="Company" className="md:text-right">
                        <h2 className="text-[15px] font-bold text-white mb-3.5">Company</h2>
                        <ul className="list-none m-0 p-0 space-y-2">
                            {FOOTER_COMPANY.map((item) => (
                                <li key={item.to}>
                                    <Link to={item.to} className={UNDERLINE_LINK_CLS}>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>

            {/* ── 4. VERY BOTTOM BAR ── */}
            <div className="bg-[#230505] border-t border-white/10 py-3.5 px-4 pb-20 md:pb-3.5">
                <p className="text-center text-xs sm:text-sm font-bold uppercase tracking-[0.28em] text-white">
                    VERIFIED STAYS, ZERO BROKERAGE
                </p>
            </div>
        </footer>
    );
}
