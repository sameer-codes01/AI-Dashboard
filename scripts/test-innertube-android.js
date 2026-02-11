
const { Innertube, UniversalCache } = require('youtubei.js');

async function testInnertubeAndroid(videoId) {
    console.log(`Testing Innertube Android for ${videoId}...`);
    try {
        const youtube = await Innertube.create({
            cache: new UniversalCache(false),
            generate_session_locally: true
        });

        console.log("Innertube created.");

        const info = await youtube.getInfo(videoId, 'ANDROID');
        console.log(`Title: ${info.basic_info.title}`);

        try {
            const transcriptData = await info.getTranscript();
            if (transcriptData?.transcript?.content?.body?.initial_segments) {
                const segments = transcriptData.transcript.content.body.initial_segments;
                console.log(`Success! Found ${segments.length} segments.`);
                console.log(`First segment: ${segments[0].snippet.text}`);
            } else {
                console.log('No transcript segments found.');
            }
        } catch (tErr) {
            console.error('getTranscript error:', tErr.message);
        }

    } catch (error) {
        console.error('Innertube Error:', error.message);
    }
}

testInnertubeAndroid('jNQXAC9IVRw'); 
