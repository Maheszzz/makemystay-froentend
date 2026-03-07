import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface StatsCardProps {
    title: string;
    value: string | number | null;
    icon: LucideIcon;
    trend: {
        value: string;
        positive: boolean;
        neutral?: boolean;
    };
    chartData: any[];
    chartColor: string;
}

export function StatsCard({ title, value, icon: Icon, trend, chartData, chartColor }: StatsCardProps) {
    const isPositive = trend.positive;
    const isNeutral = trend.neutral;

    return (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 group flex flex-col justify-between hover:shadow-md hover:border-slate-200 transition-all shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-slate-500 font-semibold text-sm mb-1">{title}</p>
                    <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        {value === null ? (
                            <span className="inline-block w-16 h-9 bg-slate-100 rounded-lg animate-pulse" />
                        ) : value}
                    </h3>
                </div>
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${chartColor} shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
            </div>

            <div className="flex items-end justify-between gap-4 mt-auto">
                <div className="flex flex-col gap-1.5">
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg border ${isNeutral
                            ? 'bg-slate-50 text-slate-600 border-slate-200'
                            : isPositive
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                : 'bg-red-50 text-red-600 border-red-100'
                        }`}>
                        {isNeutral ? null : isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {trend.value}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">vs last month</span>
                </div>

                <div className="h-10 w-24">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id={`gradient-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={isPositive || isNeutral ? '#10b981' : '#ef4444'} stopOpacity={0.2} />
                                    <stop offset="95%" stopColor={isPositive || isNeutral ? '#10b981' : '#ef4444'} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke={isPositive || isNeutral ? '#10b981' : '#ef4444'}
                                fillOpacity={1}
                                fill={`url(#gradient-${title.replace(/\s+/g, '')})`}
                                strokeWidth={2.5}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
