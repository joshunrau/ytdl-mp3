import os from 'os';
import path from 'path';

import NodeID3 from 'node-id3';
import ytdl from 'ytdl-core';
import type { videoInfo as VideoInfo } from 'ytdl-core';

import { extractSongTags } from './extractSongTags';
import { FormatConverter } from './FormatConverter';
import { isDirectory, removeParenthesizedText } from './utils';

export interface DownloaderOptions {
  outputDir?: string;
  getTags?: boolean;
  verbose?: boolean;
  verifyTags?: boolean;
}

export class Downloader {
  static defaultDownloadsDir = path.join(os.homedir(), 'Downloads');

  formatConverter: FormatConverter;
  outputDir: string;
  getTags: boolean;
  verifyTags: boolean;

  constructor({ outputDir, getTags, verifyTags }: DownloaderOptions) {
    this.formatConverter = new FormatConverter();
    this.outputDir = outputDir ?? Downloader.defaultDownloadsDir;
    this.getTags = Boolean(getTags);
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

    const outputFile = this.getOutputFile(videoInfo.videoDetails.title);
    const videoData = await this.downloadVideo(videoInfo);

    this.formatConverter.videoToAudio(videoData, outputFile);

    if (this.getTags) {
      const songTags = await extractSongTags(videoInfo, this.verifyTags);
      NodeID3.write(songTags, outputFile);
    }

    console.log(`Done! Output file: ${outputFile}`);
    return outputFile;
  }

  /** Returns the content from the video as a buffer */
  async downloadVideo(videoInfo: VideoInfo): Promise<Buffer> {
    const buffers: Buffer[] = [];
    const stream = ytdl.downloadFromInfo(videoInfo, { quality: 'highestaudio' }); // .pipe(fs.createWriteStream(outputFile));
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk: Buffer) => {
        buffers.push(chunk);
      });
      stream.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
      stream.on('error', (err) => {
        reject(err);
      });
    });
  }

  /** Returns the absolute path to the audio file to be downloaded */
  private getOutputFile(videoTitle: string): string {
    const baseFileName = removeParenthesizedText(videoTitle)
      .replace(/[^a-z0-9]/gi, '_')
      .split('_')
      .filter((element) => element)
      .join('_')
      .toLowerCase();
    return path.join(this.outputDir, baseFileName + '.mp3');
  }
}
