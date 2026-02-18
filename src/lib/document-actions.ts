"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
// @ts-ignore
import pdf from "pdf-parse";
import { revalidatePath } from "next/cache";



export async function uploadDocument(formData: FormData) {

    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: "You must be logged in to upload documents." };
    }

    try {

        const file = formData.get("file") as File;
        if (!file) {
            console.error(">>> [SERVER] No file in formData");
            return { success: false, error: "No file uploaded." };
        }


        const bytes = await file.arrayBuffer();


        const buffer = Buffer.from(bytes);
        let content = "";

        if (file.type === "application/pdf") {

            try {
                const data = await pdf(buffer);
                content = data.text;

            } catch (pdfError: any) {
                console.error(">>> [SERVER] PDF Parse Exception:", pdfError);
                return { success: false, error: "Failed to parse PDF: " + (pdfError.message || String(pdfError)) };
            }
        } else if (file.type === "text/plain") {

            content = buffer.toString("utf-8");

        } else {
            console.error(">>> [SERVER] Unsupported file type:", file.type);
            return { success: false, error: "Unsupported file type." };
        }

        if (!content || !content.trim()) {
            console.error(">>> [SERVER] Content is empty after parsing");
            return { success: false, error: "The document is empty or could not be read." };
        }


        const document = await (prisma as any).document.create({
            data: {
                name: file.name,
                content: content,
                userId: session.user.id,
            },
        });



        revalidatePath("/dashboard/documents");

        return { success: true, documentId: document.id };
    } catch (error: any) {
        console.error(">>> [SERVER] CRITICAL UNCAUGHT ERROR:", error);
        return { success: false, error: error.message || "Failed to process document." };
    }
}

export async function getDocuments() {

    const session = await auth();
    if (!session?.user?.id) {
        console.warn(">>> [SERVER] getDocuments: Unauthorized");
        return { success: false, error: "Unauthorized." };
    }

    try {

        const documents = await (prisma as any).document.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                createdAt: true,
            }
        });



        return { success: true, documents };
    } catch (error: any) {
        console.error(">>> [SERVER] Get documents error:", error);
        return { success: false, error: "Failed to fetch documents." };
    }
}

export async function deleteDocument(id: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized." };
    }

    try {
        await (prisma as any).document.delete({
            where: { id, userId: session.user.id },
        });

        revalidatePath("/dashboard/documents");
        return { success: true };
    } catch (error: any) {
        console.error("Delete document error:", error);
        return { success: false, error: "Failed to delete document." };
    }
}

export async function getDocument(id: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized." };
    }

    try {
        const document = await (prisma as any).document.findUnique({
            where: { id, userId: session.user.id },
        });

        if (!document) return { success: false, error: "Document not found." };
        return { success: true, document };
    } catch (error: any) {
        console.error("Get document error:", error);
        return { success: false, error: "Failed to fetch document." };
    }
}
