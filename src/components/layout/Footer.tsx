import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-brand-charcoal relative pt-20 pb-10 text-slate-300 overflow-hidden">
            {/* Background Gradient & Pattern */}
            <div className="absolute inset-0 bg-diagonal-grid opacity-5 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-red/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-brand-red to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-red/20">
                                <span className="text-white font-bold text-xl">M</span>
                            </div>
                            <span className="text-2xl font-bold text-white tracking-tight font-heading">
                                MakeMyStay<span className="text-brand-red">.ai</span>
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed mb-8 text-slate-400 font-medium">
                            The first AI-native revenue engine for co-living and rental operators. Automate growth today.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://www.facebook.com/profile.php?id=61569413385115" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition-all duration-300 border border-white/5 hover:border-[#1877F2] hover:shadow-glow hover:-translate-y-1">
                                <Facebook size={18} />
                            </a>
                            <a href="https://www.instagram.com/makemystay_realty?utm_source=qr&igsh=cXl0Y2pwdWJhcHY5" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-gradient-to-br hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:text-white flex items-center justify-center transition-all duration-300 border border-white/5 hover:border-[#DD2A7B] hover:shadow-glow hover:-translate-y-1">
                                <Instagram size={18} />
                            </a>
                            <a href="https://www.linkedin.com/company/makemystay-realty/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#0A66C2] hover:text-white flex items-center justify-center transition-all duration-300 border border-white/5 hover:border-[#0A66C2] hover:shadow-glow hover:-translate-y-1">
                                <Linkedin size={18} />
                            </a>
                            <a href="https://x.com/Makemystay16268" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-black hover:text-white flex items-center justify-center transition-all duration-300 border border-white/5 hover:border-black hover:shadow-glow hover:-translate-y-1">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-lg mb-8 font-heading">Product</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><a href="#" className="hover:text-brand-red hover:pl-2 transition-all duration-300 inline-block">Features</a></li>
                            <li><a href="#" className="hover:text-brand-red hover:pl-2 transition-all duration-300 inline-block">Pricing</a></li>
                            <li><a href="#" className="hover:text-brand-red hover:pl-2 transition-all duration-300 inline-block">Case Studies</a></li>
                            <li><a href="#" className="hover:text-brand-red hover:pl-2 transition-all duration-300 inline-block">Integration</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-lg mb-8 font-heading">Company</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><a href="#" className="hover:text-brand-red hover:pl-2 transition-all duration-300 inline-block">About Us</a></li>
                            <li><a href="#" className="hover:text-brand-red hover:pl-2 transition-all duration-300 inline-block">Careers</a></li>
                            <li><a href="#" className="hover:text-brand-red hover:pl-2 transition-all duration-300 inline-block">Blog</a></li>
                            <li><a href="#" className="hover:text-brand-red hover:pl-2 transition-all duration-300 inline-block">Press Kit</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-lg mb-8 font-heading">Contact</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li className="flex items-start group">
                                <MapPin size={18} className="mr-3 mt-0.5 text-brand-red group-hover:scale-110 transition-transform" />
                                <span className="text-slate-400 group-hover:text-white transition-colors">HSR Layout, Sector 4<br />Bangalore, India 560102</span>
                            </li>
                            <li className="flex items-center group">
                                <Mail size={18} className="mr-3 text-brand-red group-hover:scale-110 transition-transform" />
                                <a href="mailto:hello@makemystay.ai" className="text-slate-400 group-hover:text-white transition-colors">hello@makemystay.ai</a>
                            </li>
                            <li className="flex items-center group">
                                <Phone size={18} className="mr-3 text-brand-red group-hover:scale-110 transition-transform" />
                                <a href="tel:+918150099911" className="text-slate-400 group-hover:text-white transition-colors">+91 81500 99911</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                    <p>&copy; 2026 MakeMyStay.ai. All rights reserved.</p>
                    <div className="flex space-x-8 mt-4 md:mt-0 font-medium">
                        <a href="#" className="hover:text-brand-red transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-brand-red transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-brand-red transition-colors">Sitemap</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
