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

ipcMain.on("download-triggered", (_event, url) => {
    console.log("Revieved URL: " + url);
    let song = new Song(url);
    song.getInfo().then(() =>
        song.downloadVideo()
    ).then(() => {
        song.convertVideoToAudio();
    }).catch(error => {
        console.error("ERROR: " + error.message);
    });
});

/*****************************************************/

function pathExists(myPath) {
    try {
        fs.accessSync(myPath, fs.constants.F_OK);
        return true;
    } catch {
        return false;
    };
};

class Song {

    // change based on info later
    audioFile = path.join(downloadsDirectory, "audio.mp3");
    videoFile = path.join(downloadsDirectory, "video.mp4");

    ffmpegCommand = `${ffmpeg} -loglevel 24 -i ${this.videoFile} ${this.audioFile}`;

    constructor(url) {
        this.url = url;
        // this.title = info.videoDetails.title;
    };

    async getInfo() {
        return ytdl.getInfo(this.url, {
                quality: 'highestaudio'
            })
            .then(info => {
                this.info = info;
            })
            .catch(error => {
                return error;
            });
    };

    async downloadVideo() {

        if (pathExists(this.videoFile)) {
            return new Error("ERROR: Video file already exists!");
        };

        return stream.promises.pipeline(
            ytdl.downloadFromInfo(this.info),
            fs.createWriteStream(this.videoFile)
        );
    };

    // Convert mp4 video file into mp3 using ffmpeg
    convertVideoToAudio() {

        if (pathExists(this.audioFile)) {
            return new Error("ERROR: Audio file already exists!");
        };

        console.log("Verified that audio file does not already exist!");

        cp.execSync(this.ffmpegCommand);
        console.log("File conversion successful!"); // try to implement as callback

        fs.rmSync(this.videoFile);
        console.log("Successfully removed video file!"); // try to implement as callback

    };

    clearMetaData() {
        id3.removeTags(this.audioFile, (error) => {
            if (error) {
                return error;
            } else {
                console.log("Metadata removal successful!")
            };
        });
    };

    addMetaData(info) {
        let title = info.videoDetails.title;
        console.log(title);
    };

};