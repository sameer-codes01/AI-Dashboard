"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function getDashboardStats() {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized." };
    }

    const isAdmin = (session.user as any).role === "ADMIN";

    try {
        // 1. User Stats (Total users if Admin, 1 if User)
        const totalUsers = isAdmin
            ? await prisma.user.count()
            : 1;

        // 2. Document Stats (Total documents in system or personal)
        const totalDocuments = isAdmin
            ? await (prisma as any).document.count()
            : await (prisma as any).document.count({ where: { userId: session.user.id } });

        // 3. Study Note Stats
        const totalNotes = isAdmin
            ? await prisma.note.count()
            : await prisma.note.count({ where: { userId: session.user.id } });

        // 4. Activity Stats (Total chats/interactions)
        const totalInteractions = isAdmin
            ? await (prisma as any).chat.count()
            : await (prisma as any).chat.count({ where: { document: { userId: session.user.id } } });

        // 5. Chart Data: Document creation by month (as a "Growth/Revenue" proxy)
        const documentsByMonth = await (prisma as any).document.groupBy({
            by: ['createdAt'],
            _count: { id: true },
        });

        // Format to monthly data
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyDocs = Array(12).fill(0).map((_, i) => ({ name: monthNames[i], total: 0 }));

        documentsByMonth.forEach((d: any) => {
            const month = d.createdAt.getMonth();
            monthlyDocs[month].total += d._count.id;
        });

        // 6. User Activity Data: Signups vs Active
        const usersByMonth = await (prisma as any).user.groupBy({
            by: ['createdAt'],
            _count: { id: true },
        });

        const activeUsersCount = totalUsers; // For simplicity in this dummy view

        const monthlyActivity = Array(12).fill(0).map((_, i) => ({
            name: monthNames[i],
            active: Math.floor(activeUsersCount * (0.5 + Math.random() * 0.5)), // Mock active data
            new: 0
        }));

        usersByMonth.forEach((u: any) => {
            const month = u.createdAt.getMonth();
            monthlyActivity[month].new += u._count.id;
        });

        return {
            success: true,
            stats: {
                totalUsers,
                totalDocuments,
                totalNotes,
                totalInteractions,
                revenueData: monthlyDocs,
                activityData: monthlyActivity
            }
        };
    } catch (error: any) {
        console.error("Dashboard stats error:", error);
        return { success: false, error: "Failed to fetch dashboard stats." };
    }
}

export async function getRecentActivity() {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized." };
    }

    const isAdmin = (session.user as any).role === "ADMIN";

    try {
        // Fetch latest documents
        const docs = await (prisma as any).document.findMany({
            where: isAdmin ? {} : { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            take: 5,
            include: { user: { select: { name: true } } }
        });

        // Fetch latest notes
        const notes = await prisma.note.findMany({
            where: isAdmin ? {} : { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            take: 5,
            include: { user: { select: { name: true } } }
        });

        // Combine and format
        const activity = [
            ...docs.map((d: any) => ({
                id: d.id,
                type: "document",
                title: d.name,
                user: d.user.name,
                date: d.createdAt,
                status: "Uploaded"
            })),
            ...notes.map((n: any) => ({
                id: n.id,
                type: "note",
                title: n.title,
                user: n.user.name,
                date: n.createdAt,
                status: "Generated"
            }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

        return { success: true, activity };
    } catch (error: any) {
        console.error("Recent activity error:", error);
        return { success: false, error: "Failed to fetch recent activity." };
    }
}
