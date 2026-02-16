"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { kpiData } from "@/data/dashboard-data";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { ArrowUpRight, ArrowDownRight, Users, DollarSign, Activity, FileText, Sparkles, Loader2, Clock } from "lucide-react";
import { getDashboardStats, getRecentActivity } from "@/lib/dashboard-actions";

function RecentActivityTable({ activity, loading }: { activity: any[], loading: boolean }) {
    if (loading) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col items-center justify-center min-h-[350px]">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-4" />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Activity...</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-800 p-6 overflow-hidden min-h-[400px]">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h3>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Latest actions across the platform</p>
                </div>
                <Clock className="w-5 h-5 text-slate-400" />
            </div>
            {activity.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <Activity className="w-10 h-10 mb-4 opacity-10" />
                    <p className="text-sm font-medium">No recent activity found.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800">
                                <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Item</th>
                                <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                                <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {activity.map((t) => (
                                <tr key={t.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${t.type === "document" ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600" : "bg-purple-50 dark:bg-purple-900/30 text-purple-600"}`}>
                                                {t.type === "document" ? <FileText className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{t.title}</div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase">{t.user || "System"}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 text-sm text-slate-500 dark:text-slate-400">{new Date(t.date).toLocaleDateString()}</td>
                                    <td className="py-4 text-right">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${t.status === "Uploaded" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"}`}>
                                            {t.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [activity, setActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const [statsRes, activityRes] = await Promise.all([
                getDashboardStats(),
                getRecentActivity()
            ]);

            if (statsRes.success) setStats(statsRes.stats);
            if (activityRes.success) setActivity(activityRes.activity!);
            setLoading(false);
        }
        loadData();
    }, []);

    const liveKpiData = stats ? [
        {
            title: "System Users",
            value: stats.totalUsers.toString(),
            change: "Live",
            trend: "up" as const,
            icon: Users,
            color: "text-indigo-600 dark:text-indigo-400",
            bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
        },
        {
            title: "Total Documents",
            value: stats.totalDocuments.toString(),
            change: "Real-time",
            trend: "up" as const,
            icon: FileText,
            color: "text-blue-600 dark:text-blue-400",
            bgColor: "bg-blue-50 dark:bg-blue-900/20",
        },
        {
            title: "AI Notes",
            value: stats.totalNotes.toString(),
            change: "Generated",
            trend: "up" as const,
            icon: Sparkles,
            color: "text-purple-600 dark:text-purple-400",
            bgColor: "bg-purple-50 dark:bg-purple-900/20",
        },
        {
            title: "AI Interactions",
            value: stats.totalInteractions.toString(),
            change: "Conversations",
            trend: "up" as const,
            icon: Activity,
            color: "text-emerald-600 dark:text-emerald-400",
            bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
        }
    ] : kpiData;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Overview</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Welcome back! Here's a live look at your workspace.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
                        Refresh Data
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all">
                        Download Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    Array(4).fill(0).map((_, i) => (
                        <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
                    ))
                ) : (
                    liveKpiData.map((stat) => (
                        <StatCard key={stat.title} {...stat} />
                    ))
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueChart data={stats?.revenueData} />
                <ActivityChart data={stats?.activityData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RecentActivityTable activity={activity} loading={loading} />
                </div>
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white flex flex-col justify-between shadow-xl shadow-indigo-600/20 relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-black mb-2">Pro Features</h3>
                        <p className="text-indigo-100 font-medium mb-8">You now have access to Document Intelligence and AI Summaries.</p>
                        <Link href="/dashboard/documents" className="block w-full text-center py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-md">Go to Documents</Link>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
                </div>
            </div>
        </div>
    );
}
