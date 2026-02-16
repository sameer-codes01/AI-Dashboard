"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import Groq from "groq-sdk";
import { revalidatePath } from "next/cache";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function askQuestion(documentId: string, question: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized." };
    }

    if (!process.env.GROQ_API_KEY) {
        console.error("GROQ_API_KEY is missing from environment variables.");
        return { success: false, error: "Groq API Key is missing. Please add GROQ_API_KEY to your .env file." };
    }

    try {

        const document = await (prisma as any).document.findUnique({
            where: { id: documentId, userId: session.user.id },
        });

        if (!document) {
            console.error("Document not found for id:", documentId);
            return { success: false, error: "Document not found." };
        }

        // Prepare context
        const context = document.content.slice(0, 15000);

        // Save user question

        const userMessage = await (prisma as any).chat.create({
            data: {
                text: question,
                role: "user",
                documentId: documentId,
            },
        });

        // Call Groq API

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a helpful assistant that answers questions based on the following document context. 
          Use ONLY the provided context to answer. If the answer is not in the context, say "I couldn't find the answer in the document."
          
          CONTEXT:
          ${context}`,
                },
                {
                    role: "user",
                    content: question,
                },
            ],
            model: "llama-3.3-70b-versatile",
        });

        const answer = chatCompletion.choices[0]?.message?.content || "No response generating.";


        // Save assistant response
        const assistantMessage = await (prisma as any).chat.create({
            data: {
                text: answer,
                role: "assistant",
                documentId: documentId,
            },
        });


        revalidatePath(`/dashboard/documents/${documentId}`);
        return { success: true, userMessage, assistantMessage };
    } catch (error: any) {
        console.error("Groq QA server-side error:", error);
        return { success: false, error: error.message || "Failed to generate answer." };
    }
}

export async function getChatHistory(documentId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized." };
    }

    try {
        const chats = await (prisma as any).chat.findMany({
            where: { documentId: documentId },
            orderBy: { createdAt: "asc" },
        });

        return { success: true, chats };
    } catch (error: any) {
        console.error("Get chat history error:", error);
        return { success: false, error: "Failed to fetch chat history." };
    }
}
