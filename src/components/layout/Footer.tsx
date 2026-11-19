import { Facebook, Instagram, Linkedin, Mail, MessageCircle, Phone } from 'lucide-react';
import {
    BRAND_CONTACT,
    BRAND_EXTENDED,
    BRAND_GRIEVANCE,
    BRAND_SOCIAL_URLS,
} from '@/lib/brandEntity';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Link } from '@/lib/navigation';
import { LEGAL_ENTITY_NAME } from '@/lib/siteConfig';
import { getWhatsappDigits } from '@/lib/whatsapp';

const REGISTERED_ADDRESS = 'HSR Layout, Sector 7, Bengaluru, Karnataka 560102';
const SKYLINE_PHOTO_SOURCE =
    'https://commons.wikimedia.org/wiki/File:Skyline_of_Varthur,_Bangalore.jpg';

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

const FOOTER_FOCUS =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-red-900';

const FOOTER_LINK_CLS = `inline-flex items-center min-h-[32px] py-1 text-red-subtitle hover:text-white hover:underline underline-offset-4 transition-colors rounded ${FOOTER_FOCUS}`;

export function Footer() {
    const whatsappHref = `https://wa.me/${getWhatsappDigits()}?text=${encodeURIComponent(
        'Hi MakeMyStay team, I need help finding a stay in Bangalore.',
    )}`;

    return (
        <footer className="bg-red-900 text-red-subtitle pt-14 md:pt-16 pb-24 md:pb-12 border-t border-champagne/30">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* 5-column layout: Brand (4 cols) + 4 Navigation columns (2 cols each on lg) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 pb-12 border-b border-champagne/25">
                    {/* Column 1: Brand, Phone, Email, WhatsApp & Socials */}
                    <div className="lg:col-span-4 space-y-5 lg:pr-8 lg:border-r lg:border-champagne/20">
                        <Link
                            to="/"
                            aria-label="MakeMyStay.ai Home"
                            className={`inline-flex rounded ${FOOTER_FOCUS}`}
                        >
                            <BrandLogo variant="light" />
                        </Link>

                        <p className="text-sm leading-relaxed text-red-subtitle max-w-sm">
                            {BRAND_EXTENDED}
                        </p>

                        <div className="space-y-1.5 text-sm">
                            <div className="flex items-center gap-2.5">
                                <Phone className="w-4 h-4 text-champagne shrink-0" aria-hidden />
                                <a
                                    href={`tel:${BRAND_CONTACT.telephone}`}
                                    className={`${FOOTER_LINK_CLS} tabular-nums`}
                                >
                                    +91 81500 99911
                                </a>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Mail className="w-4 h-4 text-champagne shrink-0" aria-hidden />
                                <a href={`mailto:${BRAND_CONTACT.email}`} className={FOOTER_LINK_CLS}>
                                    {BRAND_CONTACT.email}
                                </a>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <MessageCircle
                                    className="w-4 h-4 text-champagne shrink-0"
                                    aria-hidden
                                />
                                <a
                                    href={whatsappHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={FOOTER_LINK_CLS}
                                >
                                    Chat on WhatsApp
                                </a>
                            </div>
                        </div>

                        {/* Social links (40px buttons, clean URLs without tracking parameters) */}
                        <div className="flex items-center gap-2.5 pt-1">
                            <a
                                href={BRAND_SOCIAL_URLS.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="MakeMyStay on Facebook"
                                className={`relative w-10 h-10 rounded-full border border-champagne/35 bg-red-800/70 text-red-subtitle hover:text-white hover:bg-red hover:border-red flex items-center justify-center transition-colors after:absolute after:-inset-0.5 ${FOOTER_FOCUS}`}
                            >
                                <Facebook size={18} aria-hidden />
                            </a>
                            <a
                                href={BRAND_SOCIAL_URLS.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="MakeMyStay on Instagram"
                                className={`relative w-10 h-10 rounded-full border border-champagne/35 bg-red-800/70 text-red-subtitle hover:text-white hover:bg-red hover:border-red flex items-center justify-center transition-colors after:absolute after:-inset-0.5 ${FOOTER_FOCUS}`}
                            >
                                <Instagram size={18} aria-hidden />
                            </a>
                            <a
                                href={BRAND_SOCIAL_URLS.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="MakeMyStay on LinkedIn"
                                className={`relative w-10 h-10 rounded-full border border-champagne/35 bg-red-800/70 text-red-subtitle hover:text-white hover:bg-red hover:border-red flex items-center justify-center transition-colors after:absolute after:-inset-0.5 ${FOOTER_FOCUS}`}
                            >
                                <Linkedin size={18} aria-hidden />
                            </a>
                            <a
                                href={BRAND_SOCIAL_URLS.x}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="MakeMyStay on X"
                                className={`relative w-10 h-10 rounded-full border border-champagne/35 bg-red-800/70 text-red-subtitle hover:text-white hover:bg-red hover:border-red flex items-center justify-center transition-colors after:absolute after:-inset-0.5 ${FOOTER_FOCUS}`}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Columns 2–5: Explore, Popular areas, Company, Legal */}
                    <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-0 sm:divide-x sm:divide-champagne/20">
                        <div className="sm:pr-6">
                            <h2 className="text-sm font-semibold text-white mb-4">Explore</h2>
                            <ul className="space-y-1.5 text-sm">
                                {FOOTER_EXPLORE.map((item) => (
                                    <li key={item.to}>
                                        <Link to={item.to} className={FOOTER_LINK_CLS}>
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="sm:px-6">
                            <h2 className="text-sm font-semibold text-white mb-4">Popular areas</h2>
                            <ul className="space-y-1.5 text-sm">
                                {FOOTER_POPULAR_AREAS.map((item) => (
                                    <li key={item.to}>
                                        <Link to={item.to} className={FOOTER_LINK_CLS}>
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="sm:px-6">
                            <h2 className="text-sm font-semibold text-white mb-4">Company</h2>
                            <ul className="space-y-1.5 text-sm">
                                {FOOTER_COMPANY.map((item) => (
                                    <li key={item.to}>
                                        <Link to={item.to} className={FOOTER_LINK_CLS}>
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="sm:pl-6">
                            <h2 className="text-sm font-semibold text-white mb-4">Legal</h2>
                            <ul className="space-y-1.5 text-sm">
                                {FOOTER_LEGAL.map((item) => (
                                    <li key={item.to}>
                                        <Link to={item.to} className={FOOTER_LINK_CLS}>
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom bar: copyright, registered office (once), optional grievance contact, skyline photo credit */}
                <div className="pt-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-xs text-red-subtitle">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        <p>&copy; 2026 {LEGAL_ENTITY_NAME}. All rights reserved.</p>
                        <p>Registered office: {REGISTERED_ADDRESS}</p>
                        {BRAND_GRIEVANCE && (
                            <a
                                href={BRAND_GRIEVANCE.href}
                                className={`text-red-subtitle hover:text-white hover:underline underline-offset-4 rounded ${FOOTER_FOCUS}`}
                            >
                                {BRAND_GRIEVANCE.label}
                            </a>
                        )}
                    </div>

                    <p>
                        Skyline photo:{' '}
                        <a
                            href={SKYLINE_PHOTO_SOURCE}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-red-subtitle hover:text-white hover:underline underline-offset-4 rounded ${FOOTER_FOCUS}`}
                        >
                            SlowPhoton, CC BY-SA 4.0
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
