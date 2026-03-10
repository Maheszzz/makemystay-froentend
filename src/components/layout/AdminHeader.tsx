// import { Search, Bell } from 'lucide-react';
// import { useAuth } from '@/context/AuthContext';

// export function AdminHeader() {
//     const { user } = useAuth();
//     const username = user?.email.split('@')[0] ?? 'Admin';

//     return (
//         <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between px-6 shadow-sm">
//             <div className="flex-1 max-w-md relative">
//                 <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//                 <input
//                     type="text"
//                     placeholder="Search properties, leads..."
//                     className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red/50 focus:bg-white transition-all"
//                 />
//             </div>

//             <div className="flex items-center gap-4">
//                 <button className="relative p-2 text-slate-500 hover:text-slate-800 transition-colors rounded-full hover:bg-slate-100">
//                     <Bell className="w-5 h-5" />
//                     <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-red rounded-full border border-white"></span>
//                 </button>

//                 <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
//                     <div className="text-right hidden sm:block">
//                         <p className="text-sm font-bold text-slate-800 capitalize">{username}</p>
//                         <p className="text-xs font-semibold text-slate-400">Administrator</p>
//                     </div>
//                     <div className="relative">
//                         <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-red to-red-600 flex items-center justify-center shadow-md">
//                             <span className="text-white text-sm font-bold">{username[0].toUpperCase()}</span>
//                         </div>
//                         <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white" />
//                     </div>
//                 </div>
//             </div>
//         </header>
//     );
// }
