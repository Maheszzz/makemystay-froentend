import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Calendar, ArrowRight, BookOpen, Search } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { BLOG_POSTS, BlogPost } from '@/data/blogPosts';
import { buildPageSEO } from '@/lib/seo';
import { buildBreadcrumbSchema } from '@/lib/schema';

export default function BlogIndex() {
    const helmet = buildPageSEO({
        title: 'Guides & Insights — PG & Rentals in Bangalore',
        description:
            'Premium guides on choosing PG accommodation, budgeting rent vs flats, and getting the most from MakeMyStay.ai.',
        path: '/blog',
    });

    const breadcrumbSchema = buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
    ]);

    const featuredPost = BLOG_POSTS[0];
    const remainingPosts = BLOG_POSTS.slice(1);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            },
        },
    };

    return (
        <div className="min-h-screen bg-white font-sans flex flex-col overflow-x-hidden">
            <SEOHead {...helmet} />
            <JsonLd data={breadcrumbSchema} id="blog-index-breadcrumb-schema" />
            <Navbar />

            <main id="main-content" className="flex-grow pt-20">
                {/* Hero Section */}
                <section className="relative py-20 md:py-32 bg-slate-900 overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute inset-0 z-0">
                        <img 
                            src="/images/blog/hero.png" 
                            alt="" 
                            className="w-full h-full object-cover opacity-30 scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs font-bold uppercase tracking-widest mb-6">
                                MakeMyStay Insights
                            </span>
                            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
                                Guides & <span className="text-brand-red">Insights</span>
                            </h1>
                            <p className="mt-6 text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                                Expert advice on finding the perfect PG and navigating the rental market in Bangalore.
                            </p>
                        </motion.div>

                        <motion.div 
                            className="mt-10 max-w-md mx-auto relative"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search guides, areas, or tips..."
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-brand-red/50 transition-all"
                                />
                            </div>
                        </motion.div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-24">
                    {/* Featured Post */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="mb-20"
                    >
                        <Link to={`/blog/${featuredPost.slug}`} className="group block overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100 transition-all hover:shadow-listing-hover">
                            <div className="grid md:grid-cols-2 gap-0">
                                <div className="aspect-[16/10] md:aspect-auto relative overflow-hidden">
                                    <img 
                                        src={featuredPost.imageUrl || "/images/blog/pg-living.png"} 
                                        alt={featuredPost.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-6 left-6">
                                        <span className="px-4 py-1.5 rounded-full bg-brand-red text-white text-xs font-bold shadow-lg">
                                            FEATURED
                                        </span>
                                    </div>
                                </div>
                                <div className="p-8 md:p-12 flex flex-col justify-center">
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="text-brand-red text-sm font-bold uppercase tracking-wider">
                                            {featuredPost.category || 'Guides'}
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                                        <div className="flex items-center text-slate-500 text-sm">
                                            <Clock className="w-4 h-4 mr-1.5" />
                                            {featuredPost.readTimeMin} min read
                                        </div>
                                    </div>
                                    <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-6 group-hover:text-brand-red transition-colors leading-tight">
                                        {featuredPost.title}
                                    </h2>
                                    <p className="text-lg text-slate-600 mb-8 line-clamp-3">
                                        {featuredPost.description}
                                    </p>
                                    <div className="mt-auto flex items-center text-slate-900 font-bold group-hover:gap-3 transition-all duration-300">
                                        Read Full Article <ArrowRight className="ml-2 w-5 h-5 text-brand-red" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Blog Feed Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900">Latest <span className="text-brand-red">Updates</span></h2>
                            <p className="mt-2 text-slate-500 text-lg">Fresh perspectives and practical advice for Bangalore living.</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {['All', 'Guides', 'Area Guide', 'Checklist', 'Legal'].map((cat) => (
                                <button 
                                    key={cat}
                                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                                        cat === 'All' 
                                            ? 'bg-slate-900 text-white shadow-lg' 
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid of Posts */}
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {remainingPosts.map((post) => (
                            <BlogCard key={post.slug} post={post} variants={itemVariants} />
                        ))}
                    </motion.div>

                    {/* Newsletter or CTA */}
                    <motion.div 
                        className="mt-32 rounded-[3rem] bg-brand-charcoal p-8 md:p-16 text-center relative overflow-hidden"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <div className="absolute inset-0 bg-diagonal-grid opacity-5" />
                        <div className="relative z-10">
                            <BookOpen className="w-12 h-12 text-brand-red mx-auto mb-6" />
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Stay Ahead of the Market</h2>
                            <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                                Subscribe to our monthly newsletter for curated Bangalore rental guides, price trends, and exclusive move-in tips.
                            </p>
                            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                                <input 
                                    type="email" 
                                    placeholder="Enter your email"
                                    className="flex-grow px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-brand-red/50 transition-all"
                                />
                                <button className="px-8 py-4 bg-brand-red text-white font-bold rounded-2xl shadow-glow hover:shadow-[0_0_25px_rgba(217,32,39,0.5)] active:scale-95 transition-all">
                                    Subscribe Now
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

function BlogCard({ post, variants }: { post: BlogPost, variants: any }) {
    return (
        <motion.div variants={variants}>
            <Link 
                to={`/blog/${post.slug}`} 
                className="group flex flex-col h-full bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-listing-hover transition-all duration-300"
            >
                <div className="aspect-[16/10] relative overflow-hidden rounded-t-3xl">
                    <img 
                        src={post.imageUrl || "/images/blog/pg-living.png"} 
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-black uppercase tracking-widest shadow-sm">
                            {post.category || 'Guides'}
                        </span>
                    </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 text-slate-400 text-xs mb-4">
                        <div className="flex items-center">
                            <Calendar className="w-3.5 h-3.5 mr-1" />
                            {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                        <div className="flex items-center">
                            <Clock className="w-3.5 h-3.5 mr-1" />
                            {post.readTimeMin} min read
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-red transition-colors leading-snug">
                        {post.title}
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-grow">
                        {post.description}
                    </p>
                    <div className="flex items-center text-slate-900 text-sm font-bold group-hover:translate-x-1 transition-transform">
                        Read Story <ArrowRight className="ml-1.5 w-4 h-4 text-brand-red" />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
