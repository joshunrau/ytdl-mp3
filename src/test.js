const fs = require('fs');
const path = require('path');
const Song = require("./song");
const ytdl = require('ytdl-core');

const videoURL = "https://www.youtube.com/watch?v=b6jK2t3lcRs";

let userOptions = {
    "output": path.join(process.env.HOME || process.env.USERPROFILE, 'Downloads'),
    "title": "Kontekst",
    "artist": "Buddha",
    "album": "Kontekst Beats Collection 1"
};

test("main", async () => {

    let videoInfo = await ytdl.getInfo(videoURL, {quality: 'highestaudio'});
    let song = new Song(videoInfo, userOptions);
    
    song.removeAllFiles();
    expect(fs.existsSync(song.filePaths.audioFile)).toBe(false);

    await song.downloadVideo();
    song.convertVideoToAudio();
    await song.findAlbumArt();
    song.applyTags();

    expect(fs.existsSync(song.filePaths.audioFile)).toBe(true);
    song.removeAllFiles();
    
});