<!-- PROJECT LOGO -->
<div align="center">
  <h3 align="center">ytdl-mp3</h3>
  <p align="center">
    An NPM package to facilitate downloading music from YouTube, including automatic retrieval of ID3 tags and album art via the iTunes public API.
    <br />
    <a href="https://github.com/joshunrau/ytdl-mp3/issues" rel="noreferrer" target="_blank">Report Bug</a>
    ·
    <a href="https://github.com/joshunrau/ytdl-mp3/issues" rel="noreferrer" target="_blank">Request Feature</a>
  </p>
</div>

<!-- PROJECT SHIELDS -->
<div align="center">

![license](https://img.shields.io/github/license/joshunrau/ytdl-mp3)
![version](https://img.shields.io/github/package-json/v/joshunrau/ytdl-mp3)
[![codecov](https://codecov.io/gh/joshunrau/ytdl-mp3/graph/badge.svg?token=T35BBZ7Q42)](https://codecov.io/gh/joshunrau/ytdl-mp3)

</div>
<hr />

## Installation

```shell
npm install -g ytdl-mp3
```

## Usage

### Command-Line

The easiest way to use ytdl-mp3 is through the command-line interface. Users must enter the URL of the YouTube video they wish to download. The title of the music video is then used to automatically retrieve ID3 tags (e.g., title, artist) and the associated cover art from iTunes. There is no need for the title of the YouTube video to follow a specific naming convention.

```
Usage: ytdl-mp3 [options] <url>

A NodeJS package and command-line tool for downloading music from YouTube, including automatic retrieval of ID3 tags and album art via iTunes.

Arguments:
url                     url of video to download

Options:
-V, --version           output the version number
-o --output-dir <path>  path to output directory
-n --no-get-tags        skip extracting/applying id3 tags
-v --verify-tags        verify id3 tags fetched from itunes
-s --silent-mode        skip console output
-h, --help              display help for command
```

### ESM

```javascript
import { Downloader } from 'ytdl-mp3';

const downloader = new Downloader({
  getTags: true
});

await downloader.downloadSong('https://www.youtube.com/watch?v=7jgnv0xCv-k');
```

### CommonJS

```javascript
const { Downloader } = require('ytdl-mp3');

async function main() {
  const downloader = new Downloader({
    getTags: true
  });
  await downloader.downloadSong('https://www.youtube.com/watch?v=7jgnv0xCv-k');
}

main();
```
