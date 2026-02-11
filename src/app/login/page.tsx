"use client"

import { useActionState } from "react"
import { login } from "@/lib/auth-actions"
import Link from "next/link"

const initialState = {
    error: null as string | null,
}

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, initialState)

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-10 rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700 transition-all">
                <div className="text-center">
                    <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                        Welcome Back
                    </h2>
                    <p className="mt-3 text-sm text-gray-600 dark:text-slate-400">
                        Sign in to access your dashboard
                    </p>
                </div>

                <form className="mt-8 space-y-6" action={formAction}>
                    <div className="space-y-4">
                        <div className="group">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">Email Address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="mt-1 block w-full rounded-xl border-gray-300 dark:border-slate-600 bg-gray-50/50 dark:bg-slate-800 py-3 px-4 text-gray-900 dark:text-white shadow-sm transition-all focus:border-blue-500 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 sm:text-sm outline-none border ring-1 ring-gray-200 dark:ring-slate-700 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                                placeholder="admin@example.com"
                            />
                        </div>
                        <div className="group">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">Password</label>
                                <a href="#" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">Forgot password?</a>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="mt-1 block w-full rounded-xl border-gray-300 dark:border-slate-600 bg-gray-50/50 dark:bg-slate-800 py-3 px-4 text-gray-900 dark:text-white shadow-sm transition-all focus:border-blue-500 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 sm:text-sm outline-none border ring-1 ring-gray-200 dark:ring-slate-700 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {state?.error && (
                        <div className="animate-shake bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
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

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                    >
                        {isPending ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Authenticating...
                            </span>
                        ) : "Sign In"}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                        Don't have an account?{" "}
                        <Link href="/signup" className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 underline-offset-4 hover:underline">
                            Create one now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
