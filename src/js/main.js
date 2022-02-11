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

ipcMain.on("download-triggered", (_event, url, tags) => {
    
    console.log(`url: ${url}, tags: ${Object.entries(tags)}`);

    fileName = tags.title.toLowerCase().replaceAll(" ", "_").replaceAll("'", "")
    const audioFile = path.join(downloadsDirectory, fileName + ".mp3");
    const videoFile = path.join(downloadsDirectory, fileName + ".mp4");
    
    ytdl.getInfo(url, {quality: 'highestaudio'})
        .then(info => {
            videoDetails = info.videoDetails;
            return stream.promises.pipeline(
                ytdl.downloadFromInfo(info),
                fs.createWriteStream(videoFile)
            );
        })
        .then(() => {
            ffmpegCommand = `${ffmpeg} -loglevel 24 -i ${videoFile} -vn -sn -c:a mp3 -ab 192k ${audioFile}`;
            cp.execSync(ffmpegCommand);
            fs.rmSync(videoFile);
        })
        .then(() => {
            id3.write(tags, audioFile, error => {
                console.error(error);
            })
        });
});
