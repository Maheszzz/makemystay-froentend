import type { Metadata } from 'next';
import Script from 'next/script';
import { Providers } from './providers';
import '@/globals.css';

export const metadata: Metadata = {
    metadataBase: new URL('https://makemystay.ai'),
    title: 'Verified PG & 1BHK/2BHK in Bangalore | Zero brokerage rentals | MakeMyStay.ai',
    description:
        'Find verified PGs and flats on rent in Bangalore with real photos, transparent pricing, and zero brokerage. Book a visit in 60 seconds on MakeMyStay.ai.',
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        siteName: 'MakeMyStay.ai',
        url: 'https://makemystay.ai',
        title: 'Verified PG & 1BHK/2BHK in Bangalore | Zero brokerage rentals | MakeMyStay.ai',
        description:
            'Find verified PGs and flats on rent in Bangalore with real photos, transparent pricing, and zero brokerage.',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&h=630&q=80',
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
        icon: '/logo.svg',
        apple: '/logo.svg',
    },
    manifest: '/manifest.json',
    themeColor: '#c0392b',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Cormorant+Garamond:wght@400;600&family=Montserrat:wght@400;700&family=Inter:wght@400;500;600;700&family=DM+Sans:wght@400;500;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="antialiased">
                <Script
                    src="https://cdn-in.pagesense.io/js/60068323066/7e76ea503238457e82afc5266e8977c1.js"
                    strategy="afterInteractive"
                />
                <Script src="https://www.googletagmanager.com/gtag/js?id=G-7THZ376P8D" strategy="afterInteractive" />
                <Script id="gtag-init" strategy="afterInteractive">
                    {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-7THZ376P8D');
                    gtag('config', 'AW-17957274528');
                    gtag('config', 'AW-11313350010');
                    `}
                </Script>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
