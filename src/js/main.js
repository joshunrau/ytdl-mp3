const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const appPath = app.getAppPath();
console.log("Registered application path: " + appPath);

const Song = require(path.join(appPath, 'src', 'js', 'song.js'));

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
