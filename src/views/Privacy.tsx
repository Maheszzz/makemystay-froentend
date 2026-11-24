'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LEGAL_ENTITY_NAME } from '@/lib/siteConfig';

const sections = [
    {
        num: '01',
        title: 'Information we collect',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        ),
        content: (
            <>
                <p className="privacy-p">We may collect the following types of information when you use our platform:</p>
                <div className="privacy-two-col">
                    <div className="privacy-info-block">
                        <h4>Personal details</h4>
                        <ul className="privacy-list">
                            <li>Name and contact information</li>
                            <li>Phone number and email address</li>
                            <li>Location preferences</li>
                            <li>Property requirements</li>
                            <li>Information submitted via forms or chat</li>
                        </ul>
                    </div>
                    <div className="privacy-info-block">
                        <h4>Transaction information</h4>
                        <p>Payments are processed securely by <strong>Razorpay</strong>. We never store debit/credit card numbers or banking details on our servers.</p>
                    </div>
                </div>
            </>
        ),
    },
    {
        num: '02',
        title: 'How we use your information',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
        ),
        content: (
            <ul className="privacy-list privacy-list--grid">
                <li>Provide property recommendations tailored to your needs</li>
                <li>Respond to inquiries and schedule property visits</li>
                <li>Improve our platform and user experience</li>
                <li>Process bookings and service payments</li>
                <li>Send relevant updates, confirmations, and offers</li>
            </ul>
        ),
    },
    {
        num: '03',
        title: 'Sharing of information',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
        ),
        content: (
            <>
                <p className="privacy-p">We share limited information only as needed to deliver our services:</p>
                <ul className="privacy-list">
                    <li>Property owners or partners to fulfil your requests</li>
                    <li>Payment gateway providers (Razorpay)</li>
                    <li>Service providers assisting in platform operations</li>
                    <li>Regulatory authorities when required by law</li>
                </ul>
                <p className="privacy-note">We do not sell, rent, or trade user data to third parties.</p>
            </>
        ),
    },
    {
        num: '04',
        title: 'Data security',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
        ),
        content: (
            <p className="privacy-p">We use reasonable technical and organizational safeguards to protect your personal information from unauthorized access, loss, or misuse. However, no online platform can guarantee absolute security, and we encourage you to use strong passwords and exercise caution when sharing information online.</p>
        ),
    },
    {
        num: '05',
        title: 'Cookies',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="8" cy="9" r="1" fill="currentColor" />
                <circle cx="15" cy="8" r="1" fill="currentColor" />
                <circle cx="10" cy="15" r="1" fill="currentColor" />
                <circle cx="16" cy="14" r="1.5" fill="currentColor" />
            </svg>
        ),
        content: (
            <p className="privacy-p">Our platform uses cookies and similar technologies to remember your preferences, improve functionality, and understand how our services are used. You can control cookie settings through your browser preferences at any time.</p>
        ),
    },
    {
        num: '06',
        title: 'Your rights',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
        ),
        content: (
            <>
                <p className="privacy-p">You may contact us at any time to:</p>
                <ul className="privacy-list">
                    <li>Request access to the personal data we hold about you</li>
                    <li>Ask for corrections to inaccurate information</li>
                    <li>Request deletion of your data (subject to legal obligations)</li>
                </ul>
                <p className="privacy-p">Send requests to <a href="mailto:connect@makemystay.ai" className="privacy-link">connect@makemystay.ai</a></p>
            </>
        ),
    },
    {
        num: '07',
        title: 'Policy updates',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
        ),
        content: (
            <p className="privacy-p">We may update this Privacy Policy periodically to reflect changes in our services or legal requirements. When we do, the revised version will be posted on this page. We encourage you to review this page from time to time.</p>
        ),
    },
];

export default function Privacy() {
    return (
        <>
            <Navbar />

            <style>{`
                .priv-hero {
                    background: linear-gradient(135deg, #C8201A 0%, #E8291C 60%, #ff4d44 100%);
                    padding: 80px 0 64px;
                }
                .priv-hero-inner {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 0 24px;
                }
                .priv-hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: rgba(255,255,255,0.18);
                    color: #fff;
                    font-size: 12px;
                    font-weight: 600;
                    letter-spacing: 0.06em;
                    padding: 5px 12px;
                    border-radius: 100px;
                    margin-bottom: 20px;
                    text-transform: uppercase;
                }
                .priv-hero-badge svg {
                    opacity: 0.85;
                }
                .priv-hero h1 {
                    font-size: clamp(2rem, 5vw, 2.75rem);
                    font-weight: 800;
                    color: #fff;
                    line-height: 1.1;
                    margin: 0 0 14px;
                    letter-spacing: -0.03em;
                }
                .priv-hero-sub {
                    color: rgba(255,255,255,0.78);
                    font-size: 1.05rem;
                    margin: 0;
                    line-height: 1.6;
                }
                .priv-meta {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    margin-top: 24px;
                    color: rgba(255,255,255,0.6);
                    font-size: 13px;
                }
                .priv-meta svg { opacity: 0.7; }

                .priv-body {
                    background: #f8f8f9;
                    min-height: 60vh;
                    padding: 60px 0 80px;
                }
                .priv-body-inner {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 0 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .priv-section {
                    background: #fff;
                    border-radius: 14px;
                    padding: 28px 32px;
                    border: 1px solid #ebebeb;
                    transition: box-shadow 0.2s;
                }
                .priv-section:hover {
                    box-shadow: 0 4px 20px rgba(0,0,0,0.07);
                }
                .priv-section-header {
                    display: flex;
                    align-items: flex-start;
                    gap: 16px;
                    margin-bottom: 18px;
                }
                .priv-section-icon {
                    width: 42px;
                    height: 42px;
                    min-width: 42px;
                    background: #fff1f0;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #E8291C;
                    margin-top: 1px;
                }
                .priv-section-heading {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }
                .priv-section-num {
                    font-size: 11px;
                    font-weight: 700;
                    color: #E8291C;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                }
                .priv-section-heading h2 {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #111;
                    margin: 0;
                    line-height: 1.3;
                }
                .priv-section-body {
                    padding-left: 58px;
                }

                .privacy-p {
                    color: #444;
                    font-size: 0.95rem;
                    line-height: 1.7;
                    margin: 0 0 12px;
                }
                .privacy-p:last-child { margin-bottom: 0; }

                .privacy-list {
                    color: #444;
                    font-size: 0.95rem;
                    line-height: 1.7;
                    padding-left: 0;
                    list-style: none;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .privacy-list li {
                    padding-left: 18px;
                    position: relative;
                }
                .privacy-list li::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 10px;
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #E8291C;
                    opacity: 0.6;
                }
                .privacy-list--grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px 24px;
                }
                .privacy-two-col {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                .privacy-info-block h4 {
                    font-size: 0.82rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                    color: #888;
                    margin: 0 0 10px;
                }
                .privacy-info-block p {
                    color: #444;
                    font-size: 0.95rem;
                    line-height: 1.7;
                    margin: 0;
                }
                .privacy-note {
                    margin-top: 14px;
                    padding: 10px 14px;
                    background: #f0fdf4;
                    border-left: 3px solid #22c55e;
                    border-radius: 0 6px 6px 0;
                    color: #166534;
                    font-size: 0.88rem;
                    font-weight: 500;
                }
                .privacy-link {
                    color: #E8291C;
                    text-decoration: none;
                    font-weight: 500;
                    border-bottom: 1px solid rgba(232,41,28,0.3);
                    padding-bottom: 1px;
                    transition: border-color 0.15s;
                }
                .privacy-link:hover {
                    border-color: #E8291C;
                }

                .priv-contact-card {
                    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                    border-radius: 14px;
                    padding: 32px;
                    display: grid;
                    grid-template-columns: 1fr auto;
                    align-items: center;
                    gap: 24px;
                    margin-top: 8px;
                }
                .priv-contact-label {
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.45);
                    margin-bottom: 6px;
                }
                .priv-contact-name {
                    font-size: 1rem;
                    font-weight: 700;
                    color: #fff;
                    margin-bottom: 4px;
                }
                .priv-contact-addr {
                    font-size: 0.88rem;
                    color: rgba(255,255,255,0.55);
                    line-height: 1.6;
                }
                .priv-contact-email {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: #E8291C;
                    color: #fff;
                    font-size: 0.88rem;
                    font-weight: 600;
                    padding: 10px 20px;
                    border-radius: 8px;
                    text-decoration: none;
                    white-space: nowrap;
                    transition: background 0.15s;
                }
                .priv-contact-email:hover { background: #c8201a; }

                @media (max-width: 600px) {
                    .priv-hero { padding: 60px 0 48px; }
                    .priv-section { padding: 22px 20px; }
                    .priv-section-body { padding-left: 0; }
                    .privacy-list--grid { grid-template-columns: 1fr; }
                    .privacy-two-col { grid-template-columns: 1fr; }
                    .priv-contact-card { grid-template-columns: 1fr; }
                    .priv-contact-email { width: 100%; justify-content: center; }
                }
            `}</style>

            <main id="main-content" className="min-h-screen">
                {/* Hero */}
                <div className="priv-hero">
                    <div className="priv-hero-inner">
                        <div className="priv-hero-badge">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                            Legal
                        </div>
                        <h1>Privacy Policy</h1>
                        <p className="priv-hero-sub">
                            How MakeMyStay collects, uses, and protects your information when you use our platform.
                        </p>
                        <div className="priv-meta">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            Last updated: February 2026
                        </div>
                    </div>
                </div>

                {/* Sections */}
                <div className="priv-body">
                    <div className="priv-body-inner">
                        {sections.map((s) => (
                            <div className="priv-section" key={s.num}>
                                <div className="priv-section-header">
                                    <div className="priv-section-icon">{s.icon}</div>
                                    <div className="priv-section-heading">
                                        <span className="priv-section-num">{s.num}</span>
                                        <h2>{s.title}</h2>
                                    </div>
                                </div>
                                <div className="priv-section-body">
                                    {s.content}
                                </div>
                            </div>
                        ))}

                        {/* Contact card */}
                        <div className="priv-contact-card">
                            <div>
                                <div className="priv-contact-label">Section 08 · Contact</div>
                                <div className="priv-contact-name">{LEGAL_ENTITY_NAME}</div>
                                <div className="priv-contact-addr">
                                    HSR Layout, Sector 7<br />
                                    Bengaluru, Karnataka 560102
                                </div>
                            </div>
                            <a href="mailto:connect@makemystay.ai" className="priv-contact-email">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                                connect@makemystay.ai
                            </a>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
