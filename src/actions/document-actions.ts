
"use server";

import prisma from "../lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";
import { generateEmbedding } from "../lib/vector-store";
// @ts-ignore
import pdf from "pdf-parse/lib/pdf-parse.js";

// Simple chunking function - kept same
function chunkText(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
    const chunks: string[] = [];
    let start = 0;
    while (start < text.length) {
        const end = Math.min(start + chunkSize, text.length);
        chunks.push(text.slice(start, end));
        start += chunkSize - overlap;
    }
    return chunks;
}

export async function uploadDocument(workspaceId: string, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const file = formData.get("file") as File;
    if (!file) {
        throw new Error("No file uploaded");
    }

    let text = "";
    if (file.type === "application/pdf") {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        try {
            const data = await pdf(buffer);
            text = data.text;
        } catch (err: any) {
            console.error("PDF extraction error:", err);
            // Throw original error message to help debugging
            throw new Error(`Failed to parse PDF: ${err.message || err}`);
        }

    } else if (file.type === "text/plain" || file.type === "application/markdown") {
        text = await file.text();
    } else {
        throw new Error("Unsupported file type");
    }

    if (!text) {
        throw new Error("Could not extract text from file");
    }

    // Create Document record
    const document = await prisma.document.create({
        data: {
            name: file.name,
            content: text, // Optional: store full text
            userId: session.user.id,
            workspaceId,
        },
    });

    // Chunk and Embed
    const chunks = chunkText(text);

    // Generate embeddings in parallel (limit concurrency in production, but okay for task)
    await Promise.all(chunks.map(async (chunk) => {
        try {
            const embedding = await generateEmbedding(chunk);

            // Store in DocumentChunk
            // Note: We use raw query for vector insertion if plain Prisma doesn't support it well yet, 
            // but simpler to use create() if we can pass valid syntax. 
            // However, for Unsupported types, Prisma Client might not let us write directly via create().
            // workaround: use $executeRaw to insert.

            const vectorString = `[${embedding.join(',')}]`;

            await prisma.$executeRaw`
        INSERT INTO "DocumentChunk" ("id", "content", "embedding", "documentId", "createdAt")
        VALUES (gen_random_uuid(), ${chunk}, ${vectorString}::vector, ${document.id}, NOW());
      `;

        } catch (error) {
            console.error("Error generating embedding for chunk:", error);
            // Continue or fail? For now log and continue
        }
    }));

    revalidatePath(`/dashboard/workspaces/${workspaceId}`);
    return { success: true };
}

export async function getDocuments(workspaceId: string) {
    const session = await auth();
    if (!session?.user?.id) return [];

    return await prisma.document.findMany({
        where: { workspaceId, userId: session.user.id },
        orderBy: { createdAt: 'desc' }
    });
}

export async function deleteDocument(id: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Authorization check
    const doc = await prisma.document.findUnique({ where: { id } });
    if (!doc || doc.userId !== session.user.id) throw new Error("Not found or unauthorized");

    await prisma.document.delete({ where: { id } });
    revalidatePath(`/dashboard/workspaces/${doc.workspaceId}`);
    return { success: true };
}
