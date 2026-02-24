import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api/client';
import { LogIn, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EmployeeLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await api.post<any>('/auth/login', { email, password });
            login(response.access_token, response.role, email);
            navigate('/admin');
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col">
            <Helmet>
                <title>Employee Login | MakeMyStay.ai</title>
            </Helmet>

            <Navbar />

            <main className="flex-grow flex items-center justify-center px-4 pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full"
                >
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-red/10 text-brand-red mb-4">
                                <LogIn className="w-8 h-8" />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900">Employee Portal</h1>
                            <p className="text-slate-500 mt-2">Sign in to manage properties and leads</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-sm">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@makemystay.ai"
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:bg-white transition-all text-slate-900"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:bg-white transition-all text-slate-900"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full py-4 rounded-2xl text-base font-bold shadow-glow"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" /> Signing in...
                                    </span>
                                ) : "Sign In"}
                            </Button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-slate-50 text-center">
                            <p className="text-sm text-slate-400">
                                Need access? Contact the system administrator.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
