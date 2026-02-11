"use client"

import { Card } from "@/components/ui/Card"
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react"

export default function AnalyticsPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <div>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Analytics</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Detailed insights and performance metrics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Views</p>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">124.5K</h3>
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                            <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Conversion Rate</p>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">3.2%</h3>
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                            <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Users</p>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">12,450</h3>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="min-h-[400px] flex items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Analytics Dashboard</h3>
                    <p className="text-slate-500 dark:text-slate-400">Advanced charts coming soon...</p>
                </div>
            </div>
        </div>
    )
}
