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

    return (
        <div className="min-h-screen bg-white font-sans flex flex-col">
            <SEOHead {...helmet} ogType="article" />
            <JsonLd data={articleSchema} />

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

                    <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-2">
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
