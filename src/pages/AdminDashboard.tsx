import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Settings, LogOut, Home, Users, BarChart3,
    X, Lock, Loader2, AlertCircle, CheckCircle2,
    Trash2, MapPin, Search, ChevronLeft, ChevronsLeft,
    ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown, Presentation, Clock, Building2,
    Edit3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api/client';
import { contactApi } from '@/lib/api/contacts';
import { PropertyForm } from '@/components/modules/admin/PropertyForm';
import { RealtyProperty, DemoBooking } from '@/types/api';
import {
    useReactTable, getCoreRowModel, getPaginationRowModel,
    getFilteredRowModel, getSortedRowModel, flexRender,
    createColumnHelper, SortingState, ColumnFiltersState,
    HeaderContext, CellContext,
} from '@tanstack/react-table';

import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatsCard } from '@/components/modules/admin/StatsCard';
import { QuickActions } from '@/components/modules/admin/QuickActions';
import { AnalyticsCharts } from '@/components/modules/admin/AnalyticsCharts';

const columnHelper = createColumnHelper<RealtyProperty>();
const demoColumnHelper = createColumnHelper<DemoBooking>();

export default function AdminDashboard() {
    const navigate = useNavigate();

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingProperty, setEditingProperty] = useState<RealtyProperty | null>(null);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pwdLoading, setPwdLoading] = useState(false);
    const [pwdError, setPwdError] = useState<string | null>(null);
    const [pwdSuccess, setPwdSuccess] = useState(false);

    const [activeTab, setActiveTab] = useState<'properties' | 'demos'>('properties');

    const [properties, setProperties] = useState<RealtyProperty[]>([]);
    const [loadingProps, setLoadingProps] = useState(true);

    const [demos, setDemos] = useState<DemoBooking[]>([]);
    const [loadingDemos, setLoadingDemos] = useState(false);

    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    useEffect(() => {
        if (activeTab === 'properties' && properties.length === 0) fetchProperties();
        if (activeTab === 'demos' && demos.length === 0) fetchDemos();
    }, [activeTab]);

    const fetchProperties = async () => {
        setLoadingProps(true);
        try {
            const data = await api.get<any>(`/realty/properties`);
            setProperties(data);
        } catch (err) {
            console.error("Failed to fetch properties", err);
        } finally {
            setLoadingProps(false);
        }
    };

    const fetchDemos = async () => {
        setLoadingDemos(true);
        try {
            const data = await contactApi.getDemos();
            setDemos(data);
        } catch (err) {
            console.error("Failed to fetch demos", err);
        } finally {
            setLoadingDemos(false);
        }
    };

    const handleDeleteProperty = async (id: number) => {
        if (!confirm("Are you sure you want to delete this property? This cannot be undone.")) return;
        try { await api.delete(`/realty/properties/${id}`); fetchProperties(); }
        catch { alert("Failed to delete property"); }
    };

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
    const activeCount = loadingProps ? null : properties.length;
    const leadsCount = loadingDemos ? null : demos.length;

    const sparklineData = Array.from({ length: 15 }, (_, i) => ({ value: 10 + Math.random() * 20 + i }));

    const columns = useMemo(() => [
        columnHelper.accessor('property_name', {
            header: ({ column }: HeaderContext<RealtyProperty, any>) => (
                <button onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-widest hover:text-slate-800 transition-colors group">
                    Property
                    <span className="text-slate-400 group-hover:text-slate-600">
                        {column.getIsSorted() === 'asc' ? <ArrowUp className="w-3 h-3" /> :
                            column.getIsSorted() === 'desc' ? <ArrowDown className="w-3 h-3" /> :
                                <ArrowUpDown className="w-3 h-3" />}
                    </span>
                </button>
            ),
            cell: ({ row }: CellContext<RealtyProperty, any>) => {
                const prop = row.original;
                return (
                    <div className="flex items-center gap-3.5 group cursor-pointer">
                        <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm relative group-hover:shadow-brand-red/20 transition-all">
                                {prop.images?.length ? (
                                    <>
                                        <img src={prop.images[0].image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Home className="w-5 h-5 text-slate-300" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="min-w-0">
                            <p className="font-bold text-slate-800 text-sm truncate leading-tight group-hover:text-brand-red transition-colors">{prop.property_name}</p>
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                                <MapPin className="w-3 h-3 shrink-0 text-brand-red/60" />{prop.location}
                            </p>
                        </div>
                    </div>
                );
            },
        }),
        columnHelper.accessor('property_type', {
            header: ({ column }: HeaderContext<RealtyProperty, any>) => (
                <button onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-widest hover:text-slate-800 transition-colors group">
                    Type
                    <span className="text-slate-400 group-hover:text-slate-600">
                        {column.getIsSorted() === 'asc' ? <ArrowUp className="w-3 h-3" /> :
                            column.getIsSorted() === 'desc' ? <ArrowDown className="w-3 h-3" /> :
                                <ArrowUpDown className="w-3 h-3" />}
                    </span>
                </button>
            ),
            cell: ({ getValue }: CellContext<RealtyProperty, any>) => {
                const type = getValue();
                const colors: Record<string, string> = {
                    PG: 'bg-violet-50 text-violet-700 border-violet-200',
                    Rent: 'bg-blue-50 text-blue-700 border-blue-200',
                    Buy: 'bg-amber-50 text-amber-700 border-amber-200',
                    Plot: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                };
                const colorClass = Object.entries(colors).find(([k]) => type?.includes(k))?.[1] ?? 'bg-slate-50 text-slate-600 border-slate-200';
                return (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-bold tracking-wide ${colorClass}`}>
                        {type}
                    </span>
                );
            },
        }),
        columnHelper.accessor((row: RealtyProperty) => row.starting_price || row.private_price, {
            id: 'price',
            header: ({ column }: HeaderContext<RealtyProperty, any>) => (
                <button onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-widest hover:text-slate-800 transition-colors group">
                    Price
                    <span className="text-slate-400 group-hover:text-slate-600">
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
                    : <span className="text-xs text-slate-400 italic">Unlisted</span>;
            },
        }),
        columnHelper.display({
            id: 'status',
            header: () => <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Status</span>,
            cell: () => (
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 bg-emerald-400" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-xs font-bold text-emerald-600">Active</span>
                </div>
            ),
        }),
        columnHelper.display({
            id: 'actions',
            header: () => <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Actions</span>,
            cell: ({ row }: CellContext<RealtyProperty, any>) => {
                const prop = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(`/admin/edit-property/${prop.id}`)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg transition-all shadow-sm">
                            <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => prop.id && handleDeleteProperty(prop.id)}
                            className="p-1.5 text-slate-500 hover:text-red-600 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg transition-all shadow-sm">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                );
            },
        }),
    ], [navigate]);

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

    const demoColumns = useMemo(() => [
        demoColumnHelper.accessor('name', {
            header: 'Operator',
            cell: ({ row }) => (
                <div>
                    <p className="font-bold text-slate-800 text-sm">{row.original.name}</p>
                    <p className="text-xs text-slate-500">{row.original.email}</p>
                    <p className="text-xs text-slate-400">{row.original.phone}</p>
                </div>
            ),
        }),
        demoColumnHelper.accessor('company', {
            header: 'Company & Scale',
            cell: ({ row }) => (
                <div>
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {row.original.company || <span className="text-slate-400 italic font-normal">Not provided</span>}
                    </div>
                    {row.original.units && (
                        <p className="text-[11px] font-bold text-blue-600 mt-1 ml-5 bg-blue-50 border border-blue-100 inline-block px-2 py-0.5 rounded-md">
                            {row.original.units} Units
                        </p>
                    )}
                </div>
            )
        }),
        demoColumnHelper.accessor('selected_slot', {
            header: 'Scheduled Time',
            cell: ({ getValue }) => {
                const date = new Date(getValue());
                return (
                    <div>
                        <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-brand-red" />
                            {date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </p>
                        <p className="text-xs font-medium text-slate-500 ml-5 mt-0.5">
                            {date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}
                        </p>
                    </div>
                );
            }
        }),
        demoColumnHelper.display({
            id: 'actions',
            header: 'Meeting',
            cell: ({ row }) => (
                row.original.meeting_link ? (
                    <a href={row.original.meeting_link} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all text-xs font-bold shadow-md">
                        <Presentation className="w-3 h-3" /> Join Meet
                    </a>
                ) : (
                    <span className="text-xs text-slate-400 italic">No link</span>
                )
            )
        })
    ], []);

    const demoTable = useReactTable({
        data: demos,
        columns: demoColumns,
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

    const activeTable = activeTab === 'properties' ? table : demoTable;
    const isLoading = activeTab === 'properties' ? loadingProps : loadingDemos;

    const { pageIndex, pageSize } = activeTable.getState().pagination;
    const totalRows = activeTable.getFilteredRowModel().rows.length;
    const startRow = pageIndex * pageSize + 1;
    const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

    return (
        <AdminLayout title="Overview">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatsCard
                    title="Total Properties"
                    value={totalCount}
                    icon={Home}
                    trend={{ value: '+12% this month', positive: true }}
                    chartData={sparklineData.map(d => ({ value: d.value + 5 }))}
                    chartColor="from-blue-500 to-blue-600"
                />
                <StatsCard
                    title="Active Listings"
                    value={activeCount}
                    icon={BarChart3}
                    trend={{ value: 'All live now', positive: true }}
                    chartData={sparklineData.map(d => ({ value: d.value + 15 }))}
                    chartColor="from-emerald-500 to-emerald-600"
                />
                <StatsCard
                    title="Leads / Enquiries"
                    value={leadsCount}
                    icon={Users}
                    trend={{ value: 'New demos scheduled', positive: false, neutral: true }}
                    chartData={sparklineData.map(d => ({ value: d.value - 2 }))}
                    chartColor="from-violet-500 to-violet-600"
                />
            </div>

            <div className="mt-6 mb-8">
                <QuickActions onAddProperty={() => setIsAddModalOpen(true)} />
            </div>

            <AnalyticsCharts />

            {/* Property / Demos Table Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl border border-slate-100 overflow-hidden mb-8 shadow-sm">

                {/* Table toolbar */}
                <div className="px-6 py-5 border-b border-slate-100/60">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Tabs */}
                        <div className="flex items-center p-1 bg-slate-100/50 rounded-xl w-fit border border-slate-200">
                            <button
                                onClick={() => { setActiveTab('properties'); setGlobalFilter(''); }}
                                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'properties' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <Home className="w-4 h-4" /> Properties
                            </button>
                            <button
                                onClick={() => { setActiveTab('demos'); setGlobalFilter(''); }}
                                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'demos' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <Presentation className="w-4 h-4" /> Demos
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={globalFilter ?? ''}
                                    onChange={e => setGlobalFilter(e.target.value)}
                                    placeholder={`Search ${activeTab === 'properties' ? 'properties' : 'demos'}...`}
                                    className="pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:bg-white focus:border-brand-red/50 transition-all w-full sm:w-64 placeholder:text-slate-400"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            {activeTable.getHeaderGroups().map((hg) => (
                                <tr key={hg.id} className="bg-slate-50/50 border-b border-slate-100">
                                    {hg.headers.map((h) => (
                                        <th key={h.id} className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                            {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="border-b border-slate-50">
                                        {Array.from({ length: activeTab === 'properties' ? 5 : 4 }).map((_, j) => (
                                            <td key={j} className="px-6 py-4">
                                                <div className="h-4 bg-slate-100 rounded-md animate-pulse" style={{ width: j === 0 ? '160px' : j === 4 ? '70px' : '80px' }} />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : activeTable.getRowModel().rows.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="py-24 text-center">
                                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                                                {activeTab === 'properties' ? <Home className="w-8 h-8 text-slate-300" /> : <Presentation className="w-8 h-8 text-slate-300" />}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-800 mb-1">
                                                    No {activeTab} found
                                                </h3>
                                                <p className="text-sm font-medium text-slate-500 max-w-sm mx-auto">
                                                    {globalFilter
                                                        ? "Try a different search term to find what you're looking for."
                                                        : `You haven't added any ${activeTab} yet. Get started by adding your first one!`}
                                                </p>
                                            </div>
                                            {!globalFilter && activeTab === 'properties' && (
                                                <button onClick={() => setIsAddModalOpen(true)} className="mt-2 px-5 py-2.5 bg-brand-red hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-brand-red/20 active:translate-y-0 hover:-translate-y-0.5">
                                                    Add Property
                                                </button>
                                            )}
                                        </motion.div>
                                    </td>
                                </tr>
                            ) : (
                                activeTable.getRowModel().rows.map((row, i: number) => (
                                    <motion.tr
                                        key={row.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.02 }}
                                        className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group"
                                    >
                                        {(row.getVisibleCells() as any[]).map((cell) => (
                                            <td key={cell.id} className="px-6 py-4">
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
                {!isLoading && totalRows > 0 && (
                    <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
                        <div className="flex items-center gap-3">
                            <p className="text-sm font-medium text-slate-500">
                                Showing <span className="font-bold text-slate-800">{startRow}</span> to <span className="font-bold text-slate-800">{endRow}</span> of <span className="font-bold text-slate-800">{totalRows}</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <button onClick={() => activeTable.previousPage()} disabled={!activeTable.getCanPreviousPage()}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-bold shadow-sm">
                                Previous
                            </button>
                            <div className="flex items-center gap-1 mx-2">
                                {Array.from({ length: activeTable.getPageCount() }, (_, i) => i).map(page => {
                                    const cur = pageIndex;
                                    if (page === 0 || page === activeTable.getPageCount() - 1 || Math.abs(page - cur) <= 1) {
                                        return (
                                            <button key={page} onClick={() => activeTable.setPageIndex(page)}
                                                className={`min-w-[32px] h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${page === cur
                                                    ? 'bg-brand-red text-white shadow-md shadow-brand-red/20'
                                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-transparent'
                                                    }`}>
                                                {page + 1}
                                            </button>
                                        );
                                    }
                                    if (Math.abs(page - cur) === 2) return <span key={page} className="text-slate-400 font-bold text-sm px-1">...</span>;
                                    return null;
                                })}
                            </div>
                            <button onClick={() => activeTable.nextPage()} disabled={!activeTable.getCanNextPage()}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-bold shadow-sm">
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Add Property Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => { setIsAddModalOpen(false); setEditingProperty(null); }} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-4xl relative z-10 max-h-[90vh] overflow-y-auto rounded-3xl hide-scrollbar shadow-2xl bg-white border border-slate-100">
                            <PropertyForm
                                onClose={() => { setIsAddModalOpen(false); setEditingProperty(null); }}
                                initialProperty={editingProperty || undefined}
                                onSuccess={() => fetchProperties()}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Settings & SignOut Modal placeholders */}
            <AnimatePresence>
                {isPasswordModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setIsPasswordModalOpen(false)} />
                        {/* Mock structure for password modal in light theme */}
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-md bg-white rounded-3xl relative z-10 border border-slate-100 p-6 shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">Change Password</h2>
                                    <p className="text-xs font-medium text-slate-500 mt-1">Update your admin credentials</p>
                                </div>
                                <button onClick={() => setIsPasswordModalOpen(false)} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"><X className="w-5 h-5" /></button>
                            </div>
                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                {pwdError && <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2"><AlertCircle className="w-4 h-4" />{pwdError}</div>}
                                {pwdSuccess && <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-sm font-medium flex items-center gap-2"><CheckCircle2 className="w-4 h-4" />Success!</div>}

                                <div className="relative">
                                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="password" required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Current Password"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red/50 focus:bg-white transition-all placeholder:text-slate-400" />
                                </div>
                                <div className="relative">
                                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New Password"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red/50 focus:bg-white transition-all placeholder:text-slate-400" />
                                </div>
                                <div className="relative">
                                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm New Password"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red/50 focus:bg-white transition-all placeholder:text-slate-400" />
                                </div>

                                <button type="submit" disabled={pwdLoading} className="w-full py-3 mt-2 bg-brand-red hover:bg-red-600 text-white rounded-xl font-bold shadow-md shadow-brand-red/20 active:translate-y-0 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                                    {pwdLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : 'Update Password'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}
