
const { Innertube, UniversalCache } = require('youtubei.js');

async function testInnertubeIOS(videoId) {
    console.log(`Testing Innertube IOS for ${videoId}...`);
    try {
        const youtube = await Innertube.create({
            cache: new UniversalCache(false),
            generate_session_locally: true
        });

        console.log("Innertube created.");

        // Try getting info with IOS client
        const info = await youtube.getInfo(videoId, 'IOS');
        console.log(`Title: ${info.basic_info.title}`);

        try {
            const transcriptData = await info.getTranscript();
            if (transcriptData?.transcript?.content?.body?.initial_segments) {
                const segments = transcriptData.transcript.content.body.initial_segments;
                console.log(`Success! Found ${segments.length} segments.`);
                console.log(`First segment: ${segments[0].snippet.text}`);
            } else {
                console.log('No transcript segments found.');
                // console.log(JSON.stringify(transcriptData, null, 2));
            }
        } catch (tErr) {
            console.error('getTranscript error:', tErr.message);
        }

    } catch (error) {
        console.error('Innertube Error:', error.message);
    }
}

testInnertubeIOS('jNQXAC9IVRw'); 
