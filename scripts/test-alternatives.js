
const ytdl = require('ytdl-core');
const { Innertube, UniversalCache } = require('youtubei.js');

async function testYtdl(videoUrl) {
    console.log(`\n[ytdl-core] Testing: ${videoUrl}`);
    try {
        const info = await ytdl.getInfo(videoUrl);
        const tracks = info.player_response.captions?.playerCaptionsTracklistRenderer?.captionTracks;
        if (tracks && tracks.length) {
            console.log('[ytdl-core] Success! Found captions:', tracks.length);
        } else {
            console.log('[ytdl-core] No captions found (check player_response.captions)');
        }
    } catch (error) {
        console.error('[ytdl-core] Error:', error.message);
    }
}

async function testYoutubei(videoUrl) {
    console.log(`\n[youtubei.js] Testing: ${videoUrl}`);
    try {
        const youtube = await Innertube.create({ cache: new UniversalCache(false) });
        const videoId = videoUrl.split('v=')[1];
        console.log(`[youtubei.js] Video ID: ${videoId}`);

        try {
            const info = await youtube.getInfo(videoId);
            console.log('[youtubei.js] getInfo success. Title:', info.basic_info.title);

            try {
                const transcriptData = await info.getTranscript();
                // console.log('Transcript Data Keys:', Object.keys(transcriptData));
                if (transcriptData && transcriptData.transcript) {
                    console.log('[youtubei.js] Transcript found!');
                } else {
                    console.log('[youtubei.js] Transcript structure check failed.');
                }
            } catch (tErr) {
                console.error('[youtubei.js] getTranscript error:', tErr.message);
            }

        } catch (infoErr) {
            console.error('[youtubei.js] getInfo error:', infoErr.message);
        }

    } catch (error) {
        console.error('[youtubei.js] Critical error:', error.message);
    }
}

const testUrls = [
    "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    "https://www.youtube.com/watch?v=gQjS58q5m0g",
];

(async () => {
    for (const url of testUrls) {
        await testYtdl(url);
        await testYoutubei(url);
    }
})();
