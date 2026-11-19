'use client';

import { Link } from '@/lib/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildPageSEO, buildHowWeVerifyPageSEO } from '@/lib/seo';
import { buildBreadcrumbSchema, buildFaqPageSchema, buildTrustSignalsSchema, type FaqItem } from '@/lib/schema';

const VERIFY_FAQS: FaqItem[] = [
    {
        question: 'Is MakeMyStay.ai a verified rental platform?',
        answer:
            'We publish listings only after baseline checks — photo consistency, availability, and owner or operator identity. Serious discrepancies trigger re-review or delisting.',
    },
    {
        question: 'Does MakeMyStay charge brokerage?',
        answer:
            'We position many rentals and PGs as zero brokerage for tenants; confirm on each listing and before you pay any token or deposit.',
    },
    {
        question: 'What should I still verify myself?',
        answer:
            'Always visit the property, read the agreement, confirm deposit and notice terms, and validate building or society rules. Use listings as a shortlist, not a substitute for due diligence.',
    },
];

export default function HowWeVerify() {
    const helmet = buildPageSEO(buildHowWeVerifyPageSEO());
    const breadcrumbLd = buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'How we verify', path: '/how-we-verify' },
    ]);
    const faqLd = buildFaqPageSchema(VERIFY_FAQS);

    return (
        <div className="min-h-screen bg-page text-ink flex flex-col">
            <SEOHead {...helmet} />
            <JsonLd id="how-verify-breadcrumb" data={breadcrumbLd} />
            <JsonLd id="how-verify-faq" data={faqLd} />
            <JsonLd id="how-verify-trust-signals" data={buildTrustSignalsSchema()} />
            <Navbar />
            <main id="main-content" className="flex-grow pt-16 sm:pt-20">
                <section className="w-full bg-red-800 text-white py-12 md:py-20 border-b border-champagne/25">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="font-serif-display text-[36px] md:text-[48px] leading-[1.1] font-normal tracking-[-0.015em] text-white">
                            How we verify listings
                        </h1>
                        <div className="w-12 h-[1px] bg-champagne mt-3 mb-4" aria-hidden="true" />
                        <p className="text-[17px] leading-[1.6] text-red-subtitle max-w-[60ch]">
                            Every live listing should meet a minimum quality bar before we send traffic to
                            it: accurate category, honest photos, and pricing that aligns with neighbourhood reality.
                        </p>
                    </div>
                </section>
                <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                    <div className="bg-white border border-line rounded-[var(--radius-pdp)] p-6 sm:p-10 md:p-12 prose-mms">
                        <h2>What our process covers</h2>
                        <ol>
                            <li>
                                <strong>Photo &amp; amenity audit</strong> — we check for stock-image patterns, duplicate
                                galleries across unrelated listings, and claims (WiFi, food, AC) that the listing details
                                should support.
                            </li>
                            <li>
                                <strong>Operator identity</strong> — owner or authorised manager contact on file; repeat
                                fraud patterns are blocked.
                            </li>
                            <li>
                                <strong>Rent and price sanity</strong> — extreme outliers versus the same locality and
                                room count are flagged for human review.
                            </li>
                            <li>
                                <strong>Change control</strong> — material edits to price or availability can trigger
                                re-verification on sensitive categories.
                            </li>
                        </ol>
                        <blockquote>
                            Always visit the property, read the agreement, confirm deposit and notice terms, and check
                            building or society rules before you pay any token or deposit.
                        </blockquote>
                        <p>
                            This page describes our verification process. For legal terms see{' '}
                            <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy</Link>.
                        </p>
                    </div>
                </article>
            </main>
            <Footer />
        </div>
    );
}
