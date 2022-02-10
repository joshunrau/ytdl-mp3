const { info } = require('console');
const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const stream = require('stream');
const ytdl = require('ytdl-core');

// Set filepaths
const downloadsDirectory = path.join(process.env.HOME || process.env.USERPROFILE, 'Downloads');
const videoFile = path.join(downloadsDirectory, "video.mp4");
const audioFile = path.join(downloadsDirectory, "audio.mp3");
console.log("Registered downloads directory: " + downloadsDirectory);

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
          }
    });
    // mainWindow.webContents.openDevTools();
    mainWindow.loadFile('index.html');
};

app.whenReady().then(() => {
    createWindow();
});

ipcMain.on("download-triggered", (_event, url) => {
    console.log("Revieved URL: " + url);
    let videoInfo = downloadVideo(url, videoFile);
    videoInfo.then(() => {
        console.log("Done!");
    })
});

// Download video and return info from YouTube
async function downloadVideo(url, outputFile) {
    let videoInfo = await ytdl.getInfo(url);
    try {
        fs.accessSync(outputFile, fs.constants.F_OK);
        console.log("File Exists!");
        return info;
    } catch (error) {
        console.log("File Does Not Exist");
    };
    let streamOptions = {autoClose: true, flags: 'w'};
    let writeStream = fs.createWriteStream(outputFile, streamOptions);
    console.log("Attempting download of " + videoInfo.videoDetails.title)
    let readStream = ytdl.downloadFromInfo(videoInfo, {
        quality: 'highestaudio'
    });
    await stream.promises.pipeline(readStream, writeStream)
};

/*

const cp = require("child_process");
const ffmpeg = require('ffmpeg-static');
const fs = require('fs');
const id3 = require('node-id3');




// Download video and return info from YouTube
async function downloadVideo(url, outputFile) {
    let info = await ytdl.getInfo(url);
    let streamOptions = {
        autoClose: true,
        flags: 'w'
    };
    try {
        fs.accessSync(outputFile, fs.constants.F_OK)
    } catch (error) {
        return info
    }
    let writeStream = fs.createWriteStream(outputFile, streamOptions);
    let readStream = ytdl.downloadFromInfo(info, {
        quality: 'highestaudio'
    });
    return (async () => {
        await stream.promises.pipeline(readStream, writeStream);
        return info
    })()
};

// Convert mp4 video file into mp3 using ffmpeg
function convertVideoToAudio(inputFile, outputFile) {
    let cmd = `${ffmpeg} -loglevel 24 -i ${inputFile} ${outputFile}`;
    try {
        fs.accessSync(outputFile, fs.constants.F_OK)
    } catch (error) {
        return
    }
    cp.execSync(cmd, (error, stdout, stderr) => {
        if (error) console.log(`error: ${error.message}`);
        else if (stderr || stdout) console.log(`File conversion successful!`);
    });
    // fs.rmSync(inputFile);
};

function clearMetaData(audioFile) {
    id3.removeTags(audioFile, (err) => {
        if (err) {
            throw new Error("Metadata removal unsuccessful!")
        } else {
            console.log("Metadata removal successful!")
        }
    });
}

function addMetaData(info) {
    let title = info.videoDetails.title;
    console.log(title);
}

async function main() {
    let videoInfo = await downloadVideo(url, videoFile);
    // console.log(Object.keys(videoInfo))
    // convertVideoToAudio(videoFile, audioFile);
    // clearMetaData(audioFile);
}

main();

*/