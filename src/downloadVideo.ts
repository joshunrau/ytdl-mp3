import fs from 'fs';

import ytdl from 'ytdl-core';
import type { videoInfo as VideoInfo } from 'ytdl-core';

export function downloadVideo(videoInfo: VideoInfo, outputFile: string): Promise<unknown> {
  const stream = ytdl.downloadFromInfo(videoInfo, { quality: 'highestaudio' }).pipe(fs.createWriteStream(outputFile));
  return new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', (err) => {
      reject(err);
    });
  });
}
