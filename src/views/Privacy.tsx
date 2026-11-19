'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LEGAL_ENTITY_NAME } from '@/lib/siteConfig';

export default function Privacy() {
    return (
        <>
            <Navbar />
            <main id="main-content" className="pt-24 pb-16 lg:pb-20 min-h-screen bg-pdp-bg text-pdp-ink">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-pdp-surface border border-pdp-border rounded-[var(--radius-pdp)] p-6 sm:p-10 md:p-12 prose-mms">
                        <h1>Privacy policy</h1>
                        <p className="text-sm text-pdp-muted">Last updated: February 2026</p>

                        <p>
                            This Privacy Policy describes how <strong>{LEGAL_ENTITY_NAME}, Bengaluru, India</strong> collects, uses, and protects information when you use <a href="https://makemystay.ai">www.makemystay.ai</a> and related services.
                        </p>
                        <p>By using our platform, you agree to the practices described in this policy.</p>

                        <hr />

                        <h2>1. Information we collect</h2>
                        <p>We may collect the following information:</p>

                        <h3>Personal information</h3>
                        <ul>
                            <li>Name</li>
                            <li>Phone number</li>
                            <li>Email address</li>
                            <li>Location preferences</li>
                            <li>Property requirements</li>
                            <li>Information submitted through forms or chat</li>
                        </ul>

                        <h3>Transaction information</h3>
                        <p>Payments made through our platform are processed securely by <strong>Razorpay</strong>. We do not store debit/credit card or banking details.</p>

                        <h2>2. How we use information</h2>
                        <p>We use collected information to:</p>
                        <ul>
                            <li>Provide property recommendations and services</li>
                            <li>Respond to inquiries and schedule visits</li>
                            <li>Improve our services and website</li>
                            <li>Process bookings or service payments</li>
                            <li>Communicate updates and offers</li>
                        </ul>

                        <h2>3. Sharing of information</h2>
                        <p>We may share limited information with:</p>
                        <ul>
                            <li>Property owners or partners to fulfill requests</li>
                            <li>Payment gateway providers</li>
                            <li>Service providers assisting in operations</li>
                            <li>Authorities when required by law</li>
                        </ul>
                        <p>We do not sell user data.</p>

                        <h2>4. Data security</h2>
                        <p>We use reasonable technical and organizational safeguards to protect personal information. However, no online system can guarantee absolute security.</p>

                        <h2>5. Cookies</h2>
                        <p>Our platform may use cookies to improve functionality and analyze usage. Users can control cookies through browser settings.</p>

                        <h2>6. User rights</h2>
                        <p>You may request:</p>
                        <ul>
                            <li>Access to personal data</li>
                            <li>Correction of information</li>
                            <li>Deletion requests (subject to legal obligations)</li>
                        </ul>
                        <p>Requests may be sent to <a href="mailto:connect@makemystay.ai">connect@makemystay.ai</a>.</p>

                        <h2>7. Changes to policy</h2>
                        <p>We may update this Privacy Policy from time to time. Updated versions will be posted on this page.</p>

                        <h2>8. Contact information</h2>
                        <p>
                            {LEGAL_ENTITY_NAME}<br />
                            HSR Layout, Sector 7, Bengaluru, Karnataka 560102<br />
                            Email: <a href="mailto:connect@makemystay.ai">connect@makemystay.ai</a>
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
