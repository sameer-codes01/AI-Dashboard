import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface StatCardProps {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down";
    icon: LucideIcon;
    color: string;
    bgColor: string;
}

export function StatCard({
    title,
    value,
    change,
    trend,
    icon: Icon,
    color,
    bgColor,
}: StatCardProps) {
    return (
        <Card className="p-6 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${bgColor} ${color}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div
                    className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${trend === "up"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-rose-50 text-rose-600"
                        }`}
                >
                    {change}
                    {trend === "up" ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    ) : (
                        <ArrowDownRight className="w-3.5 h-3.5" />
                    )}
                </div>
            </div>
            <div className="mt-4">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
                    {value}
                </h3>
            </div>
        </Card>
    );
}
