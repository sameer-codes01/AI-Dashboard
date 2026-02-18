const { GoogleGenerativeAI } = require("@google/generative-ai");
const Groq = require("groq-sdk");
require("dotenv").config({ path: ".env" });

async function testGemini() {
    console.log("Testing Gemini Embedding...");
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "models/gemini-embedding-001" });
        const result = await model.embedContent("Hello world");
        console.log("Gemini Embedding Success! Vector length:", result.embedding.values.length);
    } catch (error) {
        console.error("Gemini Embedding Failed:", error.message);
    }
}

async function testGroq() {
    console.log("\nTesting Groq Chat...");
    try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: "Hello" }],
            model: "llama-3.3-70b-versatile",
        });
        console.log("Groq Chat Success! Response:", completion.choices[0]?.message?.content);
    } catch (error) {
        console.error("Groq Chat Failed:", error.message);
    }
}

(async () => {
    await testGemini();
    await testGroq();
})();
