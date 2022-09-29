# ytdl-mp3

A NodeJS package and command-line tool for downloading music from YouTube, including automatic retrieval of ID3 tags and album art via iTunes. 

## Installation

    npm install ytdl-mp3

## Usage

### Command-Line

The easiest way to use ytdl-mp3 is through the command-line interface. Users must enter the URL of the YouTube video they wish to download. The title of the music video is then used to automatically retrieve ID3 tags (e.g., title, artist) and the associated cover art from iTunes. There is no need for the title of the YouTube video to follow a specific naming convention.

    Usage: ytdl-mp3 [options] <url>

    A NodeJS package and command-line tool for downloading music from YouTube, including automatic retrieval of ID3 tags and album art via iTunes. 

    Arguments:
    url                     url of video to download

    Options:
    -V, --version           output the version number
    -o --output-dir <path>  path to output directory (default: "/Users/joshua/Downloads")
    -n --no-get-tags        skip extracting/applying id3 tags
    -v --verify-tags        verify id3 tags fetched from itunes
    -h, --help              display help for command

### CommonJS

You can also use ytdl-mp3 as a CommonJS module. For example, to achieve the same functionality as the default command line options:

    const { downloadSong } = require('ytdl-mp3');

    downloadSong('https://www.youtube.com/watch?v=dQw4w9WgXcQ', {
        getTags: true
    })