"use client"

import { Card } from "@/components/ui/Card"
import { Check, CreditCard, Zap } from "lucide-react"

export default function BillingPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <div>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Billing & Plans</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage your subscription and billing information.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Free Plan */}
                <Card className="p-8 relative overflow-hidden">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Free Plan</h3>
                    <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-4xl font-black text-slate-900 dark:text-white">$0</span>
                        <span className="text-slate-500">/month</span>
                    </div>
                    <p className="mt-4 text-slate-500 dark:text-slate-400 text-sm">Perfect for getting started with basic analytics.</p>

                    <ul className="mt-8 space-y-4">
                        <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                            <Check className="w-5 h-5 text-emerald-500" /> 3 Projects
                        </li>
                        <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                            <Check className="w-5 h-5 text-emerald-500" /> Basic Analytics
                        </li>
                        <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                            <Check className="w-5 h-5 text-emerald-500" /> 24h Support Response
                        </li>
                    </ul>

                    <button className="mt-8 w-full py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        Current Plan
                    </button>
                </Card>

                {/* Pro Plan */}
                <Card className="p-8 relative overflow-hidden border-indigo-500 ring-4 ring-indigo-500/20">
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                        Popular
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        Pro Plan
                        <Zap className="w-5 h-5 text-indigo-500 fill-indigo-500" />
                    </h3>
                    <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-4xl font-black text-slate-900 dark:text-white">$29</span>
                        <span className="text-slate-500">/month</span>
                    </div>
                    <p className="mt-4 text-slate-500 dark:text-slate-400 text-sm">Advanced features for growing teams.</p>

                    <ul className="mt-8 space-y-4">
                        <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                            <Check className="w-5 h-5 text-indigo-500" /> Unlimited Projects
                        </li>
                        <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                            <Check className="w-5 h-5 text-indigo-500" /> Advanced Analytics
                        </li>
                        <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                            <Check className="w-5 h-5 text-indigo-500" /> Priority Support
                        </li>
                        <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                            <Check className="w-5 h-5 text-indigo-500" /> AI Summarizer
                        </li>
                    </ul>

                    <button className="mt-8 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition-colors">
                        Upgrade Now
                    </button>
                </Card>

                {/* Enterprise */}
                <Card className="p-8 relative overflow-hidden">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Enterprise</h3>
                    <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-4xl font-black text-slate-900 dark:text-white">$99</span>
                        <span className="text-slate-500">/month</span>
                    </div>
                    <p className="mt-4 text-slate-500 dark:text-slate-400 text-sm">Custom solutions for large organizations.</p>

                    <ul className="mt-8 space-y-4">
                        <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                            <Check className="w-5 h-5 text-slate-400" /> Review previous plans
                        </li>
                        <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                            <Check className="w-5 h-5 text-emerald-500" /> SSO & Custom Roles
                        </li>
                        <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                            <Check className="w-5 h-5 text-emerald-500" /> Dedicated Account Manager
                        </li>
                    </ul>

                    <button className="mt-8 w-full py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        Contact Sales
                    </button>
                </Card>
            </div>
        </div>
    )
}
