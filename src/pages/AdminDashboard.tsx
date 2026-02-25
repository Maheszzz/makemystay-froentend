import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import {
    LayoutDashboard, Plus, Settings, LogOut, Home, Users, BarChart3,
    ChevronRight, X, Lock, Loader2, AlertCircle, CheckCircle2,
    Trash2, RotateCcw, MapPin, Search, ChevronLeft, ChevronsLeft,
    ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api/client';
import { PropertyForm } from '@/components/modules/admin/PropertyForm';
import { RealtyProperty } from '@/types/api';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    flexRender,
    createColumnHelper,
    SortingState,
    ColumnFiltersState,
    HeaderGroup,
    Header,
    Row,
    Cell,
    HeaderContext,
    CellContext,
} from '@tanstack/react-table';

const columnHelper = createColumnHelper<RealtyProperty>();

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingProperty, setEditingProperty] = useState<RealtyProperty | null>(null);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pwdLoading, setPwdLoading] = useState(false);
    const [pwdError, setPwdError] = useState<string | null>(null);
    const [pwdSuccess, setPwdSuccess] = useState(false);

    const [properties, setProperties] = useState<RealtyProperty[]>([]);
    const [loadingProps, setLoadingProps] = useState(true);
    const [showDeleted, setShowDeleted] = useState(false);

    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    useEffect(() => { fetchProperties(); }, [showDeleted]);

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
        if (!confirm("Soft-delete this property?")) return;
        try { await api.delete(`/realty/properties/${id}`); fetchProperties(); }
        catch { alert("Failed to delete property"); }
    };

    const handleRestoreProperty = async (id: number) => {
        try { await api.post(`/realty/properties/${id}/restore`); fetchProperties(); }
        catch { alert("Failed to restore property"); }
    };

    const handleLogout = () => { logout(); navigate('/'); };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) { setPwdError("Passwords do not match"); return; }
        setPwdLoading(true); setPwdError(null); setPwdSuccess(false);
        try {
            await api.put('/auth/password', { current_password: currentPassword, new_password: newPassword });
            setPwdSuccess(true);
            setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
            setTimeout(() => setIsPasswordModalOpen(false), 2000);
        } catch (err: any) {
            setPwdError(err.message || 'Failed to update password');
        } finally { setPwdLoading(false); }
    };

    const totalCount = loadingProps ? null : properties.length;
    const activeCount = loadingProps ? null : properties.filter((p: any) => !p.deleted_at).length;

    const columns = useMemo(() => [
        columnHelper.accessor('property_name', {
            header: ({ column }: HeaderContext<RealtyProperty, any>) => (
                <button onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors group">
                    Property
                    <span className="text-slate-300 group-hover:text-slate-400">
                        {column.getIsSorted() === 'asc' ? <ArrowUp className="w-3 h-3" /> :
                            column.getIsSorted() === 'desc' ? <ArrowDown className="w-3 h-3" /> :
                                <ArrowUpDown className="w-3 h-3" />}
                    </span>
                </button>
            ),
            cell: ({ row }: CellContext<RealtyProperty, any>) => {
                const prop = row.original;
                return (
                    <div className="flex items-center gap-3.5">
                        <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200/60 shadow-sm">
                                {prop.images?.length ? (
                                    <img src={prop.images[0].image_url} className="w-full h-full object-cover" alt="" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Home className="w-5 h-5 text-slate-300" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="min-w-0">
                            <p className="font-semibold text-slate-800 text-sm truncate leading-tight">{prop.property_name}</p>
                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                                <MapPin className="w-3 h-3 text-brand-red/60 shrink-0" />{prop.location}
                            </p>
                        </div>
                    </div>
                );
            },
        }),
        columnHelper.accessor('property_type', {
            header: ({ column }: HeaderContext<RealtyProperty, any>) => (
                <button onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors group">
                    Type
                    <span className="text-slate-300 group-hover:text-slate-400">
                        {column.getIsSorted() === 'asc' ? <ArrowUp className="w-3 h-3" /> :
                            column.getIsSorted() === 'desc' ? <ArrowDown className="w-3 h-3" /> :
                                <ArrowUpDown className="w-3 h-3" />}
                    </span>
                </button>
            ),
            cell: ({ getValue }: CellContext<RealtyProperty, any>) => {
                const type = getValue();
                const colors: Record<string, string> = {
                    PG: 'bg-violet-50 text-violet-700 border-violet-100',
                    Rent: 'bg-blue-50 text-blue-700 border-blue-100',
                    Buy: 'bg-amber-50 text-amber-700 border-amber-100',
                    Plot: 'bg-emerald-50 text-emerald-700 border-emerald-100',
                };
                const colorClass = Object.entries(colors).find(([k]) => type?.includes(k))?.[1] ?? 'bg-slate-50 text-slate-600 border-slate-100';
                return (
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-[11px] font-bold tracking-wide ${colorClass}`}>
                        {type}
                    </span>
                );
            },
        }),
        columnHelper.accessor((row: RealtyProperty) => row.starting_price || row.private_price, {
            id: 'price',
            header: ({ column }: HeaderContext<RealtyProperty, any>) => (
                <button onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors group">
                    Price
                    <span className="text-slate-300 group-hover:text-slate-400">
                        {column.getIsSorted() === 'asc' ? <ArrowUp className="w-3 h-3" /> :
                            column.getIsSorted() === 'desc' ? <ArrowDown className="w-3 h-3" /> :
                                <ArrowUpDown className="w-3 h-3" />}
                    </span>
                </button>
            ),
            cell: ({ getValue }: CellContext<RealtyProperty, any>) => {
                const val = getValue();
                return val
                    ? <span className="text-sm font-bold text-slate-800">₹{Number(val).toLocaleString('en-IN')}</span>
                    : <span className="text-xs text-slate-300 italic">Unlisted</span>;
            },
        }),
        columnHelper.display({
            id: 'status',
            header: () => <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Status</span>,
            cell: () => (
                <div className="flex items-center gap-2">
                    <span className={`relative flex h-2 w-2`}>
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${showDeleted ? 'bg-red-400' : 'bg-emerald-400'}`} />
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${showDeleted ? 'bg-red-500' : 'bg-emerald-500'}`} />
                    </span>
                    <span className={`text-xs font-semibold ${showDeleted ? 'text-red-500' : 'text-emerald-600'}`}>
                        {showDeleted ? 'Deleted' : 'Active'}
                    </span>
                </div>
            ),
        }),
        columnHelper.display({
            id: 'actions',
            header: () => <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Actions</span>,
            cell: ({ row }: CellContext<RealtyProperty, any>) => {
                const prop = row.original;
                return (
                    <div className="flex items-center gap-2">
                        {showDeleted ? (
                            <button onClick={() => prop.id && handleRestoreProperty(prop.id)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 active:scale-95 transition-all text-xs font-semibold shadow-sm shadow-emerald-200">
                                <RotateCcw className="w-3 h-3" /> Restore
                            </button>
                        ) : (
                            <div className="flex items-center gap-1.5">
                                <button onClick={() => navigate(`/admin/edit-property/${prop.id}`)}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 active:scale-95 transition-all text-xs font-semibold">
                                    <Settings className="w-3 h-3" /> Edit
                                </button>
                                <button onClick={() => prop.id && handleDeleteProperty(prop.id)}
                                    className="p-1.5 bg-red-50 text-red-500 border border-red-100 rounded-lg hover:bg-red-500 hover:text-white active:scale-95 transition-all">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}
                    </div>
                );
            },
        }),
    ], [showDeleted, navigate]);

    const table = useReactTable({
        data: properties,
        columns,
        state: { globalFilter, sorting, columnFilters },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: 10 } },
    });

    const { pageIndex, pageSize } = table.getState().pagination;
    const totalRows = table.getFilteredRowModel().rows.length;
    const startRow = pageIndex * pageSize + 1;
    const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

    const username = user?.email.split('@')[0] ?? 'Admin';

    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%)' }}>
            <Helmet><title>Admin Dashboard | MakeMyStay.ai</title></Helmet>
            <Navbar />

            <main className="flex-grow pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-red to-red-700 flex items-center justify-center shadow-lg shadow-brand-red/30">
                                <span className="text-white text-xl font-bold">{username[0].toUpperCase()}</span>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-0.5">Good morning 👋</p>
                            <h1 className="text-2xl font-bold text-slate-900">Welcome back, <span className="text-brand-red capitalize">{username}</span></h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setIsPasswordModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                            <Settings className="w-4 h-4" /> Settings
                        </button>
                        <button onClick={() => setIsSignOutModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-all">
                            <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                    </div>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
                    {[
                        {
                            label: "Total Properties",
                            value: totalCount,
                            icon: Home,
                            gradient: "from-blue-500 to-blue-600",
                            bg: "bg-blue-50",
                            text: "text-blue-600",
                            border: "border-blue-100",
                            trend: "+3 this month",
                        },
                        {
                            label: "Active Listings",
                            value: activeCount,
                            icon: BarChart3,
                            gradient: "from-emerald-500 to-emerald-600",
                            bg: "bg-emerald-50",
                            text: "text-emerald-600",
                            border: "border-emerald-100",
                            trend: "All live now",
                        },
                        {
                            label: "Leads / Enquiries",
                            value: 12,
                            icon: Users,
                            gradient: "from-violet-500 to-violet-600",
                            bg: "bg-violet-50",
                            text: "text-violet-600",
                            border: "border-violet-100",
                            trend: "+4 this week",
                        },
                    ].map((stat, idx) => (
                        <motion.div key={idx}
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative"
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full ${stat.bg} blur-3xl opacity-60 -translate-y-8 translate-x-8`} />
                            <div className="relative p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-md`}>
                                        <stat.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${stat.text} ${stat.bg} px-2 py-1 rounded-lg border ${stat.border}`}>
                                        <TrendingUp className="w-2.5 h-2.5" />{stat.trend}
                                    </span>
                                </div>
                                <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                                <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                    {stat.value === null ? (
                                        <span className="inline-block w-12 h-8 bg-slate-100 rounded-lg animate-pulse" />
                                    ) : stat.value}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Property Table Card */}
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }}
                    className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-8">

                    {/* Table toolbar */}
                    <div className="px-6 pt-6 pb-5 border-b border-slate-50">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h2 className="text-xl font-bold text-slate-900">Property Listings</h2>
                                    {!loadingProps && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-brand-red/10 text-brand-red text-xs font-bold">
                                            {totalRows}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-400">
                                    {loadingProps ? 'Fetching your listings…' : showDeleted ? 'Showing deleted properties' : 'All active properties'}
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                    <input
                                        type="text"
                                        value={globalFilter ?? ''}
                                        onChange={e => setGlobalFilter(e.target.value)}
                                        placeholder="Search by name, location…"
                                        className="pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/80 focus:outline-none focus:ring-2 focus:ring-brand-red/15 focus:bg-white focus:border-slate-300 transition-all w-full sm:w-64 placeholder:text-slate-300"
                                    />
                                </div>
                                <button
                                    onClick={() => setShowDeleted(!showDeleted)}
                                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 border ${showDeleted
                                        ? 'bg-orange-50 text-orange-600 border-orange-200 shadow-sm'
                                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
                                        }`}>
                                    <Trash2 className="w-4 h-4" />
                                    {showDeleted ? 'Exit Trash' : 'Trash'}
                                </button>
                                <button onClick={() => setIsAddModalOpen(true)}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-brand-red to-red-600 text-white rounded-xl text-sm font-bold shadow-md shadow-brand-red/20 hover:shadow-lg hover:shadow-brand-red/30 hover:-translate-y-0.5 active:translate-y-0 transition-all">
                                    <Plus className="w-4 h-4" /> Add Property
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                {table.getHeaderGroups().map((hg: HeaderGroup<RealtyProperty>) => (
                                    <tr key={hg.id} className="bg-slate-50/60">
                                        {hg.headers.map((h: Header<RealtyProperty, unknown>) => (
                                            <th key={h.id} className="px-6 py-3.5 text-left">
                                                {flexRender(h.column.columnDef.header, h.getContext())}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {loadingProps ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i} className="border-t border-slate-50">
                                            {Array.from({ length: 5 }).map((_, j) => (
                                                <td key={j} className="px-6 py-4">
                                                    <div className="h-4 bg-slate-100 rounded-lg animate-pulse" style={{ width: j === 0 ? '180px' : j === 4 ? '80px' : '80px' }} />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : table.getRowModel().rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center">
                                                    <Home className="w-8 h-8 text-slate-300" />
                                                </div>
                                                <p className="font-semibold text-slate-500">No properties found</p>
                                                {globalFilter && <p className="text-sm text-slate-300">Try a different search term</p>}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    table.getRowModel().rows.map((row: Row<RealtyProperty>, i: number) => (
                                        <motion.tr
                                            key={row.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.015 }}
                                            className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors group"
                                        >
                                            {row.getVisibleCells().map((cell: Cell<RealtyProperty, unknown>) => (
                                                <td key={cell.id} className="px-6 py-3.5">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {!loadingProps && totalRows > 0 && (
                        <div className="px-6 py-4 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <p className="text-sm text-slate-400">
                                    <span className="font-semibold text-slate-600">{startRow}–{endRow}</span>
                                    {' '}of{' '}
                                    <span className="font-semibold text-slate-600">{totalRows}</span> properties
                                </p>
                                <select value={pageSize} onChange={e => table.setPageSize(Number(e.target.value))}
                                    className="text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-red/15 cursor-pointer">
                                    {[5, 10, 20, 50].map(s => <option key={s} value={s}>Per page: {s}</option>)}
                                </select>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}
                                    className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-25 disabled:cursor-not-allowed transition-all">
                                    <ChevronsLeft className="w-4 h-4" />
                                </button>
                                <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}
                                    className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-25 disabled:cursor-not-allowed transition-all">
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <div className="flex items-center gap-0.5 px-1">
                                    {Array.from({ length: table.getPageCount() }, (_, i) => i).map(page => {
                                        const cur = pageIndex;
                                        if (page === 0 || page === table.getPageCount() - 1 || Math.abs(page - cur) <= 1) {
                                            return (
                                                <button key={page} onClick={() => table.setPageIndex(page)}
                                                    className={`min-w-[32px] h-8 px-2 rounded-lg text-sm font-semibold transition-all ${page === cur
                                                        ? 'bg-brand-red text-white shadow-sm shadow-brand-red/30'
                                                        : 'text-slate-500 hover:bg-slate-100'
                                                        }`}>
                                                    {page + 1}
                                                </button>
                                            );
                                        }
                                        if (Math.abs(page - cur) === 2) return <span key={page} className="text-slate-300 text-sm w-4 text-center">…</span>;
                                        return null;
                                    })}
                                </div>
                                <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}
                                    className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-25 disabled:cursor-not-allowed transition-all">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                                <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}
                                    className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-25 disabled:cursor-not-allowed transition-all">
                                    <ChevronsRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[
                        {
                            title: "Add New Property", description: "List a new buy, rent, or PG property in minutes",
                            icon: Plus, gradient: "from-brand-red to-red-600", shadow: "shadow-brand-red/20",
                            onClick: () => setIsAddModalOpen(true)
                        },
                        {
                            title: "Browse Listings", description: "View and explore all property listings live",
                            icon: LayoutDashboard, gradient: "from-blue-500 to-blue-600", shadow: "shadow-blue-200",
                            onClick: () => navigate('/properties')
                        },
                        {
                            title: "Account Settings", description: "Manage your admin credentials and profile",
                            icon: Settings, gradient: "from-slate-600 to-slate-700", shadow: "shadow-slate-200",
                            onClick: () => setIsPasswordModalOpen(true)
                        },
                    ].map((action, idx) => (
                        <motion.button key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + idx * 0.1 }}
                            whileHover={{ y: -4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={action.onClick}
                            className="group bg-white border border-slate-100 rounded-3xl p-6 text-left shadow-sm hover:shadow-md transition-all duration-300 w-full"
                        >
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-5 shadow-lg ${action.shadow} group-hover:scale-110 transition-transform duration-300`}>
                                <action.icon className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-bold text-slate-900 mb-1.5">{action.title}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed mb-5">{action.description}</p>
                            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-red group-hover:gap-2.5 transition-all">
                                Get Started <ChevronRight className="w-4 h-4" />
                            </span>
                        </motion.button>
                    ))}
                </div>
            </main>

            {/* Password Modal */}
            <AnimatePresence>
                {isPasswordModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                            onClick={() => setIsPasswordModalOpen(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.94, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 24 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden">
                            <div className="h-1.5 bg-gradient-to-r from-brand-red to-red-400" />
                            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">Change Password</h2>
                                    <p className="text-xs text-slate-400 mt-0.5">Update your admin credentials</p>
                                </div>
                                <button onClick={() => setIsPasswordModalOpen(false)}
                                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handlePasswordChange} className="p-6 space-y-5">
                                {pwdError && (
                                    <div className="p-3.5 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-2.5 text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />{pwdError}
                                    </div>
                                )}
                                {pwdSuccess && (
                                    <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-2.5 text-emerald-700 text-sm">
                                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />Password updated successfully!
                                    </div>
                                )}
                                {[
                                    { label: 'Current Password', value: currentPassword, set: setCurrentPassword },
                                    { label: 'New Password', value: newPassword, set: setNewPassword },
                                    { label: 'Confirm New Password', value: confirmPassword, set: setConfirmPassword },
                                ].map(({ label, value, set }) => (
                                    <div key={label} className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{label}</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                            <input type="password" required value={value} onChange={e => set(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/15 focus:bg-white focus:border-slate-300 transition-all" />
                                        </div>
                                    </div>
                                ))}
                                <button type="submit" disabled={pwdLoading || pwdSuccess}
                                    className="w-full py-3 bg-gradient-to-r from-brand-red to-red-600 text-white rounded-xl font-bold text-sm shadow-md shadow-brand-red/25 hover:shadow-lg hover:shadow-brand-red/35 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                    {pwdLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating…</> : pwdSuccess ? '✓ Updated!' : 'Update Password'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add Property Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                            onClick={() => { setIsAddModalOpen(false); setEditingProperty(null); }} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="w-full max-w-4xl relative z-10">
                            <PropertyForm
                                onClose={() => { setIsAddModalOpen(false); setEditingProperty(null); }}
                                initialProperty={editingProperty || undefined}
                                onSuccess={() => fetchProperties()}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Sign Out Confirmation Modal */}
            <AnimatePresence>
                {isSignOutModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                            onClick={() => setIsSignOutModalOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.94, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.94, y: 20 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-sm relative z-10 overflow-hidden"
                        >
                            <div className="h-1.5 bg-gradient-to-r from-brand-red to-red-400" />
                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
                                        <LogOut className="w-5 h-5 text-red-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900">Sign Out?</h2>
                                        <p className="text-sm text-slate-400 mt-0.5">You'll be logged out of your admin account.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() => setIsSignOutModalOpen(false)}
                                        className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-red to-red-600 text-white text-sm font-bold shadow-md shadow-brand-red/25 hover:shadow-lg hover:shadow-brand-red/35 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                                    >
                                        Yes, Sign Out
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}
