const fs = require('fs');
const path = require('path');
// Function to read the consent message from the text file
function readConsentMessage() {
    let filePath = null
    try {
        filePath = path.join(__dirname, "/../..", process.env.CONSENT_FILE_PATH);

        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.error('Error reading consent message:', error);
        console.error("Please Fix file path before starting up Application as Consent File is Required.\n"
        + "Application exiting...")
        process.exit(1);
        return null;
    }
}

// Usage example
const consentMessage = readConsentMessage();
module.exports = consentMessage;