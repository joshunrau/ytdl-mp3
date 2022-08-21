import NodeID3 from 'node-id3';
import ytdl from 'ytdl-core';

import convertVideoToAudio from './convertVideoToAudio';
import downloadVideo from './downloadVideo';
import extractSongTags from './extractSongTags';
import getFilepaths from './getFilepaths';

interface Options {
  outputDir?: string;
}

export default async function main(
  url: string,
  options?: Options
): Promise<void> {
  const videoInfo = await ytdl.getInfo(url).catch(() => {
    throw new Error('Unable to fetch info for video with URL: ' + url);
  });
  const songTags = await extractSongTags(videoInfo);
  const filepaths = getFilepaths(songTags.title, options?.outputDir);
  await downloadVideo(videoInfo, filepaths.videoFile);
  convertVideoToAudio(filepaths.videoFile, filepaths.audioFile);
  NodeID3.write(songTags, filepaths.audioFile);
}
