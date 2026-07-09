'use client';

import { ReactNode, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { AuthProvider } from '@/context/AuthContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import ScrollToTop from '@/components/layout/ScrollToTop';
import { PrerenderSafetyTimeout } from '@/components/seo/PrerenderSafetyTimeout';
import { SkipLink } from '@/components/a11y/SkipLink';
import { initWebVitalsReporting } from '@/lib/reportWebVitals';
import { useEffect } from 'react';

const MobileBottomCTA = dynamic(
    () => import('@/components/layout/MobileBottomCTA').then((m) => m.MobileBottomCTA),
    { ssr: false },
);

const WhatsAppWidget = dynamic(
    () => import('@/components/layout/WhatsAppWidget').then((m) => m.WhatsAppWidget),
    { ssr: false },
);

export function Providers({ children }: { children: ReactNode }) {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            (window as unknown as { prerenderReady?: boolean }).prerenderReady = false;
            initWebVitalsReporting();
        }
    }, []);

    return (
        <ErrorBoundary>
            <AuthProvider>
                <WishlistProvider>
                    <SkipLink />
                    <Suspense fallback={null}>
                        <ScrollToTop />
                    </Suspense>
                    <PrerenderSafetyTimeout />
                    {children}
                    <MobileBottomCTA />
                    <WhatsAppWidget />
                </WishlistProvider>
            </AuthProvider>
        </ErrorBoundary>
    );
}
