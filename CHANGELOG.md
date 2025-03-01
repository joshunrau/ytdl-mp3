# Changelog

## [5.2.2](https://github.com/joshunrau/ytdl-mp3/compare/v5.2.1...v5.2.2) (2025-03-01)

### Bug Fixes

* update dependencies ([a25cb58](https://github.com/joshunrau/ytdl-mp3/commit/a25cb58aef3d1d9825d528aedbcd5a837bf26415))

## [5.2.1](https://github.com/joshunrau/ytdl-mp3/compare/v5.2.0...v5.2.1) (2025-02-07)


### Bug Fixes

* useless logs ([65df057](https://github.com/joshunrau/ytdl-mp3/commit/65df057cbe14aa6661aad15f41ee018fd4f30309))

## [5.2.0](https://github.com/joshunrau/ytdl-mp3/compare/v5.1.0...v5.2.0) (2024-12-19)


### Features

* included year and track number, added support for custom itunes search strings ([6fc57d0](https://github.com/joshunrau/ytdl-mp3/commit/6fc57d02cdff6af67920a6750eb8fa24d55aa66b))


### Bug Fixes

* removed unused import ([e45dd80](https://github.com/joshunrau/ytdl-mp3/commit/e45dd80857a556508e019fdcc6ed97d08aa94599))

## [5.1.0](https://github.com/joshunrau/ytdl-mp3/compare/v5.0.0...v5.1.0) (2024-12-16)


### Features

* included genre and album ([b19a51c](https://github.com/joshunrau/ytdl-mp3/commit/b19a51c838893b83395eaf6529157be1df28ee7f))

## [5.0.0](https://github.com/joshunrau/ytdl-mp3/compare/v4.0.2...v5.0.0) (2024-08-25)


### ⚠ BREAKING CHANGES

* the main export has been removed since the version was incorrect

### Code Refactoring

* move main into bin ([fa6144c](https://github.com/joshunrau/ytdl-mp3/commit/fa6144c625f6e8d28f4e493fc55708000e5fb79c))

## [4.0.2](https://github.com/joshunrau/ytdl-mp3/compare/v4.0.1...v4.0.2) (2024-08-25)


### Bug Fixes

* issue where 403 error occurs ([a515cfe](https://github.com/joshunrau/ytdl-mp3/commit/a515cfe3af7f75271fdd5347f5481c9be367ae03))

## [4.0.1](https://github.com/joshunrau/ytdl-mp3/compare/v4.0.0...v4.0.1) (2024-07-29)


### Bug Fixes

* issue where cli side effect prevents import as cjs module ([85d9952](https://github.com/joshunrau/ytdl-mp3/commit/85d99525761a082cc7ba4487688d33cdacd8f853))

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
