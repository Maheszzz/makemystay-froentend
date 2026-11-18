'use client';

let initialized = false;
let lastPopTarget = '';
let lastPopAt = 0;
let initialUrl = '';
let initAt = 0;
let isBackForwardLoad = false;
let lastRecordedUrl = '';
let internalNavCount = 0;

function currentRelativeUrl(): string {
    if (typeof window === 'undefined') return '/';
    return `${window.location.pathname}${window.location.search}`;
}

function isSameOriginReferrer(): boolean {
    if (typeof document === 'undefined' || !document.referrer) return false;
    try {
        return new URL(document.referrer).origin === window.location.origin;
    } catch {
        return false;
    }
}

/**
 * Registers global `popstate` tracking once so ScrollToTop and useScrollMemory
 * can distinguish Back/Forward navigations from forward `<Link>` clicks.
 */
export function initScrollNavigationTracker(): void {
    if (initialized || typeof window === 'undefined') return;
    initialized = true;

    initialUrl = currentRelativeUrl();
    initAt = Date.now();
    lastRecordedUrl = initialUrl;

    try {
        const navEntry = performance.getEntriesByType('navigation')[0] as
            | PerformanceNavigationTiming
            | undefined;
        if (navEntry?.type === 'back_forward') {
            isBackForwardLoad = true;
        }
    } catch {
        // Ignore browsers without PerformanceNavigationTiming
    }

    window.addEventListener('popstate', () => {
        lastPopTarget = currentRelativeUrl();
        lastPopAt = Date.now();
    });
}

/**
 * Records client-side route transitions so `useSmartBack` knows when `history.back()`
 * stays inside the app vs. falling back to `/properties`.
 */
export function recordRouteVisit(url: string): void {
    if (typeof window === 'undefined') return;
    initScrollNavigationTracker();
    if (url && url !== lastRecordedUrl) {
        lastRecordedUrl = url;
        internalNavCount += 1;
    }
}

/**
 * True when the current location was reached via browser Back/Forward (`popstate` or bfcache reload).
 */
export function isPopNavigationForUrl(url?: string): boolean {
    if (typeof window === 'undefined') return false;
    initScrollNavigationTracker();
    const target = url ?? currentRelativeUrl();
    const now = Date.now();

    if (lastPopTarget === target && now - lastPopAt < 5000) {
        return true;
    }
    if (isBackForwardLoad && initialUrl === target && now - initAt < 5000) {
        return true;
    }
    return false;
}

/**
 * True when calling `history.back()` will navigate to a previous page inside the app.
 */
export function canGoBackInApp(): boolean {
    if (typeof window === 'undefined') return false;
    if (window.history.length <= 1) return false;
    return internalNavCount > 0 || isSameOriginReferrer();
}
