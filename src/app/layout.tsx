import type { Metadata, Viewport } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import Script from 'next/script';
import { Providers } from './providers';
import { buildOrganizationSchema } from '@/lib/schema';
import '@/globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const montserrat = Montserrat({
    subsets: ['latin'],
    weight: ['400', '700'],
    variable: '--font-montserrat',
    display: 'swap',
});

export const metadata: Metadata = {
    metadataBase: new URL('https://makemystay.ai'),
    title: {
        default: 'Verified PGs & Flats in Bangalore | MakeMyStay.ai',
        template: '%s | MakeMyStay.ai',
    },
    description:
        'Find verified PGs and flats on rent in Bangalore with real photos, transparent pricing, and zero brokerage. Book a visit in 60 seconds on MakeMyStay.ai.',
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        siteName: 'MakeMyStay.ai',
        url: 'https://makemystay.ai',
        title: 'Verified PGs & Flats in Bangalore | MakeMyStay.ai',
        description:
            'Find verified PGs and flats on rent in Bangalore with real photos, transparent pricing, and zero brokerage.',
        images: [
            {
                url: 'https://makemystay.ai/og-image.jpg',
                width: 1200,
                height: 630,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@Makemystay16268',
    },
    icons: {
        icon: '/icon.svg',
        apple: '/apple-touch-icon.png',
    },
    manifest: '/manifest.json',
};

export const viewport: Viewport = {
    themeColor: '#BA1D23',
};

/** Cached HTML for hubs/PDPs; client islands hydrate inside Suspense. */
export const revalidate = 3600;

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html
            lang="en-IN"
            className={`${inter.variable} ${montserrat.variable}`}
        >
            <body className="antialiased font-sans">
                <Script
                    src="https://cdn-in.pagesense.io/js/60068323066/7e76ea503238457e82afc5266e8977c1.js"
                    strategy="lazyOnload"
                />
                <Script src="https://www.googletagmanager.com/gtag/js?id=G-7THZ376P8D" strategy="lazyOnload" />
                <Script id="gtag-init" strategy="lazyOnload">
                    {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-7THZ376P8D');
                    gtag('config', 'AW-17957274528');
                    gtag('config', 'AW-11313350010');
                    `}
                </Script>
                <script
                    id="global-org-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationSchema()) }}
                />
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
