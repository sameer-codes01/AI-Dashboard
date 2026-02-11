"use client";

import Link from "next/link";

import { kpiData } from "@/data/dashboard-data";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
// import { RecentSales } from "@/components/dashboard/RecentSales"; // Will enable after fixing imports
import { ArrowUpRight, ArrowDownRight, Users, DollarSign, Activity, ShoppingCart } from "lucide-react";

// Inline for now to avoid complexity with circular dependencies or missing files
function RecentSalesTable() {
    const transactions = [
        { id: "TRX-9871", user: "Alice Smith", amount: "$450.00", status: "Completed", date: "Oct 25" },
        { id: "TRX-9872", user: "Bob Jones", amount: "$120.50", status: "Processing", date: "Oct 25" },
        { id: "TRX-9873", user: "Charlie Day", amount: "$850.25", status: "Completed", date: "Oct 24" },
        { id: "TRX-9874", user: "Dana White", amount: "$65.00", status: "Failed", date: "Oct 24" },
        { id: "TRX-9875", user: "Evan You", amount: "$230.00", status: "Completed", date: "Oct 23" },
    ];

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-800 p-6 overflow-hidden">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Latest financial activity</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800">
                            <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Transaction</th>
                            <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                            <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                            <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                        {transactions.map((t) => (
                            <tr key={t.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="py-4">
                                    <div className="font-bold text-slate-900 dark:text-white">{t.user}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">{t.id}</div>
                                </td>
                                <td className="py-4 text-sm text-slate-500 dark:text-slate-400">{t.date}</td>
                                <td className="py-4 text-sm font-bold text-slate-900 dark:text-white">{t.amount}</td>
                                <td className="py-4 text-right">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${t.status === "Completed" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" :
                                        t.status === "Processing" ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" : "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
                                        }`}>
                                        {t.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default function DashboardPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Overview</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Welcome back! Here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
                        Filter
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all">
                        Download Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map((stat) => (
                    <StatCard key={stat.title} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueChart />
                <ActivityChart />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RecentSalesTable />
                </div>
                <div className="bg-indigo-600 rounded-xl p-8 text-white flex flex-col justify-between shadow-xl shadow-indigo-600/20 relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-black mb-2">Pro Plan</h3>
                        <p className="text-indigo-100 font-medium mb-8">Unlock advanced analytics and export features.</p>
                        <Link href="/dashboard/billing" className="block w-full text-center py-3 bg-white text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transition-colors">Upgrade Now</Link>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
                </div>
            </div>
        </div>
    );
}
