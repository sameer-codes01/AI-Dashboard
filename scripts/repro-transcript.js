
const { YoutubeTranscript } = require('youtube-transcript');
const { YoutubeTranscript: YoutubeTranscriptPlus } = require('youtube-transcript-plus');

async function testTranscript(videoUrl) {
    console.log(`Testing URL: ${videoUrl}`);
    try {
        console.log("Attempting YoutubeTranscript...");
        const items = await YoutubeTranscript.fetchTranscript(videoUrl);
        console.log("YoutubeTranscript Success!");
        console.log("Length:", items.length);
        return;
    } catch (e) {
        console.error("YoutubeTranscript failed:", e.message);
    }

    try {
        console.log("Attempting YoutubeTranscriptPlus...");
        const items = await YoutubeTranscriptPlus.fetchTranscript(videoUrl);
        console.log("YoutubeTranscriptPlus Success!");
        console.log("Length:", items.length);
    } catch (e) {
        console.error("YoutubeTranscriptPlus failed:", e.message);
    }
}

// Test with a known working video (e.g. a popular TED talk or something likely to have CC)
// and maybe one that might be tricky.
// Using a standard YouTube video ID that usually has captions.
const testUrls = [
    "https://www.youtube.com/watch?v=jNQXAC9IVRw", // Me at the zoo (might not have auto-generated captions? actually it does have captions usually)
    "https://www.youtube.com/watch?v=gQjS58q5m0g", // A random tech video usually has captions
];

(async () => {
    for (const url of testUrls) {
        await testTranscript(url);
        console.log("-----------------------------------");
    }
})();
