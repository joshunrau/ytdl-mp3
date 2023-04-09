import fs from 'fs';
import os from 'os';
import path from 'path';

import NodeID3 from 'node-id3';
import ytdl from 'ytdl-core';
import type { videoInfo as VideoInfo } from 'ytdl-core';

import { convertVideoToAudio } from './convertVideoToAudio';
import { extractSongTags } from './extractSongTags';
import { getFilepaths } from './getFilepaths';
import { isDirectory } from './utils';

export interface DownloaderOptions {
  outputDir?: string;
  getTags?: boolean;
  verbose?: boolean;
  verifyTags?: boolean;
}

export class Downloader {
  static defaultDownloadsDir = path.join(os.homedir(), 'Downloads');

  outputDir: string;
  getTags: boolean;
  verbose: boolean;
  verifyTags: boolean;

  constructor({ outputDir, getTags, verbose, verifyTags }: DownloaderOptions) {
    this.outputDir = outputDir ?? Downloader.defaultDownloadsDir;
    this.getTags = Boolean(getTags);
    this.verbose = Boolean(verbose);
    this.verifyTags = Boolean(verifyTags);
  }

  async downloadSong(url: string) {
    if (!isDirectory(this.outputDir)) {
      throw new Error(`Not a directory: ${this.outputDir}`);
    }
    const videoInfo = await ytdl.getInfo(url).catch((error) => {
      throw new Error(`Failed to fetch info for video with URL: ${url}`, {
        cause: error,
      });
    });

    const filepaths = getFilepaths(videoInfo.videoDetails.title, this.outputDir);
    await this.downloadVideo(videoInfo, filepaths.videoFile);
    convertVideoToAudio(filepaths.videoFile, filepaths.audioFile);

    if (this.getTags) {
      const songTags = await extractSongTags(videoInfo, this.verifyTags);
      NodeID3.write(songTags, filepaths.audioFile);
    }

    console.log(`Done! Output file: ${filepaths.audioFile}`);
    return filepaths.audioFile;
  }

  async downloadVideo(videoInfo: VideoInfo, outputFile: string) {
    const stream = ytdl.downloadFromInfo(videoInfo, { quality: 'highestaudio' }).pipe(fs.createWriteStream(outputFile));
    return new Promise((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', (err) => {
        reject(err);
      });
    });
  }
}
