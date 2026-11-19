import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { BRAND_CONTACT, BRAND_EXTENDED, BRAND_SOCIAL_URLS } from '@/lib/brandEntity';
import { Link } from '@/lib/navigation';
import { LEGAL_ENTITY_NAME } from '@/lib/siteConfig';

const LOGO_SRC = '/logo-nav.jpg';
const REGISTERED_ADDRESS = 'HSR Layout, Sector 7, Bengaluru, Karnataka 560102';

const FOOTER_EXPLORE = [
    { label: 'PGs', to: '/pg' },
    { label: 'Flats', to: '/rent' },
    { label: 'Buy', to: '/buy' },
    { label: 'Plots', to: '/plots' },
] as const;

const FOOTER_POPULAR_AREAS = [
    { label: 'Whitefield', to: '/pg/whitefield' },
    { label: 'HSR Layout', to: '/pg/hsr-layout' },
    { label: 'Koramangala', to: '/pg/koramangala' },
    { label: 'BTM Layout', to: '/pg/btm' },
    { label: 'Marathahalli', to: '/pg/marathahalli' },
    { label: 'Bellandur', to: '/pg/bellandur' },
    { label: 'Indiranagar', to: '/pg/indiranagar' },
    { label: 'Electronic City', to: '/pg/electronic-city' },
] as const;

const FOOTER_COMPANY = [
    { label: 'About', to: '/about' },
    { label: 'How we verify', to: '/how-we-verify' },
    { label: 'Blog', to: '/blog' },
    { label: 'Quick Pay', to: '/quick-pay' },
    { label: 'For owners', to: '/for-owners' },
    { label: 'Contact', to: '/contact-us' },
] as const;

const FOOTER_LEGAL = [
    { label: 'Privacy', to: '/privacy' },
    { label: 'Terms', to: '/terms' },
    { label: 'Refund policy', to: '/refund-policy' },
] as const;

export function Footer() {
    return (
        <footer className="bg-pdp-contrast-bg text-pdp-contrast-muted pt-14 md:pt-16 pb-24 md:pb-12 border-t border-pdp-contrast-border">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-pdp-contrast-border">
                    {/* Brand, Contact & Registered Address */}
                    <div className="lg:col-span-4 space-y-5">
                        <div className="flex items-center gap-2.5">
                            <img
                                src={LOGO_SRC}
                                alt="MakeMyStay.ai logo"
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-lg object-contain bg-white"
                            />
                            <span className="text-xl font-bold text-white tracking-tight font-heading">
                                MakeMyStay<span className="text-pdp-contrast-muted font-semibold">.ai</span>
                            </span>
                        </div>

                        <p className="text-sm leading-relaxed text-pdp-contrast-muted max-w-sm">
                            {BRAND_EXTENDED}
                        </p>

                        <div className="space-y-2.5 text-sm">
                            <div className="flex items-start gap-2.5">
                                <MapPin className="w-4 h-4 text-pdp-contrast-muted shrink-0 mt-0.5" aria-hidden />
                                <span>
                                    <strong className="font-medium text-white">{LEGAL_ENTITY_NAME}</strong>
                                    <br />
                                    {REGISTERED_ADDRESS}
                                </span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Mail className="w-4 h-4 text-pdp-contrast-muted shrink-0" aria-hidden />
                                <a
                                    href={`mailto:${BRAND_CONTACT.email}`}
                                    className="hover:text-white underline underline-offset-4 transition-colors"
                                >
                                    {BRAND_CONTACT.email}
                                </a>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Phone className="w-4 h-4 text-pdp-contrast-muted shrink-0" aria-hidden />
                                <a
                                    href={`tel:${BRAND_CONTACT.telephone}`}
                                    className="hover:text-white transition-colors tabular-nums"
                                >
                                    +91 81500 99911
                                </a>
                            </div>
                        </div>

                        {/* Clean social links (zero tracking parameters) */}
                        <div className="flex items-center gap-2.5 pt-1">
                            <a
                                href={BRAND_SOCIAL_URLS.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="MakeMyStay on Facebook"
                                className="w-9 h-9 rounded-full border border-pdp-contrast-border bg-pdp-contrast-surface text-pdp-contrast-muted hover:text-white hover:border-white/30 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                            >
                                <Facebook size={16} aria-hidden />
                            </a>
                            <a
                                href={BRAND_SOCIAL_URLS.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="MakeMyStay on Instagram"
                                className="w-9 h-9 rounded-full border border-pdp-contrast-border bg-pdp-contrast-surface text-pdp-contrast-muted hover:text-white hover:border-white/30 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                            >
                                <Instagram size={16} aria-hidden />
                            </a>
                            <a
                                href={BRAND_SOCIAL_URLS.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="MakeMyStay on LinkedIn"
                                className="w-9 h-9 rounded-full border border-pdp-contrast-border bg-pdp-contrast-surface text-pdp-contrast-muted hover:text-white hover:border-white/30 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                            >
                                <Linkedin size={16} aria-hidden />
                            </a>
                            <a
                                href={BRAND_SOCIAL_URLS.x}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="MakeMyStay on X"
                                className="w-9 h-9 rounded-full border border-pdp-contrast-border bg-pdp-contrast-surface text-pdp-contrast-muted hover:text-white hover:border-white/30 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                            >
                                <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* 4 Navigation Columns */}
                    <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
                        <div>
                            <h2 className="text-sm font-semibold text-white mb-4">Explore</h2>
                            <ul className="space-y-2.5 text-sm">
                                {FOOTER_EXPLORE.map((item) => (
                                    <li key={item.to}>
                                        <Link
                                            to={item.to}
                                            className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-white mb-4">Popular areas</h2>
                            <ul className="space-y-2.5 text-sm">
                                {FOOTER_POPULAR_AREAS.map((item) => (
                                    <li key={item.to}>
                                        <Link
                                            to={item.to}
                                            className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-white mb-4">Company</h2>
                            <ul className="space-y-2.5 text-sm">
                                {FOOTER_COMPANY.map((item) => (
                                    <li key={item.to}>
                                        <Link
                                            to={item.to}
                                            className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-white mb-4">Legal</h2>
                            <ul className="space-y-2.5 text-sm">
                                {FOOTER_LEGAL.map((item) => (
                                    <li key={item.to}>
                                        <Link
                                            to={item.to}
                                            className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-pdp-contrast-muted">
                    <p>&copy; 2026 {LEGAL_ENTITY_NAME}. All rights reserved.</p>
                    <p>Registered office: {REGISTERED_ADDRESS}</p>
                </div>
            </div>
        </footer>
    );
}
