import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { BLOG_POSTS } from '@/data/blogPosts';
import { buildPageSEO } from '@/lib/seo';

export default function BlogIndex() {
    const helmet = buildPageSEO({
        title: 'Guides & insights — PG & rentals in Bangalore',
        description:
            'Practical guides on choosing PG accommodation, budgeting rent vs flats, and getting the most from MakeMyStay.ai.',
        path: '/blog',
    });

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <SEOHead {...helmet} />
            <Navbar />
            <main id="main-content" className="flex-grow pt-28 pb-16">
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Blog</h1>
                    <p className="mt-2 text-slate-600">Guides for renters and PG seekers in Bangalore.</p>
                    <ul className="mt-10 space-y-8">
                        {BLOG_POSTS.map((p) => (
                            <li key={p.slug} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <Link to={`/blog/${p.slug}`} className="text-xl font-bold text-slate-900 hover:text-brand-red">
                                    {p.title}
                                </Link>
                                <p className="mt-2 text-slate-600 text-sm">{p.description}</p>
                                <p className="mt-3 text-xs text-slate-400">
                                    {p.publishedAt} · {p.readTimeMin} min read
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
            <Footer />
        </div>
    );
}
