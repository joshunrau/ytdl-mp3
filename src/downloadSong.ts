import path from 'path';

import NodeID3 from 'node-id3';
import ytdl from 'ytdl-core';

import { getDownloadsDir, isDirectory } from './utils';

import convertVideoToAudio from './convertVideoToAudio';
import downloadVideo from './downloadVideo';
import extractSongTags from './extractSongTags';
import getFilepaths from './getFilepaths';

interface Options {
  outputDir?: string;
  getTags?: boolean;
  verifyTags?: boolean;
}

export default async function downloadSong(url: string, options?: Options): Promise<string> {
  if (options?.outputDir && !isDirectory(options.outputDir)) {
    throw new Error(`Not a directory: ${options.outputDir}`);
  }

  const videoInfo = await ytdl.getInfo(url).catch(() => {
    throw new Error(`Failed to fetch info for video with URL: ${url}`);
  });

  const filepaths = getFilepaths(videoInfo.videoDetails.title, options?.outputDir ?? getDownloadsDir());
  await downloadVideo(videoInfo, filepaths.videoFile);
  convertVideoToAudio(filepaths.videoFile, filepaths.audioFile);

  if (options?.getTags) {
    const songTags = await extractSongTags(videoInfo, options.verifyTags);
    NodeID3.write(songTags, filepaths.audioFile);
  }

  console.log(`Done! Output file: ${filepaths.audioFile}`);
  return filepaths.audioFile;
}
