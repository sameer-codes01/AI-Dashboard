
const { Innertube, UniversalCache } = require('youtubei.js');

async function testClient(clientType) {
    console.log(`\n--- Testing Client: ${clientType} ---`);
    try {
        const youtube = await Innertube.create({
            cache: new UniversalCache(false),
            generate_session_locally: true
        });

        const videoId = 'jNQXAC9IVRw'; // Me at the zoo

        console.log(`Getting info for ${videoId}...`);
        const info = await youtube.getInfo(videoId, clientType); // passing client type if supported in getInfo or via create options?
        // Actually, client type matches usually need to be set in create or getInfo options.
        // Checking documentation: Innertube.create({ client_type: ... }) is not exactly how it works. 
        // We usually just use the default.
        // But getInfo doesn't take client type as 2nd arg easily.

        // Let's rely on standard creation first but maybe try to force a different client context if possible.
        // Actually, let's try to just use getTranscript() directly if possible.

        console.log('Title:', info.basic_info.title);
        const transcriptData = await info.getTranscript();
        if (transcriptData?.transcript) {
            console.log('Success! Transcript found.');
        } else {
            console.log('No transcript found.');
        }

    } catch (error) {
        console.error(`Error with ${clientType}:`, error.message);
    }
}

// Innertube by default use WEB.
// We can't easily change client in getInfo in older versions, but let's see.

// Try a different approach: use `ytdl-core` with a specific agent.
// Or just try the standard one again with more logging.

// Let's try to fetch the transcript using the internal API directly if we can.

(async () => {
    await testClient('WEB');
})();
