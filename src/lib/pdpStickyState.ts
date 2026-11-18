'use client';

import { useSyncExternalStore } from 'react';

let pdpStickyCount = 0;
const listeners = new Set<() => void>();

function notify() {
    for (const listener of listeners) {
        listener();
    }
}

export function enterPdpSticky(): () => void {
    pdpStickyCount += 1;
    notify();
    return () => {
        pdpStickyCount = Math.max(0, pdpStickyCount - 1);
        notify();
    };
}

function subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

function getSnapshot(): boolean {
    return pdpStickyCount > 0;
}

function getServerSnapshot(): boolean {
    return false;
}

export function usePdpStickyActive(): boolean {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
