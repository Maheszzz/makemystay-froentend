import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import './globals.css';

const root = createRoot(document.getElementById('root')!);
root.render(
    <StrictMode>
        <ErrorBoundary>
            <HelmetProvider>
                <App />
            </HelmetProvider>
        </ErrorBoundary>
    </StrictMode>,
);

// Signal to Prerender.io that the page is fully hydrated
// (This ensures capture happens after Helmet/SEO tags are ready)
if (typeof window !== 'undefined') {
    (window as any).prerenderReady = true;
}
