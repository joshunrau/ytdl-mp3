const readline = require("readline");
const path = require('path');

function getDownloadsDirectory() {
    return path.join(process.env.HOME || process.env.USERPROFILE, 'Downloads');
}

function userInput(prompt) {

    if (!typeof(prompt) === 'string') {
        throw new TypeError
    }

    const readlineInterface = readline.createInterface({
        input: process.stdin, 
        output: process.stdout
    });

    return new Promise((resolve, reject) => {
        readlineInterface.question(prompt, (response) => {
            readlineInterface.close()
            resolve(response);
        });
    });
};

function formatSongTitle(title) {
    return title.replace(/[^a-z0-9]/gi, '_').split("_").filter(element => element).join("_").toLowerCase();
};

module.exports = { getDownloadsDirectory, userInput, formatSongTitle };