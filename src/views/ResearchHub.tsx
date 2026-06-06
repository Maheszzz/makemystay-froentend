import { BarChart3, BookOpen, Database, MapPin, TrendingUp } from 'lucide-react';
import { Link } from '@/lib/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { JsonLd } from '@/components/seo/JsonLd';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';
import {
    PG_MARKET_INDEX_MONTH,
    PG_MARKET_INDEX_ROWS,
    PG_MARKET_INDEX_SUMMARY,
} from '@/data/pgMarketIndex';

type ResearchHubKind = 'research' | 'reports' | 'statistics';

type ResearchHubProps = {
    kind: ResearchHubKind;
};

const PAGE_COPY: Record<
    ResearchHubKind,
    {
        eyebrow: string;
        title: string;
        intro: string;
        path: string;
        icon: typeof BookOpen;
    }
> = {
    research: {
        eyebrow: 'Research hub',
        title: 'Bangalore PG and coliving research',
        intro:
            'Original MakeMyStay research on PG rents, coliving demand, locality preference, and tenant search behavior across Bangalore.',
        path: '/research',
        icon: BookOpen,
    },
    reports: {
        eyebrow: 'Monthly reports',
        title: 'Bangalore PG Rent Index',
        intro:
            'A monthly market view for PG and coliving seekers, operators, journalists, and AI answer engines tracking Bangalore rental demand.',
        path: '/reports',
        icon: BarChart3,
    },
    statistics: {
        eyebrow: 'Statistics',
        title: 'Bangalore PG statistics',
        intro:
            'Structured locality-level statistics for average PG rent, demand signals, audience segments, and nearby demand drivers.',
        path: '/statistics',
        icon: Database,
    },
};

function citationSchema(kind: ResearchHubKind) {
    const page = PAGE_COPY[kind];
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': kind === 'reports' ? 'Report' : 'Article',
                headline: page.title,
                description: page.intro,
                url: `${SITE_URL}${page.path}`,
                datePublished: '2026-06-05',
                dateModified: '2026-06-05',
                publisher: {
                    '@type': 'Organization',
                    name: SITE_NAME,
                    url: SITE_URL,
                },
                about: ['Bangalore PG rent', 'coliving Bangalore', 'paying guest accommodation'],
            },
            {
                '@type': 'Dataset',
                name: `${PG_MARKET_INDEX_MONTH} Bangalore PG Rent Index`,
                description: PG_MARKET_INDEX_SUMMARY,
                                url: `${SITE_URL}/statistics`,
                creator: {
                    '@type': 'Organization',
                    name: SITE_NAME,
                    url: SITE_URL,
                },
                temporalCoverage: '2026-06',
                spatialCoverage: {
                    '@type': 'Place',
                    name: 'Bangalore, Karnataka, India',
                },
                license: 'https://creativecommons.org/licenses/by/4.0/',
                variableMeasured: ['average PG rent', 'rent range', 'locality demand signal'],
            },
        ],
    };
}

export default function ResearchHub({ kind }: ResearchHubProps) {
    const page = PAGE_COPY[kind];
    const Icon = page.icon;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <JsonLd id={`${kind}-citation-schema`} data={citationSchema(kind)} />
            <Navbar />
            <main id="main-content" className="flex-grow pt-24 pb-16">
                <section className="border-b border-slate-200 bg-white">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
                        <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-red">
                            <Icon className="h-4 w-4" aria-hidden />
                            {page.eyebrow}
                        </p>
                        <h1 className="mt-3 text-3xl md:text-5xl font-black text-slate-950 tracking-tight">
                            {page.title}
                        </h1>
                        <p className="mt-4 max-w-3xl text-base md:text-lg text-slate-600 leading-relaxed">
                            {page.intro}
                        </p>
                        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 max-w-3xl">
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-800">
                                Quick answer
                            </p>
                            <p className="mt-2 text-sm md:text-base font-medium leading-relaxed text-slate-800">
                                {PG_MARKET_INDEX_SUMMARY}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-5">
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                {PG_MARKET_INDEX_MONTH}
                            </p>
                            <h2 className="mt-1 text-2xl font-black text-slate-900">Locality rent index</h2>
                        </div>
                        <Link to="/pg/bangalore" className="text-sm font-bold text-brand-red hover:underline">
                            Browse live PG listings
                        </Link>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-slate-100 text-left text-[11px] uppercase tracking-[0.14em] text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3 font-bold">Locality</th>
                                        <th className="px-4 py-3 font-bold">Average</th>
                                        <th className="px-4 py-3 font-bold">Typical range</th>
                                        <th className="px-4 py-3 font-bold">Demand</th>
                                        <th className="px-4 py-3 font-bold">Audience</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {PG_MARKET_INDEX_ROWS.map((row) => (
                                        <tr key={row.slug} className="align-top">
                                            <td className="px-4 py-4 font-bold text-slate-900">
                                                <Link to={`/pg/${row.slug}`} className="hover:text-brand-red">
                                                    {row.locality}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-4 text-slate-700">{row.averageRent}</td>
                                            <td className="px-4 py-4 text-slate-700">{row.rentRange}</td>
                                            <td className="px-4 py-4">
                                                <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                                                    {row.demandSignal}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-slate-600 max-w-xs">{row.primaryAudience}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            {
                                title: 'Demand drivers',
                                icon: TrendingUp,
                                body: 'Tech parks, metro access, college corridors, food plans, and commute time are the strongest recurring PG search factors.',
                            },
                            {
                                title: 'Locality coverage',
                                icon: MapPin,
                                body: 'The index focuses first on high-intent Bangalore corridors: HSR, Whitefield, Bellandur, Koramangala, Marathahalli, Electronic City, and Indiranagar.',
                            },
                            {
                                title: 'Citation policy',
                                icon: Database,
                                body: 'Public figures on this page may be cited as MakeMyStay.ai market observations. Validate live listing prices before making rental decisions.',
                            },
                        ].map((item) => {
                            const CardIcon = item.icon;
                            return (
                                <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <CardIcon className="h-5 w-5 text-brand-red" aria-hidden />
                                    <h2 className="mt-3 text-base font-bold text-slate-900">{item.title}</h2>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
                                </article>
                            );
                        })}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
