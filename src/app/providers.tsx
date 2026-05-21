'use client';

import { ReactNode } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/context/AuthContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import ScrollToTop from '@/components/layout/ScrollToTop';
import { MobileBottomCTA } from '@/components/layout/MobileBottomCTA';
import { WhatsAppWidget } from '@/components/layout/WhatsAppWidget';
import { PrerenderSafetyTimeout } from '@/components/seo/PrerenderSafetyTimeout';
import { SkipLink } from '@/components/a11y/SkipLink';
import { initWebVitalsReporting } from '@/lib/reportWebVitals';
import { useEffect } from 'react';

export function Providers({ children }: { children: ReactNode }) {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            (window as unknown as { prerenderReady?: boolean }).prerenderReady = false;
            initWebVitalsReporting();
        }
    }, []);

    return (
        <ErrorBoundary>
            <HelmetProvider>
                <AuthProvider>
                    <WishlistProvider>
                        <SkipLink />
                        <ScrollToTop />
                        <PrerenderSafetyTimeout />
                        {children}
                        <MobileBottomCTA />
                        <WhatsAppWidget />
                    </WishlistProvider>
                </AuthProvider>
            </HelmetProvider>
        </ErrorBoundary>
    );
}
