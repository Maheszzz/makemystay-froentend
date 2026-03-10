// import { Link, useLocation } from 'react-router-dom';
// import { LayoutDashboard, Home, Users, Calendar, CreditCard, BarChart3, Settings, LogOut } from 'lucide-react';
// import { useAuth } from '@/context/AuthContext';
// import { motion } from 'framer-motion';

// const navItems = [
//     { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
//     { label: 'Properties', icon: Home, path: '/properties' },
//     { label: 'Leads', icon: Users, path: '/admin/leads' },
//     { label: 'Bookings', icon: Calendar, path: '/admin/bookings' },
//     { label: 'Payments', icon: CreditCard, path: '/admin/payments' },
//     { label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
// ];

// export function AdminSidebar() {
//     const location = useLocation();
//     const { logout } = useAuth();

//     return (
//         <div className="w-64 bg-white border-r border-slate-200 h-screen fixed left-0 top-0 flex flex-col pt-6 pb-4 z-50 shadow-sm">
//             <div className="px-6 mb-8 flex items-center gap-2.5">
//                 <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-red to-red-600 flex items-center justify-center shadow-sm">
//                     <span className="text-white font-bold text-lg">M</span>
//                 </div>
//                 <span className="text-xl font-bold text-slate-900 tracking-tight">
//                     MakeMyStay<span className="text-brand-red">.ai</span>
//                 </span>
//             </div>

//             <div className="px-4 flex-grow space-y-1 overflow-y-auto">
//                 {navItems.map((item) => {
//                     const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));

//                     return (
//                         <Link
//                             key={item.label}
//                             to={item.path}
//                             className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive
//                                     ? 'bg-red-50 text-brand-red'
//                                     : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
//                                 }`}
//                         >
//                             <item.icon className={`w-5 h-5 ${isActive ? 'text-brand-red' : 'text-slate-400'}`} />
//                             {item.label}
//                             {isActive && (
//                                 <motion.div layoutId="sidebar-activeIndicator" className="absolute left-0 w-1 h-6 bg-brand-red rounded-r-md" />
//                             )}
//                         </Link>
//                     )
//                 })}

//                 <div className="pt-6 mt-6 border-t border-slate-100">
//                     <Link
//                         to="/admin/settings"
//                         className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${location.pathname.includes('/settings')
//                                 ? 'bg-red-50 text-brand-red'
//                                 : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
//                             }`}
//                     >
//                         <Settings className="w-5 h-5" />
//                         Settings
//                     </Link>
//                 </div>
//             </div>

//             <div className="px-4 mt-auto">
//                 <button
//                     onClick={() => logout()}
//                     className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
//                 >
//                     <LogOut className="w-5 h-5" />
//                     Sign Out
//                 </button>
//             </div>
//         </div>
//     );
// }
