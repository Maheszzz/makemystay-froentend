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
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <JsonLd data={schema} id="blog-post-jsonld" />
            <Navbar />

            <main id="main-content" className="flex-grow pt-20 pb-20">
                {/* ── Article Header ── */}
                <header className="bg-white border-b border-slate-100 pb-10">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6">
                        <BreadcrumbNav items={breadcrumb} />

                        <div className="mt-5">
                            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-brand-red mb-3">
                                <span>{hero.category}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                <span>Bangalore PG Guides</span>
                            </div>

                            <h1
                                data-seo="blog-h1"
                                className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
                            >
                                {hero.heading}
                            </h1>

                            <p className="mt-3 text-slate-600 text-base md:text-lg leading-relaxed">
                                {hero.subHeading}
                            </p>

                            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs md:text-sm text-slate-500 border-t border-slate-100 pt-4">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <span>Updated: {updatedDate}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-slate-400" />
                                    <span>{estimatedReadingTime} min read</span>
                                </div>
                                <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                                    <span>By {author.name}</span>
                                </div>
                            </div>

                            {/* Quick Summary — Google AI Overview / Speakable Target */}
                            <div
                                data-seo="blog-quick-summary"
                                className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/70 p-6"
                            >
                                <p className="text-sm md:text-base text-blue-950 leading-relaxed font-normal">
                                    <strong className="font-bold text-blue-900">Quick Summary (AEO Answer): </strong>
                                    {quickSummary}
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* ── Article Layout (Main + Sidebar TOC) ── */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-10">
                    <div className="space-y-12">
                        {/* ── Table of Contents ── */}
                        <nav
                            aria-label="Table of contents"
                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <ListChecks className="w-5 h-5 text-brand-red" />
                                Table of Contents
                            </h2>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                {tableOfContents.map((toc, idx) => (
                                    <li key={toc.id}>
                                        <a
                                            href={`#${toc.id}`}
                                            className="text-slate-600 hover:text-brand-red hover:underline flex items-center gap-1.5 transition-colors"
                                        >
                                            <span className="text-xs font-bold text-slate-400">{idx + 1}.</span>
                                            {toc.title.replace(/^\d+\.\s*/, '')}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* ── Introduction ── */}
                        <section className="space-y-4 text-slate-700 text-base md:text-lg leading-relaxed">
                            {introduction.map((para, i) => (
                                <p key={i}>{para}</p>
                            ))}
                        </section>

                        {/* ── Long-Form Sections ── */}
                        <div className="space-y-12">
                            {mainContent.map((sec) => (
                                <section
                                    key={sec.id}
                                    id={sec.id}
                                    className="scroll-mt-24 space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm"
                                >
                                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                                        {sec.title}
                                    </h2>

                                    <div className="space-y-4 text-slate-700 text-base leading-relaxed">
                                        {sec.content.map((p, i) => (
                                            <p key={i} className="whitespace-pre-line">{p}</p>
                                        ))}
                                    </div>

                                    {/* Optional Structured Table */}
                                    {sec.table && (
                                        <div className="mt-6 overflow-x-auto pt-2">
                                            {sec.table.caption && (
                                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                                                    {sec.table.caption}
                                                </p>
                                            )}
                                            <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                                                <thead className="bg-slate-100/80">
                                                    <tr>
                                                        {sec.table.headers.map((h, i) => (
                                                            <th
                                                                key={i}
                                                                className="text-left py-3 px-4 font-bold text-slate-800 border-b border-slate-200"
                                                            >
                                                                {h}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {sec.table.rows.map((row, ri) => (
                                                        <tr key={ri} className="hover:bg-slate-50/70 transition-colors">
                                                            {row.map((cell, ci) => (
                                                                <td
                                                                    key={ci}
                                                                    className={`py-3.5 px-4 ${
                                                                        ci === 0
                                                                            ? 'font-semibold text-slate-900'
                                                                            : 'text-slate-600'
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
                        </div>

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
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                                        PG Localities
                                    </h3>
                                    <ul className="space-y-2">
                                        {internalLinks.localities.map((item) => (
                                            <li key={item.path}>
                                                <Link
                                                    to={item.path}
                                                    className="flex items-center gap-1.5 text-sm text-brand-red hover:underline font-medium"
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
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                                        Tech Park Coliving
                                    </h3>
                                    <ul className="space-y-2">
                                        {internalLinks.techParks.map((item) => (
                                            <li key={item.path}>
                                                <Link
                                                    to={item.path}
                                                    className="flex items-center gap-1.5 text-sm text-brand-red hover:underline font-medium"
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
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                                        Related Guides
                                    </h3>
                                    <ul className="space-y-2">
                                        {internalLinks.blogs.map((item) => (
                                            <li key={item.path}>
                                                <Link
                                                    to={item.path}
                                                    className="flex items-center gap-1.5 text-sm text-brand-red hover:underline font-medium line-clamp-1"
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
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                                        Browse Listings
                                    </h3>
                                    <ul className="space-y-2">
                                        {internalLinks.propertyPages.map((item) => (
                                            <li key={item.path}>
                                                <Link
                                                    to={item.path}
                                                    className="flex items-center gap-1.5 text-sm text-brand-red hover:underline font-medium"
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
