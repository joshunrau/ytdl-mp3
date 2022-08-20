import cp from 'child_process';
import ffmpeg from 'ffmpeg-static';
import fs from 'fs';
import id3 from 'node-id3';
import path from 'path';
import ytdl from 'ytdl-core';

import downloadVideo from './downloadVideo';
import extractSongTags from './extractSongTags';
import fetchAlbumArt from './fetchAlbumArt';
import formatSongTitle from './formatSongTitle';

import { ProgramOptions } from './types';

export default async function main(url: string, options: ProgramOptions) {
  const videoInfo = await ytdl.getInfo(url);
  const songTags = await extractSongTags(videoInfo);

  // generate filenames based on song tags
  const baseFileName = formatSongTitle(songTags.title);
  const filepaths = {
    audioFile: path.join(options.outputDir, baseFileName + '.mp3'),
    videoFile: path.join(options.outputDir, baseFileName + '.mp4'),
  };

  for (const file of Object.values(filepaths)) {
    if (fs.existsSync(file)) {
      fs.rmSync(file);
    }
  }

  // download video
  await downloadVideo(videoInfo, filepaths.videoFile);

  // convert video to audio
  cp.execSync(
    `${ffmpeg} -loglevel 24 -i ${filepaths.videoFile} -vn -sn -c:a mp3 -ab 192k ${filepaths.audioFile}`
  );
  fs.rmSync(filepaths.videoFile);

  songTags.image = await fetchAlbumArt(songTags);
  id3.write(songTags, filepaths.audioFile);
  
}
