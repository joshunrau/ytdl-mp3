# ytdl-mp3

## About

Given only the URL, this simple command line utility allows you to download music from YouTube, complete with metadata and cover art. The tags associated with a music video (e.g., title, artist, album) are automatically extracted using the ytdl-core library. If these tags are unavailable, then the user will be prompted to manually enter them. Based on these parameters, the program fetches the associated cover art from iTunes and applies the appropriate tags to the file.

## Installation

    npm install -g ytdl-mp3

## Usage

    Usage: ytdl-mp3 [options] <url>

    A command line tool for downloading YouTube videos, converting them to mp3 format, then automatically retrieving and applying ID3 tags and cover art.

    Arguments:
    url              url of video to download

    Options:
    -V, --version    output the version number
    --output <path>  output directory
    -h, --help       display help for command
