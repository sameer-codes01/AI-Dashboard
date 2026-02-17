"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Settings, LogOut, BarChart3, ShieldCheck, PieChart, Video, Sparkles, FileText, Folder } from 'lucide-react'
import { signOut } from 'next-auth/react'

export function Sidebar({ role }: { role: string }) {
    const pathname = usePathname()

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Workspaces', href: '/dashboard/workspaces', icon: Folder, isPro: true },
        { name: 'AI Summarizer', href: '/dashboard/ai-summarizer', icon: Video, isPro: true },
        { name: 'Document QA', href: '/dashboard/documents', icon: FileText, isPro: true },
        { name: 'Analytics', href: '/dashboard/analytics', icon: PieChart },
    ]

    const adminItems = [
        { name: 'Manage Users', href: '/admin', icon: ShieldCheck },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ]

    return (
        <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col border-r border-slate-800 fixed left-0 top-0">
            <div className="p-8">
                <h1 className="text-2xl font-black text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <span>SaaS<span className="text-indigo-500">Core</span></span>
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                : 'hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                                <span className="font-medium">{item.name}</span>
                            </div>
                            {(item as any).isPro && (
                                <Sparkles className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-200' : 'text-indigo-500 group-hover:text-indigo-400'}`} />
                            )}
                        </Link>
                    )
                })}

                {role === 'ADMIN' && (
                    <>
                        <div className="pt-8 pb-2 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                            Administration
                        </div>
                        {adminItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                        : 'hover:bg-slate-800 hover:text-white'
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            )
                        })}
                    </>
                )}
            </nav>

            <div className="p-4 border-t border-slate-800/50">
                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
                >
                    <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-400" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    )
}
