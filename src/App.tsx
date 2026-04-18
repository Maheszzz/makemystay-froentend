import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import ScrollToTop from './components/layout/ScrollToTop';
import { MobileBottomCTA } from './components/layout/MobileBottomCTA';
import { WhatsAppWidget } from './components/layout/WhatsAppWidget';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';

const Home = lazy(() => import('./pages/Home'));
const Contact = lazy(() => import('./pages/Contact'));
const PropertyDetails = lazy(() => import('./pages/PropertyDetails'));
const Properties = lazy(() => import('./pages/Properties'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
const QuickPay = lazy(() => import('./pages/QuickPay'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const ScheduleDemo = lazy(() => import('./pages/ScheduleDemo'));
const NotFound = lazy(() => import('./pages/NotFound'));
const FAQ = lazy(() => import('./pages/FAQ'));
const PGBangaloreHub = lazy(() => import('./pages/PGBangaloreHub'));
const PGHyderabadHub = lazy(() => import('./pages/PGHyderabadHub'));
const PGPuneHub = lazy(() => import('./pages/PGPuneHub'));
const RentBangaloreHub = lazy(() => import('./pages/RentBangaloreHub'));
const RentHyderabadHub = lazy(() => import('./pages/RentHyderabadHub'));
const RentPuneHub = lazy(() => import('./pages/RentPuneHub'));
const BuyBangaloreHub = lazy(() => import('./pages/BuyBangaloreHub'));
const PlotBangaloreHub = lazy(() => import('./pages/PlotBangaloreHub'));
const PgFeatureLandingPage = lazy(() => import('./pages/PgFeatureLandingPage'));
const PgVsFlatBangalore = lazy(() => import('./pages/PgVsFlatBangalore'));
const PGLocationPage = lazy(() => import('./pages/PGLocationPage'));
const PgNearMe = lazy(() => import('./pages/PgNearMe'));
const BlogIndex = lazy(() => import('./pages/BlogIndex'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const SkipLink = lazy(() => import('./components/a11y/SkipLink').then(m => ({ default: m.SkipLink })));

// Import location data for programmatic routing
import locJson from './data/pg-locations.json';
import { canonicalRentPathForRentInSegment } from '@/lib/rentLegacyRedirects';

/** 301-style in-app redirect; see `public/_redirects` for static hosts. */
function RentInLegacyRedirect() {
    const { legacyHub } = useParams<{ legacyHub: string }>();
    const target = legacyHub ? canonicalRentPathForRentInSegment(legacyHub) : null;
    if (!target) return <Navigate to="/rent" replace />;
    return <Navigate to={target} replace />;
}

/** Backward-compat: redirect /properties/id/102 → /properties/102 */
function LegacyIdRedirect() {
    const { id } = useParams<{ id: string }>();
    return <Navigate to={`/properties/${id}`} replace />;
}

/** Backward-compat: redirect /properties/rent/slc-bhk-2 → /properties/slc-bhk-2 */
function LegacyTypeSlugRedirect() {
    const { slug } = useParams<{ type: string; slug: string }>();
    return <Navigate to={`/properties/${slug}`} replace />;
}

/**
 * Smart Router for /pg/:slug
 * - 'bangalore' → PGBangaloreHub
 * - 'pg-with-wifi', 'pg-with-food', 'pg-with-ac' → PgFeatureLandingPage
 * - 'pg-vs-flat-bangalore' → PgVsFlatBangalore
 * - starts with digit → PropertyDetails
 * - else → PGLocationPage (Locality Hub)
 */
function PGRouter() {
    const { slug } = useParams<{ slug: string }>();
    const param = (slug || '').toLowerCase();

    if (/^(\d+)(-|$)/.test(param)) {
        return <PropertyDetails />;
    }

    if (param === 'bangalore') return <PGBangaloreHub />;
    if (param === 'hyderabad') return <PGHyderabadHub />;
    if (param === 'pune') return <PGPuneHub />;
    if (['pg-with-wifi', 'pg-with-food', 'pg-with-ac'].includes(param)) return <PgFeatureLandingPage />;
    if (param === 'pg-vs-flat-bangalore') return <PgVsFlatBangalore />;

    return <PGLocationPage />;
}

/** Component to extract params from /pg-in-:slug-under-:price */
function PGPriceTierRouter() {
    const { location, price } = useParams<{ location: string; price: string }>();
    const baseSlug = location === 'btm-layout' ? 'btm' : (location || '');
    return <PGLocationPage overrideSlug={baseSlug} overrideMaxPrice={price} />;
}

/**
 * Smart Router for /rent/:slug
 * - starts with digit → PropertyDetails
 * - else → Properties (Locality filtering for rent)
 */
function RentRouter() {
    const { slug } = useParams<{ slug: string }>();
    const param = (slug || '').toLowerCase();

    if (/^(\d+)(-|$)/.test(param)) {
        return <PropertyDetails />;
    }

    if (param === 'bangalore') {
        return (
            <RentBangaloreHub key="rent-bangalore-hub" />
        );
    }
    if (param === 'hyderabad') {
        return (
            <RentHyderabadHub key="rent-hyderabad-hub" />
        );
    }
    if (param === 'pune') {
        return (
            <RentPuneHub key="rent-pune-hub" />
        );
    }

    return (
        <Properties
            key={`rent-${slug ?? 'hub'}`}
            initialCategory="rent"
            initialCity={slug ?? 'all'}
        />
    );
}

/** Wrapper for City-specific SEO pages */
function CityProperties({ category, title, subtitle }: { category: any, title?: string, subtitle?: string }) {
    const { city } = useParams<{ city: string }>();
    // Capitalize city for display
    const cityTitle = city ? city.charAt(0).toUpperCase() + city.slice(1) : '';
    const displayTitle = title || (category === 'all' ? `Properties in ${cityTitle}` : `${category.toUpperCase()} in ${cityTitle}`);
    const displaySubtitle = subtitle || `Explore the best verified ${category === 'all' ? 'homes' : category} in ${cityTitle}`;

    return <Properties
        key={`${category}-${city}`}
        initialCategory={category}
        initialCity={city}
        pageTitle={displayTitle}
        pageSubtitle={displaySubtitle}
    />;
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <WishlistProvider>
                    <ScrollToTop />
                    <Suspense fallback={
                        <div className="h-screen w-full bg-slate-50 flex items-center justify-center">
                            <div className="animate-pulse flex flex-col items-center">
                                <div className="h-12 w-12 bg-emerald-100 rounded-full mb-4"></div>
                                <div className="h-4 w-32 bg-slate-200 rounded"></div>
                            </div>
                        </div>
                    }>
                        <SkipLink />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/contact-us" element={<Contact />} />
                            <Route path="/properties" element={<Properties key="all" />} />
                            <Route path="/properties/in/:city" element={<CityProperties category="all" />} />

                            <Route path="/rent" element={<Properties key="rent" initialCategory="rent" pageTitle="Properties for Rent" pageSubtitle="Find your perfect rental home in Bangalore" />} />
                            <Route path="/rent/in/:city" element={<CityProperties category="rent" />} />
                            <Route path="/rent/:slug" element={<RentRouter />} />

                            <Route path="/property/:slug" element={<PropertyDetails />} />
                            <Route path="/properties/id/:id" element={<LegacyIdRedirect />} />
                            <Route path="/properties/:type/:slug" element={<LegacyTypeSlugRedirect />} />
                            <Route path="/properties/:slug" element={<PropertyDetails />} />
                             <Route path="/pg-with-wifi" element={<PgFeatureLandingPage />} />
                             <Route path="/pg-with-food" element={<PgFeatureLandingPage />} />
                             <Route path="/pg-with-ac" element={<PgFeatureLandingPage />} />
                             <Route path="/pg-for-girls" element={<PgFeatureLandingPage />} />
                             <Route path="/pg-for-boys" element={<PgFeatureLandingPage />} />
                             <Route path="/pg-single-room" element={<PgFeatureLandingPage />} />
                             <Route path="/pg-near-me" element={<PgNearMe />} />
                             <Route path="/pg/:slug" element={<PGRouter />} />
                             <Route path="/pg" element={<Properties key="pg" initialCategory="pg" pageTitle="PG Accommodations" pageSubtitle="Comfortable & verified PG options in Bangalore" />} />

                             <Route path="/plots" element={<Properties key="plots" initialCategory="plot" pageTitle="Plots & Land for Sale" pageSubtitle="Find plots and land to build your dream home" />} />
                             <Route path="/plots/in/bangalore" element={<PlotBangaloreHub key="plot-bangalore-hub" />} />
                             <Route path="/plots/in/:city" element={<CityProperties category="plot" />} />

                             <Route path="/buy" element={<Properties key="buy" initialCategory="buy" pageTitle="Properties for Sale" pageSubtitle="Find your dream home to buy" />} />
                             <Route path="/buy/in/bangalore" element={<BuyBangaloreHub key="buy-bangalore-hub" />} />
                             <Route path="/buy/in/:city" element={<CityProperties category="buy" />} />
                             <Route path="/schedule-demo" element={<ScheduleDemo />} />
                             <Route path="/1bhk" element={<Properties key="1bhk" initialTypeFilter="1BHK" pageTitle="1 BHK Properties in Bangalore" pageSubtitle="Perfect homes for singles and couples" />} />
                             <Route path="/2bhk" element={<Properties key="2bhk" initialTypeFilter="2BHK" pageTitle="2 BHK Properties in Bangalore" pageSubtitle="Ideal spaces for small families" />} />
                            <Route path="/services/:serviceId" element={<ServiceDetail />} />
                            <Route path="/terms" element={<Terms />} />
                            <Route path="/privacy" element={<Privacy />} />
                            <Route path="/refund-policy" element={<RefundPolicy />} />
                            <Route path="/quick-pay" element={<QuickPay />} />
                            <Route path="/wishlist" element={<Wishlist />} />
                            <Route path="/faq" element={<FAQ />} />
                            <Route path="/pg-in-bangalore" element={<Navigate to="/pg/bangalore" replace />} />
                            <Route path="/buy/bangalore" element={<Navigate to="/buy/in/bangalore" replace />} />
                            <Route path="/plot/bangalore" element={<Navigate to="/plots/in/bangalore" replace />} />

                            {/* Programmatic Locality Hubs (Massive SEO Grid) */}
                            {locJson.map((loc) => {
                                const hubSlug = loc.slug === 'btm' ? 'btm-layout' : loc.slug;
                                return (
                                    <Route 
                                        key={`pg-in-${loc.slug}`}
                                        path={`/pg-in-${hubSlug}`} 
                                        element={<PGLocationPage overrideSlug={loc.slug} />} 
                                    />
                                );
                            })}
                            
                            {/* Hyper-Long-Tail Price Tiers (1000+ Pages potential) */}
                            <Route path="/pg-in-:location-under-:price" element={<PGPriceTierRouter />} />

                            <Route path="/rent-in-:legacyHub" element={<RentInLegacyRedirect />} />
                            <Route path="/flats-in-bangalore" element={<Properties key="flats-bangalore" initialCategory="rent" pageTitle="Flats for Rent in Bangalore" />} />

                            <Route path="/blog/:slug" element={<BlogPost />} />
                            <Route path="/blog" element={<BlogIndex />} />

                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Suspense>
                    <MobileBottomCTA />
                    <WhatsAppWidget />
                </WishlistProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
