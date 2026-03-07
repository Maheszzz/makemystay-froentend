import { Plus, Upload, Tag, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuickActionsProps {
    onAddProperty: () => void;
}

export function QuickActions({ onAddProperty }: QuickActionsProps) {
    const actions = [
        {
            label: "Add Property",
            icon: Plus,
            onClick: onAddProperty,
            primary: true,
            desc: "List new housing",
            color: "from-brand-red to-red-600"
        },
        {
            label: "Import CSV",
            icon: Upload,
            onClick: () => alert("Import feature coming soon"),
            desc: "Bulk upload listings",
            color: "from-blue-500 to-blue-600"
        },
        {
            label: "Create Offer",
            icon: Tag,
            onClick: () => alert("Offers feature coming soon"),
            desc: "New discount campaign",
            color: "from-violet-500 to-violet-600"
        },
        {
            label: "Add Agent",
            icon: UserPlus,
            onClick: () => alert("Agent management coming soon"),
            desc: "Invite team member",
            color: "from-emerald-500 to-emerald-600"
        }
    ];

    return (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {actions.map((action, idx) => (
                    <motion.button
                        key={idx}
                        onClick={action.onClick}
                        whileHover={{ y: -4, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex flex-col items-start p-5 rounded-2xl border text-left transition-all group ${action.primary
                                ? 'bg-gradient-to-br from-brand-red to-red-600 border-transparent text-white shadow-lg shadow-brand-red/20'
                                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm hover:shadow-md cursor-pointer'
                            }`}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${action.primary ? 'bg-white/20 text-white' : `bg-gradient-to-br ${action.color} text-white shadow-md`
                            }`}>
                            <action.icon className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-sm block mb-1">{action.label}</span>
                        <span className={`text-[11px] font-medium leading-tight ${action.primary ? 'text-white/80' : 'text-slate-400'}`}>{action.desc}</span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
