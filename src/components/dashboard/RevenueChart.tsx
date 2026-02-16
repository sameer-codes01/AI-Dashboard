"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { revenueData } from "@/data/dashboard-data";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function RevenueChart({ data }: { data?: any[] }) {
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = mounted && (theme === "dark" || resolvedTheme === "dark");

    return (
        <Card className="p-6 h-[400px]">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Revenue Overview</h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Monthly performance analysis
                </p>
            </div>
            <ResponsiveContainer width="100%" height="85%">
                <AreaChart
                    data={data && data.length > 0 ? data : revenueData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#334155" : "#e2e8f0"} />
                    <XAxis
                        dataKey="name"
                        tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: "12px",
                            border: "none",
                            backgroundColor: isDark ? "#1e293b" : "#ffffff", // slate-800 : white
                            color: isDark ? "#f8fafc" : "#0f172a",
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        }}
                        cursor={{ stroke: "#6366f1", strokeWidth: 1 }}
                    />
                    <Area
                        type="monotone"
                        dataKey="total"
                        stroke="#6366f1"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorTotal)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Card>
    );
}
