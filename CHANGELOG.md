# Changelog

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