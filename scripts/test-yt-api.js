
const TranscriptClient = require('youtube-transcript-api');

async function testTranscript(videoId) {
    console.log(`Testing youtube-transcript-api for ${videoId}...`);
    try {
        const client = new TranscriptClient();
        await client.ready;
        const transcript = await client.getTranscript(videoId);
        console.log(`Success! Found transcript.`);
        console.log(`Snippet: ${JSON.stringify(transcript).substring(0, 100)}`);
    } catch (error) {
        console.error('Error:', error);
    }
}

testTranscript('jNQXAC9IVRw'); 
