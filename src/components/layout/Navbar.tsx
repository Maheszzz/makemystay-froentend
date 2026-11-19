"use client";

import { useState, useEffect, useRef } from 'react';
import { X, Menu, Phone, ArrowRight, Search, Heart, CreditCard, Video, BookOpen, MapPin, ChevronDown, Check } from 'lucide-react';
import { navigationLinks } from '@/data/content';
import { Button } from '@/components/ui/Button';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Link, useLocation, useNavigate } from '@/lib/navigation';
import { useAuth } from '@/context/AuthContext';

const NAV_CITIES = [
    { slug: 'bangalore', label: 'Bangalore' },
    { slug: 'pune', label: 'Pune' },
    { slug: 'hyderabad', label: 'Hyderabad' },
] as const;

type NavCitySlug = typeof NAV_CITIES[number]['slug'];

interface CityDropdownProps {
    selectedCity: NavCitySlug;
    onSelect: (slug: NavCitySlug) => void;
    calm?: boolean;
}

function CityDropdown({ selectedCity, onSelect, calm = false }: CityDropdownProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);
    const currentLabel = NAV_CITIES.find((c) => c.slug === selectedCity)?.label ?? 'Bangalore';

    useEffect(() => {
        if (!open) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEsc);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEsc);
        };
    }, [open]);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="hidden md:inline-flex items-center justify-between gap-1.5 rounded-full border min-w-[122px] border-line bg-white px-3 py-1.5 text-xs font-medium text-ink hover:bg-blush-100 transition-colors"
            >
                <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-red" />
                    {currentLabel}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div
                    role="listbox"
                    aria-label="Select city"
                    className="absolute left-0 top-full mt-2 w-44 rounded-xl border border-line bg-white shadow-xl p-1 z-50"
                >
                    {NAV_CITIES.map((c) => {
                        const active = c.slug === selectedCity;
                        return (
                            <button
                                key={c.slug}
                                type="button"
                                role="option"
                                aria-selected={active}
                                onClick={() => {
                                    onSelect(c.slug);
                                    setOpen(false);
                                }}
                                className={`w-full flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                                    active
                                        ? 'bg-red text-white'
                                        : 'text-ink hover:bg-blush-100'
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <MapPin className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-slate'}`} />
                                    {c.label}
                                </span>
                                {active && <Check className="w-4 h-4" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export function Navbar({ city, variant: _variant }: { city?: string; variant?: 'default' | 'calm' }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    useAuth();

    const [selectedCity, setSelectedCity] = useState<NavCitySlug>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('make_my_stay_city');
            if (city && NAV_CITIES.some(c => c.slug === city.toLowerCase())) {
                return city.toLowerCase() as NavCitySlug;
            }
            if (saved && NAV_CITIES.some(c => c.slug === saved)) {
                return saved as NavCitySlug;
            }
        }
        return 'bangalore';
    });

    const handleCitySelect = (slug: NavCitySlug) => {
        setSelectedCity(slug);
        if (typeof window !== 'undefined') {
            localStorage.setItem('make_my_stay_city', slug);
        }
        navigate(`/pg/${slug}`);
    };

    useEffect(() => {
        if (city && NAV_CITIES.some(c => c.slug === city.toLowerCase())) {
            setSelectedCity(city.toLowerCase() as NavCitySlug);
            if (typeof window !== 'undefined') {
                localStorage.setItem('make_my_stay_city', city.toLowerCase());
            }
        }
    }, [city]);

    useEffect(() => {
        const parts = location.pathname.toLowerCase().split('/').filter(Boolean);
        if (parts[0] === 'pg' && parts[1] && NAV_CITIES.some((c) => c.slug === parts[1] as NavCitySlug)) {
            setSelectedCity(parts[1] as NavCitySlug);
            if (typeof window !== 'undefined') {
                localStorage.setItem('make_my_stay_city', parts[1]);
            }
        }
    }, [location.pathname]);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    // Handle scroll after navigation to home
    useEffect(() => {
        if (location.pathname === '/' && location.hash) {
            const sectionId = location.hash.replace('#', '');
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }, [location]);

    const handleNavClick = (item: string, e: React.MouseEvent) => {
        const sectionId = item.toLowerCase().replace(' ', '-');

        if (item === 'Home') {
            e.preventDefault();
            if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                navigate('/');
            }
            setIsMenuOpen(false);
            return;
        }



        if (location.pathname === '/') {
            e.preventDefault();
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // Navigate to home with hash
            navigate(`/#${sectionId}`);
        }
        setIsMenuOpen(false);
    };

    const pathname = location.pathname.toLowerCase();
    const isContactPage = pathname === '/contact-us';
    const importantNavItems = navigationLinks.filter((item) => ['Home'].includes(item));

    const desktopNavItems: { label: string; to: string; active: boolean; isHome?: boolean }[] = [
        ...importantNavItems.map((item) => ({
            label: item,
            to: '/',
            active: pathname === '/',
            isHome: true,
        })),
        {
            label: 'PGs',
            to: '/pg',
            active:
                pathname === '/pg' ||
                pathname.startsWith('/pg/') ||
                pathname.startsWith('/pg-'),
        },
        {
            label: 'Flats',
            to: '/rent',
            active:
                pathname === '/rent' ||
                pathname.startsWith('/rent/') ||
                pathname.includes('bhk') ||
                pathname === '/flats-in-bangalore',
        },
        {
            label: 'About Us',
            to: '/about',
            active: pathname === '/about',
        },
        {
            label: 'Blog',
            to: '/blog',
            active: pathname === '/blog' || pathname.startsWith('/blog/'),
        },
        {
            label: 'Quick Pay',
            to: '/quick-pay',
            active: pathname === '/quick-pay',
        },
        {
            label: 'For Owners',
            to: '/for-owners',
            active: pathname === '/for-owners',
        },
    ];

    const navBarClasses = `fixed w-full z-50 transition-all duration-200 bg-white border-b border-line ${
        isScrolled ? 'py-1.5' : 'py-2'
    }`;

    return (
        <>
            <nav className={navBarClasses} aria-label="Main navigation">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between md:grid md:grid-cols-[auto_auto_1fr_auto] md:items-center md:gap-4 lg:gap-8">
                        <Link
                            to="/"
                            aria-label="MakeMyStay Home"
                            className="inline-flex items-center shrink-0 rounded"
                        >
                            <BrandLogo variant="dark" />
                        </Link>

                        <CityDropdown selectedCity={selectedCity} onSelect={handleCitySelect} />

                        <div className="hidden md:flex items-center justify-self-center min-w-0 gap-x-4 lg:gap-x-6">
                            {desktopNavItems.map((navItem) => {
                                const linkCls = `relative py-1 whitespace-nowrap text-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 rounded ${
                                    navItem.active
                                        ? 'font-semibold text-ink'
                                        : 'font-medium text-slate hover:text-ink'
                                }`;
                                return navItem.isHome ? (
                                    <a
                                        key={navItem.label}
                                        href="/"
                                        aria-current={navItem.active ? 'page' : undefined}
                                        onClick={(e) => handleNavClick(navItem.label, e)}
                                        className={linkCls}
                                    >
                                        {navItem.label}
                                        {navItem.active && (
                                            <span
                                                aria-hidden="true"
                                                className="absolute inset-x-0 -bottom-[9px] h-[2px] bg-red rounded-full"
                                            />
                                        )}
                                    </a>
                                ) : (
                                    <Link
                                        key={navItem.label}
                                        to={navItem.to}
                                        aria-current={navItem.active ? 'page' : undefined}
                                        className={linkCls}
                                    >
                                        {navItem.label}
                                        {navItem.active && (
                                            <span
                                                aria-hidden="true"
                                                className="absolute inset-x-0 -bottom-[9px] h-[2px] bg-red rounded-full"
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="flex items-center justify-end justify-self-end shrink-0 gap-2">
                            <Link
                                to="/for-owners"
                                aria-label="List your PG or property"
                                className="md:hidden inline-flex items-center rounded-full border border-ink bg-white px-2.5 py-1 text-[11px] font-medium text-ink hover:bg-red hover:border-red hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2"
                            >
                                List PG
                            </Link>
                            <Link
                                to="/contact-us"
                                aria-current={isContactPage ? 'page' : undefined}
                                className={`hidden md:inline-flex items-center justify-center gap-2 min-h-[44px] rounded-[10px] border-[1.5px] border-red px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 ${
                                    isContactPage
                                        ? 'bg-red text-white hover:bg-red-hover hover:border-red-hover'
                                        : 'bg-white text-red hover:bg-red hover:text-white'
                                }`}
                            >
                                <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
                                Contact Us
                            </Link>
                            <button
                                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="md:hidden p-2 rounded-lg transition-colors flex items-center justify-center text-pdp-ink hover:bg-pdp-bg min-w-[40px] min-h-[40px]"
                            >
                                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Full-Screen Mobile Menu Overlay — rendered outside nav for correct z-index */}
            <div
                className={`fixed inset-0 z-[60] md:hidden transition-all duration-500 ${isMenuOpen
                    ? 'opacity-100 pointer-events-auto'
                    : 'opacity-0 pointer-events-none'
                    }`}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={() => setIsMenuOpen(false)}
                />

                {/* Menu Panel */}
                <div
                    className={`absolute top-0 right-0 w-[85%] max-w-[360px] h-full bg-red-900 shadow-2xl transition-transform duration-500 ease-out flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    {/* Menu Header */}
                    <div className="flex items-center justify-between p-6 border-b border-champagne/25">
                        <BrandLogo variant="light" />
                        <button
                            aria-label="Close menu"
                            onClick={() => setIsMenuOpen(false)}
                            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Nav Links */}
                    <div className="flex-1 overflow-y-auto py-4 px-5">

                        {/* ── Primary Booking Actions ── */}
                        <p className="text-xs font-medium text-red-subtitle px-1 mb-3">Quick actions</p>
                        <div className="space-y-1.5 mb-5">
                            <Link
                                to="/properties"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-champagne/20 text-white transition-colors group"
                            >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-red-800 border border-champagne/30">
                                    <Search className="w-4 h-4 text-champagne" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-sm">Find Homes</div>
                                    <div className="text-[11px] text-red-subtitle">Browse verified PG &amp; rentals</div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-red-subtitle group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                            </Link>

                            <Link
                                to="/wishlist"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-champagne/20 text-white transition-colors group"
                            >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-red-800 border border-champagne/30">
                                    <Heart className="w-4 h-4 text-champagne" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-sm">Wishlist</div>
                                    <div className="text-[11px] text-red-subtitle">Your saved properties</div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-red-subtitle group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                            </Link>

                            <Link
                                to="/blog"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-champagne/20 text-white transition-colors group"
                            >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-red-800 border border-champagne/30">
                                    <BookOpen className="w-4 h-4 text-champagne" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-sm">Blog</div>
                                    <div className="text-[11px] text-red-subtitle">Guides &amp; Bangalore tips</div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-red-subtitle group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                            </Link>

                            <Link
                                to="/quick-pay"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-champagne/20 text-white transition-colors group"
                            >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-red-800 border border-champagne/30">
                                    <CreditCard className="w-4 h-4 text-champagne" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-sm">Quick Pay</div>
                                    <div className="text-[11px] text-red-subtitle">Pay booking fee securely</div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-red-subtitle group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                            </Link>
                        </div>

                        <Link
                            to="/for-owners"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-champagne/20 text-white transition-colors group mb-5"
                        >
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-red-800 border border-champagne/30">
                                <Video className="w-4 h-4 text-champagne" />
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold text-sm">For Property Owners</div>
                                <div className="text-[11px] text-red-subtitle">List &amp; manage your property</div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-red-subtitle group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                        </Link>

                        {/* ── Divider ── */}
                        <div className="flex items-center gap-3 mb-3">
                            <div className="flex-1 h-px bg-champagne/25" />
                            <p className="text-xs font-medium text-red-subtitle">More</p>
                            <div className="flex-1 h-px bg-champagne/25" />
                        </div>

                        {/* ── Info Pages ── */}
                        <div className="space-y-0.5">
                            {navigationLinks.map((item, idx) => (
                                <a
                                    key={item}
                                    href={item === 'Home' ? '/' : `/#${item.toLowerCase().replace(' ', '-')}`}
                                    onClick={(e) => handleNavClick(item, e)}
                                    className="flex items-center justify-between py-3 px-2 text-sm font-medium text-red-subtitle hover:text-white border-b border-champagne/15 transition-colors group"
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                >
                                    <span>{item}</span>
                                    <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Menu Footer */}
                    <div className="p-6 border-t border-champagne/25 space-y-4">
                        <Link to="/contact-us" onClick={() => setIsMenuOpen(false)}>
                            <Button
                                variant="outline"
                                className="w-full py-3.5 text-base border-white/40 text-white hover:border-white hover:text-white hover:bg-white/10 rounded-[10px]"
                            >
                                Contact Us
                            </Button>
                        </Link>
                        <a
                            href="tel:+918150099911"
                            className="flex items-center justify-center gap-2 py-3 text-sm text-red-subtitle hover:text-white transition-colors"
                        >
                            <Phone className="w-4 h-4" />
                            +91 81500 99911
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
