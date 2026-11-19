import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const BRAND_RED = '#C41F25';
const BRAND_DARK = '#5E0F12';
const BRAND_DEEP = '#7F1519';
const BRAND_SUBTITLE = '#F6DCDD';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title')?.trim() || 'Verified PG & rentals';
    const location = searchParams.get('location')?.trim() || 'Bangalore';
    const price = searchParams.get('price')?.trim() || 'Zero brokerage';
    const type = searchParams.get('type')?.trim() || 'MakeMyStay.ai';

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '56px 64px',
                    background: `linear-gradient(135deg, ${BRAND_DARK} 0%, ${BRAND_DEEP} 55%, ${BRAND_RED} 120%)`,
                    color: '#FFFFFF',
                    fontFamily: 'system-ui, sans-serif',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div
                        style={{
                            width: 52,
                            height: 52,
                            borderRadius: 14,
                            background: BRAND_RED,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 28,
                            fontWeight: 800,
                        }}
                    >
                        M
                    </div>
                    <span style={{ fontSize: 28, fontWeight: 700, opacity: 0.95 }}>MakeMyStay.ai</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1000 }}>
                    <div
                        style={{
                            fontSize: 22,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            color: BRAND_SUBTITLE,
                        }}
                    >
                        {type}
                    </div>
                    <div
                        style={{
                            fontSize: 52,
                            fontWeight: 800,
                            lineHeight: 1.15,
                            letterSpacing: '-0.02em',
                        }}
                    >
                        {title.length > 72 ? `${title.slice(0, 69)}…` : title}
                    </div>
                    <div style={{ fontSize: 30, fontWeight: 500, opacity: 0.9 }}>{location}</div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: 26,
                        fontWeight: 700,
                    }}
                >
                    <span>{price}</span>
                    <span style={{ opacity: 0.75, fontSize: 20 }}>Verified · Book a visit</span>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        },
    );
}
