import NodeID3 from 'node-id3';
import ytdl from 'ytdl-core';

import { NotADirectoryError, VideoInfoFetchError } from './exceptions';
import { isDirectory } from './utils';

import convertVideoToAudio from './convertVideoToAudio';
import downloadVideo from './downloadVideo';
import extractSongTags from './extractSongTags';
import getFilepaths from './getFilepaths';

interface Options {
  outputDir: string;
  getTags?: boolean;
  verifyTags?: boolean;
}

export default async function main(
  url: string,
  options: Options
): Promise<void> {
  if (!isDirectory(options.outputDir)) {
    throw new NotADirectoryError(options.outputDir);
  }
  const videoInfo = await ytdl.getInfo(url).catch(() => {
    throw new VideoInfoFetchError('Unable to fetch info for video with URL: ' + url);
  });

  const filepaths = getFilepaths(
    videoInfo.videoDetails.title,
    options.outputDir
  );
  await downloadVideo(videoInfo, filepaths.videoFile);
  convertVideoToAudio(filepaths.videoFile, filepaths.audioFile);

  if (options.getTags) {
    const songTags = await extractSongTags(videoInfo, options.verifyTags);
    NodeID3.write(songTags, filepaths.audioFile);
  }

}
