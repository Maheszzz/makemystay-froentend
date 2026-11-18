'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ServicesGrid } from '@/components/modules/services/ServicesGrid';
import { Problem } from '@/components/sections/Problem';
import { Solution } from '@/components/sections/Solution';
import { Comparison } from '@/components/sections/Comparison';
import { CaseStudy } from '@/components/sections/CaseStudy';
import { CTA } from '@/components/sections/CTA';
import { Link } from '@/lib/navigation';
import { ArrowRight, Building2, Calendar } from 'lucide-react';

export default function ForOwners() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />
            <main id="main-content" className="flex-grow pt-24">
                <section className="bg-white border-b border-slate-100 py-14 md:py-20">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-red/10 text-brand-red text-xs font-bold uppercase tracking-wider mb-5">
                            <Building2 className="w-3.5 h-3.5" />
                            For PG &amp; Rental Property Owners
                        </span>
                        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-5">
                            Grow Occupancy Directly.<br className="hidden sm:block" /> Skip Broker Commissions.
                        </h1>
                        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
                            Partner with MakeMyStay.ai to list your PG, coliving building, or rental flats with
                            verified photography, direct tenant inquiries, and automated visit scheduling.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                to="/schedule-demo"
                                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-brand-red text-white font-bold text-sm hover:bg-red-700 transition-colors shadow-sm"
                            >
                                <Calendar className="w-4 h-4" />
                                Schedule a Demo
                            </Link>
                            <Link
                                to="/contact-us?type=owner"
                                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-sm hover:bg-slate-50 transition-colors"
                            >
                                List Your Property
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </section>

                <section id="services" className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 text-center">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Owner Services</h2>
                        <p className="text-slate-600 mt-2 text-sm sm:text-base">
                            Tools and operations support for PG and rental operators
                        </p>
                    </div>
                    <ServicesGrid />
                </section>

                <Problem />
                <Solution />
                <Comparison />
                <CaseStudy />
                <CTA />
            </main>
            <Footer />
        </div>
    );
}
