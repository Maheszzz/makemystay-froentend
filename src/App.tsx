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
const PgFeatureLandingPage = lazy(() => import('./pages/PgFeatureLandingPage'));
const PgVsFlatBangalore = lazy(() => import('./pages/PgVsFlatBangalore'));
const PGLocationPage = lazy(() => import('./pages/PGLocationPage'));
const BlogIndex = lazy(() => import('./pages/BlogIndex'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const SkipLink = lazy(() => import('./components/a11y/SkipLink').then(m => ({ default: m.SkipLink })));

/** Alias: /property/:slug → /properties/:slug (share-friendly path). */
function PropertyAliasRedirect() {
    const { slug } = useParams<{ slug: string }>();
    return <Navigate to={`/properties/${slug}`} replace />;
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

                            <Route path="/pg/in/:city" element={<CityProperties category="pg" />} />
                            <Route path="/pg/bangalore" element={<PGBangaloreHub />} />
                            <Route path="/pg-with-wifi" element={<PgFeatureLandingPage />} />
                            <Route path="/pg-with-food" element={<PgFeatureLandingPage />} />
                            <Route path="/pg-with-ac" element={<PgFeatureLandingPage />} />
                            <Route path="/pg-vs-flat-bangalore" element={<PgVsFlatBangalore />} />
                            <Route path="/pg/:location" element={<PGLocationPage />} />
                            <Route path="/pg" element={<Properties key="pg" initialCategory="pg" pageTitle="PG Accommodations" pageSubtitle="Comfortable & verified PG options in Bangalore" />} />

                            <Route path="/plots" element={<Properties key="plots" initialCategory="plot" pageTitle="Plots & Land for Sale" pageSubtitle="Find plots and land to build your dream home" />} />
                            <Route path="/plots/in/:city" element={<CityProperties category="plot" />} />

                            <Route path="/buy" element={<Properties key="buy" initialCategory="buy" pageTitle="Properties for Sale" pageSubtitle="Find your dream home to buy" />} />
                            <Route path="/buy/in/:city" element={<CityProperties category="buy" />} />
                            <Route path="/schedule-demo" element={<ScheduleDemo />} />
                            <Route path="/1bhk" element={<Properties key="1bhk" initialTypeFilter="1BHK" pageTitle="1 BHK Properties in Bangalore" pageSubtitle="Perfect homes for singles and couples" />} />
                            <Route path="/2bhk" element={<Properties key="2bhk" initialTypeFilter="2BHK" pageTitle="2 BHK Properties in Bangalore" pageSubtitle="Ideal spaces for small families" />} />
                            <Route path="/property/:slug" element={<PropertyAliasRedirect />} />
                            <Route path="/properties/id/:id" element={<LegacyIdRedirect />} />
                            <Route path="/properties/:type/:slug" element={<LegacyTypeSlugRedirect />} />
                            <Route path="/properties/:slug" element={<PropertyDetails />} />
                            <Route path="/services/:serviceId" element={<ServiceDetail />} />
                            <Route path="/terms" element={<Terms />} />
                            <Route path="/privacy" element={<Privacy />} />
                            <Route path="/refund-policy" element={<RefundPolicy />} />
                            <Route path="/quick-pay" element={<QuickPay />} />
                            <Route path="/wishlist" element={<Wishlist />} />
                            <Route path="/faq" element={<FAQ />} />
                            <Route path="/pg-in-bangalore" element={<Navigate to="/pg/bangalore" replace />} />

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
