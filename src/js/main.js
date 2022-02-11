const { app, BrowserWindow, ipcMain } = require('electron');
const cp = require("child_process");
const ffmpeg = require('ffmpeg-static');
const fs = require('fs');
const id3 = require('node-id3');
const path = require('path');
const stream = require('stream');
const ytdl = require('ytdl-core');

const appPath = app.getAppPath();
console.log("Registered application path: " + appPath);

const downloadsDirectory = path.join(process.env.HOME || process.env.USERPROFILE, 'Downloads');
console.log("Registered downloads directory: " + downloadsDirectory);

let audioFile = path.join(downloadsDirectory, "audio.mp3");
let videoFile = path.join(downloadsDirectory, "video.mp4");

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(appPath, 'src', 'js', 'preload.js')
        }
    });
    mainWindow.loadFile(path.join(appPath, 'src', 'html', 'index.html'));
};

app.whenReady().then(() => {
    createWindow();
});

ipcMain.on("download-triggered", (_event, url) => {
    console.log("Revieved URL: " + url);
    ytdl.getInfo(url, {quality: 'highestaudio'})
    .then(info => {
        videoDetails = info.videoDetails;
        return stream.promises.pipeline(
            ytdl.downloadFromInfo(info),
            fs.createWriteStream(videoFile)
        );
    })
    .then(() => {
        ffmpegCommand = `${ffmpeg} -loglevel 24 -i ${videoFile} ${audioFile}`;
        cp.execSync(ffmpegCommand);
        fs.rmSync(videoFile);
    });
});
