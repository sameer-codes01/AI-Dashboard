const { YoutubeTranscript } = require('youtube-transcript-plus');

async function testTranscriptPlus() {
    const videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    console.log(`Testing youtube-transcript-plus for: ${videoUrl}`);

    try {
        const transcript = await YoutubeTranscript.fetchTranscript(videoUrl);
        console.log(`✅ Success! Found ${transcript.length} segments.`);
        console.log(`Preview: ${transcript[0].text}`);
    } catch (error) {
        console.error('❌ Error fetching transcript:', error);
    }
}

testTranscriptPlus();
