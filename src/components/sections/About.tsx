import { Target, Lightbulb, Users, Award, CheckCircle, Heart } from 'lucide-react';

export function About() {
    return (
        <section id="about-us" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">About MakeMyStay</h2>
                    <div className="w-20 h-1.5 bg-brand-red mx-auto rounded-full mb-6"></div>
                    <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        MakeMyStay.ai is a technology-driven real estate platform built to make property discovery simple, transparent, and intelligent.
                    </p>
                </div>

                {/* Introduction */}
                <div className="max-w-4xl mx-auto mb-20 text-center">
                    <p className="text-slate-700 text-lg leading-relaxed mb-4">
                        Finding the right place to stay shouldn't be complicated. Whether you're searching for a rental home, a PG, or an investment opportunity, MakeMyStay helps you explore verified properties, compare options, and make confident decisions—all in one place.
                    </p>
                    <p className="text-xl font-semibold text-brand-red">
                        Our goal is simple: make finding a place to live as easy as booking a trip.
                    </p>
                </div>

                {/* Our Story */}
                <div className="mb-20 bg-slate-50 rounded-2xl p-8 md:p-12">
                    <h3 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h3>
                    <p className="text-slate-700 leading-relaxed mb-4">
                        MakeMyStay was founded in <strong>2026</strong> in <strong>Bengaluru</strong> with a vision to modernize the way people search for homes.
                    </p>
                    <p className="text-slate-700 leading-relaxed mb-4">
                        The traditional property search process often involves scattered information, unclear pricing, and time-consuming coordination. MakeMyStay was created to remove that friction by bringing everything into one seamless digital platform where users can discover, evaluate, and choose properties efficiently.
                    </p>
                    <p className="text-slate-700 leading-relaxed">
                        Today, we are building a smarter and more transparent way for people to find their next home.
                    </p>
                </div>

                {/* What We Do */}
                <div className="mb-20">
                    <h3 className="text-3xl font-bold text-slate-900 mb-8 text-center">What We Do</h3>
                    <p className="text-center text-slate-600 mb-10 max-w-3xl mx-auto">
                        MakeMyStay simplifies the property journey from search to decision:
                    </p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: CheckCircle, text: "Verified property listings" },
                            { icon: Lightbulb, text: "Smart property recommendations" },
                            { icon: Award, text: "Transparent pricing and property insights" },
                            { icon: Users, text: "Assistance in choosing the right home or investment" },
                            { icon: Target, text: "Digital tools that reduce manual follow-ups" },
                            { icon: Heart, text: "Technology combined with real estate expertise" }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-4 p-6 rounded-xl bg-white border border-slate-200 hover:shadow-lg transition-all duration-300">
                                <item.icon className="w-6 h-6 text-brand-red flex-shrink-0 mt-1" />
                                <p className="text-slate-700">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Vision & Mission */}
                <div className="grid md:grid-cols-2 gap-8 mb-20">
                    {/* Vision */}
                    <div className="bg-gradient-to-br from-brand-red to-red-600 rounded-2xl p-8 text-white">
                        <Target className="w-12 h-12 mb-4" />
                        <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                        <p className="text-white/90 leading-relaxed">
                            To become a trusted digital platform where people can discover, compare, and secure homes effortlessly.
                        </p>
                    </div>

                    {/* Mission */}
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-white">
                        <Lightbulb className="w-12 h-12 mb-4" />
                        <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                        <ul className="space-y-3 text-white/90">
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span>Simplify property discovery</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span>Bring transparency and trust to real estate</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span>Use technology to improve customer experience</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span>Help people find homes that match their lifestyle and budget</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Founder */}
                <div className="mb-20 bg-slate-50 rounded-2xl p-8 md:p-12">
                    <h3 className="text-3xl font-bold text-slate-900 mb-8 text-center">Our Founder</h3>
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="mb-6">
                            <h4 className="text-2xl font-bold text-slate-900">Madhava R</h4>
                            <p className="text-brand-red font-medium">Founder</p>
                        </div>
                        <p className="text-slate-700 leading-relaxed">
                            Madhava R founded MakeMyStay with a mission to bring transparency, efficiency, and technology-driven solutions to the real estate ecosystem. The vision behind the platform is to make property discovery faster, simpler, and more reliable for modern customers.
                        </p>
                    </div>
                </div>

                {/* Our Team */}
                <div className="mb-20 text-center">
                    <h3 className="text-3xl font-bold text-slate-900 mb-4">Our Team</h3>
                    <p className="text-slate-700 leading-relaxed max-w-3xl mx-auto mb-6">
                        MakeMyStay is powered by a growing team of professionals across technology, marketing, and real estate, all working toward improving the property search experience.
                    </p>
                    <div className="inline-flex items-center gap-3 bg-brand-red text-white px-8 py-4 rounded-full">
                        <Users className="w-6 h-6" />
                        <span className="font-semibold text-lg">Team Size: 10–15 members</span>
                    </div>
                </div>

                {/* Why MakeMyStay */}
                <div className="mb-20">
                    <h3 className="text-3xl font-bold text-slate-900 mb-8 text-center">Why MakeMyStay</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            "Technology-driven platform",
                            "Personalized property suggestions",
                            "Verified and curated listings",
                            "Fast and simple discovery process",
                            "Dedicated customer support"
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-6 rounded-xl bg-white border-2 border-brand-red/20 hover:border-brand-red hover:shadow-lg transition-all duration-300">
                                <CheckCircle className="w-6 h-6 text-brand-red flex-shrink-0" />
                                <p className="text-slate-700 font-medium">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Our Commitment */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-10 md:p-16 text-center text-white">
                    <Heart className="w-16 h-16 mx-auto mb-6 text-brand-red" />
                    <h3 className="text-3xl font-bold mb-6">Our Commitment</h3>
                    <p className="text-xl text-white/90 leading-relaxed max-w-3xl mx-auto mb-4">
                        At MakeMyStay, we believe a home is more than a space—it's where life happens.
                    </p>
                    <p className="text-lg text-white/80 leading-relaxed max-w-3xl mx-auto">
                        We are committed to building a platform that makes finding that space easier, faster, and more reliable.
                    </p>
                </div>
            </div>
        </section>
    );
}
