'use client';

import React from 'react';
import { Link, Navigate, useParams } from '@/lib/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { JsonLd } from '@/components/seo/JsonLd';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { FaqSection } from '@/components/seo/FaqSection';
import { generateProgrammaticBlogPost, type ProgrammaticBlogPost } from '@/lib/blog';
import {
    Clock,
    Calendar,
    ChevronRight,
    Building2,
    Train,
    Building,
    IndianRupee,
    ListChecks,
    ShieldCheck
} from 'lucide-react';

interface BlogPostProps {
    slug?: string;
}

export default function BlogPost({ slug: propSlug }: BlogPostProps) {
    const params = useParams<{ slug: string }>();
    const slug = propSlug || params.slug;

    const profile: ProgrammaticBlogPost | null = generateProgrammaticBlogPost(slug);

    if (!profile) {
        return <Navigate to="/blog" replace />;
    }

    const {
        hero,
        quickSummary,
        introduction,
        mainContent,
        rentalInsights,
        nearbyTechParks,
        nearbyMetro,
        nearbyCompanies,
        faqs,
        internalLinks,
        breadcrumb,
        tableOfContents,
        author,
        updatedDate,
        estimatedReadingTime,
        schema
    } = profile;

    return (
        <div className="min-h-screen bg-pdp-bg text-pdp-ink font-sans flex flex-col">
            <JsonLd data={schema} id="blog-post-jsonld" />
            <Navbar />

            <main id="main-content" className="flex-grow pt-20 pb-20">
                {/* ── Article Header ── */}
                <header className="bg-pdp-surface border-b border-pdp-border py-10">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6">
                        <BreadcrumbNav items={breadcrumb} calm />

                        <div className="mt-5">
                            <div className="flex items-center gap-3 text-xs font-medium text-pdp-muted mb-3">
                                <span>{hero.category}</span>
                                <span className="w-1 h-1 rounded-full bg-pdp-border" />
                                <span>Bangalore PG guides</span>
                            </div>

                            <h1
                                data-seo="blog-h1"
                                className="type-h1 text-pdp-ink max-w-[24ch]"
                            >
                                {hero.heading}
                            </h1>

                            <p className="mt-4 pdp-type-body text-pdp-muted max-w-[66ch]">
                                {hero.subHeading}
                            </p>

                            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-pdp-muted border-t border-pdp-border pt-4">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-pdp-muted" />
                                    <span>Updated: {updatedDate}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-pdp-muted" />
                                    <span>{estimatedReadingTime} min read</span>
                                </div>
                                <div className="flex items-center gap-1.5 font-medium text-pdp-ink">
                                    <span>By {author.name}</span>
                                </div>
                            </div>

                            {/* Quick Summary — Google AI Overview / Speakable Target */}
                            <blockquote
                                data-seo="blog-quick-summary"
                                className="mt-8 border-l-2 border-pdp-ink bg-pdp-bg rounded-r-[10px] p-5 md:p-6 max-w-[66ch]"
                            >
                                <p className="pdp-type-body text-pdp-ink">
                                    <strong className="font-semibold">Quick summary: </strong>
                                    {quickSummary}
                                </p>
                            </blockquote>
                        </div>
                    </div>
                </header>

                {/* ── Article Layout ── */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-10">
                    <div className="space-y-12">
                        {/* ── Table of Contents ── */}
                        <nav
                            aria-label="Table of contents"
                            className="rounded-[var(--radius-pdp)] border border-pdp-border bg-pdp-surface p-6"
                        >
                            <h2 className="text-lg font-semibold text-pdp-ink mb-3 flex items-center gap-2">
                                <ListChecks className="w-5 h-5 text-pdp-muted" aria-hidden />
                                Table of contents
                            </h2>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-sm">
                                {tableOfContents.map((toc, idx) => (
                                    <li key={toc.id}>
                                        <a
                                            href={`#${toc.id}`}
                                            className="text-pdp-ink underline underline-offset-4 hover:text-pdp-cta flex items-center gap-1.5 transition-colors"
                                        >
                                            <span className="text-xs font-medium text-pdp-muted tabular-nums">{idx + 1}.</span>
                                            {toc.title.replace(/^\d+\.\s*/, '')}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* ── Introduction & Long-Form Sections rendered with .prose-mms ── */}
                        <article className="prose-mms max-w-[66ch]">
                            {introduction.map((para, i) => (
                                <p key={i}>{para}</p>
                            ))}

                            {mainContent.map((sec) => (
                                <section key={sec.id} id={sec.id} className="scroll-mt-24">
                                    <h2>{sec.title}</h2>
                                    {sec.content.map((p, i) => (
                                        <p key={i} className="whitespace-pre-line">{p}</p>
                                    ))}

                                    {sec.table && (
                                        <div className="my-6 overflow-x-auto">
                                            {sec.table.caption && (
                                                <p className="text-sm font-medium text-pdp-muted mb-2">
                                                    {sec.table.caption}
                                                </p>
                                            )}
                                            <table className="w-full text-sm border border-pdp-border rounded-lg overflow-hidden bg-pdp-surface">
                                                <thead className="bg-pdp-bg">
                                                    <tr>
                                                        {sec.table.headers.map((h, i) => (
                                                            <th
                                                                key={i}
                                                                className="text-left py-3 px-4 font-semibold text-pdp-ink border-b border-pdp-border"
                                                            >
                                                                {h}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-pdp-border">
                                                    {sec.table.rows.map((row, ri) => (
                                                        <tr key={ri}>
                                                            {row.map((cell, ci) => (
                                                                <td
                                                                    key={ci}
                                                                    className={`py-3 px-4 ${
                                                                        ci === 0
                                                                            ? 'font-medium text-pdp-ink'
                                                                            : 'text-pdp-muted'
                                                                    }`}
                                                                >
                                                                    {cell}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </section>
                            ))}
                        </article>

                        {/* ── Rental Insights Table ── */}
                        <section
                            className="rounded-2xl border border-red-100 bg-red-50/30 p-6 md:p-8 shadow-sm space-y-6"
                            aria-labelledby="rental-insights-heading"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <h2
                                    id="rental-insights-heading"
                                    className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2"
                                >
                                    <IndianRupee className="w-6 h-6 text-brand-red" />
                                    2026 PG Rental Price Breakdown
                                </h2>
                                <span className="text-xs font-extrabold text-brand-red bg-white px-3 py-1.5 rounded-full border border-red-200 w-fit">
                                    Average Rent: {rentalInsights.averageRent}
                                </span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm bg-white rounded-xl overflow-hidden border border-slate-200">
                                    <thead className="bg-slate-100">
                                        <tr>
                                            <th className="text-left py-3 px-4 font-bold text-slate-800">Room Category</th>
                                            <th className="text-left py-3 px-4 font-bold text-slate-800">Monthly Rent Range</th>
                                            <th className="text-left py-3 px-4 font-bold text-slate-800">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {rentalInsights.priceTable.map((row) => (
                                            <tr key={row.roomType} className="hover:bg-slate-50 transition-colors">
                                                <td className="py-3.5 px-4 font-bold text-slate-900">{row.roomType}</td>
                                                <td className="py-3.5 px-4 font-extrabold text-brand-red">{row.priceRange}</td>
                                                <td className="py-3.5 px-4 text-slate-600 text-xs md:text-sm">{row.note}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="space-y-2 text-xs md:text-sm text-slate-600">
                                {rentalInsights.analysis.map((p, i) => (
                                    <p key={i}>{p}</p>
                                ))}
                            </div>
                        </section>

                        {/* ── Ecosystem Grids (Parks, Metro, Companies) ── */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Nearby IT Parks */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-brand-red" />
                                    Nearby IT Parks
                                </h3>
                                <ul className="space-y-2 text-sm">
                                    {nearbyTechParks.map((tp) => (
                                        <li key={tp.name} className="border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                                            <p className="font-semibold text-slate-900">{tp.name}</p>
                                            <p className="text-xs text-slate-500">{tp.distance} · {tp.note}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Nearby Metro */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <Train className="w-4 h-4 text-brand-red" />
                                    Namma Metro Access
                                </h3>
                                <ul className="space-y-2 text-sm">
                                    {nearbyMetro.map((m) => (
                                        <li key={m.name} className="border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                                            <div className="flex items-center justify-between">
                                                <p className="font-semibold text-slate-900">{m.name}</p>
                                                <span className="text-[10px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded font-bold">
                                                    {m.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500">{m.line} · {m.distance}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Key Companies */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <Building className="w-4 h-4 text-brand-red" />
                                    Key Companies
                                </h3>
                                <ul className="space-y-2 text-sm">
                                    {nearbyCompanies.map((comp) => (
                                        <li key={comp.name} className="border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                                            <p className="font-semibold text-slate-900">{comp.name}</p>
                                            <p className="text-xs text-slate-500">{comp.industry}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* ── 10+ SEO / AEO FAQs ── */}
                        {faqs.length > 0 && (
                            <FaqSection
                                title="Frequently Asked Questions"
                                items={faqs}
                            />
                        )}

                        {/* ── Topical Authority Internal Links ── */}
                        <section
                            className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6"
                            aria-labelledby="explore-more-heading"
                        >
                            <h2
                                id="explore-more-heading"
                                className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2"
                            >
                                <ShieldCheck className="w-5 h-5 text-brand-red" />
                                Explore Bangalore PG Corridors & Guides
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Localities */}
                                <div>
                                    <h3 className="text-sm font-semibold text-pdp-muted mb-3">
                                        PG localities
                                    </h3>
                                    <ul className="space-y-2">
                                        {internalLinks.localities.map((item) => (
                                            <li key={item.path}>
                                                <Link
                                                    to={item.path}
                                                    className="flex items-center gap-1.5 text-sm text-pdp-ink underline underline-offset-4 hover:text-pdp-cta font-medium"
                                                >
                                                    <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                                                    {item.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Tech Parks */}
                                <div>
                                    <h3 className="text-sm font-semibold text-pdp-muted mb-3">
                                        Tech park coliving
                                    </h3>
                                    <ul className="space-y-2">
                                        {internalLinks.techParks.map((item) => (
                                            <li key={item.path}>
                                                <Link
                                                    to={item.path}
                                                    className="flex items-center gap-1.5 text-sm text-pdp-ink underline underline-offset-4 hover:text-pdp-cta font-medium"
                                                >
                                                    <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                                                    {item.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Related Blogs */}
                                <div>
                                    <h3 className="text-sm font-semibold text-pdp-muted mb-3">
                                        Related guides
                                    </h3>
                                    <ul className="space-y-2">
                                        {internalLinks.blogs.map((item) => (
                                            <li key={item.path}>
                                                <Link
                                                    to={item.path}
                                                    className="flex items-center gap-1.5 text-sm text-pdp-ink underline underline-offset-4 hover:text-pdp-cta font-medium line-clamp-1"
                                                >
                                                    <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                                                    {item.title}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Property Pages */}
                                <div>
                                    <h3 className="text-sm font-semibold text-pdp-muted mb-3">
                                        Browse listings
                                    </h3>
                                    <ul className="space-y-2">
                                        {internalLinks.propertyPages.map((item) => (
                                            <li key={item.path}>
                                                <Link
                                                    to={item.path}
                                                    className="flex items-center gap-1.5 text-sm text-pdp-ink underline underline-offset-4 hover:text-pdp-cta font-medium"
                                                >
                                                    <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                                                    {item.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* ── Author Bio ── */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-red-100 text-brand-red flex items-center justify-center font-bold text-lg flex-shrink-0">
                                M
                            </div>
                            <div className="text-center sm:text-left">
                                <p className="text-base font-bold text-slate-900">{author.name}</p>
                                {author.role && (
                                    <p className="text-xs font-semibold text-slate-500 mb-1">{author.role}</p>
                                )}
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Our editorial team conducts physical property inspections and market research across Bangalore to publish accurate, transparent coliving and rental guides.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
