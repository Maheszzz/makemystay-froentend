import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, Plus, Settings, LogOut, Home, Users, BarChart3, ChevronRight, X, Lock, Loader2, AlertCircle, CheckCircle2, Trash2, RotateCcw, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api/client';
import { PropertyForm } from '@/components/modules/admin/PropertyForm';
import { RealtyProperty } from '@/types/api';

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Modal states
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingProperty, setEditingProperty] = useState<RealtyProperty | null>(null);

    // Password form state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pwdLoading, setPwdLoading] = useState(false);
    const [pwdError, setPwdError] = useState<string | null>(null);
    const [pwdSuccess, setPwdSuccess] = useState(false);

    // Properties list state
    const [properties, setProperties] = useState<RealtyProperty[]>([]);
    const [loadingProps, setLoadingProps] = useState(true);
    const [showDeleted, setShowDeleted] = useState(false);

    useEffect(() => {
        fetchProperties();
    }, [showDeleted]);

    const fetchProperties = async () => {
        setLoadingProps(true);
        try {
            const data = await api.get<any>(`/realty/properties?include_deleted=${showDeleted}`);
            setProperties(data);
        } catch (err) {
            console.error("Failed to fetch properties", err);
        } finally {
            setLoadingProps(false);
        }
    };

    const handleDeleteProperty = async (id: number) => {
        if (!confirm("Are you sure you want to delete this property? it will be soft-deleted.")) return;
        try {
            await api.delete(`/realty/properties/${id}`);
            fetchProperties();
        } catch (err) {
            alert("Failed to delete property");
        }
    };

    const handleRestoreProperty = async (id: number) => {
        try {
            await api.post(`/realty/properties/${id}/restore`);
            fetchProperties();
        } catch (err) {
            alert("Failed to restore property");
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setPwdError("New passwords do not match");
            return;
        }

        setPwdLoading(true);
        setPwdError(null);
        setPwdSuccess(false);

        try {
            await api.put('/auth/password', {
                current_password: currentPassword,
                new_password: newPassword
            });
            setPwdSuccess(true);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => setIsPasswordModalOpen(false), 2000);
        } catch (err: any) {
            setPwdError(err.message || 'Failed to update password');
        } finally {
            setPwdLoading(false);
        }
    };

    const stats = [
        { label: "Total Properties", value: "81", icon: Home, color: "bg-blue-500" },
        { label: "Active Listings", value: "76", icon: BarChart3, color: "bg-green-500" },
        { label: "Leads/Enquiries", value: "12", icon: Users, color: "bg-purple-500" },
    ];

    const actions = [
        { title: "Add New Property", description: "Create a new listing for buy, rent or PG", icon: Plus, link: "#", color: "text-brand-red bg-brand-red/10", onClick: () => setIsAddModalOpen(true) },
        { title: "Manage Properties", description: "Edit, update or delete existing listings", icon: LayoutDashboard, link: "/properties", color: "text-blue-600 bg-blue-50" },
        { title: "Account Settings", description: "Update your profile and password", icon: Settings, link: "#", color: "text-slate-600 bg-slate-100", onClick: () => setIsPasswordModalOpen(true) },
    ];

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col">
            <Helmet>
                <title>Admin Dashboard | MakeMyStay.ai</title>
            </Helmet>

            <Navbar />

            <main className="flex-grow pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Welcome Back, {user?.email.split('@')[0]}</h1>
                        <p className="text-slate-500 mt-1">Here's what's happening with your properties today.</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="flex items-center gap-2 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-2xl"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`${stat.color} p-3 rounded-2xl text-white`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Property Management Table */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-10">
                    <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Property Listings</h2>
                            <p className="text-sm text-slate-500">View and manage your property directory</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowDeleted(!showDeleted)}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${showDeleted
                                    ? 'bg-orange-50 text-orange-600 border border-orange-100'
                                    : 'bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100'
                                    }`}
                            >
                                <Trash2 className="w-4 h-4" /> {showDeleted ? 'Showing Deleted' : 'Show Trash'}
                            </button>
                            <Button onClick={() => setIsAddModalOpen(true)} className="rounded-xl flex items-center gap-2 h-10 px-4">
                                <Plus className="w-4 h-4" /> Add New
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Property</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Price (Base)</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loadingProps ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <Loader2 className="w-8 h-8 text-brand-red animate-spin mx-auto mb-2" />
                                            <p className="text-slate-500 text-sm">Loading properties...</p>
                                        </td>
                                    </tr>
                                ) : properties.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <p className="text-slate-500 font-medium">No properties found.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    properties.map((prop) => (
                                        <tr key={prop.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                                                        {prop.images && prop.images.length > 0 ? (
                                                            <img src={prop.images[0].image_url} className="w-full h-full object-cover" alt="" />
                                                        ) : (
                                                            <Home className="w-6 h-6 text-slate-300 m-3" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 line-clamp-1">{prop.property_name}</p>
                                                        <p className="text-xs text-slate-500 flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" /> {prop.location}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-slate-600">{prop.property_type}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-slate-900">₹{prop.starting_price || prop.private_price || 'N/A'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${showDeleted ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                                                    }`}>
                                                    {showDeleted ? 'Deleted' : 'Active'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {showDeleted ? (
                                                        <button
                                                            onClick={() => prop.id && handleRestoreProperty(prop.id)}
                                                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all"
                                                            title="Restore Property"
                                                        >
                                                            <RotateCcw className="w-4 h-4" />
                                                        </button>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => {
                                                                    navigate(`/admin/edit-property/${prop.id}`);
                                                                }}
                                                                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all"
                                                                title="Edit"
                                                            >
                                                                <Settings className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => prop.id && handleDeleteProperty(prop.id)}
                                                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {actions.map((action, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: (idx + 3) * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm cursor-pointer group"
                            onClick={() => action.onClick ? action.onClick() : (action.link !== "#" && navigate(action.link))}
                        >
                            <div className={`${action.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6`}>
                                <action.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{action.title}</h3>
                            <p className="text-sm text-slate-500 mb-6">{action.description}</p>
                            <div className="flex items-center text-sm font-bold text-brand-red group-hover:gap-2 transition-all">
                                Get Started <ChevronRight className="w-4 h-4" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>

            {/* Password Change Modal */}
            <AnimatePresence>
                {isPasswordModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => setIsPasswordModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-slate-900">Change Password</h2>
                                <button
                                    onClick={() => setIsPasswordModalOpen(false)}
                                    className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            <form onSubmit={handlePasswordChange} className="p-8 space-y-6">
                                {pwdError && (
                                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-sm">
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        <p>{pwdError}</p>
                                    </div>
                                )}

                                {pwdSuccess && (
                                    <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-start gap-3 text-green-600 text-sm">
                                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                                        <p>Password updated successfully!</p>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 ml-1">Current Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="password"
                                                required
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:bg-white transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 ml-1">New Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="password"
                                                required
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:bg-white transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 ml-1">Confirm New Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="password"
                                                required
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:bg-white transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full py-4 rounded-2xl text-base font-bold shadow-glow"
                                    disabled={pwdLoading || pwdSuccess}
                                >
                                    {pwdLoading ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" /> Updating...
                                        </span>
                                    ) : (pwdSuccess ? "Success!" : "Update Password")}
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add Property Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => {
                                setIsAddModalOpen(false);
                                setEditingProperty(null);
                            }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="w-full max-w-4xl relative z-10"
                        >
                            <PropertyForm
                                onClose={() => {
                                    setIsAddModalOpen(false);
                                    setEditingProperty(null);
                                }}
                                initialProperty={editingProperty || undefined}
                                onSuccess={() => {
                                    fetchProperties();
                                }}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}
