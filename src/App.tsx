import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/layout/ScrollToTop';
import { MobileBottomCTA } from './components/layout/MobileBottomCTA';

const Home = lazy(() => import('./pages/Home'));
const Contact = lazy(() => import('./pages/Contact'));
const PropertyDetails = lazy(() => import('./pages/PropertyDetails'));
const Properties = lazy(() => import('./pages/Properties'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));

function App() {
    return (
        <Router>
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
                    <Route path="/properties" element={<Properties />} />
                    <Route path="/property/:id" element={<PropertyDetails />} />
                    <Route path="/services/:serviceId" element={<ServiceDetail />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/refund-policy" element={<RefundPolicy />} />
                </Routes>
            </Suspense>
            <MobileBottomCTA />
        </Router>
    );
}

export default App;
