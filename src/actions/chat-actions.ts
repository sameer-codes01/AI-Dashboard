
"use server";

import prisma from "../lib/prisma";
import { auth } from "../auth";
import Groq from "groq-sdk";
import { revalidatePath } from "next/cache";
import { generateEmbedding, findSimilarChunks } from "../lib/vector-store";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

import { searchWeb } from "../lib/firecrawl";

export async function chatWithWorkspace(workspaceId: string, message: string, useDeepSearch: boolean = false) {
    const session = await auth();
    if (!session?.user?.id) {
        console.log("Chat: Unauthorized access attempt");
        return { success: false, error: "Unauthorized." };
    }
    console.log("Chat: Starting chat", { workspaceId, useDeepSearch });

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

        // 3. Find Similar Chunks (Document Context)
        const similarChunks = await findSimilarChunks(embedding, workspaceId);

        let context = "";

        // Add Document Context
        if (similarChunks.length > 0) {
            context += "### DOCUMENT CONTEXT:\n";
            context += similarChunks.map(chunk =>
                `Source: ${chunk.documentName}\nContent: ${chunk.content}`
            ).join("\n\n---\n\n");
            context += "\n\n";
        }

        // 4. Deep Search (Web Context)
        if (useDeepSearch) {
            console.log("Chat: Performing Deep Search...");
            const webResults = await searchWeb(message);
            if (webResults.length > 0) {
                context += "### WEB SEARCH CONTEXT:\n";
                context += webResults.map(result =>
                    `Source: ${result.title} (${result.url})\nContent: ${result.content || result.description}`
                ).join("\n\n---\n\n");
                context += "\n\n";
            }
        }

        if (!context) {
            // No context found
        }

        // 5. Generate Answer with LLM
        const systemPrompt = `You are a helpful AI assistant for a document workspace.
        Use the provided context (Documents and/or Web Search) to answer the user's question.
        
        Rules:
        1. Answer based ONLY on the provided context. 
        2. If the answer is not in the context, say "I couldn't find the information."
        3. Cite the source (Document Name or Web URL) when answering.
        4. If using Web Search, explicitly mention "According to web sources...".
        5. Keep the answer concise and helpful.

        CONTEXT:
        ${context}
        `;

        console.log("Chat: Sending request to LLM...");
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message },
            ],
            model: "llama-3.3-70b-versatile",
        });

        const answer = chatCompletion.choices[0]?.message?.content || "I couldn't generate a response.";
        console.log("Chat: Received LLM response");

        // 6. Save Assistant Response
        const assistantMessage = await prisma.chat.create({
            data: {
                text: answer,
                role: "assistant",
                workspaceId: workspaceId,
            },
        });

        revalidatePath(`/dashboard/workspaces/${workspaceId}`);
        console.log("Chat: Success");
        return { success: true, userMessage, assistantMessage };

    } catch (error: any) {
        console.error("Chat error:", error);
        return { success: false, error: `Chat failed: ${error.message}` };
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
