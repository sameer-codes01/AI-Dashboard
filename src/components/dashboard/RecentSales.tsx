import { Card } from "@/components/ui/Card";
import { recentTransactions } from "@/data/dashboard-data";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"; // Removed unused import

export function RecentSales() {
    return (
        <Card className="col-span-1 lg:col-span-3 p-6">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900">Recent Transactions</h3>
                <p className="text-sm font-medium text-slate-500">
                    Latest financial activity
                </p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100">
                            <th className="py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Transaction ID
                            </th>
                            <th className="py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                User
                            </th>
                            <th className="py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Amount
                            </th>
                            <th className="py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {recentTransactions.map((trx) => (
                            <tr
                                key={trx.id}
                                className="group hover:bg-slate-50/50 transition-colors"
                            >
                                <td className="py-4 text-sm font-medium text-slate-500">
                                    {trx.id}
                                </td>
                                <td className="py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                                            <img
                                                src={trx.avatar}
                                                alt={trx.user}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <span className="text-sm font-bold text-slate-900">
                                            {trx.user}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-4 text-sm font-medium text-slate-500">
                                    {trx.date}
                                </td>
                                <td className="py-4 text-sm font-bold text-slate-900">
                                    {trx.amount}
                                </td>
                                <td className="py-4 text-right">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${trx.status === "Completed"
                                            ? "bg-emerald-50 text-emerald-600"
                                            : trx.status === "Processing"
                                                ? "bg-blue-50 text-blue-600"
                                                : "bg-rose-50 text-rose-600"
                                            }`}
                                    >
                                        {trx.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
