const axios = require("axios");
const cp = require("child_process");
const ffmpeg = require('ffmpeg-static');
const fs = require('fs');
const id3 = require('node-id3');
const path = require('path');
const ytdl = require('ytdl-core');

const utils = require("./utils");


module.exports = async function main(videoURL, options = {"output": utils.getDownloadsDirectory()}) {

    let outputDirectory = options.output

    // get video info using ytdl-core function
    let videoInfo;
    try {
        videoInfo = await ytdl.getInfo(videoURL, {quality: 'highestaudio'});
    } catch(error) {
        throw new Error(`An unexpected exception occurred during call to ytdl-core function "getInfo"\n\n${error.stack}`)
    };

    // attempt to extract song tags from ytdl info and ask user to input missing tags
    songTags = {
        'title': videoInfo.videoDetails.media.song,
        'artist': videoInfo.videoDetails.media.artist,
        'album': videoInfo.videoDetails.media.album
    }

    if (Object.values(songTags).includes(undefined)) {
        console.log("Unable to extract all song tags from YouTube");
    };

    for (const tag in songTags) {
        if (songTags[tag] === undefined) {
            songTags[tag] = await utils.userInput(`Enter ${tag}: `);
        };
    };

    // generate filenames based on song tags
    let baseFileName = utils.formatSongTitle(songTags.title);
    let filePaths = {
        "audioFile": path.join(outputDirectory, baseFileName + ".mp3"),
        "videoFile": path.join(outputDirectory, baseFileName + ".mp4")
    };

    // remove old files of the same names
    for (let file of Object.values(filePaths)) {
        if (fs.existsSync(file)) {
            fs.rmSync(file);
        };
    };

    // download video
    let stream = ytdl.downloadFromInfo(videoInfo)
        .pipe(fs.createWriteStream(filePaths.videoFile));
    
    await new Promise((resolve, reject) => {
        stream.on("finish", resolve);
        stream.on("error", (err) => {
            reject(err)
        });
    });

    // convert video to audio
    cp.execSync(`${ffmpeg} -loglevel 24 -i ${filePaths.videoFile} -vn -sn -c:a mp3 -ab 192k ${filePaths.audioFile}`);
    fs.rmSync(filePaths.videoFile);

    // fetch album art from iTunes
    let iTunesURL = new URL("https://itunes.apple.com/search?country=US&media=music");
    iTunesURL.searchParams.set("term", `$${songTags.artist} ${songTags.album}`);

    // verify server response
    let infoResponse = await axios.get(iTunesURL.href)
    if (infoResponse.status !== 200) {
        throw new Error(`Call to iTunes API returned status code ${infoResponse.status}`);
    } else if (infoResponse.data.resultCount === 0) {
        throw new Error("Call to iTunes API did not return any results");
    };

    let artworkFilepath = path.join(outputDirectory, "album_art.jpg");

    // find the first result with 600 x 600 resolution
    songTags.image = await new Promise(async (resolve, reject) => {
        let count = 1;
        for (let result of infoResponse.data.results) {
            if (result.artworkUrl100 !== undefined) {
                let artworkUrl600 = result.artworkUrl100.replace("100x100bb.jpg", "600x600bb.jpg");
                let fileStream = fs.createWriteStream(artworkFilepath);
                await axios.get(artworkUrl600, {responseType: 'stream'})
                    .then(response => {
                        response.data.pipe(fileStream);
                        fileStream.on('close', () => {
                            resolve({
                                "mime": "image/png",
                                "type": {
                                    "id": 3,
                                    "name": "front cover"
                                },
                                "description": "Album Art",
                                "imageBuffer": fs.readFileSync(artworkFilepath)
                            });
                        });
                    }).catch(error => reject(error));
                break;
            } else {
                process.emitWarning(`Could not find album art from result ${n} of iTunes API response`);
                count += 1;
            };
        };
    });

    fs.rmSync(artworkFilepath);
    id3.write(songTags, filePaths.audioFile);
    return filePaths.audioFile;

};

