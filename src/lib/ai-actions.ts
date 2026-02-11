"use server";


import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

import { Innertube, UniversalCache } from 'youtubei.js';
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

const execAsync = promisify(exec);


const INVIDIOUS_INSTANCES = [
    "https://invidious.projectsegfau.lt",
    "https://inv.tux.pizza",
    "https://invidious.jing.rocks",
    "https://vid.puffyan.us",
    "https://yt.artemislena.eu"
];

export async function extractTranscript(videoUrl: string) {
    try {
        console.log(`Extracting transcript for URL: ${videoUrl}`);

        // Extract Video ID
        const urlObj = new URL(videoUrl);
        let videoId = urlObj.searchParams.get("v");
        if (!videoId) {
            // Handle Short URLs if necessary or other formats
            if (urlObj.hostname === "youtu.be") {
                videoId = urlObj.pathname.slice(1);
            }
        }

        if (!videoId) {
            throw new Error("Invalid YouTube URL");
        }

        console.log(`Video ID: ${videoId}`);

        // 1. Try Innertube (Android Client) - usually most reliable
        try {
            console.log("Attempting Innertube (Android)...");
            const youtube = await Innertube.create({
                cache: new UniversalCache(false),
                generate_session_locally: true
            });

            const info = await youtube.getInfo(videoId, { client: 'ANDROID' });

            try {
                const transcriptData = await info.getTranscript();
                if (transcriptData?.transcript?.content?.body?.initial_segments) {
                    const segments = transcriptData.transcript.content.body.initial_segments;
                    const transcriptText = segments.map((seg: any) => seg.snippet.text).join(" ");

                    console.log(`Innertube success. Length: ${transcriptText.length} chars.`);
                    return { success: true, transcript: transcriptText };
                }
            } catch (innerErr: any) {
                console.warn("Innertube getTranscript failed:", innerErr.message);
            }
        } catch (error: any) {
            console.error('Innertube (Android) failed:', error.message);
        }

        // 2. Try Invidious Fallback (Privacy Instances)
        console.log("Attempting Invidious fallback...");
        for (const instance of INVIDIOUS_INSTANCES) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout per instance

                console.log(`Trying ${instance}...`);
                const captionsUrl = `${instance}/api/v1/captions/${videoId}`;
                const captionsRes = await fetch(captionsUrl, { signal: controller.signal });
                clearTimeout(timeoutId);

                if (!captionsRes.ok) continue;

                const captionsData = await captionsRes.json();
                const enCaption = captionsData.captions?.find((c: any) => c.languageCode === 'en');

                if (enCaption) {
                    const transcriptUrl = `${instance}${enCaption.url}`;
                    const transcriptRes = await fetch(transcriptUrl);
                    if (transcriptRes.ok) {
                        const transcriptText = await transcriptRes.text();
                        // Parse VTT (simple regex)
                        const lines = transcriptText.split('\n');
                        const textLines = lines.filter(line => !line.includes('-->') && line.trim() !== '' && !line.match(/^\d+$/) && !line.match(/^WEBVTT/));
                        const cleanText = textLines.join(' ');

                        console.log(`Invidious success (${instance}).`);
                        return { success: true, transcript: cleanText };
                    }
                }
            } catch (e) {
                console.warn(`Invidious instance ${instance} failed:`, e);
            }
        }

        // 3. Try Python Script Fallback (youtube-transcript-api)
        try {
            console.log("Attempting Python script fallback...");
            const scriptPath = path.join(process.cwd(), "scripts", "get-transcript.py");
            const { stdout } = await execAsync(`python "${scriptPath}" ${videoId}`);
            const result = JSON.parse(stdout);

            if (result.success && result.transcript) {
                console.log(`Python script success. Length: ${result.transcript.length} chars.`);
                return { success: true, transcript: result.transcript };
            } else {
                console.warn("Python script returned error:", result.error);
            }
        } catch (pyErr: any) {
            console.error("Python script failed:", pyErr.message);
        }

        throw new Error("No transcript found via any method (Innertube, Invidious, Python). Please ensure the video has closed captions (CC).");

    } catch (error: any) {
        console.error("Transcript extraction error:", error);

        return {
            success: false,
            error: error.message || "Failed to extract transcript.",
        };
    }
}

const FALLBACK_MODELS = [
    "gemini-2.0-flash", // Verified available
    "gemini-2.0-flash-lite", // Verified available
    "gemini-flash-latest", // Verified available
    "gemini-pro-latest" // Verified available
];

export async function generateStudyNotes(transcript: string, mode: string) {
    if (!process.env.GEMINI_API_KEY) {
        return {
            success: false,
            error: "Gemini API Key is missing. Please add GEMINI_API_KEY to your .env file.",
        };
    }

    let success = false;
    let content = "";
    let lastError = "";

    for (const modelName of FALLBACK_MODELS) {
        try {
            console.log(`Attempting to generate content with model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });

            const prompt = `
        OBJECTIVE:
        Convert the provided YouTube video transcript into clean, accurate, well-structured study material.

        TRANSCRIPT:
        ${transcript}

        SELECTED MODE:
        ${mode}

        STRICT RULES (NON-NEGOTIABLE):
        - Use ONLY information explicitly present in the transcript.
        - Do NOT hallucinate missing details.
        - Keep language simple, precise, neutral, and student-friendly.
        - If any part of the transcript is unclear, incomplete, or lacks context, explicitly state the limitation.
        - Prioritize factual accuracy over completeness.
        - Adjust depth and detail ONLY based on the selected MODE: ${mode}.

        OUTPUT FORMAT (FOLLOW EXACTLY):

        TITLE:
        - One clear, concise, accurate title strictly based on the transcript.

        SUMMARY:
        - Direct explanation of what the video teaches.
        - No storytelling or background filler.

        KEY CONCEPTS:
        - List the main concepts discussed.
        - For each concept:
          - Concept Name
          - Explanation in 2–4 clear lines.

        DETAILED STUDY NOTES:
        - Clean bullet points and sub-points.
        - Follow the logical flow of the video.
        - Remove repetition, filler words, and spoken-language noise.
        - Notes must be exam-ready and editable by the user.

        IMPORTANT DEFINITIONS:
        - Include ONLY definitions explicitly explained in the transcript.
        - If none exist, write exactly: "No explicit definitions provided."

        EXAMPLES / CASE STUDIES:
        - Include ONLY examples or cases mentioned in the transcript.
        - Do NOT invent or expand examples.
        - If none exist, write exactly: "No examples mentioned."

        QUICK REVISION POINTS:
        - 5–10 sharp bullet points.
        - Facts only. No explanations.

        FLASHCARDS:
        - Term → Definition
        - Concept → Explanation
        - Use only transcript content.
        `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            if (text) {
                success = true;
                content = text;
                break; // Exit loop on success
            }
        } catch (error: any) {
            console.error(`Error with model ${modelName}:`, error.message);
            lastError = error.message;
            // Continue to the next model in the fallback list
        }
    }

    if (success) {
        return {
            success: true,
            content: content,
        };
    } else {
        return {
            success: false,
            error: lastError || "Failed to generate study notes with any available model.",
        };
    }
}

export async function saveNote(title: string, content: string, videoUrl: string, mode: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: "You must be logged in to save notes." };
    }

    try {
        const note = await prisma.note.create({
            data: {
                title,
                content,
                videoUrl,
                mode,
                userId: session.user.id,
            },
        });

        return { success: true, note };
    } catch (error: any) {
        console.error("Save note error:", error);
        return { success: false, error: error.message || "Failed to save note." };
    }
}

export async function getSavedNotes() {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: "You must be logged in to view notes." };
    }

    try {
        const notes = await prisma.note.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
        });

        return { success: true, notes };
    } catch (error: any) {
        console.error("Get notes error:", error);
        return { success: false, error: error.message || "Failed to fetch notes." };
    }
}

export async function deleteNote(id: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized." };
    }

    try {
        await prisma.note.delete({
            where: { id, userId: session.user.id },
        });

        return { success: true };
    } catch (error: any) {
        console.error("Delete note error:", error);
        return { success: false, error: error.message || "Failed to delete note." };
    }
}
