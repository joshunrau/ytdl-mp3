# Changelog

## [4.0.0](https://github.com/joshunrau/ytdl-mp3/compare/v3.4.1...v4.0.0) (2024-06-19)


### ⚠ BREAKING CHANGES

* set minimum node version to 20

### Bug Fixes

* handle nested brackets in removeParenthesizedText ([6d3871b](https://github.com/joshunrau/ytdl-mp3/commit/6d3871bf278e1f3dc6bcf1e60fea92ae9d18108b))


### Miscellaneous Chores

* set minimum node version to 20 ([9e0996a](https://github.com/joshunrau/ytdl-mp3/commit/9e0996a41a5cb6c6bad953b5eb142bab9af446e6))

## [3.4.1] - 2023-09-14

### Changed
- Updated dependencies

## [3.1.0] - 2023-05-18

### Added 
- Log search term to stdout
- Throw if output file exists
- Add custom `YtdlMp3Error` exception
- Catch `YtdlMp3Error` with nice formatting for cli users

## [3.0.1] - 2023-05-13

### Changed
- Updated dependencies

### Removed
- Unused, broken test from v2

## [3.0.0] - 2023-04-09

Major refactoring of the entire codebase. Breaking change for library use, but not for CLI.

### Added
- ESM Support
- Downloader
- FormatConverter
- SongTagsSearch

### Removed
- convertVideoToAudio
- downloadSong
- downloadVideo
- extractSongTags
- fetchAlbumArt
- fetchSearchResults
- getFilepaths
- verifySearchResult
