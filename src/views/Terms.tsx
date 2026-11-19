'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LEGAL_ENTITY_NAME } from '@/lib/siteConfig';

export default function Terms() {
    return (
        <>
            <Navbar />
            <main id="main-content" className="pt-24 pb-16 lg:pb-20 min-h-screen bg-pdp-bg text-pdp-ink">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-pdp-surface border border-pdp-border rounded-[var(--radius-pdp)] p-6 sm:p-10 md:p-12 prose-mms">
                        <h1>Terms and conditions</h1>
                        <p className="text-sm text-pdp-muted">Last updated: February 2026</p>

                        <p>
                            These Terms and Conditions govern the use of <a href="https://makemystay.ai">www.makemystay.ai</a>, operated by <strong>{LEGAL_ENTITY_NAME}</strong>.
                        </p>
                        <p>By accessing or using our services, you agree to these Terms.</p>

                        <hr />

                        <h2>1. Use of platform</h2>
                        <p>MakeMyStay provides an online platform to discover rental homes, PG accommodations, and real estate opportunities.</p>
                        <p>Users agree to:</p>
                        <ul>
                            <li>Provide accurate information</li>
                            <li>Use the platform only for lawful purposes</li>
                            <li>Not misuse or attempt to disrupt services</li>
                        </ul>

                        <h2>2. Eligibility</h2>
                        <p>You must be at least <strong>18 years of age</strong> to use our services.</p>

                        <h2>3. Role of MakeMyStay</h2>
                        <p>MakeMyStay acts as:</p>
                        <ul>
                            <li>A discovery platform</li>
                            <li>A facilitator between users and property providers in certain cases</li>
                        </ul>
                        <p>We do not own most listed properties unless explicitly stated.</p>

                        <h2>4. Property information</h2>
                        <p>We strive to provide accurate information, but:</p>
                        <ul>
                            <li>Availability and pricing may change</li>
                            <li>Final verification is the user’s responsibility</li>
                        </ul>

                        <h2>5. Bookings and payments</h2>
                        <ul>
                            <li>Payments may be processed through <strong>Razorpay</strong>, an authorized payment gateway.</li>
                            <li>MakeMyStay does not store card or banking details.</li>
                            <li>Booking or service charges, if paid, may be subject to separate refund policies.</li>
                        </ul>

                        <h2>6. Payment safety notice</h2>
                        <blockquote className="prose-callout">
                            <p><strong>Protect yourself from fraud</strong></p>
                            <ul>
                                <li><strong>Never</strong> pay in cash to any individuals or property representatives.</li>
                                <li><strong>Never</strong> use third-party payment links or direct personal transfers.</li>
                                <li>Payments must <strong>only</strong> be made through authorized MakeMyStay verified channels.</li>
                                <li>MakeMyStay representatives will never ask for payment via cash, personal UPI IDs, or unauthorized platforms.</li>
                                <li>If you are asked to pay outside the platform, please report it immediately to our support team.</li>
                            </ul>
                        </blockquote>

                        <h2>7. Cancellation and refund</h2>
                        <p>Refunds, if applicable, will follow:</p>
                        <ul>
                            <li>Booking terms displayed at time of payment</li>
                            <li>Service-specific policies</li>
                        </ul>
                        <p>Processing timelines may vary based on payment gateway rules.</p>

                        <h2>8. Intellectual property</h2>
                        <p>All content, logos, text, and design on this platform are the property of MakeMyStay and may not be used without permission.</p>

                        <h2>9. Limitation of liability</h2>
                        <p>MakeMyStay is not responsible for:</p>
                        <ul>
                            <li>Disputes between users and property owners</li>
                            <li>Third-party services</li>
                            <li>Temporary technical interruptions</li>
                        </ul>

                        <h2>10. Termination</h2>
                        <p>We reserve the right to suspend or terminate access to users who violate these Terms.</p>

                        <h2>11. Governing law</h2>
                        <p>These Terms shall be governed by the laws of <strong>India</strong>, and courts in <strong>Bengaluru, Karnataka</strong> shall have jurisdiction.</p>

                        <h2>12. Contact and support</h2>
                        <p>For any queries, payment issues, or to report suspicious activity, please reach out to us:</p>
                        <div className="prose-callout">
                            <p>
                                <strong>{LEGAL_ENTITY_NAME} Support</strong><br />
                                Email: <a href="mailto:connect@makemystay.ai">connect@makemystay.ai</a><br />
                                Phone: <a href="tel:+918150099911">+91 81500 99911</a>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
