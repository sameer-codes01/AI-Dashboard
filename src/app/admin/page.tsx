import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { toggleUserApproval, deleteUser } from "@/lib/admin-actions"
import { ShieldCheck, UserX, CheckCircle2, XCircle, Trash2, Mail, ShieldAlert, Users } from "lucide-react"

export default async function AdminPage() {
    const session = await auth()

    if ((session?.user as any)?.role !== 'ADMIN') {
        redirect("/dashboard")
    }

    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
    })

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <ShieldAlert className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                        User Management
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-lg">Control access and approve new registrations.</p>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-2xl px-6 py-3 flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse"></div>
                    <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">{users.length} Registered Accounts</span>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <th className="px-8 py-5 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Member</th>
                                <th className="px-8 py-5 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Privilege</th>
                                <th className="px-8 py-5 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Authentication</th>
                                <th className="px-8 py-5 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {users.map((user: any) => (
                                <tr key={user.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                {user.name?.[0] || 'U'}
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-900 dark:text-white">{user.name}</div>
                                                <div className="text-sm font-medium text-slate-400 flex items-center gap-1 mt-0.5">
                                                    <Mail className="w-3 h-3" />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-xl text-xs font-black tracking-widest uppercase ${user.role === 'ADMIN' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        {user.isApproved ? (
                                            <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm bg-emerald-50 dark:bg-emerald-900/20 w-fit px-4 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                                                <CheckCircle2 className="w-4 h-4" />
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2 text-rose-500 dark:text-rose-400 font-bold text-sm bg-rose-50 dark:bg-rose-900/20 w-fit px-4 py-1 rounded-full border border-rose-100 dark:border-rose-900/30">
                                                <XCircle className="w-4 h-4" />
                                                Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <form action={toggleUserApproval.bind(null, user.id, user.isApproved)}>
                                                <button
                                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all min-w-[120px] justify-center ${user.isApproved
                                                        ? 'bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600'
                                                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20'
                                                        }`}
                                                >
                                                    {user.isApproved ? 'Revoke Access' : 'Approve User'}
                                                </button>
                                            </form>
                                            <form action={deleteUser.bind(null, user.id)}>
                                                <button className="p-2.5 rounded-xl text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-900">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {users.length === 0 && (
                    <div className="py-24 text-center">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Users className="w-10 h-10 text-slate-200 dark:text-slate-600" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">No users found</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium max-w-sm mx-auto">Registration activity will appear here. No users have signed up yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
