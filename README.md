<h1 align="center">ytdl-mp3</h1>

## About

Given only the URL, this simple command line utility allows you to download music from YouTube, complete with metadata and cover art. The tags associated with a music video (e.g., title, artist, album) are automatically extracted using the ytdl-core library. However, these can also be specified manually as command-line arguments by users (e.g., if the data provided by YouTube are inaccurate or unavailable). Based on these parameters, the program fetches the associated cover art from iTunes and applies the appropriate tags to the file.

## Installation

    npm install ytdl-mp3

## Usage

    Usage: ytdl-mp3 [options] <url>

    A command line tool for downloading YouTube videos, converting them to mp3 format, then automatically retrieving and applying ID3 tags and cover art.

    Arguments:
    url             url of video to download

    Options:
    -V, --version   output the version number
    --title <tag>   title tag
    --artist <tag>  artist tag
    --album <tag>   album tag
    -h, --help      display help for command