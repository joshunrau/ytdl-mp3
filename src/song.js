const axios = require("axios");
const cp = require("child_process");
const ffmpeg = require('ffmpeg-static');
const fs = require('fs');
const id3 = require('node-id3');
const path = require('path');
const ytdl = require('ytdl-core');

const downloadsDirectory = path.join(process.env.HOME || process.env.USERPROFILE, 'Downloads');

module.exports = class Song {

    constructor(videoInfo) {

        this.videoInfo = videoInfo;
        this.songTags = {
            "title": videoInfo.videoDetails.media.song,
            "artist": videoInfo.videoDetails.media.artist,
        };

        Object.entries(this.songTags).forEach(([key, value]) => {
            if (value === undefined) {
                throw new ReferenceError(`Value for '${key}' is not defined`)
            };
        });

        if (videoInfo.videoDetails.media.album) {
            this.songTags.album = videoInfo.videoDetails.media.album;
        } else {
            this.songTags.album = videoInfo.videoDetails.media.song;
        };

        let baseFileName = this.songTags.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        this.filePaths = {
            "audioFile": path.join(downloadsDirectory, baseFileName + ".mp3"),
            "videoFile": path.join(downloadsDirectory, baseFileName + ".mp4")
        };
    };

    async downloadVideo() {

        let stream = ytdl.downloadFromInfo(this.videoInfo)
            .pipe(fs.createWriteStream(this.filePaths.videoFile));

        return new Promise((resolve, reject) => {
            stream.on("finish", () => resolve(this));
            stream.on("error", reject);
        });
    };

    convertVideoToAudio() {
        cp.execSync(`${ffmpeg} -loglevel 24 -i ${this.filePaths.videoFile} -vn -sn -c:a mp3 -ab 192k ${this.filePaths.audioFile}`);
        fs.rmSync(this.filePaths.videoFile);
        return this;
    };

    async findAlbumArt() {

        let url = new URL("https://itunes.apple.com/search?country=US&media=music");
        url.searchParams.set("term", this.songTags.title);

        let infoResponse = await axios.get(url.href)
        
        if (infoResponse.status !== 200) {
            throw new Error(`Call to iTunes API returned status code ${infoResponse.status}`);
        };

        if (infoResponse.data.resultCount === 0) {
            throw new Error("Call to iTunes API did not return any results");
        };

        let n = 1;
        for (let result of infoResponse.data.results) {
            if (result.artworkUrl100 !== undefined) {
                let artworkUrl600 = result.artworkUrl100.replace("100x100bb.jpg", "600x600bb.jpg");
                let artworkFilepath = path.join(downloadsDirectory, "album_art.jpg");
                let fileStream = fs.createWriteStream(artworkFilepath)
                return axios.get(artworkUrl600, {responseType: 'stream'})
                    .then(artworkResponse => {
                        return new Promise((resolve, reject) => {
                            artworkResponse.data.pipe(fileStream);
                            let error = null;
                            fileStream.on('error', err => {
                                error = err;
                                fileStream.close();
                                reject(err);
                            });
                            fileStream.on('close', () => {
                                if (!error) {
                                    this.songTags.image = {
                                        "mime": "image/png",
                                        "type": {
                                            "id": 3,
                                            "name": "front cover"
                                        },
                                        "description": "Album Art",
                                        "imageBuffer": fs.readFileSync(artworkFilepath)
                                    };
                                    fs.rmSync(artworkFilepath);
                                    resolve(this);
                                };
                            });
                        });
                    });
            } else {
                process.emitWarning(`Could not find album art from result ${n} of iTunes API response`);
                n += 1;
            };
        };
        throw new Error("Could not find album art for any results from iTunes API response");
    };

    applyTags() {
        id3.write(this.songTags, this.filePaths.audioFile);
        return this;
    };

};