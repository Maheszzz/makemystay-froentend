'use client';

import { useEffect, useRef } from 'react';
import { useLocation } from '@/lib/navigation';
import { isPopNavigationForUrl } from '@/lib/scrollNavigation';

function scrollToHashElement(hash: string): () => void {
    const id = hash.replace(/^#/, '');
    if (!id) return () => {};

    let cancelled = false;
    let rafId = 0;

    const tryScroll = (attempt = 0) => {
        if (cancelled) return;
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (attempt < 15) {
            rafId = window.requestAnimationFrame(() => tryScroll(attempt + 1));
        }
    };

    const tid = window.setTimeout(() => tryScroll(), 50);
    return () => {
        cancelled = true;
        window.clearTimeout(tid);
        if (rafId) window.cancelAnimationFrame(rafId);
    };
}

export default function ScrollToTop() {
    const { pathname } = useLocation();
    const isInitialMount = useRef(true);
    const prevPathname = useRef(pathname);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const hash = window.location.hash;

        if (isInitialMount.current) {
            isInitialMount.current = false;
            prevPathname.current = pathname;
            if (hash) {
                return scrollToHashElement(hash);
            }
            return;
        }

        if (prevPathname.current === pathname) {
            return;
        }
        prevPathname.current = pathname;

        // Preserve scroll position on browser Back / Forward (`popstate`) navigations.
        if (isPopNavigationForUrl()) {
            return;
        }

        if (hash) {
            return scrollToHashElement(hash);
        }

        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }, [pathname]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        let cleanupHashScroll: (() => void) | undefined;

        const onHashChange = () => {
            cleanupHashScroll?.();
            if (window.location.hash) {
                cleanupHashScroll = scrollToHashElement(window.location.hash);
            }
        };

        window.addEventListener('hashchange', onHashChange);
        return () => {
            cleanupHashScroll?.();
            window.removeEventListener('hashchange', onHashChange);
        };
    }, []);

    return null;
}
