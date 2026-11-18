'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { isPopNavigationForUrl } from '@/lib/scrollNavigation';

export interface UseScrollMemoryOptions {
    /** Optional explicit URL/key override (e.g. synced `pathname + search`). */
    urlKey?: string;
    disabled?: boolean;
}

/**
 * Persists scroll position per full URL in `sessionStorage` and restores it
 * after `ready` is true on Back/Forward (`popstate`) navigations.
 */
export function useScrollMemory(ready: boolean, options: UseScrollMemoryOptions = {}): void {
    const pathname = usePathname() ?? '/';
    const { urlKey, disabled = false } = options;

    const resolvedKey =
        urlKey ??
        (typeof window !== 'undefined'
            ? `${pathname}${window.location.search}`
            : pathname);

    const storageKey = `mms:scroll:${resolvedKey}`;
    const shouldRestoreRef = useRef<boolean>(false);
    const activeKeyRef = useRef<string>('');

    // Determine whether entering this URL key was a Back/Forward navigation.
    if (typeof window !== 'undefined' && activeKeyRef.current !== resolvedKey) {
        activeKeyRef.current = resolvedKey;
        shouldRestoreRef.current = !disabled && isPopNavigationForUrl(resolvedKey);
    }

    // Continuously save scroll position while the user scrolls (avoiding post-unmount 0 overwrites).
    useEffect(() => {
        if (disabled || typeof window === 'undefined') return;

        let rafId = 0;
        const save = () => {
            if (shouldRestoreRef.current) return;
            try {
                sessionStorage.setItem(storageKey, String(Math.round(window.scrollY || 0)));
            } catch {
                // Ignore storage quota / private mode errors
            }
        };

        const onScroll = () => {
            if (rafId) return;
            rafId = window.requestAnimationFrame(() => {
                rafId = 0;
                save();
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('pagehide', save);
        return () => {
            if (rafId) window.cancelAnimationFrame(rafId);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('pagehide', save);
        };
    }, [storageKey, disabled]);

    // Restore scroll position once listing data is rendered (`ready === true`).
    useEffect(() => {
        if (disabled || !ready || typeof window === 'undefined') return;
        if (!shouldRestoreRef.current) return;

        shouldRestoreRef.current = false;

        let savedRaw: string | null = null;
        try {
            savedRaw = sessionStorage.getItem(storageKey);
        } catch {
            return;
        }

        const y = Number(savedRaw);
        if (!Number.isFinite(y) || y <= 0) return;

        let raf1 = 0;
        let raf2 = 0;

        raf1 = window.requestAnimationFrame(() => {
            window.scrollTo({ top: y, left: 0, behavior: 'instant' as ScrollBehavior });
            // Re-verify once on the next frame in case hydrated children adjusted layout height.
            raf2 = window.requestAnimationFrame(() => {
                if (Math.abs(window.scrollY - y) > 4) {
                    window.scrollTo({ top: y, left: 0, behavior: 'instant' as ScrollBehavior });
                }
            });
        });

        return () => {
            if (raf1) window.cancelAnimationFrame(raf1);
            if (raf2) window.cancelAnimationFrame(raf2);
        };
    }, [ready, storageKey, disabled]);
}
