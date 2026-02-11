"use client"

import { ThemeToggle } from "@/components/ThemeToggle"
import { useSession } from "next-auth/react"
import { Bell, Search, User as UserIcon, ChevronDown } from "lucide-react"

export function Navbar() {
    const { data: session } = useSession()

    return (
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-30 px-8 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4 flex-1">
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search analytics, users..."
                        className="w-full bg-gray-50 dark:bg-slate-800 dark:text-white border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
                <ThemeToggle />

                <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors group">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 group-hover:scale-110 transition-transform"></span>
                </button>

                <div className="h-8 w-px bg-gray-200 dark:bg-slate-800"></div>

                <div className="flex items-center gap-3 pl-2 group cursor-pointer">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                            {session?.user?.name || "User"}
                        </p>
                        <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {(session?.user as any)?.role || "User"}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center border border-indigo-200 dark:border-indigo-800 group-hover:shadow-md transition-all">
                        <UserIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                </div>
            </div>
        </header>
    )
}
