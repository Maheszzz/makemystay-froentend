"use client";

import { useState, useEffect } from 'react';
import { X, Menu, Phone, ArrowRight, Search, Heart, CreditCard, Video, BookOpen } from 'lucide-react';
import { navigationLinks } from '@/data/content';
import { Button } from '@/components/ui/Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import logoImage from '@/assets/MakeMysStaylogo.svg';
export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    useAuth();

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

    const isHomePage = location.pathname === '/';
    const showScrolledStyle = isScrolled || !isHomePage;

    return (
        <>
            <nav className={`fixed w-full z-50 transition-all duration-300 ${showScrolledStyle ? 'bg-white/95 backdrop-blur-md shadow-sm py-3 md:py-4 border-b border-brand-gray' : 'bg-transparent py-4 md:py-6'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between md:grid md:grid-cols-[auto_1fr_auto] md:justify-normal md:items-center md:gap-3 lg:gap-4">
                        <div className="flex items-center space-x-2 shrink-0">
                            <img src={logoImage} alt="MakeMyStay Logo" className="w-8 h-8 md:w-10 md:h-10 max-w-[32px] max-h-[32px] md:max-w-[40px] md:max-h-[40px] shrink-0 rounded-lg object-cover shadow-md bg-white" />
                            <Link to="/" className={`text-xl md:text-2xl font-bold tracking-tight font-heading transition-colors ${showScrolledStyle ? 'text-brand-charcoal' : 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]'}`}>
                                MakeMyStay<span className="text-brand-red">.ai</span>
                            </Link>
                        </div>

                        <div className="hidden md:flex items-center justify-center gap-x-4 lg:gap-x-6 xl:gap-x-7 min-w-0 mx-1">
                            {navigationLinks.map((item) => (
                                <a
                                    key={item}
                                    href={item === 'Home' ? '/' : `/#${item.toLowerCase().replace(' ', '-')}`}
                                    onClick={(e) => handleNavClick(item, e)}
                                    className={`text-sm font-medium whitespace-nowrap transition-colors cursor-pointer hover:text-brand-red ${showScrolledStyle ? 'text-slate-600' : 'text-slate-200'}`}
                                >
                                    {item}
                                </a>
                            ))}
                            <Link to="/blog" className={`text-sm font-medium whitespace-nowrap transition-colors cursor-pointer hover:text-brand-red ${showScrolledStyle ? 'text-slate-600' : 'text-slate-200'}`}>
                                Blog
                            </Link>
                            <Link to="/quick-pay" className={`text-sm font-medium whitespace-nowrap transition-colors cursor-pointer hover:text-brand-red ${showScrolledStyle ? 'text-slate-600' : 'text-slate-200'}`}>
                                Quick Pay
                            </Link>

                            <Link
                                to="/schedule-demo"
                                className={`flex items-center gap-1.5 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer hover:text-brand-red ${showScrolledStyle ? 'text-slate-600' : 'text-slate-200'}`}
                            >
                                <Video className="w-4 h-4 shrink-0" />
                                Schedule a Demo
                            </Link>
                        </div>

                        <div className="flex items-center justify-end shrink-0 gap-2">
                            <Link to="/contact-us" className="hidden md:block">
                                <Button variant="primary" className="px-5 lg:px-6 py-2.5 text-sm shadow-glow">Contact Us</Button>
                            </Link>
                            <button
                                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className={`md:hidden p-2 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${showScrolledStyle ? 'text-slate-900 hover:bg-slate-100' : 'text-white hover:bg-white/10'
                                    }`}
                            >
                                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
                    className={`absolute top-0 right-0 w-[85%] max-w-[360px] h-full bg-brand-charcoal shadow-2xl transition-transform duration-500 ease-out flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    {/* Menu Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10">
                        <div className="flex items-center space-x-2">
                            <img src={logoImage} alt="MakeMyStay Logo" className="w-8 h-8 rounded-lg object-cover" />
                            <span className="text-lg font-bold text-white font-heading">
                                MakeMyStay<span className="text-brand-red">.ai</span>
                            </span>
                        </div>
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
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 px-1 mb-3">Quick Actions</p>
                        <div className="space-y-1.5 mb-5">
                            <Link
                                to="/properties"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors group"
                            >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(197,160,33,0.15)' }}>
                                    <Search className="w-4 h-4" style={{ color: '#C5A021' }} />
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-sm">Find Homes</div>
                                    <div className="text-[11px] text-slate-400">Browse verified PG & rentals</div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                            </Link>

                            <Link
                                to="/wishlist"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors group"
                            >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-red-500/15">
                                    <Heart className="w-4 h-4 text-red-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-sm">Wishlist</div>
                                    <div className="text-[11px] text-slate-400">Your saved properties</div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                            </Link>

                            <Link
                                to="/blog"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors group"
                            >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-amber-500/15">
                                    <BookOpen className="w-4 h-4 text-amber-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-sm">Blog</div>
                                    <div className="text-[11px] text-slate-400">Guides &amp; Bangalore tips</div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                            </Link>

                            <Link
                                to="/quick-pay"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors group"
                            >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-emerald-500/15">
                                    <CreditCard className="w-4 h-4 text-emerald-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-sm">Quick Pay</div>
                                    <div className="text-[11px] text-slate-400">Pay booking fee securely</div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                            </Link>
                        </div>

                        <Link
                            to="/schedule-demo"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors group"
                        >
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-blue-500/15">
                                <Video className="w-4 h-4 text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold text-sm">Schedule a Demo</div>
                                <div className="text-[11px] text-slate-400">Book a live walkthrough</div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                        </Link>

                        {/* ── Divider ── */}
                        <div className="flex items-center gap-3 mb-3">
                            <div className="flex-1 h-px bg-white/8" />
                            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">More</p>
                            <div className="flex-1 h-px bg-white/8" />
                        </div>

                        {/* ── Info Pages ── */}
                        <div className="space-y-0.5">
                            {navigationLinks.map((item, idx) => (
                                <a
                                    key={item}
                                    href={item === 'Home' ? '/' : `/#${item.toLowerCase().replace(' ', '-')}`}
                                    onClick={(e) => handleNavClick(item, e)}
                                    className="flex items-center justify-between py-3 px-2 text-sm font-medium text-slate-400 hover:text-white border-b border-white/5 transition-colors group"
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                >
                                    <span>{item}</span>
                                    <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Menu Footer */}
                    <div className="p-6 border-t border-white/10 space-y-4">
                        <Link to="/contact-us" onClick={() => setIsMenuOpen(false)}>
                            <Button variant="primary" className="w-full py-3.5 text-base shadow-glow">
                                Contact Us
                            </Button>
                        </Link>
                        <a
                            href="tel:+918150099911"
                            className="flex items-center justify-center gap-2 py-3 text-sm text-slate-400 hover:text-white transition-colors"
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
