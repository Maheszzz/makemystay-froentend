import { useState, useEffect } from "react";

interface PaymentSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    paymentId: string;
    amount: number;
    receiptUrl: string;
}

export function PaymentSuccessModal({ isOpen, onClose, paymentId, amount, receiptUrl }: PaymentSuccessModalProps) {
    const [copied, setCopied] = useState(false);
    const [visible, setVisible] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setVisible(true), 50);
            setTimeout(() => setContentVisible(true), 300);
        } else {
            setVisible(false);
            setContentVisible(false);
        }
    }, [isOpen]);

    const handleCopy = () => {
        navigator.clipboard.writeText(paymentId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isOpen) return null;

    return (
        <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .pms-overlay {
          position: fixed; inset: 0; z-index: 1000;
          display: flex; align-items: center; justify-content: center;
          padding: 1rem;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(6px);
          opacity: 0; transition: opacity 0.3s ease;
        }
        .pms-overlay.show { opacity: 1; }

        .pms-modal {
          background: #ffffff;
          border-radius: 20px;
          width: 100%; max-width: 460px;
          padding: 0;
          overflow: hidden;
          transform: translateY(24px) scale(0.97);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 24px 80px rgba(0,0,0,0.25);
          position: relative;
        }
        .pms-modal.show { transform: translateY(0) scale(1); }

        /* Close button */
        .pms-close {
          position: absolute; top: 14px; right: 16px;
          background: none; border: none; cursor: pointer;
          color: #9ca3af; padding: 4px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%; transition: background 0.15s, color 0.15s;
          z-index: 10;
        }
        .pms-close:hover { background: #f3f4f6; color: #374151; }

        /* Top section */
        .pms-top {
          padding: 36px 32px 20px;
          text-align: center;
          opacity: 0; transform: translateY(12px);
          transition: all 0.4s ease;
        }
        .pms-top.show { opacity: 1; transform: translateY(0); }

        /* Check icon */
        .pms-check-wrap {
          display: inline-flex; align-items: center; justify-content: center;
          width: 72px; height: 72px;
          background: #f0fdf4;
          border: 6px solid #dcfce7;
          border-radius: 50%;
          margin-bottom: 18px;
        }

        .pms-title {
          font-size: 1.625rem; font-weight: 800;
          color: #111827; letter-spacing: -0.02em;
          margin-bottom: 8px; line-height: 1.2;
        }

        .pms-subtitle {
          font-size: 0.875rem; color: #6b7280;
          line-height: 1.5; margin-bottom: 14px;
        }

        /* Verified badge */
        .pms-badge {
          display: inline-flex; align-items: center; gap: 5px;
          border: 1.5px solid #22c55e;
          color: #16a34a; font-size: 0.6875rem;
          font-weight: 700; letter-spacing: 0.08em;
          padding: 5px 14px; border-radius: 999px;
          background: #f0fdf4;
        }

        /* Details card */
        .pms-card {
          margin: 0 20px 16px;
          border: 1.5px solid #e5e7eb;
          border-radius: 14px;
          overflow: hidden;
          opacity: 0; transform: translateY(10px);
          transition: all 0.4s ease 0.1s;
        }
        .pms-card.show { opacity: 1; transform: translateY(0); }

        /* Card header: logo + name + amount */
        .pms-card-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 18px;
        }
        .pms-logo-row { display: flex; align-items: center; gap: 12px; }
        .pms-logo-circle {
          width: 44px; height: 44px; border-radius: 50%;
          background: #B91C1C;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
        }
        .pms-logo-initials { font-size: 10px; font-weight: 800; color: white; text-align: center; line-height: 1.1; }
        .pms-merchant-name { font-size: 0.9375rem; font-weight: 700; color: #111827; }
        .pms-merchant-tag { font-size: 0.75rem; color: #9ca3af; margin-top: 1px; }
        .pms-amount-wrap { display: flex; align-items: center; gap: 6px; }
        .pms-amount { font-size: 1.25rem; font-weight: 800; color: #111827; }

        .pms-divider { height: 1px; background: #e5e7eb; margin: 0; }

        /* Detail rows */
        .pms-rows { padding: 2px 0; }
        .pms-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 11px 18px;
          border-bottom: 1px solid #f9fafb;
        }
        .pms-row:last-child { border-bottom: none; }
        .pms-row-key {
          font-size: 0.8125rem; color: #6b7280; font-weight: 400;
          flex-shrink: 0;
        }
        .pms-row-val {
          font-size: 0.8125rem; color: #111827; font-weight: 500;
          display: flex; align-items: center; gap: 6px;
          text-align: right;
        }
        .pms-row-val.green { color: #16a34a; font-weight: 700; }
        .pms-txn-id {
          font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
          font-size: 0.75rem;
        }
        .pms-copy-btn {
          background: none; border: none; cursor: pointer;
          color: #9ca3af; padding: 2px;
          display: flex; align-items: center;
          transition: color 0.15s;
          flex-shrink: 0;
        }
        .pms-copy-btn:hover { color: #374151; }

        /* Security note */
        .pms-security {
          margin: 0 20px 16px;
          background: #f0fdf4;
          border: 1.5px solid #bbf7d0;
          border-radius: 12px;
          padding: 11px 16px;
          display: flex; align-items: center; gap: 10px;
          opacity: 0; transform: translateY(8px);
          transition: all 0.4s ease 0.2s;
        }
        .pms-security.show { opacity: 1; transform: translateY(0); }
        .pms-security-text { font-size: 0.8125rem; color: #15803d; font-weight: 500; }

        /* Buttons */
        .pms-buttons {
          display: flex; gap: 10px;
          padding: 4px 20px 24px;
          opacity: 0; transform: translateY(8px);
          transition: all 0.4s ease 0.25s;
        }
        .pms-buttons.show { opacity: 1; transform: translateY(0); }

        .pms-btn-share {
          flex: 1; padding: 13px;
          background: #ffffff; color: #374151;
          border: 1.5px solid #d1d5db; border-radius: 12px;
          font-family: inherit; font-size: 0.875rem; font-weight: 600;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          cursor: pointer; transition: all 0.2s ease;
        }
        .pms-btn-share:hover { background: #f9fafb; border-color: #9ca3af; }

        .pms-btn-download {
          flex: 1; padding: 13px;
          background: #2563eb; color: #ffffff;
          border: none; border-radius: 12px;
          font-family: inherit; font-size: 0.875rem; font-weight: 600;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          cursor: pointer; transition: all 0.2s ease;
          text-decoration: none;
        }
        .pms-btn-download:hover { background: #1d4ed8; }
        .pms-btn-download:active { background: #1e40af; }

        .status-dot-green {
          width: 8px; height: 8px; border-radius: 50%;
          background: #22c55e; display: inline-block; flex-shrink: 0;
        }
      `}</style>

            <div className={`pms-overlay ${visible ? "show" : ""}`} onClick={onClose}>
                <div className={`pms-modal ${visible ? "show" : ""}`} onClick={(e) => e.stopPropagation()}>

                    {/* Close button */}
                    <button className="pms-close" onClick={onClose} aria-label="Close">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>

                    {/* Top: check + title + badge */}
                    <div className={`pms-top ${contentVisible ? "show" : ""}`}>
                        <div className="pms-check-wrap">
                            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <h2 className="pms-title">Payment Successful</h2>
                        <p className="pms-subtitle">
                            Your payment of ₹{amount.toLocaleString("en-IN")} has been processed successfully.
                        </p>
                        <div className="pms-badge">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="#22c55e" stroke="none">
                                <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
                            </svg>
                            VERIFIED
                        </div>
                    </div>

                    {/* Payment card */}
                    <div className={`pms-card ${contentVisible ? "show" : ""}`}>
                        {/* Card header */}
                        <div className="pms-card-header">
                            <div className="pms-logo-row">
                                <div className="pms-logo-circle">
                                    <div className="pms-logo-initials">Make<br />My<br />Stay</div>
                                </div>
                                <div>
                                    <div className="pms-merchant-name">MakeMyStay Realty</div>
                                    <div className="pms-merchant-tag">Clicks to Closure</div>
                                </div>
                            </div>
                            <div className="pms-amount-wrap">
                                <span className="pms-amount">₹{amount.toLocaleString("en-IN")}</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="18 15 12 9 6 15" />
                                </svg>
                            </div>
                        </div>

                        <div className="pms-divider" />

                        {/* Rows */}
                        <div className="pms-rows">
                            <div className="pms-row">
                                <span className="pms-row-key">Transaction ID</span>
                                <span className="pms-row-val">
                                    <span className="pms-txn-id">{paymentId}</span>
                                    <button className="pms-copy-btn" onClick={handleCopy} title="Copy">
                                        {copied
                                            ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                            : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                                        }
                                    </button>
                                </span>
                            </div>
                            <div className="pms-row">
                                <span className="pms-row-key">To</span>
                                <span className="pms-row-val">MakeMyStay Realty</span>
                            </div>
                            <div className="pms-row">
                                <span className="pms-row-key">Status</span>
                                <span className="pms-row-val green">
                                    <span className="status-dot-green" />
                                    Success
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Security note */}
                    <div className={`pms-security ${contentVisible ? "show" : ""}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#22c55e" stroke="none" style={{ flexShrink: 0 }}>
                            <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
                        </svg>
                        <span className="pms-security-text">This payment is secured and encrypted.</span>
                    </div>

                    {/* Buttons */}
                    <div className={`pms-buttons ${contentVisible ? "show" : ""}`}>
                        <button className="pms-btn-share" onClick={onClose}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                            </svg>
                            Share Receipt
                        </button>
                        <a href={receiptUrl} target="_blank" rel="noopener noreferrer" className="pms-btn-download">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            Download Receipt
                        </a>
                    </div>

                </div>
            </div>
        </div>
    );
}
