"use client"

import { Card } from "@/components/ui/Card"
import { Settings, Save } from "lucide-react"

export default function SettingsPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <div>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Settings</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage your system preferences and configurations.</p>
            </div>

            <Card className="p-8">
                <div className="space-y-6 max-w-2xl">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-slate-500" />
                            General Settings
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">Email Notifications</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Receive daily summary reports</p>
                                </div>
                                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                    <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-green-400" />
                                    <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">Public Profile</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Allow others to see your status</p>
                                </div>
                                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                    <input type="checkbox" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:bg-green-400" />
                                    <label className="toggle-label block overflow-hidden h-6 rounded-full bg-green-400 cursor-pointer"></label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                        <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
