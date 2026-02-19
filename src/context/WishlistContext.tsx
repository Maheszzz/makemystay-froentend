import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Property } from '@/types/api';

interface WishlistContextType {
    wishlist: Property[];
    isWishlisted: (id: string | number) => boolean;
    toggleWishlist: (property: Property) => void;
    clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

const STORAGE_KEY = 'mms_wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [wishlist, setWishlist] = useState<Property[]>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    }, [wishlist]);

    const isWishlisted = (id: string | number) => wishlist.some((p) => String(p.id) === String(id));

    const toggleWishlist = (property: Property) => {
        setWishlist((prev) =>
            prev.some((p) => p.id === property.id)
                ? prev.filter((p) => p.id !== property.id)
                : [...prev, property]
        );
    };

    const clearWishlist = () => setWishlist([]);

    return (
        <WishlistContext.Provider value={{ wishlist, isWishlisted, toggleWishlist, clearWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const ctx = useContext(WishlistContext);
    if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
    return ctx;
}
