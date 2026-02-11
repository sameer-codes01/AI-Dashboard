
const ytdl = require('@distube/ytdl-core');

async function testDistube(videoUrl) {
    console.log(`Testing with @distube/ytdl-core: ${videoUrl}`);
    try {
        const info = await ytdl.getInfo(videoUrl, {
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept-Language': 'en-US,en;q=0.9',
                }
            }
        });
        const tracks = info.player_response.captions?.playerCaptionsTracklistRenderer?.captionTracks;
        if (tracks && tracks.length) {
            console.log('Success! Found captions:', tracks.length);
            console.log('First track url:', tracks[0].baseUrl);

            // Try fetching content
            const response = await fetch(tracks[0].baseUrl);
            const text = await response.text();
            console.log('Caption content length:', text.length);
            console.log('First 100 chars:', text.substring(0, 100));
        } else {
            console.log('No captions found.');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testDistube('https://www.youtube.com/watch?v=jNQXAC9IVRw'); // Me at the zoo
testDistube('https://www.youtube.com/watch?v=gQjS58q5m0g');
