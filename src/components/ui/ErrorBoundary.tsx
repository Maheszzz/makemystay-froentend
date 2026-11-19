import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Top-level Error Boundary: prevents the entire app from going blank on any
 * uncaught render/lifecycle exception. Shows a branded recovery screen so users
 * can refresh instead of seeing a white screen.
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('[ErrorBoundary] Uncaught error:', error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div
                    style={{
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--color-page)',
                        fontFamily: 'Inter, sans-serif',
                        padding: '2rem',
                        textAlign: 'center',
                    }}
                >
                    {/* Brand mark */}
                    <div
                        style={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            background: 'var(--color-red)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1.5rem',
                        }}
                    >
                        {/* exclamation mark */}
                        <span style={{ color: '#FFFFFF', fontSize: 28, fontWeight: 900, lineHeight: 1 }}>
                            !
                        </span>
                    </div>

                    <h1
                        style={{
                            fontSize: '2.25rem',
                            fontWeight: 700,
                            fontFamily: 'var(--font-heading)',
                            color: 'var(--color-ink)',
                            marginBottom: '0.5rem',
                        }}
                    >
                        Something went wrong
                    </h1>
                    <p
                        style={{
                            color: 'var(--color-slate)',
                            maxWidth: 420,
                            lineHeight: 1.65,
                            marginBottom: '2rem',
                            fontSize: '0.95rem',
                        }}
                    >
                        We hit an unexpected error on this page. Try refreshing — if the
                        problem persists, contact support.
                    </p>

                    {/* Error detail (dev / debug aid — hidden in tiny collapsed block) */}
                    {this.state.error && (
                        <details
                            style={{
                                marginBottom: '1.5rem',
                                maxWidth: 520,
                                textAlign: 'left',
                                background: '#FFFFFF',
                                borderRadius: 12,
                                border: '1px solid var(--color-line)',
                                padding: '0.75rem 1rem',
                            }}
                        >
                            <summary
                                style={{
                                    cursor: 'pointer',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    color: 'var(--color-slate)',
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Error details
                            </summary>
                            <pre
                                style={{
                                    marginTop: '0.5rem',
                                    fontSize: '0.75rem',
                                    color: 'var(--color-red)',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-all',
                                }}
                            >
                                {this.state.error.message}
                                {'\n'}
                                {this.state.error.stack?.slice(0, 800)}
                            </pre>
                        </details>
                    )}

                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '0.7rem 2rem',
                            borderRadius: 10,
                            background: 'var(--color-red)',
                            color: '#FFFFFF',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            border: 'none',
                            cursor: 'pointer',
                            marginRight: '0.75rem',
                        }}
                    >
                        Refresh page
                    </button>
                    <a
                        href="/"
                        style={{
                            padding: '0.7rem 2rem',
                            borderRadius: 10,
                            background: '#FFFFFF',
                            color: 'var(--color-ink)',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            border: '1px solid var(--color-ink)',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            display: 'inline-block',
                        }}
                    >
                        Go home
                    </a>
                </div>
            );
        }

        return this.props.children;
    }
}
