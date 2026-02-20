import { useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { ServicesGrid } from '@/components/modules/services/ServicesGrid';
import { PropertyGrid } from '@/components/modules/listings/PropertyGrid';
import { InvestmentCalculator } from '@/components/modules/calculator/InvestmentCalculator';
import { About } from '@/components/sections/About';
import { Problem } from '@/components/sections/Problem';
import { Solution } from '@/components/sections/Solution';
import { Comparison } from '@/components/sections/Comparison';
import { CTA } from '@/components/sections/CTA';
import { CaseStudy } from '@/components/sections/CaseStudy';

export default function Home() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Get values from URL or default
    const category = (searchParams.get('category') as 'buy' | 'rent') || 'rent';
    const searchQuery = searchParams.get('q') || '';

    // Wrapped setters to update URL
    const setCategory = (newCategory: 'buy' | 'rent') => {
        setSearchParams(prev => {
            prev.set('category', newCategory);
            return prev;
        }, { replace: true });
    };

    const setSearchQuery = (newQuery: string) => {
        setSearchParams(prev => {
            if (newQuery) {
                prev.set('q', newQuery);
            } else {
                prev.delete('q');
            }
            return prev;
        }, { replace: true });
    };

    return (
        <>
            <Navbar />
            <main id="main-content" className="min-h-screen bg-white">
                <section id="home">
                    <Hero
                        category={category}
                        setCategory={setCategory}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                    />
                </section>

                {/* Property Listings */}
                <PropertyGrid category={category} searchQuery={searchQuery} />

                {/* Services / What We Offer */}
                <section id="services" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 text-center">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Our Services</h2>
                        <p className="text-slate-500 mt-2 text-sm sm:text-base">Comprehensive solutions for every real estate need</p>
                    </div>
                    <ServicesGrid />
                </section>

                {/* Investment Calculator */}
                <InvestmentCalculator />

                <About />
                <Problem />
                <Solution />
                <Comparison />
                <CaseStudy />
                <CTA />
            </main>

            <Footer />
        </>
    );
}
