
"use server";

import prisma from "../lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "../auth"; // Assuming auth is set up in src/auth.ts based on file list
import { redirect } from "next/navigation";

export async function createWorkspace(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/");
    }

    const name = formData.get("name") as string;

    if (!name) {
        throw new Error("Workspace name is required");
    }

    await prisma.workspace.create({
        data: {
            name,
            userId: session.user.id,
        },
    });

    revalidatePath("/dashboard/workspaces");
    return { success: true };
}

export async function getWorkspaces() {
    const session = await auth();
    if (!session?.user?.id) {
        return [];
    }

    return await prisma.workspace.findMany({
        where: {
            userId: session.user.id,
        },
        orderBy: {
            updatedAt: "desc",
        },
        include: {
            _count: {
                select: { documents: true },
            },
        },
    });
}

export async function getWorkspace(id: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return null;
    }

    return await prisma.workspace.findFirst({
        where: {
            id,
            userId: session.user.id,
        },
        include: {
            documents: {
                orderBy: {
                    createdAt: 'desc'
                }
            },
        },
    });
}
