
// const { XMLParser } = require('fast-xml-parser'); // Removed dependency
// Actually, YouTube usually returns XML for transcripts if you use the base URL, or JSON-like format.
// Let's assume XML if we follow standard scraping.
// However, I'll use a simple regex to find the caption URL.

const fs = require('fs');

async function fetchTranscript(videoId) {
    const logFile = 'custom-transcript-log.txt';
    const logs = [];
    const log = (msg) => {
        console.log(msg);
        logs.push(String(msg));
    };

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    log(`\nFetching ${videoUrl}...`);

    try {
        const response = await fetch(videoUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        });
        const html = await response.text();
        log(`Page Status: ${response.status}`);

        // Find captionTracks
        let match = html.match(/"captionTracks":(\[.*?\])/);
        if (!match) {
            log("Could not find captionTracks in HTML directly. Checking player_response...");
            const playerResponseMatch = html.match(/ytInitialPlayerResponse\s*=\s*({.+?});/);
            if (playerResponseMatch) {
                const playerResponse = JSON.parse(playerResponseMatch[1]);
                const tracks = playerResponse.captions?.playerCaptionsTracklistRenderer?.captionTracks;
                if (tracks) {
                    log("Found captionTracks in ytInitialPlayerResponse.");
                    match = [null, JSON.stringify(tracks)];
                } else {
                    log("ytInitialPlayerResponse found but no captions.");
                }
            } else {
                log("Could not find ytInitialPlayerResponse.");
            }
        }

        if (!match) {
            log("No captions found.");
            fs.writeFileSync(logFile, logs.join('\n'));
            return;
        }

        const tracks = JSON.parse(match[1]);
        log(`Found ${tracks.length} tracks.`);

        const enTrack = tracks.find(t => t.languageCode === 'en') || tracks[0];
        log(`Selected track: ${enTrack.name.simpleText} (${enTrack.languageCode})`);

        let transcriptUrl = enTrack.baseUrl;
        log(`Fetching transcript from: ${transcriptUrl}`);

        const transcriptResponse = await fetch(transcriptUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': videoUrl,
            }
        });

        log(`Transcript Response Status: ${transcriptResponse.status}`);
        log('Content-Type: ' + transcriptResponse.headers.get('content-type'));
        log('Content-Length: ' + transcriptResponse.headers.get('content-length'));

        const text = await transcriptResponse.text();
        log(`Body Length: ${text.length}`);
        log("--- Body Preview ---");
        log(text.substring(0, 500));

    } catch (e) {
        log(`Error: ${e.message}\n${e.stack}`);
    }

    fs.writeFileSync(logFile, logs.join('\n'));
}

fetchTranscript('jNQXAC9IVRw');

fetchTranscript('jNQXAC9IVRw'); // Me at the zoo (often has captions)
// fetchTranscript('gQjS58q5m0g'); // Another video
