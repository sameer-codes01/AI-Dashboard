require('dotenv').config();

console.log("Checking Environment Variables...");

const key = process.env.GEMINI_API_KEY;

if (key) {
    console.log("✅ GEMINI_API_KEY is found.");
    console.log(`Key length: ${key.length}`);
    console.log(`First 4 chars: ${key.substring(0, 4)}`);
    console.log(`Last 4 chars: ${key.substring(key.length - 4)}`);
} else {
    console.error("❌ GEMINI_API_KEY is NOT found or empty.");
}

console.log("\nChecking for potential conflicts:");
console.log("GOOGLE_API_KEY:", process.env.GOOGLE_API_KEY ? "Found" : "Not Found");
