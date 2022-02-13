#!/usr/bin/env node

const { program } = require('commander');
const path = require('path');
const pkg = require('../package.json');
const Song = require("./song");
const ytdl = require('ytdl-core');

program.name(pkg.name);
program.description(pkg.description);
program.version(pkg.version);
program.allowExcessArguments(false);
program.argument("<url>", "url of video to download");
program.option("--output <path>", "output directory", path.join(process.env.HOME || process.env.USERPROFILE, 'Downloads'));
program.option("--title <tag>", "title tag");
program.option("--artist <tag>", "artist tag");
program.option("--album <tag>", "album tag");
program.parse();

const main = async () => {
    song = await ytdl.getInfo(program.args[0], {quality: 'highestaudio'})
        .then(info => new Song(info, program.opts()))
        .then(song => song.downloadVideo())
        .then(song => song.convertVideoToAudio())
        .then(song => song.findAlbumArt())
        .then(song => song.applyTags())
};

main()