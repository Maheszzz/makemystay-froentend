import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { BRAND_CONTACT, BRAND_EXTENDED, BRAND_SOCIAL_URLS } from '@/lib/brandEntity';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Link } from '@/lib/navigation';
import { LEGAL_ENTITY_NAME } from '@/lib/siteConfig';

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
        <footer className="bg-red-900 text-red-subtitle pt-14 md:pt-16 pb-24 md:pb-12 border-t border-champagne/30">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-champagne/25">
                    {/* Brand, Contact & Registered Address */}
                    <div className="lg:col-span-4 space-y-5 lg:pr-8 lg:border-r lg:border-champagne/20">
                        <Link to="/" aria-label="MakeMyStay.ai Home" className="inline-flex rounded">
                            <BrandLogo variant="light" />
                        </Link>

                        <p className="text-sm leading-relaxed text-red-subtitle max-w-sm">
                            {BRAND_EXTENDED}
                        </p>

                        <div className="space-y-2.5 text-sm">
                            <div className="flex items-start gap-2.5">
                                <MapPin className="w-4 h-4 text-champagne shrink-0 mt-0.5" aria-hidden />
                                <span>
                                    <strong className="font-medium text-white">{LEGAL_ENTITY_NAME}</strong>
                                    <br />
                                    {REGISTERED_ADDRESS}
                                </span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Mail className="w-4 h-4 text-champagne shrink-0" aria-hidden />
                                <a
                                    href={`mailto:${BRAND_CONTACT.email}`}
                                    className="text-red-subtitle hover:text-white hover:underline underline-offset-4 transition-colors rounded"
                                >
                                    {BRAND_CONTACT.email}
                                </a>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Phone className="w-4 h-4 text-champagne shrink-0" aria-hidden />
                                <a
                                    href={`tel:${BRAND_CONTACT.telephone}`}
                                    className="text-red-subtitle hover:text-white hover:underline underline-offset-4 transition-colors tabular-nums rounded"
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
                                className="w-9 h-9 rounded-full border border-champagne/35 bg-red-800/70 text-red-subtitle hover:text-white hover:bg-red hover:border-red flex items-center justify-center transition-colors"
                            >
                                <Facebook size={16} aria-hidden />
                            </a>
                            <a
                                href={BRAND_SOCIAL_URLS.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="MakeMyStay on Instagram"
                                className="w-9 h-9 rounded-full border border-champagne/35 bg-red-800/70 text-red-subtitle hover:text-white hover:bg-red hover:border-red flex items-center justify-center transition-colors"
                            >
                                <Instagram size={16} aria-hidden />
                            </a>
                            <a
                                href={BRAND_SOCIAL_URLS.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="MakeMyStay on LinkedIn"
                                className="w-9 h-9 rounded-full border border-champagne/35 bg-red-800/70 text-red-subtitle hover:text-white hover:bg-red hover:border-red flex items-center justify-center transition-colors"
                            >
                                <Linkedin size={16} aria-hidden />
                            </a>
                            <a
                                href={BRAND_SOCIAL_URLS.x}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="MakeMyStay on X"
                                className="w-9 h-9 rounded-full border border-champagne/35 bg-red-800/70 text-red-subtitle hover:text-white hover:bg-red hover:border-red flex items-center justify-center transition-colors"
                            >
                                <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* 4 Navigation Columns separated by champagne hairlines */}
                    <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-0 sm:divide-x sm:divide-champagne/20">
                        <div className="sm:pr-6">
                            <h2 className="text-sm font-semibold text-white mb-4">Explore</h2>
                            <ul className="space-y-2.5 text-sm">
                                {FOOTER_EXPLORE.map((item) => (
                                    <li key={item.to}>
                                        <Link
                                            to={item.to}
                                            className="text-red-subtitle hover:text-white hover:underline underline-offset-4 transition-colors rounded"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="sm:px-6">
                            <h2 className="text-sm font-semibold text-white mb-4">Popular areas</h2>
                            <ul className="space-y-2.5 text-sm">
                                {FOOTER_POPULAR_AREAS.map((item) => (
                                    <li key={item.to}>
                                        <Link
                                            to={item.to}
                                            className="text-red-subtitle hover:text-white hover:underline underline-offset-4 transition-colors rounded"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="sm:px-6">
                            <h2 className="text-sm font-semibold text-white mb-4">Company</h2>
                            <ul className="space-y-2.5 text-sm">
                                {FOOTER_COMPANY.map((item) => (
                                    <li key={item.to}>
                                        <Link
                                            to={item.to}
                                            className="text-red-subtitle hover:text-white hover:underline underline-offset-4 transition-colors rounded"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="sm:pl-6">
                            <h2 className="text-sm font-semibold text-white mb-4">Legal</h2>
                            <ul className="space-y-2.5 text-sm">
                                {FOOTER_LEGAL.map((item) => (
                                    <li key={item.to}>
                                        <Link
                                            to={item.to}
                                            className="text-red-subtitle hover:text-white hover:underline underline-offset-4 transition-colors rounded"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-red-subtitle">
                    <p>&copy; 2026 {LEGAL_ENTITY_NAME}. All rights reserved.</p>
                    <p>Registered office: {REGISTERED_ADDRESS}</p>
                </div>
            </div>
        </footer>
    );
}
