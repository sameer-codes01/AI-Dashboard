import { Sidebar } from "@/components/Sidebar"
import { Navbar } from "@/components/Navbar"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    return (
        <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen">
            <Sidebar role={(session.user as any)?.role} />
            <div className="flex-1 ml-64 flex flex-col">
                <Navbar />
                <main className="p-10">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
