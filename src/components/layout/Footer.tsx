import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { navigationLinks } from '@/data/content';
import logoImage from '@/assets/MakeMysStaylogo.svg';

export function Footer() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavClick = (item: string, e: React.MouseEvent) => {
        e.preventDefault();
        const sectionId = item.toLowerCase().replace(' ', '-');

        if (item === 'Home') {
            if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                navigate('/');
            }
            return;
        }

        if (location.pathname === '/') {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            navigate(`/#${sectionId}`);
        }
    };

    return (
        <footer className="bg-brand-charcoal relative pt-12 md:pt-20 pb-28 md:pb-10 text-slate-300 overflow-hidden">
            {/* Background Gradient & Pattern */}
            <div className="absolute inset-0 bg-diagonal-grid opacity-5 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-red/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Top grid — brand takes wider col, rest are equal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-16">

                    {/* Brand column — spans 2 cols on large */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center space-x-3 mb-5">
                            <img src={logoImage} alt="MakeMyStay Logo" className="w-8 h-8 rounded-lg shadow-lg shadow-brand-red/20 object-cover" />
                            <span className="text-2xl font-bold text-white tracking-tight font-heading">
                                MakeMyStay<span className="text-brand-red">.ai</span>
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed mb-6 text-slate-400 font-medium max-w-xs">
                            Your trusted real estate facilitation platform — from PGs and rentals to buying your dream home.
                        </p>
                        <div className="flex space-x-3">
                            <a href="https://www.facebook.com/profile.php?id=61569413385115" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition-all duration-300 border border-white/5 hover:border-[#1877F2] hover:shadow-glow hover:-translate-y-1">
                                <Facebook size={16} />
                            </a>
                            <a href="https://www.instagram.com/makemystay_realty?utm_source=qr&igsh=cXl0Y2pwdWJhcHY5" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 hover:bg-gradient-to-br hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:text-white flex items-center justify-center transition-all duration-300 border border-white/5 hover:border-[#DD2A7B] hover:shadow-glow hover:-translate-y-1">
                                <Instagram size={16} />
                            </a>
                            <a href="https://www.linkedin.com/company/makemystay-realty/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#0A66C2] hover:text-white flex items-center justify-center transition-all duration-300 border border-white/5 hover:border-[#0A66C2] hover:shadow-glow hover:-translate-y-1">
                                <Linkedin size={16} />
                            </a>
                            <a href="https://x.com/Makemystay16268" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 hover:bg-black hover:text-white flex items-center justify-center transition-all duration-300 border border-white/5 hover:border-black hover:shadow-glow hover:-translate-y-1">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Explore column */}
                    <div>
                        <h4 className="font-bold mb-5 font-heading tracking-wide uppercase text-xs text-slate-400">Explore</h4>
                        <ul className="space-y-3 text-sm font-medium">
                            {navigationLinks.map((item) => (
                                <li key={item}>
                                    <a
                                        href={item === 'Home' ? '/' : `/#${item.toLowerCase().replace(' ', '-')}`}
                                        onClick={(e) => handleNavClick(item, e)}
                                        className="text-slate-400 hover:text-white hover:pl-1.5 transition-all duration-200 inline-block cursor-pointer"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                            <li>
                                <Link to="/faq" className="text-slate-400 hover:text-white hover:pl-1.5 transition-all duration-200 inline-block">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin" className="text-slate-400 hover:text-white hover:pl-1.5 transition-all duration-200 inline-block">
                                    Dashboard
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact column */}
                    <div>
                        <h4 className="font-bold mb-5 font-heading tracking-wide uppercase text-xs text-slate-400">Contact Us</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li className="flex items-start group">
                                <MapPin size={16} className="mr-3 mt-0.5 text-brand-red shrink-0 group-hover:scale-110 transition-transform" />
                                <span className="text-slate-400 group-hover:text-white transition-colors leading-relaxed">
                                    HSR Layout, Sector 4<br />Bangalore, India 560102
                                </span>
                            </li>
                            <li className="flex items-center group">
                                <Mail size={16} className="mr-3 text-brand-red shrink-0 group-hover:scale-110 transition-transform" />
                                <a href="mailto:connect@makemystay.ai" className="text-slate-400 group-hover:text-white transition-colors break-all">connect@makemystay.ai</a>
                            </li>
                            <li className="flex items-center group">
                                <Phone size={16} className="mr-3 text-brand-red shrink-0 group-hover:scale-110 transition-transform" />
                                <a href="tel:+918150099911" className="text-slate-400 group-hover:text-white transition-colors">+91 81500 99911</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/5 pt-8 flex flex-col gap-3 md:flex-row justify-between items-center text-xs text-slate-500">
                    <p className="text-center md:text-left">&copy; 2026 MakeMyStay.ai. All rights reserved.</p>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6 font-medium">
                        <Link to="/privacy" className="hover:text-brand-red transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-brand-red transition-colors">Terms &amp; Conditions</Link>
                        <Link to="/refund-policy" className="hover:text-brand-red transition-colors">Refund Policy</Link>
                        <Link to="/faq" className="hover:text-brand-red transition-colors">FAQ</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
