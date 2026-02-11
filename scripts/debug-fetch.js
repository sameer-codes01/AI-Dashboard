
const fs = require('fs');

async function testFetch(url) {
    console.log(`Fetching ${url} WITHOUT headers...`);
    try {
        const response = await fetch(url); // No headers
        console.log(`Status: ${response.status}`);
        const text = await response.text();
        console.log(`Body length: ${text.length}`);

        if (text.includes("captions")) {
            console.log("Page contains 'captions' keyword.");
        } else {
            console.log("Page does NOT contain 'captions' keyword.");
        }

    } catch (e) {
        console.error('Fetch failed:', e.message);
    }
}

testFetch('https://www.youtube.com/watch?v=jNQXAC9IVRw');
