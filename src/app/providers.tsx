'use client';

import { ReactNode, Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname, useSearchParams } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import ScrollToTop from '@/components/layout/ScrollToTop';
import { PrerenderSafetyTimeout } from '@/components/seo/PrerenderSafetyTimeout';
import { SkipLink } from '@/components/a11y/SkipLink';
import { initWebVitalsReporting } from '@/lib/reportWebVitals';
import { initScrollNavigationTracker, recordRouteVisit } from '@/lib/scrollNavigation';

const MobileBottomCTA = dynamic(
    () => import('@/components/layout/MobileBottomCTA').then((m) => m.MobileBottomCTA),
    { ssr: false },
);

const WhatsAppWidget = dynamic(
    () => import('@/components/layout/WhatsAppWidget').then((m) => m.WhatsAppWidget),
    { ssr: false },
);

function NavigationHistoryTracker() {
    const pathname = usePathname() ?? '/';
    const searchParams = useSearchParams();
    const qs = searchParams?.toString() ?? '';

    useEffect(() => {
        recordRouteVisit(qs ? `${pathname}?${qs}` : pathname);
    }, [pathname, qs]);

    return null;
}

export function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 5 * 60 * 1000,
                        gcTime: 30 * 60 * 1000,
                        refetchOnWindowFocus: false,
                        retry: 1,
                    },
                },
            }),
    );

    useEffect(() => {
        if (typeof window !== 'undefined') {
            (window as unknown as { prerenderReady?: boolean }).prerenderReady = false;
            initScrollNavigationTracker();
            initWebVitalsReporting();
        }
    }, []);

    return (
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <WishlistProvider>
                        <SkipLink />
                        <Suspense fallback={null}>
                            <NavigationHistoryTracker />
                            <ScrollToTop />
                        </Suspense>
                        <PrerenderSafetyTimeout />
                        {children}
                        <MobileBottomCTA />
                        <WhatsAppWidget />
                    </WishlistProvider>
                </AuthProvider>
            </QueryClientProvider>
        </ErrorBoundary>
    );
}
