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
        <div className="min-h-screen bg-page text-ink flex flex-col">
            <Navbar />
            <main id="main-content" className="flex-grow pt-16 sm:pt-20">
                <section className="bg-white border-b border-line py-12 md:py-20 lg:py-24">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blush-100 border border-line text-red text-xs font-semibold mb-5">
                            <Building2 className="w-3.5 h-3.5" />
                            For PG &amp; Rental Property Owners
                        </span>
                        <h1 className="type-h1 text-ink mb-5">
                            Grow occupancy directly.<br className="hidden sm:block" /> Skip broker commissions.
                        </h1>
                        <p className="text-base sm:text-lg text-slate max-w-2xl mx-auto mb-8 leading-relaxed">
                            Partner with MakeMyStay.ai to list your PG, coliving building, or rental flats with
                            verified photography, direct tenant inquiries, and automated visit scheduling.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                to="/schedule-demo"
                                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-[10px] bg-red text-white font-semibold text-sm hover:bg-red-hover transition-colors"
                            >
                                <Calendar className="w-4 h-4" />
                                Schedule a Demo
                            </Link>
                            <Link
                                to="/contact-us?type=owner"
                                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-[10px] bg-white border border-ink text-ink font-semibold text-sm hover:bg-blush-100 transition-colors"
                            >
                                List Your Property
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </section>

                <section id="services" className="py-12 md:py-20 lg:py-24 bg-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 text-center">
                        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-ink">Owner services</h2>
                        <p className="text-slate mt-2 text-sm sm:text-base">
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
