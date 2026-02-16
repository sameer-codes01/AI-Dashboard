const fs = require('fs');
const pdf = require('pdf-parse');

async function testPdf() {
    // Check if we have a dummy pdf or just use a placeholder
    const filePath = 'd:/TASK 4/test-sample.pdf';

    // Create a dummy pdf if it doesn't exist for testing (not easy with just fs)
    // So we'll just check if the module loads and has the function
    if (typeof pdf === 'function') {
        console.log('✅ pdf-parse module loaded successfully');
    } else {
        console.log('❌ pdf-parse module failed to load');
    }
}

testPdf();
