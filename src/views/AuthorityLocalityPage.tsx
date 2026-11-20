'use server';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { FaqSection } from '@/components/seo/FaqSection';
import { JsonLd } from '@/components/seo/JsonLd';
import { Link } from '@/lib/navigation';
import { buildAuthorityGraph, buildAuthorityBreadcrumbs, getAuthorityFaqs } from '@/lib/authorityContent';
import { fetchPropertiesServer } from '@/lib/server/fetchPropertiesServer';
import { AuthorityIntro } from '@/components/seo/authority/AuthorityIntro';
import { AuthorityCommuteTable } from '@/components/seo/authority/AuthorityCommuteTable';
import { AuthorityRentTable } from '@/components/seo/authority/AuthorityRentTable';
import { AuthorityPlacesList } from '@/components/seo/authority/AuthorityPlacesList';
import { AuthorityProsCons } from '@/components/seo/authority/AuthorityProsCons';
import { AuthorityPriceTrends } from '@/components/seo/authority/AuthorityPriceTrends';
import { AuthorityMarketDashboard } from '@/components/seo/authority/AuthorityMarketDashboard';
import { AuthorityPersonaGuides } from '@/components/seo/authority/AuthorityPersonaGuides';
import { AuthorityCalculators } from '@/components/seo/authority/AuthorityCalculators';
import { AuthorityLocalInsightsSection } from '@/components/seo/authority/AuthorityLocalInsights';
import { AuthorityStickyTOC } from '@/components/seo/authority/AuthorityStickyTOC';
import { AuthorityInternalLinkHub } from '@/components/seo/authority/AuthorityInternalLinkHub';
import Properties from '@/views/Properties';

import {
    MapPin,
    Train,
    Bus,
    UtensilsCrossed,
    Heart,
    Dumbbell,
    Coffee,
    ShoppingCart,
    Building2,
    Shield,
    TrendingUp,
    Briefcase
} from 'lucide-react';
import type { LocalityAuthorityProfile } from '@/data/authority/types';

interface AuthorityLocalityPageProps {
    profile: LocalityAuthorityProfile;
    overrideMaxPrice?: string;
    overrideGender?: string;
    overrideFeature?: string;
}

export default async function AuthorityLocalityPage({ 
    profile,
    overrideMaxPrice,
    overrideGender,
    overrideFeature 
}: AuthorityLocalityPageProps) {
    let programmaticModifier = '';
    let filterObj: any = { category: 'pg', city: profile.name, is_available: true, limit: 24, sort_by: 'newest' };
    
    if (overrideMaxPrice) {
        programmaticModifier = ` under ₹${overrideMaxPrice}`;
        filterObj.max_price = Number(overrideMaxPrice) || undefined;
    } else if (overrideGender) {
        programmaticModifier = ` for ${overrideGender}`;
        filterObj.gender = overrideGender.toLowerCase();
    } else if (overrideFeature) {
        programmaticModifier = ` with ${overrideFeature}`;
        if (overrideFeature.toLowerCase() === 'food') filterObj.foodIncluded = true;
        if (overrideFeature.toLowerCase() === 'ac') filterObj.hasAC = true;
    }

    const dynamicTitle = `PG & Coliving in ${profile.name}${programmaticModifier}`;
    const metaTitle = overrideMaxPrice || overrideGender || overrideFeature 
        ? `${dynamicTitle} | Verified Stays | MakeMyStay.ai`
        : profile.metaTitle;
    const metaDesc = overrideMaxPrice || overrideGender || overrideFeature
        ? `Find verified ${dynamicTitle}. Explore budget-friendly stays, reviews, and commute times to tech parks on MakeMyStay.`
        : profile.metaDescription;

    const canonicalPath = overrideMaxPrice 
        ? `/pg-in-${profile.slug}-under-${overrideMaxPrice}`
        : overrideGender
        ? `/pg-for-${overrideGender.toLowerCase()}-in-${profile.slug}`
        : overrideFeature
        ? `/pg-in-${profile.slug}-with-${overrideFeature.toLowerCase()}`
        : `/pg/${profile.slug}`;

    const jsonLd = buildAuthorityGraph({
        ...profile,
        metaTitle,
        metaDescription: metaDesc,
    }, canonicalPath);
    
    const breadcrumbItems = buildAuthorityBreadcrumbs(profile);
    if (programmaticModifier) {
        breadcrumbItems.push({ name: dynamicTitle, path: canonicalPath });
    }
    
    const faqs = getAuthorityFaqs(profile);

    const { items: initialProperties, total, propertyCounts } = await fetchPropertiesServer(filterObj);

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <JsonLd data={jsonLd} id="locality-authority-jsonld" />
            <Navbar />

            <main id="main-content" className="flex-grow pt-20 pb-16">
                
                {/* ── Hero ── */}
                <div className="bg-white border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                        <BreadcrumbNav items={breadcrumbItems} />
                        <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="max-w-3xl">
                                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-2">
                                    Topical Authority Hub
                                </p>
                                <h1 className="type-h1 text-slate-900">
                                    {dynamicTitle}
                                </h1>
                                <p className="mt-4 text-slate-600 text-lg leading-relaxed">
                                    {metaDesc}
                                </p>
                            </div>
                            <div className="flex-shrink-0 text-right">
                                <p className="text-sm font-semibold text-slate-500 mb-1">Updated For</p>
                                <p className="text-lg font-bold text-brand-red">2026 Market</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Properties Widget (Full-Width, Displayed First — Above Content) ── */}
                <section
                    aria-labelledby="properties-heading"
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8"
                >
                    <div className="mb-4 flex items-center justify-between">
                        <h2 id="properties-heading" className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <Building2 className="w-6 h-6 text-brand-red" />
                            Top PGs in {profile.name}
                        </h2>
                    </div>
                    <Properties
                        hideChrome
                        initialCategory="pg"
                        initialCity={profile.name}
                        initialMaxPrice={overrideMaxPrice}
                        forcedGenderFilter={overrideGender ? (overrideGender.toLowerCase() as 'male' | 'female') : undefined}
                        pageTitle={`Explore all options in ${profile.name}${programmaticModifier}`}
                        pageSubtitle="Filter by budget, sharing type, and food plan."
                        initialProperties={initialProperties}
                        initialTotalCount={total}
                        initialPropertyCounts={propertyCounts}
                        showMapPanel
                    />
                </section>

                {/* ── Content Grid ── */}
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-14 flex gap-8 relative items-start">
                    
                    {/* Main Content Column */}
                    <div className="flex-1 space-y-16 min-w-0">

                        {/* Intro & Why Live Here */}
                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                            <AuthorityIntro introduction={profile.introduction} whyLiveHere={profile.whyLiveHere} name={profile.name} />
                        </div>

                        {profile.marketDashboard && (
                            <AuthorityMarketDashboard data={profile.marketDashboard} name={profile.name} />
                        )}

                        {profile.personaGuides && (
                            <AuthorityPersonaGuides guides={profile.personaGuides} name={profile.name} />
                        )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            
                            {/* Connectivity */}
                            <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm" aria-labelledby="connectivity-heading">
                                <h2 id="connectivity-heading" className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <Train className="w-6 h-6 text-brand-red" />
                                    Commute & Connectivity
                                </h2>
                                <AuthorityCommuteTable rows={profile.commuteTable} />
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                    <AuthorityPlacesList title="Metro Access" icon={<Train className="w-4 h-4"/>} items={profile.nearbyMetro} />
                                    <AuthorityPlacesList title="BMTC Hubs" icon={<Bus className="w-4 h-4"/>} items={profile.nearbyBmtcStops} />
                                </div>
                            </section>

                            {/* Interactive Calculator */}
                            <AuthorityCalculators />

                            {/* Rent & Price Trends */}
                            <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm" aria-labelledby="rent-heading">
                                <h2 id="rent-heading" className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <TrendingUp className="w-6 h-6 text-brand-red" />
                                    {profile.name} Rent Insights
                                </h2>
                                <AuthorityRentTable rows={profile.averageRentTable} />
                                <div className="mt-8 space-y-6">
                                    <AuthorityPriceTrends rows={profile.pgPriceTrends} />
                                </div>
                            </section>

                            {/* Local Insights */}
                            {profile.localInsights && (
                                <AuthorityLocalInsightsSection insights={profile.localInsights} />
                            )}

                            {/* Lifestyle & Amenities */}
                            <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm" aria-labelledby="lifestyle-heading">
                                <h2 id="lifestyle-heading" className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <Coffee className="w-6 h-6 text-brand-red" />
                                    Local Lifestyle
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <AuthorityPlacesList title="Hospitals" icon={<Heart className="w-4 h-4"/>} items={profile.hospitals} />
                                    <AuthorityPlacesList title="Gyms & Fitness" icon={<Dumbbell className="w-4 h-4"/>} items={profile.gyms} />
                                    <AuthorityPlacesList title="Cafes" icon={<Coffee className="w-4 h-4"/>} items={profile.cafes} />
                                    <AuthorityPlacesList title="Supermarkets" icon={<ShoppingCart className="w-4 h-4"/>} items={profile.groceryStores} />
                                    <AuthorityPlacesList title="Restaurants" icon={<UtensilsCrossed className="w-4 h-4"/>} items={profile.restaurants} />
                                </div>
                            </section>

                        </div>

                        {/* Right Sidebar */}
                        <div className="space-y-8">
                            
                            {/* Tech Parks */}
                            <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-brand-red" />
                                    Nearby Tech Parks
                                </h3>
                                <ul className="space-y-3">
                                    {profile.nearbyTechParks.map((park) => (
                                        <li key={park.name} className="flex justify-between items-center text-sm">
                                            <Link to={`/${park.path}`} className="font-medium text-slate-900 hover:text-brand-red hover:underline">
                                                {park.name}
                                            </Link>
                                            <span className="text-slate-500 font-medium">{park.commuteTime}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            {/* Safety & Pros/Cons */}
                            <AuthorityProsCons pros={profile.pros} cons={profile.cons} />
                            
                            <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-brand-red" />
                                    Safety
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {profile.safety}
                                </p>
                            </section>

                        </div>
                    </div>

                    {/* Internal Linking Hub */}
                    <AuthorityInternalLinkHub profile={profile} />

                    {/* FAQs */}
                    <FaqSection
                        id="locality-faq-heading"
                        title={`Frequently Asked — PG in ${profile.name}`}
                        items={faqs}
                        collapsible
                        titleAdornment={<MapPin className="h-6 w-6 text-brand-red shrink-0" aria-hidden />}
                        className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm"
                    />

                    </div>
                    {/* Right Sidebar TOC */}
                    <aside className="w-[250px] shrink-0 hidden xl:block">
                        <AuthorityStickyTOC />
                    </aside>
                </div>
            </main>

            <Footer />
        </div>
    );
}
