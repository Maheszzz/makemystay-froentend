import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ScrollToTop from './components/layout/ScrollToTop';
import { MobileBottomCTA } from './components/layout/MobileBottomCTA';
import { WhatsAppWidget } from './components/layout/WhatsAppWidget';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider, useAuth } from './context/AuthContext';

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
const EmployeeLogin = lazy(() => import('./pages/EmployeeLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const EditProperty = lazy(() => import('./pages/EditProperty'));
const NotFound = lazy(() => import('./pages/NotFound'));


const SkipLink = lazy(() => import('./components/a11y/SkipLink').then(m => ({ default: m.SkipLink })));

// Toggles data-admin attribute on <html> ONLY on /admin routes
function AdminThemeToggle() {
    const { isAdmin } = useAuth();
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    useEffect(() => {
        if (isAdmin && isAdminRoute) {
            document.documentElement.setAttribute('data-admin', 'true');
        } else {
            document.documentElement.removeAttribute('data-admin');
        }
        return () => document.documentElement.removeAttribute('data-admin');
    }, [isAdmin, isAdminRoute]);
    return null;
}

// Private Route Component
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <>{children}</> : <Navigate to="/employee-login" />;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <WishlistProvider>
                    <AdminThemeToggle />
                    <SkipLink />
                    <ScrollToTop />
                    <Suspense fallback={
                        <div className="h-screen w-full bg-slate-50 flex items-center justify-center">
                            <div className="animate-pulse flex flex-col items-center">
                                <div className="h-12 w-12 bg-emerald-100 rounded-full mb-4"></div>
                                <div className="h-4 w-32 bg-slate-200 rounded"></div>
                            </div>
                        </div>
                    }>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/contact-us" element={<Contact />} />
                            <Route path="/properties" element={<Properties key="all" />} />
                            <Route path="/rent" element={<Properties key="rent" initialCategory="rent" pageTitle="Properties for Rent" pageSubtitle="Find your perfect rental home in Bangalore" />} />
                            <Route path="/pg" element={<Properties key="pg" initialCategory="pg" pageTitle="PG Accommodations" pageSubtitle="Comfortable & verified PG options in Bangalore" />} />
                            <Route path="/plots" element={<Properties key="plots" initialCategory="plot" pageTitle="Plots & Land for Sale" pageSubtitle="Find plots and land to build your dream home" />} />
                            <Route path="/buy" element={<Properties key="buy" initialCategory="buy" pageTitle="Properties for Sale" pageSubtitle="Find your dream home to buy" />} />
                            <Route path="/schedule-demo" element={<ScheduleDemo />} />
                            <Route path="/1bhk" element={<Properties key="1bhk" initialTypeFilter="1BHK" pageTitle="1 BHK Properties in Bangalore" pageSubtitle="Perfect homes for singles and couples" />} />
                            <Route path="/2bhk" element={<Properties key="2bhk" initialTypeFilter="2BHK" pageTitle="2 BHK Properties in Bangalore" pageSubtitle="Ideal spaces for small families" />} />
                            <Route path="/properties/:type/:slug" element={<PropertyDetails />} />
                            <Route path="/services/:serviceId" element={<ServiceDetail />} />
                            <Route path="/terms" element={<Terms />} />
                            <Route path="/privacy" element={<Privacy />} />
                            <Route path="/refund-policy" element={<RefundPolicy />} />
                            <Route path="/quick-pay" element={<QuickPay />} />
                            <Route path="/wishlist" element={<Wishlist />} />

                            {/* Auth Routes */}
                            <Route path="/employee-login" element={<EmployeeLogin />} />
                            <Route path="/admin" element={
                                <PrivateRoute>
                                    <AdminDashboard />
                                </PrivateRoute>
                            } />
                            <Route path="/admin/edit-property/:id" element={
                                <PrivateRoute>
                                    <EditProperty />
                                </PrivateRoute>
                            } />

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
