import { useEffect, useRef } from 'react';

/**
 * Custom hook to trigger scroll animations for elements with 'animate-on-scroll' class.
 * It adds the 'visible' class when elements enter the viewport.
 * 
 * @param dependencies - Array of dependencies to re-run the observer (e.g. loading state)
 */
export function useScrollAnimation(dependencies: any[] = []) {
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        // Cleanup previous observer
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.1 }
        );

        // Small delay to ensure DOM is ready, especially after loading states
        const timeoutId = setTimeout(() => {
            const elements = document.querySelectorAll('.animate-on-scroll');
            if (elements.length > 0) {
                elements.forEach((el) => observerRef.current?.observe(el));
            }
        }, 100);

        return () => {
            clearTimeout(timeoutId);
            observerRef.current?.disconnect();
        };
    }, dependencies);
}
