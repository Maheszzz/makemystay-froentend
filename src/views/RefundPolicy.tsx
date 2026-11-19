'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LEGAL_ENTITY_NAME } from '@/lib/siteConfig';

export default function RefundPolicy() {
    return (
        <>
            <Navbar />
            <main id="main-content" className="pt-24 pb-16 lg:pb-20 min-h-screen bg-pdp-bg text-pdp-ink">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-pdp-surface border border-pdp-border rounded-[var(--radius-pdp)] p-6 sm:p-10 md:p-12 prose-mms">
                        <h1>Refund and cancellation policy</h1>
                        <p className="text-sm text-pdp-muted">Last updated: February 2026</p>

                        <p>
                            This Refund and Cancellation Policy outlines the terms applicable to payments made on <a href="https://makemystay.ai">www.makemystay.ai</a>, operated by <strong>{LEGAL_ENTITY_NAME}</strong>, Bengaluru, India.
                        </p>
                        <p>By making a payment on our platform, you agree to the terms described below.</p>

                        <hr />

                        <h2>1. Booking and service payments</h2>
                        <p>Payments made on MakeMyStay may include:</p>
                        <ul>
                            <li>Property visit or service charges</li>
                            <li>Booking or token advance</li>
                            <li>Platform or consultation fees</li>
                        </ul>
                        <p>All payments are processed securely through authorized payment gateways such as <strong>Razorpay</strong>.</p>

                        <h2>2. Cancellation policy</h2>
                        <p>Users may request cancellation of a booking or service by contacting our support team.</p>
                        <p>Cancellation eligibility depends on:</p>
                        <ul>
                            <li>Type of service or booking</li>
                            <li>Time of cancellation request</li>
                            <li>Partner or property provider terms</li>
                        </ul>
                        <p>Certain service or consultation fees may be non-refundable if the service has already been delivered.</p>

                        <h2>3. Refund policy</h2>
                        <p>Refunds, if applicable, may be issued under the following conditions:</p>
                        <ul>
                            <li>Duplicate payment made by mistake</li>
                            <li>Payment failure where amount was deducted but service not provided</li>
                            <li>Booking cancelled within the eligible cancellation window</li>
                        </ul>
                        <p>Refunds may not be applicable in cases where:</p>
                        <ul>
                            <li>A site visit or service has already been completed</li>
                            <li>The user fails to attend a scheduled visit without prior notice</li>
                            <li>Payment was made toward non-refundable service charges clearly mentioned at the time of booking</li>
                        </ul>

                        <h2>4. Refund processing time</h2>
                        <p>Approved refunds are processed within <strong>5 to 10 working days</strong>.</p>
                        <p>The time taken for the amount to reflect depends on:</p>
                        <ul>
                            <li>Payment method used</li>
                            <li>Bank or payment gateway processing timelines</li>
                        </ul>
                        <p>MakeMyStay is not responsible for delays caused by banks or payment providers.</p>

                        <h2>5. Mode of refund</h2>
                        <p>Refunds will be issued to the <strong>original payment method</strong> used during the transaction unless otherwise required by applicable regulations.</p>

                        <h2>6. Disputes</h2>
                        <p>In case of any disputes related to payments or refunds, users are requested to contact MakeMyStay support first for resolution.</p>

                        <h2>7. Contact information</h2>
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
