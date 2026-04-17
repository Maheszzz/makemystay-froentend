import { Link, Navigate, useParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { BLOG_POSTS, getBlogPost } from '@/data/blogPosts';
import { buildPageSEO } from '@/lib/seo';
import { SITE_URL } from '@/lib/siteConfig';

export default function BlogPost() {
    const { slug } = useParams<{ slug: string }>();
    const post = getBlogPost(slug);

    if (!post) {
        return <Navigate to="/blog" replace />;
    }

    const canonical = `${SITE_URL}/blog/${post.slug}`;
    const helmet = buildPageSEO({
        title: post.title,
        description: post.description,
        canonicalUrl: canonical,
    });

    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.description,
        datePublished: post.publishedAt,
        author: { '@type': 'Organization', name: 'MakeMyStay.ai' },
        publisher: { '@type': 'Organization', name: 'MakeMyStay.ai' },
        mainEntityOfPage: canonical,
    };

    const faqSchema = post.faqs && post.faqs.length > 0 ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faqs.map(f => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: f.answer
            }
        }))
    } : null;

    return (
        <div className="min-h-screen bg-white font-sans flex flex-col">
            <SEOHead {...helmet} ogType="article" />
            <JsonLd data={articleSchema} id="blog-article-schema" />
            {faqSchema && <JsonLd data={faqSchema} id="blog-faq-schema" />}

            <Navbar />

            <main id="main-content" className="flex-grow pt-28 pb-16">
                <article className="max-w-3xl mx-auto px-4 sm:px-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                        <Link to="/" className="hover:text-brand-red">
                            Home
                        </Link>{' '}
                        / Blog
                    </p>
                    <h1 className="mt-3 text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">{post.title}</h1>
                    <p className="mt-2 text-sm text-slate-500">
                        {post.publishedAt} · {post.readTimeMin} min read
                    </p>
                    <p className="mt-6 text-lg text-slate-600 leading-relaxed">{post.description}</p>

                    <div className="mt-10 space-y-5 text-slate-700 leading-relaxed">
                        {post.body.map((para, i) => (
                            <p key={i}>{para}</p>
                        ))}
                    </div>

                    {post.faqs && post.faqs.length > 0 && (
                        <div className="mt-12 space-y-8">
                            <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
                            <div className="grid gap-6">
                                {post.faqs.map((faq, i) => (
                                    <div key={i} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
                                        <h3 className="font-bold text-slate-900 mb-2">{faq.question}</h3>
                                        <p className="text-slate-600 text-sm leading-relaxed">{faq.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-4">
                        <div className="space-y-2">
                            <p className="font-semibold text-slate-900">Looking for a PG or rental?</p>
                            <p>
                                <Link to="/pg/bangalore" className="text-brand-red font-medium hover:underline">
                                    PG in Bangalore (city hub)
                                </Link>
                                {' · '}
                                <Link to="/pg/btm" className="text-brand-red font-medium hover:underline">
                                    PG in BTM
                                </Link>
                                {' · '}
                                <Link to="/pg-vs-flat-bangalore" className="text-brand-red font-medium hover:underline">
                                    PG vs flat guide
                                </Link>
                            </p>
                            <Link to="/pg" className="inline-block text-sm text-slate-600 hover:text-brand-red font-medium hover:underline">
                                Browse all PG listings →
                            </Link>
                        </div>
                        {post.relatedRentHubs && post.relatedRentHubs.length > 0 && (
                            <div className="pt-2 border-t border-slate-200/80">
                                <p className="text-sm font-semibold text-slate-900 mb-2">Flats &amp; houses for rent by area</p>
                                <ul className="flex flex-wrap gap-2">
                                    {post.relatedRentHubs.map((hub) => (
                                        <li key={hub.path}>
                                            <Link
                                                to={hub.path}
                                                className="inline-flex rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-brand-red/40 hover:text-brand-red transition-colors"
                                            >
                                                {hub.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </article>

                <section className="max-w-3xl mx-auto px-4 sm:px-6 mt-16">
                    <h2 className="text-lg font-bold text-slate-900">More articles</h2>
                    <ul className="mt-4 space-y-3">
                        {BLOG_POSTS.filter((p) => p.slug !== post.slug).map((p) => (
                            <li key={p.slug}>
                                <Link to={`/blog/${p.slug}`} className="text-brand-red font-medium hover:underline">
                                    {p.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            </main>

            <Footer />
        </div>
    );
}
