
"use server";

import prisma from "../lib/prisma";
import { auth } from "../auth";
import Groq from "groq-sdk";
import { revalidatePath } from "next/cache";
import { generateEmbedding, findSimilarChunks } from "../lib/vector-store";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function chatWithWorkspace(workspaceId: string, message: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized." };
    }

    try {
        // 1. Save User Message
        const userMessage = await prisma.chat.create({
            data: {
                text: message,
                role: "user",
                workspaceId: workspaceId,
            },
        });

        // 2. Generate Embedding for Query
        const embedding = await generateEmbedding(message);

        // 3. Find Similar Chunks
        const similarChunks = await findSimilarChunks(embedding, workspaceId);

        // 4. Construct Context from Chunks
        // format: "Document: <name>\nContent: <content>\n\n"
        const context = similarChunks.map(chunk =>
            `Source: ${chunk.document.name}\nContent: ${chunk.content}`
        ).join("\n\n---\n\n");

        if (!context) {
            // No context found, but we should still answer or say we don't know
            // Let's fallback to just answering without context if simple greeting, but strict for RAG
        }

        // 5. Generate Answer with LLM
        const systemPrompt = `You are a helpful AI assistant for a document workspace.
        Use the following retrieved context to answer the user's question.
        
        Rules:
        1. Answer based ONLY on the provided context. 
        2. If the answer is not in the context, say "I couldn't find the information in the workspace documents."
        3. Cite the source document names when answering (e.g., "According to [Document Name]...").
        4. Keep the answer concise and helpful.

        CONTEXT:
        ${context}
        `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message },
            ],
            model: "llama-3.3-70b-versatile",
        });

        const answer = chatCompletion.choices[0]?.message?.content || "I couldn't generate a response.";

        // 6. Save Assistant Response
        const assistantMessage = await prisma.chat.create({
            data: {
                text: answer,
                role: "assistant", // Using 'assistant' to match schema comment, though sometimes 'system' is used in DB
                workspaceId: workspaceId,
            },
        });

        revalidatePath(`/dashboard/workspaces/${workspaceId}`);
        return { success: true, userMessage, assistantMessage };

    } catch (error: any) {
        console.error("Chat error:", error);
        return { success: false, error: "Failed to process chat." };
    }
}

export async function getWorkspaceChatHistory(workspaceId: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        const chats = await prisma.chat.findMany({
            where: { workspaceId },
            orderBy: { createdAt: "asc" },
        });
        return { success: true, chats };
    } catch (error) {
        console.error("Get history error:", error);
        return { success: false, error: "Failed to fetch history" };
    }
}
