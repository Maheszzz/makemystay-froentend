import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImage from '@/assets/MakeMysStaylogo.svg';
import { QuickAnswersBlock } from '@/components/seo/QuickAnswersBlock';
import { FaqSection } from '@/components/seo/FaqSection';
import { PG_LOCATIONS } from '@/data/pgLocations';
import { HOME_PG_FAQS } from '@/data/homePgSeo';

export function Footer() {
    return (
        <footer className="bg-brand-charcoal relative pt-12 md:pt-20 pb-28 md:pb-10 text-slate-300 overflow-hidden">
            {/* Background Gradient & Pattern */}
            <div className="absolute inset-0 bg-diagonal-grid opacity-5 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-red/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 mb-12 md:mb-16">
                    <div className="lg:col-span-2">
                        <div className="flex items-center space-x-3 mb-5">
                            <img src={logoImage} alt="MakeMyStay Logo" className="w-8 h-8 rounded-lg shadow-lg shadow-brand-red/20 object-cover" />
                            <span className="text-2xl font-bold text-white tracking-tight font-heading">
                                MakeMyStay<span className="text-brand-red">.ai</span>
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed mb-6 text-slate-400 font-medium max-w-md">
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

                {/* PG hub / AEO — dark-surface cards aligned with footer */}
                <div className="border-t border-white/10 pt-10 md:pt-14 pb-2 md:pb-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
                        <div className="lg:col-span-2 space-y-8">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 mb-2">Bangalore · PG</p>
                                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight font-heading">
                                    Find the best PG in Bangalore
                                </h2>
                                <p className="mt-2 text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">
                                    Discover fully furnished PG and coliving spaces across Bangalore with WiFi, food plans,
                                    and 24/7 security — compare areas below, then browse live listings.{' '}
                                    <Link to="/pg/bangalore" className="font-semibold text-brand-red hover:underline whitespace-nowrap">
                                        Open the Bangalore PG hub →
                                    </Link>
                                </p>
                            </div>
                            <QuickAnswersBlock locationName="Bangalore" variant="dark" />
                            <FaqSection
                                id="footer-pg-faq-heading"
                                title="Frequently asked questions"
                                items={HOME_PG_FAQS}
                                variant="dark"
                                titleAdornment={<MapPin className="h-5 w-5 text-brand-red shrink-0" aria-hidden />}
                            />
                        </div>
                        <div className="lg:col-span-1">
                            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-sm ring-1 ring-white/5 backdrop-blur-sm lg:sticky lg:top-28">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Popular areas</p>
                                <h2 className="mt-1.5 text-base font-bold text-white font-heading">Top PG locations</h2>
                                <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">Area guides &amp; listings</p>
                                <nav className="flex flex-wrap gap-1.5" aria-label="Popular PG areas">
                                    {PG_LOCATIONS.slice(0, 20).map((loc) => (
                                        <Link
                                            key={loc.slug}
                                            to={`/pg/${loc.slug}`}
                                            className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:border-brand-red/35 hover:bg-brand-red/10 hover:text-white"
                                        >
                                            {loc.name}
                                        </Link>
                                    ))}
                                </nav>
                                <Link
                                    to="/pg"
                                    className="mt-5 inline-block text-xs font-semibold text-brand-red hover:underline"
                                >
                                    View all PG listings →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col gap-3 md:flex-row justify-between items-center text-xs text-slate-500">
                    <p className="text-center md:text-left">&copy; 2026 MakeMyStay.ai. All rights reserved.</p>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6 font-medium">
                        <Link to="/privacy" className="hover:text-brand-red transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-brand-red transition-colors">Terms &amp; Conditions</Link>
                        <Link to="/refund-policy" className="hover:text-brand-red transition-colors">Refund Policy</Link>
                        <Link to="/faq" className="hover:text-brand-red transition-colors">FAQ</Link>
                        <Link to="/blog" className="hover:text-brand-red transition-colors">Blog</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
