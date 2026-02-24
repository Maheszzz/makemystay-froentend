"use client";

import { useState, useEffect } from 'react';
import { X, Menu, Phone, ArrowRight } from 'lucide-react';
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
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <img src={logoImage} alt="MakeMyStay Logo" className="w-8 h-8 md:w-10 md:h-10 rounded-lg object-cover shadow-md bg-white" />
                            <Link to="/" className={`text-xl md:text-2xl font-bold tracking-tight font-heading transition-colors ${showScrolledStyle ? 'text-brand-charcoal' : 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]'}`}>
                                MakeMyStay<span className="text-brand-red">.ai</span>
                            </Link>
                        </div>

                        <div className="hidden md:flex items-center space-x-8">
                            {navigationLinks.map((item) => (
                                <a
                                    key={item}
                                    href={
                                        item === 'Home' ? '/' :
                                            item === 'Home' ? '/' :
                                                `/#${item.toLowerCase().replace(' ', '-')}`
                                    }
                                    onClick={(e) => handleNavClick(item, e)}
                                    className={`text-sm font-medium transition-colors cursor-pointer hover:text-brand-red ${showScrolledStyle ? 'text-slate-600' : 'text-slate-200'}`}
                                >
                                    {item}
                                </a>
                            ))}
                            <Link to="/quick-pay" className={`text-sm font-medium transition-colors cursor-pointer hover:text-brand-red ${showScrolledStyle ? 'text-slate-600' : 'text-slate-200'}`}>
                                Quick Pay
                            </Link>
                            <Link to="/admin" className={`text-sm font-bold transition-colors cursor-pointer text-brand-red`}>
                                Dashboard
                            </Link>
                            <Link to="/contact-us">
                                <Button variant="gold" className="px-6 py-2.5 text-sm shadow-glow">Contact Us</Button>
                            </Link>
                        </div>

                        {/* Mobile Hamburger */}
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
                    <div className="flex-1 overflow-y-auto py-6 px-6">
                        <div className="space-y-1">
                            {navigationLinks.map((item, idx) => (
                                <a
                                    key={item}
                                    href={
                                        item === 'Home' ? '/' :
                                            item === 'Home' ? '/' :
                                                `/#${item.toLowerCase().replace(' ', '-')}`
                                    }
                                    onClick={(e) => handleNavClick(item, e)}
                                    className="flex items-center justify-between py-4 text-lg font-medium text-slate-300 hover:text-white border-b border-white/5 transition-colors group"
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                >
                                    <span>{item}</span>
                                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                </a>
                            ))}
                            <Link
                                to="/quick-pay"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center justify-between py-4 text-lg font-medium text-slate-300 hover:text-white border-b border-white/5 transition-colors group"
                            >
                                <span>Quick Pay</span>
                                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </Link>
                            <Link
                                to="/admin"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center justify-between py-4 text-lg font-bold text-brand-red border-b border-white/5 transition-colors group"
                            >
                                <span>Dashboard</span>
                                <ArrowRight className="w-4 h-4 opacity-100 translate-x-0 transition-all" />
                            </Link>
                        </div>
                    </div>

                    {/* Menu Footer */}
                    <div className="p-6 border-t border-white/10 space-y-4">
                        <Link to="/contact-us" onClick={() => setIsMenuOpen(false)}>
                            <Button variant="gold" className="w-full py-3.5 text-base shadow-glow">
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
