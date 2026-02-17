
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env' });

async function listModels() {
    console.log("Checking API Key availability...");
    if (!process.env.GEMINI_API_KEY) {
        console.error("No GEMINI_API_KEY found in .env");
        return;
    }

    // Direct REST API call to list models, as SDK method might differ or be obscure.
    // GET https://generativelanguage.googleapis.com/v1beta/models?key=API_KEY
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;

    try {
        console.log("Fetching models from Google AI API...");
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("API Error:", data.error);
            return;
        }

        if (data.models) {
            console.log("\nAvailable Models:");
            console.log("-----------------");
            data.models.forEach(m => {
                if (m.name.includes('embedding') || m.supportedGenerationMethods?.includes('embedContent')) {
                    console.log(`✅ ${m.name}`);
                    console.log(`   Description: ${m.description}`);
                    console.log(`   Methods: ${m.supportedGenerationMethods.join(', ')}`);
                    console.log("-----------------");
                } else {
                    // console.log(`   ${m.name}`); // Start with just listing embeddings
                }
            });
            console.log("\n(Filtered to show only embedding-capable models)");
        } else {
            console.log("No models returned. Raw data:", data);
        }

    } catch (error) {
        console.error("Request failed:", error);
    }
}

listModels();
