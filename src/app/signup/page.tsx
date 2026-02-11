"use client"

import { useActionState } from "react"
import { signUp } from "@/lib/auth-actions"
import Link from "next/link"

const initialState: any = {
    error: null,
    success: null,
}

export default function SignUpPage() {
    const [state, formAction, isPending] = useActionState(signUp as any, initialState)

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-10 rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700 transition-all">
                <div className="text-center">
                    <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                        Join the Dashboard
                    </h2>
                    <p className="mt-3 text-sm text-gray-600 dark:text-slate-400">
                        Secure access to your SaaS analytics
                    </p>
                </div>

                <form className="mt-8 space-y-5" action={formAction}>
                    <div className="space-y-4">
                        <div className="group">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400">Full Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="mt-1 block w-full rounded-xl border-gray-300 dark:border-slate-600 bg-gray-50/50 dark:bg-slate-800 py-3 px-4 text-gray-900 dark:text-white shadow-sm transition-all focus:border-indigo-500 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 sm:text-sm outline-none border ring-1 ring-gray-200 dark:ring-slate-700 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="group">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400">Email Address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="mt-1 block w-full rounded-xl border-gray-300 dark:border-slate-600 bg-gray-50/50 dark:bg-slate-800 py-3 px-4 text-gray-900 dark:text-white shadow-sm transition-all focus:border-indigo-500 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 sm:text-sm outline-none border ring-1 ring-gray-200 dark:ring-slate-700 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                                placeholder="john@example.com"
                            />
                        </div>
                        <div className="group">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="mt-1 block w-full rounded-xl border-gray-300 dark:border-slate-600 bg-gray-50/50 dark:bg-slate-800 py-3 px-4 text-gray-900 dark:text-white shadow-sm transition-all focus:border-indigo-500 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 sm:text-sm outline-none border ring-1 ring-gray-200 dark:ring-slate-700 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="group">
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400">Request Role</label>
                            <select
                                id="role"
                                name="role"
                                className="mt-1 block w-full rounded-xl border-gray-300 dark:border-slate-600 bg-gray-50/50 dark:bg-slate-800 py-3 px-4 text-gray-900 dark:text-white shadow-sm transition-all focus:border-indigo-500 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 sm:text-sm outline-none border ring-1 ring-gray-200 dark:ring-slate-700 appearance-none"
                            >
                                <option value="USER">Standard User</option>
                                <option value="ADMIN">Administrator</option>
                            </select>
                        </div>
                    </div>

                    {state?.error && (
                        <div className="animate-pulse bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700 font-medium">{state.error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {state?.success && (
                        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-emerald-700 font-medium">{state.success}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                    >
                        {isPending ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : "Create Account"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                        Already have an account?{" "}
                        <Link href="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 underline-offset-4 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
