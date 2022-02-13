#!/usr/bin/env node

const Song = require("./song");
const ytdl = require('ytdl-core');

const sampleURL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

const main = async () => {
    song = await ytdl.getInfo(sampleURL, {quality: 'highestaudio'})
        .then(info => new Song(info))
        .then(song => song.downloadVideo())
        .then(song => song.convertVideoToAudio())
        .then(song => song.findAlbumArt())
        .then(song => song.applyTags())
};

main()